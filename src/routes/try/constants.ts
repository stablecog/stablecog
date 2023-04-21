import type { TSidebarItem } from '$routes/guide/types';

const previewBaseUrl = 'https://ba.stablecog.com/try/previews';

function getPreviewUrlFromTryPathname(pathname: string) {
	const parts = pathname.split('/');
	const lastPart = parts[parts.length - 1];
	return `${previewBaseUrl}/${lastPart}.jpg`;
}

const _sidebar: TSidebarItem = {
	title: 'All Models',
	pathname: '/try/models',
	children: [
		{
			title: 'All Models',
			pathname: '/try/models'
		},
		{
			title: 'Kandinsky',
			pathname: '/try/models/kandinsky'
		},
		{
			title: 'Luna Diffusion',
			pathname: '/try/models/luna-diffusion'
		},
		{
			title: 'Stable Diffusion',
			pathname: '/try/models/stable-diffusion'
		},
		{
			title: 'Openjourney',
			pathname: '/try/models/openjourney'
		},
		{
			title: 'Waifu Diffusion',
			pathname: '/try/models/waifu-diffusion'
		},
		{
			title: '22h Diffusion',
			pathname: '/try/models/22h-diffusion'
		},
		{
			title: 'Arcane Diffusion',
			pathname: '/try/models/arcane-diffusion'
		},
		{
			title: 'Redshift Diffusion',
			pathname: '/try/models/redshift-diffusion'
		},
		{
			title: 'Ghibli Diffusion',
			pathname: '/try/models/ghibli-diffusion'
		}
	]
};

export const trySidebar = addImageUrlToSidebarItem(_sidebar);

export const flatTrySidebarShallow = trySidebar.children!.reduce((acc, item) => {
	acc.push({ title: item.title, pathname: item.pathname });
	if (item.children) {
		acc.push(...item.children);
	}
	return acc;
}, [] as TSidebarItem[]);

function addImageUrlToSidebarItem(item: TSidebarItem): TSidebarItem {
	let obj = { ...item, preview_image_url: getPreviewUrlFromTryPathname(item.pathname) };
	if (item.children) {
		obj = {
			...obj,
			children: item.children.map((child) => addImageUrlToSidebarItem(child))
		};
	}
	return obj;
}
