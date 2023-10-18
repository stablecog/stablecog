<script lang="ts">
	import { blogContainerSize } from '$components/docs/constants';
	import { locale } from '$i18n/i18n-svelte';
	import type { TPostCleanedMetadata } from '$docroutes/blog/types';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let post: TPostCleanedMetadata;
	export let featured = false;
	export let loading: 'eager' | 'lazy' = 'lazy';
	export { classes as class };
	let classes = '';

	$: src = getImgProxySrcDefault(post.preview_image_url);
	$: srcset = getImgProxySrcSet({ src: post.preview_image_url });
	const sizes = `(min-width: 1024px) ${blogContainerSize / 3}px, (min-width: 768px) 50vw, 100vw`;
	const sizesFeatured = `(min-width: 768px) min(${blogContainerSize / 2}px, 50vw), 100vw`;
</script>

<a
	href="/blog/{post.slug}"
	data-sveltekit-preload-data="hover"
	class="w-full self-stretch bg-c-bg-secondary ring-2 ring-c-bg-tertiary relative z-0 overflow-hidden
  rounded-xl flex {featured
		? 'flex-col md:flex-row'
		: 'flex-col'} shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] transition group
	not-touch:hover:ring-4 not-touch:hover:shadow-xl
	not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:-translate-y-1.5 {classes}"
>
	<div
		class="{featured
			? 'w-full md:w-full md:max-w-[50%] min-h-full'
			: 'w-full h-auto'} relative z-0 overflow-hidden"
	>
		<svg
			class="w-full h-auto {featured ? 'md:object-cover md:h-full' : ''} relative"
			viewBox="0 0 1200 630"
		/>
		<img
			{loading}
			class="bg-c-bg-tertiary w-full h-auto {featured
				? 'md:object-cover md:h-full'
				: ''} absolute left-0 top-0 origin-top transition transform"
			sizes={featured ? sizesFeatured : sizes}
			{src}
			{srcset}
			alt={post.title}
			width="1200"
			height="630"
		/>
	</div>
	<div
		class="w-full flex flex-col items-start px-5 py-4 {featured
			? 'md:px-6 md:py-5 lg:px-7 lg:py-6'
			: ''} relative flex-1"
	>
		<p
			class="font-semibold {featured
				? 'md:text-2xl'
				: ''} max-w-full text-lg leading-snug text-c-on-bg transition
				not-touch:group-hover:text-c-primary"
		>
			{post.title}
		</p>
		<p
			class="{featured
				? 'md:text-base'
				: ''} max-w-full text-sm text-c-on-bg/60 mt-2 leading-normal"
		>
			{post.description}
		</p>
		<div class="flex-1" />
		<p
			class="mb-auto text-sm flex justify-start mt-2.5 bg-c-on-bg/8 text-c-on-bg/60 px-2 py-0.75 rounded"
		>
			{new Date(post.date).toLocaleDateString($locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})}
		</p>
	</div>
</a>
