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
    colophon: "Colophon",
    rss: {
        href: "/rss.xml",
        title: "RSS",
    },
}