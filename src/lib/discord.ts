export interface Bookmark {
    id: string;
    content: string;
    url: string | null;
    tags: string[];
    timestamp: Date;
    author: string;
    threadName: string;
    thumbnail?: string | null;
}

interface DiscordThread {
    id: string;
    name: string;
    applied_tags?: string[];
}

interface DiscordMessage {
    id: string;
    content: string;
    timestamp: string;
    author: {
        username: string;
    };
}

interface ForumTag {
    id: string;
    name: string;
    moderated: boolean;
    emoji_id: string | null;
    emoji_name: string | null;
}

interface ChannelData {
    available_tags?: ForumTag[];
}

export async function getDiscordBookmarks(): Promise<Bookmark[]> {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

    if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
        throw new Error('Missing Discord credentials');
    }

    try {
        // Step 1: Get channel info to retrieve available tags
        const channelResponse = await fetch(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                },
                next: { revalidate: 3600 },
            }
        );

        if (!channelResponse.ok) {
            throw new Error(`Discord API error: ${channelResponse.status}`);
        }

        const channelData: ChannelData = await channelResponse.json();

        // Create a map of tag IDs to tag names
        const tagMap = new Map<string, string>();
        if (channelData.available_tags) {
            channelData.available_tags.forEach(tag => {
                tagMap.set(tag.id, tag.name);
            });
        }

        // Step 2: Get archived public threads
        const archivedPublicResponse = await fetch(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/threads/archived/public?limit=100`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                },
                next: { revalidate: 3600 },
            }
        );

        // Step 3: Get active threads from guild
        const guildId = (channelData as any).guild_id;
        const guildThreadsResponse = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}/threads/active`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                },
                next: { revalidate: 3600 },
            }
        );

        const archivedPublicData = archivedPublicResponse.ok
            ? await archivedPublicResponse.json()
            : { threads: [] };

        const guildThreadsData = guildThreadsResponse.ok
            ? await guildThreadsResponse.json()
            : { threads: [] };

        // Filter guild threads to only those in our channel
        const channelThreads = guildThreadsData.threads?.filter(
            (t: any) => t.parent_id === DISCORD_CHANNEL_ID
        ) || [];

        // Combine all threads
        const allThreads: DiscordThread[] = [
            ...(archivedPublicData.threads || []),
            ...channelThreads,
        ];

        // Step 4: Fetch messages from each thread
        const allBookmarks: Bookmark[] = [];

        for (const thread of allThreads) {
            const messagesResponse = await fetch(
                `https://discord.com/api/v10/channels/${thread.id}/messages?limit=1`,
                {
                    headers: {
                        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                    },
                    next: { revalidate: 3600 },
                }
            );

            if (messagesResponse.ok) {
                const messages: any[] = await messagesResponse.json();
                const firstMessage = messages[0];

                if (firstMessage) {
                    // Extract URL from thread name or message content
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const nameUrls = thread.name.match(urlRegex) || [];
                    const contentUrls = firstMessage.content.match(urlRegex) || [];
                    const url = nameUrls[0] || contentUrls[0] || null;

                    // Get tags from applied_tags using the tag map
                    const tags = (thread.applied_tags || [])
                        .map(tagId => tagMap.get(tagId))
                        .filter((name): name is string => name !== undefined);

                    // Get thumbnail from embeds
                    let thumbnail = firstMessage.embeds?.[0]?.thumbnail?.url ||
                        firstMessage.embeds?.[0]?.image?.url ||
                        null;

                    // get thumbnail from attachment
                    if (!thumbnail && firstMessage.attachments.length > 0) {
                        thumbnail = firstMessage.attachments[0].url;
                    }

                    allBookmarks.push({
                        id: thread.id,
                        content: firstMessage.content,
                        url: url,
                        tags: tags,
                        timestamp: new Date(firstMessage.timestamp),
                        author: firstMessage.author.username,
                        threadName: thread.name,
                        thumbnail: thumbnail,
                    });
                }
            }
        }

        // Sort by newest first
        allBookmarks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        return allBookmarks;
    } catch (error) {
        console.error('Error fetching Discord bookmarks:', error);
        throw error;
    }
}