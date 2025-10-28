import {getDiscordBookmarks} from "@/lib/discord";
import {LinkBlock} from "@/components/link-block";

export default async function Bookmarks() {
    const bookmarks = await getDiscordBookmarks();

    if (bookmarks.length === 0) {
        return <div>No bookmarks found</div>;
    }

    return (
        <ul className="space-y-8 not-prose pt-4">
            {bookmarks.map((bookmark) => (
                <li key={bookmark.id}>
                    <LinkBlock
                        title={
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="break-all">{bookmark.threadName}</span>
                                {bookmark.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        }
                        description={bookmark.content}
                        href={bookmark.url || '#'}
                    />
                </li>
            ))}
        </ul>
    );
}