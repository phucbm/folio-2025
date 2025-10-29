"use client"
import Gravity, {MatterBody} from "@/components/fancy/physics/gravity"
import {
    IconBrandDiscord,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandNpm,
    IconBrandX,
    IconMail
} from "@tabler/icons-react";
import {LinkBlock} from "@/components/link-block";

type Props = {
    items: {
        label: string;
        name: string;
        url: string;
        description?: string;
        icon?: string;
    }[]
};

const iconMap = {
    github: IconBrandGithub,
    linkedin: IconBrandLinkedin,
    x: IconBrandX,
    npm: IconBrandNpm,
    discord: IconBrandDiscord,
    email: IconMail,
} as const;

const stars = ["✱", "✽", "✦", "✸", "✹", "✺"]

export function Connect({items}: Props) {
    return (
        <div className="w-full flex flex-col">
            <div
                className="w-full h-[300px] flex flex-col relative overflow-hidden border-b border-primary">
                <Gravity gravity={{x: 0, y: 1}} resetOnResize={false} className="w-full flex-1">
                    {items.map((item, index) => {
                        const IconComponent = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
                        return (
                            <MatterBody
                                key={index}
                                matterBodyOptions={{friction: 0.5, restitution: 0.5}}
                                x={`${20 + (index * 15) % 60}%`}
                                y={`${20 + (index * 10) % 30}%`}
                                angle={(index * 5) % 20 - 10}
                                isDraggable={false}
                            >
                                <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-background text-primary border border-primary hover:cursor-pointer hover:bg-primary hover:text-primary-foreground
                                md:px-6 md:py-3 py-2 px-4 active:scale-90 transition-transform
                                no-underline rounded-md
                                flex items-center gap-2
                                "
                                >
                                {IconComponent && <IconComponent size={20} className="flex-shrink-0"/>}
                                {item.name}
                            </a>
                            </MatterBody>
                    )
                    })}

                    {stars.map((star, i) => (
                        <MatterBody
                            key={i}
                            matterBodyOptions={{friction: 0.5, restitution: 0.2}}
                            x={`${Math.random() * 60 + 10}%`}
                            y={`${Math.random() * 60 + 5}%`}
                            angle={Math.random() * 360}
                        >
                            <div
                                className="aspect-square w-10 h-10 sm:w-14 sm:h-14 md:w-12 md:h-12 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-2xl">
                                {star}
                            </div>
                        </MatterBody>
                    ))}
                </Gravity>
            </div>

            {/* Link blocks list */}
            <div className="w-full py-8 space-y-2">
                {items.map((item, index) => {
                    const IconComponent = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
                    return (
                        <LinkBlock
                            key={index}
                            title={
                                <div className="flex items-center gap-1">
                                    <div
                                        className="md:min-w-[150px] min-w-[100px] flex items-center gap-1.5 text-muted-foreground">
                                        {IconComponent && <IconComponent size={20} className="flex-shrink-0"/>}
                                        {item.label}
                                    </div>

                                    {item.name}
                                </div>
                            }
                            href={item.url}
                            openInNewTab={true}
                            showThumbnail={false}
                        />
                    )
                })}
            </div>
        </div>
    )
}