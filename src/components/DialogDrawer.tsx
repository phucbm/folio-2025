"use client";

import * as React from "react";
import {useMediaQuery} from "usehooks-ts";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

type DialogDrawerProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    trigger: React.ReactNode;
    children: React.ReactNode;

    open?: boolean;
    onOpenChangeAction?: (open: boolean) => void;

    contentClassName?: string;
    desktopScrollClassName?: string; // defaults to max-h-[70vh]
    mobileScrollClassName?: string;  // defaults to max-h-[65vh]
    showDrawerCloseButton?: boolean; // defaults true
};

export function DialogDrawer(props: DialogDrawerProps) {
    const {
        title,
        description,
        trigger,
        children,
        open,
        onOpenChangeAction,
        contentClassName,
        desktopScrollClassName,
        mobileScrollClassName,
        showDrawerCloseButton = true,
    } = props;

    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Uncontrolled fallback if not provided
    const [openInternal, setOpenInternal] = React.useState(false);
    const isControlled = typeof open === "boolean";
    const actualOpen = isControlled ? open : openInternal;
    const handleOpenChange = (next: boolean) => {
        if (isControlled) onOpenChangeAction?.(next);
        else setOpenInternal(next);
    };

    if (isDesktop) {
        return (
            <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className={cn("sm:max-w-[480px]", contentClassName)}>
                    <DialogHeader className="mb-3">
                        <DialogTitle>{title}</DialogTitle>
                        {description ? <DialogDescription>{description}</DialogDescription> : null}
                    </DialogHeader>

                    <ScrollArea className={cn("max-h-[70vh] pr-2", desktopScrollClassName)}>
                        <div className="px-1">
                            {children}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={actualOpen} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    {description ? <DrawerDescription>{description}</DrawerDescription> : null}
                </DrawerHeader>

                <div className={cn("pb-6 px-4 max-h-[65vh] overflow-auto", mobileScrollClassName)}>
                    {children}
                </div>

                {showDrawerCloseButton && (
                    <DrawerFooter className="pt-2 bg-background z-20">
                        <DrawerClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DrawerClose>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}