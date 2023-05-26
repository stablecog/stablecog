<script lang="ts">
	import { blogContainerSize } from '$components/docs/constants';
	import { locale } from '$i18n/i18n-svelte';
	import type { TPostMetadata } from '$routes/blog/types';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let post: TPostMetadata;

	$: src = getImgProxySrcDefault(post.preview_image_url);
	$: srcset = getImgProxySrcSet({ src: post.preview_image_url });
	const sizes = `(min-width: 1024px) ${blogContainerSize / 3}px, (min-width: 768px) 50vw, 100vw`;
</script>

<a
	href="/blog/{post.slug}"
	data-sveltekit-preload-data="hover"
	class="w-full self-stretch bg-c-bg-secondary ring-2 ring-c-bg-tertiary relative z-0 overflow-hidden
  rounded-xl flex flex-col shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] transition group
	not-touch:hover:ring-4 not-touch:hover:shadow-xl
	not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:-translate-y-1.5"
>
	<div class="w-full h-auto relative z-0 overflow-hidden">
		<svg class="w-full h-auto relative" viewBox="0 0 1200 630" />
		<img
			loading="lazy"
			class="bg-c-bg-tertiary w-full h-auto absolute left-0 top-0 origin-top transition transform"
			{sizes}
			{src}
			{srcset}
			alt={post.title}
			width="1200"
			height="630"
		/>
	</div>
	<div class="w-full flex flex-col items-start px-5 pt-4 pb-4 relative flex-1">
		<p
			class="font-semibold text-lg leading-snug text-c-on-bg transition
				not-touch:group-hover:text-c-primary"
		>
			{post.title}
		</p>
		<p class="text-sm text-c-on-bg/60 mt-2 leading-normal">{post.description}</p>
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
