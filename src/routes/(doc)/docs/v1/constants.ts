import type { TSidebarItem, TSidebarItemBase } from '$docroutes/guide/types';
import { addImageUrlToSidebarItem } from '$components/docs/helpers';

export const previewBaseUrl = 'https://ba.stablecog.com/docs/previews';
export const entries = import.meta.glob(`/src/lib/md/docs/**/*.md`);

const _sidebar: TSidebarItemBase = {
	title: 'Documentation',
	pathname: '/docs/v1',
	preview_image_url: `${previewBaseUrl}/docs-v1.jpg`,
	children: [
		{
			title: 'Overview',
			pathname: '/docs/v1',
			preview_image_url: `${previewBaseUrl}/docs-v1.jpg`
		},
		{
			title: 'Get Started',
			pathname: '/docs/v1/get-started'
		},
		{
			title: 'API Reference',
			pathname: '/docs/v1/api-reference',
			children: [
				{
					title: 'Image',
					pathname: '/docs/v1/api-reference/image',
					children: [
						{
							title: 'Generation',
							pathname: '/docs/v1/api-reference/image/generation',
							children: [
								{
									title: 'Create',
									pathname: '/docs/v1/api-reference/image/generation/create',
									http_method: 'POST'
								},
								{
									title: 'Outputs',
									pathname: '/docs/v1/api-reference/image/generation/outputs',
									http_method: 'GET'
								},
								{
									title: 'Models',
									pathname: '/docs/v1/api-reference/image/generation/models',
									http_method: 'GET'
								},
								{
									title: 'Defaults',
									pathname: '/docs/v1/api-reference/image/generation/defaults',
									http_method: 'GET'
								}
							]
						},
						{
							title: 'Upscale',
							pathname: '/docs/v1/api-reference/image/upscale',
							children: [
								{
									title: 'Create',
									pathname: '/docs/v1/api-reference/image/upscale/create',
									http_method: 'POST'
								},
								{
									title: 'Models',
									pathname: '/docs/v1/api-reference/image/upscale/models',
									http_method: 'GET'
								},
								{
									title: 'Defaults',
									pathname: '/docs/v1/api-reference/image/upscale/defaults',
									http_method: 'GET'
								}
							]
						}
					]
				},
				{
					title: 'Audio',
					pathname: '/docs/v1/api-reference/audio',
					children: [
						{
							title: 'Voiceover',
							pathname: '/docs/v1/api-reference/audio/voiceover',
							children: [
								{
									title: 'Create',
									pathname: '/docs/v1/api-reference/audio/voiceover/create',
									http_method: 'POST'
								},
								{
									title: 'Outputs',
									pathname: '/docs/v1/api-reference/audio/voiceover/outputs',
									http_method: 'GET'
								},
								{
									title: 'Models',
									pathname: '/docs/v1/api-reference/audio/voiceover/models',
									http_method: 'GET'
								},
								{
									title: 'Defaults',
									pathname: '/docs/v1/api-reference/audio/voiceover/defaults',
									http_method: 'GET'
								}
							]
						}
					]
				},
				{
					title: 'Credits',
					pathname: '/docs/v1/api-reference/credits'
				}
			]
		},
		{
			title: 'Billing',
			pathname: '/docs/v1/billing'
		}
	]
};

export const docsSidebar = addImageUrlToSidebarItem({ sidebarItem: _sidebar, previewBaseUrl });

export const flatDocsSidebarShallow = getAllChildrenFlat(docsSidebar);

function getAllChildrenFlat(item: TSidebarItem): TSidebarItem[] {
	const children = item.children || [];
	return children.reduce((acc, child) => {
		acc.push(child);
		if (child.children) {
			acc.push(...getAllChildrenFlat(child));
		}
		return acc;
	}, [] as TSidebarItem[]);
}
