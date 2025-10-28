import {headers} from 'next/headers';

/**
 * Check if a URL is external (different domain from current site)
 * Works in both client and server environments
 */
export async function isExternalLink(href: string, currentHostname?: string): Promise<boolean> {
    try {
        // Handle relative URLs - they're internal
        if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
            return false;
        }

        // Parse the URL
        const url = new URL(href, 'https://dummy.com');

        // If no hostname in URL (relative), it's internal
        if (!url.hostname || url.hostname === 'dummy.com') {
            return false;
        }

        // Get current hostname
        let hostname = currentHostname;

        if (!hostname) {
            // Server-side: get from headers
            if (typeof window === 'undefined') {
                const headersList = await headers();
                hostname = headersList.get('host') || '';
            } else {
                // Client-side: get from window
                hostname = window.location.hostname;
            }
        }

        // Compare hostnames
        return url.hostname !== hostname;
    } catch (error) {
        return false;
    }
}