import type {MenuItem, PageMapItem} from 'nextra'
import {normalizePages, PageItem} from 'nextra/normalize-pages'
import type {FC, ReactNode} from 'react'
import {cn} from "@/lib/utils";
import {MenuBarLink} from "@/components/menu-bar-link";

type NavbarProps = {
    children?: ReactNode;
    pageMap: PageMapItem[];
    className?: string;
}
type ExtendedNavbarItem = (PageItem | MenuItem) & {
    href?: string;
    target?: string;
}

export const MenuBar: FC<NavbarProps> = ({children, pageMap, className}) => {
    const {topLevelNavbarItems} = normalizePages({list: pageMap, route: '/'})

    const items = topLevelNavbarItems.filter(item => item.display !== "hidden");

    return (
        <div
            className={cn("flex flex-wrap gap-2", className)}
            data-pagefind-ignore="all"
        >
            <span className="decor-marks">[</span>
            {items.map((nav, index) => {
                const extendedNav = nav as ExtendedNavbarItem;
                const href = ('route' in extendedNav ? extendedNav.route : extendedNav.href) || '';

                return (
                    <div>
                        <MenuBarLink
                            key={href}
                            href={href}
                            target={extendedNav.target}
                        >
                            {extendedNav.title}
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
