import type { TSidebarItem } from '$routes/guide/types';

const bucketUrl = 'https://ba.stablecog.com';

export const sidebar: TSidebarItem = {
	title: 'Guide',
	pathname: '/guide',
	preview_image_url: `${bucketUrl}/guide/previews/guide.jpg`,
	children: [
		{
			title: 'Overview',
			pathname: '/guide',
			preview_image_url: `${bucketUrl}/guide/previews/guide.jpg`
		},
		{
			title: 'Prompting',
			pathname: '/guide/prompting',
			preview_image_url: `${bucketUrl}/guide/previews/prompting.jpg`,
			children: [
				{
					title: 'Styles',
					pathname: '/guide/prompting/styles',
					preview_image_url: `${bucketUrl}/guide/previews/styles.jpg`
				},
				{
					title: 'Environments',
					pathname: '/guide/prompting/environments',
					preview_image_url: `${bucketUrl}/guide/previews/environments.jpg`
				},
				{
					title: 'Emotions',
					pathname: '/guide/prompting/emotions',
					preview_image_url: `${bucketUrl}/guide/previews/emotions.jpg`
				}
			]
		},
		{
			title: 'Generation Settings',
			pathname: '/guide/generation-settings',
			preview_image_url: `${bucketUrl}/guide/previews/generation-settings.jpg`,
			children: [
				{
					title: 'Inference Steps',
					pathname: '/guide/generation-settings/inference-steps',
					preview_image_url: `${bucketUrl}/guide/previews/inference-steps.jpg`
				},
				{
					title: 'Guidance Scale',
					pathname: '/guide/generation-settings/guidance-scale',
					preview_image_url: `${bucketUrl}/guide/previews/guidance-scale.jpg`
				},
				{
					title: 'Negative Prompt',
					pathname: '/guide/generation-settings/negative-prompt',
					preview_image_url: `${bucketUrl}/guide/previews/negative-prompt.jpg`
				},
				{
					title: 'Scheduler',
					pathname: '/guide/generation-settings/scheduler',
					preview_image_url: `${bucketUrl}/guide/previews/scheduler.jpg`
				},
				{
					title: 'Seed',
					pathname: '/guide/generation-settings/seed',
					preview_image_url: `${bucketUrl}/guide/previews/seed.jpg`
				}
			]
		},
		{
			title: 'Models',
			pathname: '/guide/models',
			preview_image_url: `${bucketUrl}/guide/previews/models.jpg`,
			children: [
				{
					title: 'Kandinsky',
					pathname: '/guide/models/kandinsky',
					preview_image_url: `${bucketUrl}/guide/previews/kandinsky.jpg`
				},
				{
					title: 'Luna Diffusion',
					pathname: '/guide/models/luna-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/luna-diffusion.jpg`
				},
				{
					title: 'Stable Diffusion',
					pathname: '/guide/models/stable-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/stable-diffusion.jpg`
				},
				{
					title: 'Openjourney',
					pathname: '/guide/models/openjourney',
					preview_image_url: `${bucketUrl}/guide/previews/openjourney.jpg`
				},
				{
					title: 'Waifu Diffusion',
					pathname: '/guide/models/waifu-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/waifu-diffusion.jpg`
				},
				{
					title: '22h Diffusion',
					pathname: '/guide/models/22h-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/22h-diffusion.jpg`
				},
				{
					title: 'Arcane Diffusion',
					pathname: '/guide/models/arcane-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/arcane-diffusion.jpg`
				},
				{
					title: 'Redshift Diffusion',
					pathname: '/guide/models/redshift-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/redshift-diffusion.jpg`
				},
				{
					title: 'Ghibli Diffusion',
					pathname: '/guide/models/ghibli-diffusion',
					preview_image_url: `${bucketUrl}/guide/previews/ghibli-diffusion.jpg`
				}
			]
		}
	]
};

export const flatSidebarShallow = sidebar.children!.reduce((acc, item) => {
	acc.push({ title: item.title, pathname: item.pathname });
	if (item.children) {
		acc.push(...item.children);
	}
	return acc;
}, [] as TSidebarItem[]);
