export default {
    '*': {
        type: 'page'
    },
    index: 'Home',
    posts: {
        type: 'page',
        display: 'hidden',
        items: {
            // draft: {
            //     display: 'hidden'
            // }
        }
    },
    stats: "Stats",
    connect: "Connect",
    colophon: "Colophon",
    // rss: {
    //     href: "/rss.xml",
    //     title: "RSS",
    // },
}