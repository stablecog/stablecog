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
	export let caption = false;
	export let captionSide: 'bottom' | 'top' = 'bottom';
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
			class="group w-full focus-visible:shadow-none"
			{href}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img
				loading="lazy"
				class="shadow-c-shadow/[var(--o-shadow-strong) h-auto w-full rounded-lg bg-c-bg-tertiary shadow-xl ring-2
        ring-c-bg-tertiary transition group-hover:ring-c-primary/75 group-focus:ring-c-primary/75"
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
			class="shadow-c-shadow/[var(--o-shadow-strong) relative z-0 rounded-lg
			bg-c-bg-tertiary shadow-xl ring-2 ring-c-bg-tertiary"
		>
			{#if caption}
				<figure class="flex w-full flex-col">
					<button
						class="group/docimage flex w-full flex-col not-touch:hover:cursor-zoom-in"
						on:click={() => toggleFullscreen()}
					>
						<div class="relative z-0 w-full overflow-hidden rounded-lg">
							<img
								loading="lazy"
								class="h-auto w-full transform transition duration-500 ease-out not-touch:group-hover/docimage:scale-102"
								{sizes}
								src={_src}
								{srcset}
								{alt}
								{width}
								{height}
							/>
						</div>
					</button>
					{#if caption === true}
						<figcaption
							class="text-balance px-4 py-3 text-center text-sm {captionSide === 'top'
								? 'order-first'
								: ''}"
						>
							{alt}
						</figcaption>
					{/if}
				</figure>
			{:else}
				<button
					class="group/docimage flex w-full flex-col not-touch:hover:cursor-zoom-in"
					on:click={() => toggleFullscreen()}
				>
					<div class="relative z-0 w-full overflow-hidden rounded-lg">
						<img
							loading="lazy"
							class="h-auto w-full transform transition duration-500 ease-out not-touch:group-hover/docimage:scale-102"
							{sizes}
							src={_src}
							{srcset}
							{alt}
							{width}
							{height}
						/>
					</div>
				</button>
			{/if}
		</div>
	</div>
{/if}

{#if isFullscreen}
	<button
		on:click={() => toggleFullscreen()}
		use:portal={'body'}
		class="fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center overflow-auto bg-c-barrier/90 px-2 py-16
		not-touch:hover:cursor-zoom-out md:overflow-hidden md:p-4"
	>
		<img
			class="h-auto w-full {boundByHeight ? 'md:h-full md:w-auto' : 'md:h-auto md:w-full'}
			shadow-c-shadow/[var(--o-shadow-strong) my-auto rounded-lg bg-c-bg-tertiary
      shadow-xl ring-2 ring-c-bg-tertiary"
			src={highestSrc}
			{alt}
			{width}
			{height}
		/>
	</button>
{/if}
