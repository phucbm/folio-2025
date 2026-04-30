import React from 'react';
import {Logo} from "@/components/logo";
import {MenuBar} from "@/components/menu-bar";
import {MobileMenu} from "@/components/mobile-menu";
import {getPageMap} from "nextra/page-map";
import {normalizePages, PageItem} from 'nextra/normalize-pages'
import type {MenuItem} from 'nextra'

type ExtendedNavbarItem = (PageItem | MenuItem) & {
    href?: string;
    title?: string;
}

const CustomHeader = async () => {
    const pageMap = await getPageMap()
    const {topLevelNavbarItems} = normalizePages({list: pageMap, route: '/'})

    const navItems = topLevelNavbarItems
        .filter(item => item.display !== 'hidden')
        .map(item => {
            const extended = item as ExtendedNavbarItem
            return {
                href: ('route' in extended ? extended.route : extended.href) || '',
                title: typeof extended.title === 'string' ? extended.title : String(extended.title ?? ''),
            }
        })
        .filter(item => item.href && item.title)

    return (
        <div className="custom-header flex items-center justify-between py-3 px-1 border-b-2 border-foreground">
            <Logo/>
            <MenuBar className="hidden sm:flex"/>
            <MobileMenu navItems={navItems}/>
        </div>
    );
};

export default CustomHeader;
