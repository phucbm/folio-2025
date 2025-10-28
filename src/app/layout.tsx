import {Head} from 'nextra/components'
import 'nextra-theme-blog/style.css'
import '@/styles/globals.css'
import CustomFooter from "@/components/custom-footer";
import CustomHeader from "@/components/custom-header";
import {Metadata} from "next";
import {Layout} from "nextra-theme-blog";
import {Inter} from 'next/font/google';

export const metadata: Metadata = {
    title: {
        absolute: '',
        template: '%s - @phucbm'
    }
}

const bodyFont = Inter({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-inter'
})

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
                    <CustomHeader/>

                    {children}

                    <CustomFooter/>
                </div>
            </Layout>
        </div>
        </body>
        </html>
    )
}