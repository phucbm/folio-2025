import {useMDXComponents as getBlogMDXComponents} from 'nextra-theme-blog'
import {useMDXComponents as getNextraComponents} from 'nextra/mdx-components'
import {Posts} from "@/components/posts";
import {Tags} from "@/components/tags";
import GitHubRepos from "@/components/github-repos";
import {LinkBlock} from "@/components/link-block";
import {Clients} from "@/components/clients";
import {Connect} from "@/components/connect";
import NpmPackages from "@/components/npm-packages";
import JsDelivrPackages from "@/components/jsdelivr";
import Bookmarks from "@/components/bookmarks";
import BooksPage from "@/components/goodreads/page";
import {Gap} from "@/components/gap";
import {RegistryInstall} from "@/registry-system/components/registry-install";
import {RegistryDemo} from "@/registry-system/components/registry-demo"
import {RegistryPropsTable} from "@/registry-system/components/registry-props-table";
import {RegistryExample} from "@/registry-system/components/registry-example";
import {OpenInV0Button} from "@/registry-system/components/OpenInV0Button";
import {Callout, Steps} from "nextra/components";
import {Components} from "@/registry-system/components/components";

const blogComponents = getBlogMDXComponents({
    h1: ({children}) => (
        <h1 className="heading-1">
            {children}
        </h1>
    ),
    h2: ({children}) => (
        <h2 className="heading-2">
            {children}
        </h2>
    ),
    h3: ({children}) => (
        <h2 className="heading-3">
            {children}
        </h2>
    ),
    DateFormatter: ({date}) =>
        `Last updated at ${date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}`
})


const defaultComponents = getNextraComponents({
    wrapper({children, toc}) {
        return (
            <div className="content-wrapper">
                {children}

                {/*<TOC toc={toc}/>*/}
            </div>
        )
    }
})

export function useMDXComponents() {
    return {
        ...blogComponents,
        ...defaultComponents,
        Callout: Callout,
        Posts: Posts,
        Tags: Tags,
        GitHubRepos: GitHubRepos,
        NpmPackages: NpmPackages,
        JsDelivrPackages: JsDelivrPackages,
        LinkBlock: LinkBlock,
        Clients: Clients,
        Connect: Connect,
        Bookmarks: Bookmarks,
        BooksPage: BooksPage,
        Gap: Gap,
        RegistryInstall: RegistryInstall,
        RegistryDemo: RegistryDemo,
        RegistryPropsTable: RegistryPropsTable,
        RegistryExample: RegistryExample,
        OpenInV0Button: OpenInV0Button,
        Components: Components,
        Steps: Steps,
    }
}