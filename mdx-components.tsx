import {useMDXComponents as getBlogMDXComponents} from 'nextra-theme-blog'
import {useMDXComponents as getNextraComponents} from 'nextra/mdx-components'
import {Posts} from "@/components/posts";
import {Tags} from "@/components/tags";
import {GitHubStars} from "@/components/github-stars";
import GitHubRepos from "@/components/github-repos";
import {LinkBlock} from "@/components/link-block";
import {Clients} from "@/components/clients";
import {Connect} from "@/components/connect";

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
        Posts: Posts,
        Tags: Tags,
        GitHubStars: GitHubStars,
        GitHubRepos: GitHubRepos,
        LinkBlock: LinkBlock,
        Clients: Clients,
        Connect: Connect,
    }
}