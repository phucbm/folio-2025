import type {MenuItem} from 'nextra'
import {PageItem} from 'nextra/normalize-pages'
import type {FC, ReactNode} from 'react'
import {cn} from "@/lib/utils";
import {MenuBarLink} from "@/components/menu-bar-link";
import {NextraSearchDialog} from "@/components/nextra-search-dialog";
import {getPagesFromPageMap} from "@/lib/getPagesFromPageMap";
import {getPageMap} from "nextra/page-map";
import {ThemeSwitch} from "nextra-theme-blog";

type NavbarProps = {
    children?: ReactNode;
    className?: string;
}
type ExtendedNavbarItem = (PageItem | MenuItem) & {
    href?: string;
    target?: string;
}

export const MenuBar: FC<NavbarProps> = async ({children, className}) => {

    const items = [
        {
            href: '/bookmarks',
            title: "Bookmarks"
        },
        {
            href: '/components',
            title: "Components"
        },
        {
            title: <NextraSearchDialog placeholder="Search" pages={await getPagesFromPageMap({pageMap: await getPageMap()})}/>
        },
        {
            title: <ThemeSwitch/>
        }
    ];

    return (
        <div
            className={cn("flex flex-wrap gap-2", className)}
            data-pagefind-ignore="all"
        >
            <span className="decor-marks">[</span>
            {items.map(({href, title}, index) => {
                return (
                    <div key={href || index}>
                        <MenuBarLink href={href}>
                            {title}
                        </MenuBarLink>
                        {index < items.length - 1 &&
                            <span className="decor-marks">,</span>
                        }
                    </div>
                );
            })}
            {children}
            <span className="decor-marks">]</span>
        </div>
    )
}
