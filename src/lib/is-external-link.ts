/**
 * Check if a URL is external (different domain from current site)
 * Works in both client and server environments
 */
export function isExternalLink(href: string, currentHostname?: string): boolean {
    try {
        // Handle relative URLs - they're internal
        if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
            return false;
        }

        // Parse the URL
        const url = new URL(href, typeof window !== 'undefined' ? window.location.href : 'https://dummy.com');

        // If no hostname in URL (relative), it's internal
        if (!url.hostname || url.hostname === 'dummy.com') {
            return false;
        }

        // Get current hostname
        let hostname = currentHostname;

        if (!hostname) {
            // Client-side: get from window
            if (typeof window !== 'undefined') {
                hostname = window.location.hostname;
            } else {
                // Server-side: return true as fallback (safer to assume external)
                // Or you can pass hostname as a prop
                return true;
            }
        }

        // Compare hostnames
        return url.hostname !== hostname;
    } catch (error) {
        return false;
    }
}