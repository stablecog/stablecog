import type { TSidebarItem } from '$routes/guide/types';

const previewBaseUrl = 'https://ba.stablecog.com/guide/previews';

function getPreviewUrlFromGuidePathname(pathname: string) {
	const parts = pathname.split('/');
	const lastPart = parts[parts.length - 1];
	return `${previewBaseUrl}/${lastPart}.jpg`;
}

const _sidebar: TSidebarItem = {
	title: 'Guide',
	pathname: '/guide',
	children: [
		{
			title: 'Overview',
			pathname: '/guide'
		},
		{
			title: 'Prompting',
			pathname: '/guide/prompting',
			children: [
				{
					title: 'Styles',
					pathname: '/guide/prompting/styles'
				},
				{
					title: 'Environments',
					pathname: '/guide/prompting/environments'
				},
				{
					title: 'Emotions',
					pathname: '/guide/prompting/emotions'
				}
			]
		},
		{
			title: 'Generation Settings',
			pathname: '/guide/generation-settings',
			children: [
				{
					title: 'Inference Steps',
					pathname: '/guide/generation-settings/inference-steps'
				},
				{
					title: 'Guidance Scale',
					pathname: '/guide/generation-settings/guidance-scale'
				},
				{
					title: 'Negative Prompt',
					pathname: '/guide/generation-settings/negative-prompt'
				},
				{
					title: 'Scheduler',
					pathname: '/guide/generation-settings/scheduler'
				},
				{
					title: 'Seed',
					pathname: '/guide/generation-settings/seed'
				}
			]
		},
		{
			title: 'Models',
			pathname: '/guide/models',
			children: [
				{
					title: 'Kandinsky',
					pathname: '/guide/models/kandinsky'
				},
				{
					title: 'Luna Diffusion',
					pathname: '/guide/models/luna-diffusion'
				},
				{
					title: 'Stable Diffusion',
					pathname: '/guide/models/stable-diffusion'
				},
				{
					title: 'Openjourney',
					pathname: '/guide/models/openjourney'
				},
				{
					title: 'Waifu Diffusion',
					pathname: '/guide/models/waifu-diffusion'
				},
				{
					title: '22h Diffusion',
					pathname: '/guide/models/22h-diffusion'
				},
				{
					title: 'Arcane Diffusion',
					pathname: '/guide/models/arcane-diffusion'
				},
				{
					title: 'Redshift Diffusion',
					pathname: '/guide/models/redshift-diffusion'
				},
				{
					title: 'Ghibli Diffusion',
					pathname: '/guide/models/ghibli-diffusion'
				}
			]
		}
	]
};

export const guideSidebar = addImageUrlToSidebarItem(_sidebar);

export const flatGuideSidebarShallow = guideSidebar.children!.reduce((acc, item) => {
	acc.push({ title: item.title, pathname: item.pathname });
	if (item.children) {
		acc.push(...item.children);
	}
	return acc;
}, [] as TSidebarItem[]);

function addImageUrlToSidebarItem(item: TSidebarItem): TSidebarItem {
	let obj = { ...item, preview_image_url: getPreviewUrlFromGuidePathname(item.pathname) };
	if (item.children) {
		obj = {
			...obj,
			children: item.children.map((child) => addImageUrlToSidebarItem(child))
		};
	}
	return obj;
}
