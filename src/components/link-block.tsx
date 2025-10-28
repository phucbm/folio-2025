import * as React from 'react';
import {Link} from "next-view-transitions";
import {isExternalLink} from "@/lib/is-external-link";
import {LinkBlockHover} from "@/components/link-block-hover";
import Image from "next/image";
import {IconMoodPuzzled} from "@tabler/icons-react";

type Props = {
    title: React.ReactNode;
    description: React.ReactNode;
    href: string;
    openInNewTab?: boolean;
    thumbnail?: string | null;
    showThumbnail?: boolean;
};

export function LinkBlock({
                              title,
                              description,
                              href,
                              openInNewTab = true,
                              thumbnail,
                              showThumbnail = false
                          }: Props) {
    const isExternal = isExternalLink(href);
    if (typeof openInNewTab !== "boolean" && isExternal === true) {
        openInNewTab = true;
    }

    const shouldShowThumbnail = showThumbnail || thumbnail;

    return (
        <LinkBlockHover>
            <Link
                className="not-prose group flex items-start mb-6 relative z-20"
                href={href}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
            >
                {shouldShowThumbnail && (
                    <div className="overflow-hidden rounded-xs md:rounded-sm w-[20%] ring ring-gray-200 dark:ring-black/20">
                        {thumbnail ? (
                            <Image
                                src={thumbnail}
                                alt=""
                                width={800}
                                height={400}
                                className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full aspect-[2/1] bg-muted flex items-center justify-center">
                                <IconMoodPuzzled
                                    className="w-6 h-6 text-muted-foreground"
                                    stroke={1.5}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className={shouldShowThumbnail ? "w-[80%] pl-2 md:pl-4" : "w-full"}>
                    <div className="font-[500] text-black dark:text-white mb-1">
                        {title}
                    </div>
                    <div className="text-muted-foreground">
                        {description}
                    </div>
                </div>
            </Link>
        </LinkBlockHover>
    );
}