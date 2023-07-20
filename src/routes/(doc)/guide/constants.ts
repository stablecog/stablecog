import type { TSidebarItem, TSidebarItemBase } from '$docroutes/guide/types';
import { addImageUrlToSidebarItem } from '$components/docs/helpers';

export const previewBaseUrl = 'https://ba.stablecog.com/guide/previews';
export const entries = import.meta.glob(`/src/lib/md/guide/**/*.md`);

const _sidebar: TSidebarItemBase = {
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
					title: 'Kandinsky 2.2',
					pathname: '/guide/models/kandinsky-2-2'
				},
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

export const guideSidebar = addImageUrlToSidebarItem({ sidebarItem: _sidebar, previewBaseUrl });

export const flatGuideSidebarShallow = guideSidebar.children!.reduce((acc, item) => {
	acc.push(item);
	if (item.children) {
		acc.push(...item.children);
	}
	return acc;
}, [] as TSidebarItem[]);
