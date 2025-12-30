'use client'

import {Link} from 'next-view-transitions'
import {useFSRoute} from 'nextra/hooks'
import * as React from 'react';

type Props = {
    href?: string;
    target?: string;
    children: React.ReactNode;
};

export function MenuBarLink(props: Props) {
    const pathname = useFSRoute();
    const {href, target = ''} = props;
    return (
        <>
            {href ?
                <Link
                    href={href}
                    className='no-underline hover:bg-muted
            text-muted-foreground aria-[current]:text-primary
            py-1 px-0.5 inline-block`
            '
                    aria-current={href === pathname || undefined}
                    target={target}
                    {...props}
                >
                    {props.children}
                </Link>
                :
                <>{props.children}</>
            }
        </>
    )
}