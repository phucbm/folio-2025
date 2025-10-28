import * as React from 'react';
import {Link} from "next-view-transitions";
import {isExternalLink} from "@/lib/is-external-link";
import {LinkBlockHover} from "@/components/link-block-hover";


type Props = {
    title: React.ReactNode;
    description: React.ReactNode;
    href: string;
    openInNewTab?: boolean;
};

export function LinkBlock({title, description, href, openInNewTab = true}: Props) {
    const isExternal = isExternalLink(href);
    if (typeof openInNewTab !== "boolean" && isExternal === true) {
        openInNewTab = true;
    }

    return (
        <LinkBlockHover>
            <Link
                className="not-prose group block mb-6 relative z-20"
                href={href}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
            >
                <div className="font-[500] text-black dark:text-white mb-1">
                    {title}
                </div>
                <div className="text-muted-foreground">
                    {description}
                </div>
            </Link>
        </LinkBlockHover>
    );
}