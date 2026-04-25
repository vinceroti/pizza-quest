import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Pizza Quest',
		short_name: 'Pizza Quest',
		description: 'Rate and discover the best pizza',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		display_override: ['standalone', 'minimal-ui'],
		background_color: '#0a0a2e',
		theme_color: '#1e3a5f',
		orientation: 'portrait',
		categories: ['food', 'lifestyle', 'social'],
		icons: [
			{
				src: '/icons/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icons/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icons/icon-maskable-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	};
}
