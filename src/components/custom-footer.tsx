import {getPageMap} from "nextra/page-map";
import {normalizePages, PageItem} from 'nextra/normalize-pages'
import type {MenuItem} from 'nextra'
import {NavbarLink} from "@/components/navbar-link";
import React from "react";

type ExtendedNavbarItem = (PageItem | MenuItem) & {
    href?: string;
}

const CustomFooter = async () => {
    const pageMap = await getPageMap()
    const {topLevelNavbarItems} = normalizePages({list: pageMap, route: '/'})

    const navItems = topLevelNavbarItems
        .filter(item => item.display !== 'hidden')
        .map(item => {
            const extended = item as ExtendedNavbarItem
            return {
                href: ('route' in extended ? extended.route : extended.href) || '',
                title: extended.title,
            }
        })

    return (
        <div className="custom-footer border-t-2 border-foreground py-3 px-1" data-pagefind-ignore="all">
            <div className="columns-2 sm:columns-3 md:columns-4 gap-x-6 mb-3">
                {navItems.map(({href, title}) => (
                    <div key={href} className="mb-1 break-inside-avoid">
                        <NavbarLink href={href}>
                            {title}
                        </NavbarLink>
                    </div>
                ))}
            </div>
            <div className="border-t border-foreground pt-2 text-xs text-muted-foreground uppercase tracking-widest">
                © {new Date().getFullYear()} Phuc Bui
            </div>
        </div>
    );
};

export default CustomFooter;
