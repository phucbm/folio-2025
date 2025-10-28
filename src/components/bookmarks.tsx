import {getDiscordBookmarks} from "@/lib/discord";
import BookmarksFilter from "@/components/bookmarks-filter";

interface BookmarksProps {
    newDaysThreshold?: number; // Allow customization
}

export default async function Bookmarks({newDaysThreshold = 3}: BookmarksProps) {
    const bookmarks = await getDiscordBookmarks();

    if (bookmarks.length === 0) {
        return <div>No bookmarks found</div>;
    }

    return <BookmarksFilter bookmarks={bookmarks} newDaysThreshold={newDaysThreshold}/>;
}