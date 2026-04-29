import {NextResponse} from 'next/server';

export const runtime = 'edge';
import {getDiscordBookmarks} from '@/lib/discord';

export async function GET() {
    try {
        const bookmarks = await getDiscordBookmarks();
        return NextResponse.json({bookmarks});
    } catch (error) {
        console.error('Error fetching Discord messages:', error);
        return NextResponse.json(
            {error: 'Failed to fetch bookmarks'},
            {status: 500}
        );
    }
}