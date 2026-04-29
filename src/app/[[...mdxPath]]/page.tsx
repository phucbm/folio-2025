import {generateStaticParamsFor, importPage} from 'nextra/pages'

import {useMDXComponents as getMDXComponents} from '../../../mdx-components'
import type {Metadata} from 'next'
import React from "react";
import {PostDetail} from "@/components/post-detail";
import {FrontMatter} from "@/lib/get-posts";
import {_metadata} from "@/lib/seo";
import {generatePageMetadata} from "@phucbm/next-og-image";

// Define types for params and metadata
type PageParams = {
    mdxPath: string[]
}

type PageProps = {
    params: Promise<PageParams>
}

export const dynamicParams = false
export const generateStaticParams = generateStaticParamsFor('mdxPath')

// export async function generateMetadata(props: PageProps): Promise<Metadata> {
//     const params = await props.params
//     const {metadata} = await importPage(params.mdxPath)
//     return metadata
// }

// @ts-ignore
export const generateMetadata = generatePageMetadata(async (props) => {
    const params = await props.params;
    if (!params.mdxPath) return {..._metadata};
    const {metadata} = await importPage(params.mdxPath)

    const canonicalPath = params.mdxPath ? `/${params.mdxPath.join('/')}` : '/';

    const description = metadata.description ?? _metadata.description;

    let title = `${metadata.title} - ${_metadata.siteName}`;
    if (metadata.description) {
        title = `${metadata.title}: ${metadata.description}`;
    }

    let socialImage = {
        title: metadata.title,
    };

    if (canonicalPath === '/') {
        // homepage
        title = `${_metadata.siteName}: ${_metadata.description}`;
        socialImage = null;
    }

    return {
        ..._metadata,
        title,
        canonicalPath,
        description,
        socialImage,
    };
});

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
    const params = await props.params
    const result = await importPage(params.mdxPath)
    const {default: MDXContent, toc, metadata} = result as {
        default: React.ComponentType<any>
        toc: any
        metadata: Metadata
    }

    const isPostPage = params.mdxPath && params.mdxPath.length > 1 && params.mdxPath.includes('posts');

    return (
        // @ts-ignore
        <Wrapper toc={toc} metadata={metadata}>
            {
                isPostPage &&
                <PostDetail metadata={metadata as FrontMatter}>
                    <MDXContent {...props} params={params}/>
                </PostDetail>
            }

            {
                !isPostPage &&
                <>
                    <MDXContent {...props} params={params}/>
                </>
            }

        </Wrapper>
    )
}