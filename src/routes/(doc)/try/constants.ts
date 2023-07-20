import type { TSidebarItem, TSidebarItemBase } from '$docroutes/guide/types';
import { addImageUrlToSidebarItem } from '$components/docs/helpers';

export const previewBaseUrl = 'https://ba.stablecog.com/try/previews';
export const entries = import.meta.glob(`/src/lib/md/try/**/*.md`);

const _sidebar: TSidebarItemBase = {
	title: 'Try',
	pathname: '/try',
	children: [
		{
			title: 'Try Models',
			pathname: '/try/models',
			children: [
				{
					title: 'Kandinsky 2.2',
					pathname: '/try/models/kandinsky-2-2'
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
		}
	]
};

export const trySidebar = addImageUrlToSidebarItem({ sidebarItem: _sidebar, previewBaseUrl });

export const flatTrySidebarShallow = trySidebar.children!.reduce((acc, item) => {
	acc.push(item);
	if (item.children) {
		acc.push(...item.children);
	}
	return acc;
}, [] as TSidebarItem[]);
