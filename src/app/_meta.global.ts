export default {
    '*': {
        type: 'page'
    },
    index: 'Home',
    posts: {
        type: 'page',
        // display: 'hidden',
        items: {
            // draft: {
            //     display: 'hidden'
            // }
        }
    },
    connect: "Connect",
    stats: "Stats",
    uses: "Uses",
    now: "Now",
    bookmarks: "Bookmarks",
    goodreads: "Goodreads",
    colophon: "Colophon",
    // rss: {
    //     href: "/rss.xml",
    //     title: "RSS",
    // },
}