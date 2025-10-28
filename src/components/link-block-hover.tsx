'use client';

import * as React from 'react';
import {useRef, useState} from 'react';
import {useGSAP} from "@gsap/react";
import Observer from "gsap/Observer";
import gsap from "gsap";

gsap.registerPlugin(Observer)

type Props = {
    children: React.ReactNode;
};

export function LinkBlockHover({children}: Props) {
    const scope = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const hoverLayer = root.querySelector<HTMLElement>(".hover-layer");
            if (!hoverLayer) return;

            const observer = Observer.create({
                target: root,
                type: "pointer",
                onMove: ({x = 0, y = 0}) => {
                    // Get the bounding rect of THIS specific root element
                    const rect = root.getBoundingClientRect();

                    // Calculate position relative to this specific element
                    const relativeX = x - rect.left;
                    const relativeY = y - rect.top;

                    // Normalize to -1 to 1 range based on element dimensions
                    const normalizedX = (relativeX / rect.width) * 2 - 1;
                    const normalizedY = (relativeY / rect.height) * 2 - 1;

                    const offset = 5;
                    gsap.to(hoverLayer, {
                        x: normalizedX * offset,
                        y: normalizedY * offset,
                        duration: 0.3,
                        scale: 1,
                        ease: "power2.out"
                    });
                },
                onHover: () => {
                    setIsHovered(true);
                },
                onHoverEnd: () => {
                    setIsHovered(false);
                    // Reset position on hover end
                    gsap.to(hoverLayer, {x: 0, y: 0, scale: 0.97, duration: 0.3, ease: "power2.out"});
                }
            });

            return () => {
                observer.kill();
            };
        },
        {scope}
    );

    return (
        <div ref={scope} className="link-block-hover relative group">
            <div
                className="hover-layer pointer-events-none transition-opacity duration-300 ease-in-out
                    absolute -inset-2 rounded-md
                    bg-gray-100 dark:bg-gray-100/10"
                style={{opacity: isHovered ? 1 : 0}}
            >
            </div>
            {children}
        </div>
    );
}