'use client'

import * as React from 'react'
import {NavbarLink} from '@/components/navbar-link'
import {ThemeSwitch} from 'nextra-theme-blog'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer'

type NavItem = {
    href: string
    title: string
}

export function MobileMenu({navItems}: { navItems: NavItem[] }) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="sm:hidden flex items-center gap-2" data-pagefind-ignore="all">
            <ThemeSwitch/>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <button
                        aria-label="Open menu"
                        className="py-1 px-0.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <span className="decor-marks">[</span>
                        <span className="px-0.5">menu</span>
                        <span className="decor-marks">]</span>
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="px-4 pt-4 pb-2 flex flex-col gap-1">
                        {navItems.map(item => (
                            <DrawerClose key={item.href} asChild>
                                <div onClick={() => setOpen(false)} className="py-1">
                                    <NavbarLink href={item.href}>
                                        {item.title}
                                    </NavbarLink>
                                </div>
                            </DrawerClose>
                        ))}
                    </div>
                    <DrawerClose asChild>
                        <button className="mx-4 mb-6 mt-4 py-2 px-4 border border-foreground text-sm text-center w-[calc(100%-2rem)]">
                            Close
                        </button>
                    </DrawerClose>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
