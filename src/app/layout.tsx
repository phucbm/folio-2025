import {Head} from 'nextra/components'
import 'nextra-theme-blog/style.css'
import '@/styles/globals.css'
import CustomFooter from "@/components/custom-footer";
import CustomHeader from "@/components/custom-header";
import {Layout} from "nextra-theme-blog";
import {GoogleAnalytics} from '@next/third-parties/google'
import {_metadata} from "@/lib/seo";
import {generatePageMetadata} from "@phucbm/next-og-image";
import localFont from 'next/font/local'

export const generateMetadata = generatePageMetadata({
    ..._metadata,
    canonicalPath: "/"
});

// const bodyFont = Inter({
//     subsets: ['latin', 'vietnamese'],
//     variable: '--font-inter'
// })
const bodyFont = localFont({
    src: [
        {
            path: '../../public/fonts/JetBrainsMono[wght].ttf',
            // style: "normal",
            // weight: "100 900",
        },
    ],
    variable: "--font-jetbrains-mono",
});

export default async function RootLayout({children}) {
    return (
        <html
            // Not required, but good for SEO
            lang="en"
            // Required to be set
            dir="ltr"
            // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
            suppressHydrationWarning

            className={bodyFont.className}
        >
        <Head backgroundColor={{dark: '#15120d', light: '#faf5e9'}}>
            <script defer src="https://cloud.umami.is/script.js"
                    data-website-id="f14c0833-d850-4d09-9c74-95cc97d95dc0"></script>
        </Head>
        <body className="min-h-screen">
        <div className="article-container">
            <Layout>
                <div className="min-h-screen flex flex-col justify-between">
                    <div>
                        <CustomHeader/>

                        {children}
                    </div>

                    <CustomFooter/>
                </div>
            </Layout>
        </div>
        </body>
        <GoogleAnalytics gaId="G-HXCF8TGQLN"/>
        </html>
    )
}