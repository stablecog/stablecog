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
							title: 'Generate',
							pathname: '/docs/v1/api-reference/image/generate'
						},
						{
							title: 'Upscale',
							pathname: '/docs/v1/api-reference/image/upscale'
						},
						{
							title: 'Models',
							pathname: '/docs/v1/api-reference/image/models',
							preview_image_url: `${previewBaseUrl}/image-models.jpg`,
							children: [
								{
									title: 'Generation Models',
									pathname: '/docs/v1/api-reference/image/models/generate',
									preview_image_url: `${previewBaseUrl}/generation-models.jpg`
								},
								{
									title: 'Upscale Models',
									pathname: '/docs/v1/api-reference/image/models/upscale',
									preview_image_url: `${previewBaseUrl}/upscale-models.jpg`
								}
							]
						},
						{
							title: 'Defaults',
							pathname: '/docs/v1/api-reference/image/defaults',
							preview_image_url: `${previewBaseUrl}/image-defaults.jpg`,
							children: [
								{
									title: 'Generation Defaults',
									pathname: '/docs/v1/api-reference/image/defaults/generate',
									preview_image_url: `${previewBaseUrl}/generation-defaults.jpg`
								},
								{
									title: 'Upscale Defaults',
									pathname: '/docs/v1/api-reference/image/defaults/upscale',
									preview_image_url: `${previewBaseUrl}/upscale-defaults.jpg`
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
