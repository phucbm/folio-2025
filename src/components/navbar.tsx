import type {MenuItem, PageMapItem} from 'nextra'
import {normalizePages, PageItem} from 'nextra/normalize-pages'
import type {FC, ReactNode} from 'react'
import {NavbarLink} from './navbar-link'
import {cn} from "@/lib/utils";

type NavbarProps = {
    children?: ReactNode;
    pageMap: PageMapItem[];
    className?: string;
}
type ExtendedNavbarItem = (PageItem | MenuItem) & {
    href?: string;
    target?: string;
}

export const Navbar: FC<NavbarProps> = ({children, pageMap, className}) => {
    const {topLevelNavbarItems} = normalizePages({list: pageMap, route: '/'})

    return (
        <div
            className={cn("flex flex-wrap gap-x-3 w-full max-sm:grid max-sm:grid-cols-2", className)}
            data-pagefind-ignore="all"
        >
            {topLevelNavbarItems
                .filter(item => item.display !== "hidden")
                .map((nav) => {
                    const extendedNav = nav as ExtendedNavbarItem;
                    const href = ('route' in extendedNav ? extendedNav.route : extendedNav.href) || '';

                    return (
                        <NavbarLink
                            key={href}
                            href={href}
                            target={extendedNav.target}
                        >
                            {extendedNav.title}
                        </NavbarLink>
                    );
                })}
            {children}
        </div>
    )
}
