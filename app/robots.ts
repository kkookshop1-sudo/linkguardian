import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard', '/settings', '/analytics', '/links', '/notifications'],
        },
        sitemap: 'https://linkguardian.net/sitemap.xml',
    };
}
