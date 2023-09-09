<script lang="ts">
	import { browser } from '$app/environment';
	import { docContainerSize } from '$components/docs/constants';
	import { getImgProxySrc, getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { onDestroy } from 'svelte';
	import { portal } from 'svelte-portal';

	export let src: string;
	export let alt: string;
	export let width: string;
	export let height: string;
	export let href: string | undefined = undefined;

	export { classes as class };

	let classes = 'mt-6 mb-3';
	$: _src = getImgProxySrcDefault(src);
	$: srcset = getImgProxySrcSet({ src });
	const sizes = `min(100vw, ${docContainerSize}px)`;
	const highestSrc = getImgProxySrc({ src, preset: 'full' });

	const paddingPx = 16;
	$: boundByHeight =
		$windowWidth && $windowHeight
			? ($windowWidth - paddingPx * 2) / ($windowHeight - paddingPx * 2) >
			  Number(width) / Number(height)
			: false;

	let isFullscreen = false;

	function toggleFullscreen(state?: boolean) {
		if (!browser) return;
		if (state !== undefined) {
			isFullscreen = state;
		} else {
			isFullscreen = !isFullscreen;
		}
		if (isFullscreen) {
			document.body.classList.add('overflow-hidden-for-doc-image');
		} else {
			document.body.classList.remove('overflow-hidden-for-doc-image');
		}
	}

	onDestroy(() => {
		if (!browser) return;
		document.body.classList.remove('overflow-hidden-for-doc-image');
	});
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			toggleFullscreen(false);
		}
	}}
/>

{#if href}
	<div class="w-full {classes}">
		<a
			class="w-full group focus-visible:shadow-none"
			{href}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img
				loading="lazy"
				class="w-full bg-c-bg-tertiary h-auto rounded-lg transition ring-2 ring-c-bg-tertiary
        group-hover:ring-c-primary/75 group-focus:ring-c-primary/75 shadow-xl shadow-c-shadow/[var(--o-shadow-strong)"
				{sizes}
				src={_src}
				{srcset}
				{alt}
				{width}
				{height}
			/>
		</a>
	</div>
{:else}
	<div class="w-full {classes}">
		<div
			class="bg-c-bg-tertiary ring-2 ring-c-bg-tertiary overflow-hidden relative z-0
			rounded-lg not-touch:hover:cursor-zoom-in shadow-xl shadow-c-shadow/[var(--o-shadow-strong) group/docimage"
		>
			<img
				on:click={() => toggleFullscreen()}
				on:keydown={() => null}
				loading="lazy"
				class="w-full h-auto transition duration-500 ease-out transform not-touch:group-hover/docimage:scale-102"
				{sizes}
				src={_src}
				{srcset}
				{alt}
				{width}
				{height}
			/>
		</div>
	</div>
{/if}

{#if isFullscreen}
	<div
		on:click={() => toggleFullscreen()}
		on:keydown={() => null}
		use:portal={'body'}
		class="fixed left-0 top-0 w-full h-full bg-c-barrier/90 flex items-center justify-center z-[9999] px-2 py-16 md:p-4
		overflow-auto md:overflow-hidden not-touch:hover:cursor-zoom-out"
	>
		<img
			class="w-full h-auto {boundByHeight ? 'md:h-full md:w-auto' : 'md:w-full md:h-auto'}
			bg-c-bg-tertiary rounded-lg ring-2 ring-c-bg-tertiary
      shadow-xl shadow-c-shadow/[var(--o-shadow-strong) my-auto"
			src={highestSrc}
			{alt}
			{width}
			{height}
		/>
	</div>
{/if}
