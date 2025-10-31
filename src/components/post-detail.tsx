// @flow
import * as React from 'react';
import {formatDate} from "@/lib/format-date";
import GiscusComments from "@/components/giscus-comments";
import {Link} from "next-view-transitions";
import {getTagUrl} from "@/lib/get-tag-url";
import {FrontMatter} from "@/lib/get-posts";
import {Posts} from "@/components/posts";

type Props = {
    metadata: FrontMatter;
    children: React.ReactNode;
};

export function PostDetail({metadata, children}: Props) {
    const tag = metadata.tags[0];
    return (
        <>
            <div className="mb-20">
                <h1 className="mb-4">{metadata.title as string}</h1>
                <p className="text-lg my-0">{metadata.description}</p>

                <div className="text-sm italic pt-4">
                    {/*<Link href="/posts" className="hover:underline no-underline flex items-center gap-1">*/}
                    {/*    <IconArrowBack className="w-4"/>*/}
                    {/*    Back to Posts*/}
                    {/*</Link>*/}
                    {/*<IconPoint className="w-3"/>*/}

                    Posted to <Link href={getTagUrl(tag)}
                                    className="not-italic no-underline hover:underline">{tag}</Link> on <span
                    className="not-italic">{formatDate(metadata.date)}</span>
                </div>

            </div>


            {children}

            {metadata.enableRelatedPost === true &&
                <div>
                    <h2>Related</h2>
                    <Posts tags={metadata.tags} excludeByTitle={metadata.title as string} first={5}/>
                </div>
            }

            {metadata.enableComment === true &&
                <div className="pt-32">
                    <GiscusComments/>
                </div>
            }
        </>
    );
}