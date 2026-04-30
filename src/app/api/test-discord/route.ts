import { NextResponse } from 'next/server';

export async function GET() {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

    if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
        return NextResponse.json({
            error: 'Missing environment variables',
        });
    }

    try {
        // Get channel info to retrieve available tags
        const channelResponse = await fetch(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                },
            }
        );
        const channelData = await channelResponse.json();

        // Get archived threads
        const archivedPublicResponse = await fetch(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/threads/archived/public?limit=5`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                },
            }
        );
        const archivedPublicData = await archivedPublicResponse.json();

        // Get active threads
        const guildThreadsResponse = await fetch(
            `https://discord.com/api/v10/guilds/${channelData.guild_id}/threads/active`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                },
            }
        );
        const guildThreadsData = await guildThreadsResponse.json();

        const channelThreads = guildThreadsData.threads?.filter(
            (t: any) => t.parent_id === DISCORD_CHANNEL_ID
        ) || [];

        // Create tag map
        const tagMap = new Map();
        if (channelData.available_tags) {
            channelData.available_tags.forEach((tag: any) => {
                tagMap.set(tag.id, tag.name);
            });
        }

        // Sample threads with resolved tags
        const sampleThreads = [...(archivedPublicData.threads || []), ...channelThreads]
            .slice(0, 5)
            .map((thread: any) => ({
                id: thread.id,
                name: thread.name,
                applied_tag_ids: thread.applied_tags || [],
                resolved_tags: (thread.applied_tags || []).map((tagId: string) => tagMap.get(tagId)),
            }));

        return NextResponse.json({
            success: true,
            channel: {
                id: channelData.id,
                name: channelData.name,
                available_tags: channelData.available_tags,
            },
            tagMap: Object.fromEntries(tagMap),
            sampleThreads: sampleThreads,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Exception occurred',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}