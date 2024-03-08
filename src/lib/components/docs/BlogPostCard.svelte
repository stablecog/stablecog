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
	class="relative z-0 flex w-full self-stretch overflow-hidden rounded-xl bg-c-bg-secondary
  ring-2 ring-c-bg-tertiary {featured
		? 'flex-col md:flex-row'
		: 'flex-col'} group shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] transition
	not-touch:hover:-translate-y-1.5 not-touch:hover:shadow-xl
	not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:ring-4 {classes}"
>
	<div
		class="{featured
			? 'min-h-full w-full md:w-full md:max-w-[50%]'
			: 'h-auto w-full'} relative z-0 overflow-hidden"
	>
		<svg
			class="h-auto w-full {featured ? 'md:h-full md:object-cover' : ''} relative"
			viewBox="0 0 1200 630"
		/>
		<img
			{loading}
			class="h-auto w-full bg-c-bg-tertiary {featured
				? 'md:h-full md:object-cover'
				: ''} absolute left-0 top-0 origin-top transform transition"
			sizes={featured ? sizesFeatured : sizes}
			{src}
			{srcset}
			alt={post.title}
			width="1200"
			height="630"
		/>
	</div>
	<div
		class="flex w-full flex-col items-start px-5 py-4 {featured
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
				: ''} mt-2 max-w-full text-sm leading-normal text-c-on-bg/60"
		>
			{post.description}
		</p>
		<div class="flex-1" />
		<p
			class="mb-auto mt-2.5 flex justify-start rounded bg-c-on-bg/8 px-2 py-0.75 text-sm text-c-on-bg/60"
		>
			{new Date(post.date).toLocaleDateString($locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})}
		</p>
	</div>
</a>
