import nextra from 'nextra'

const withNextra = nextra({
    defaultShowCopyCode: true,
    // readingTime: true
    mdxOptions: {
        rehypePrettyCodeOptions: {
            theme: {
                light: "github-light-default",
                dark: "github-dark-default",
            },
        },
    },
})

// You can include other Next.js configuration options here, in addition to Nextra settings:
export default withNextra({
    // ... Other Next.js config options
    turbopack: {
        resolveAlias: {
            'next-mdx-import-source-file': './mdx-components.tsx'
        }
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allow all HTTPS domains
            },
        ],
    },

    // webpack: (config, {isServer}) => {
    //     if(isServer){
    //         config.externals.push({
    //             'utf-8-validate': 'commonjs utf-8-validate',
    //             'bufferutil': 'commonjs bufferutil',
    //             'zlib-sync': 'commonjs zlib-sync',
    //         });
    //     }
    //     return config;
    // },


    async rewrites(){
        return [
            {
                source: '/ingest/static/:path*',
                destination: 'https://us-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
        ]
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
})
