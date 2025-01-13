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
	export let caption: 'top' | boolean = false;
	export { classes as class };

	let classes = 'mt-6 mb-3';
	$: _src = getImgProxySrcDefault(src);
	$: srcset = getImgProxySrcSet({ src });
	const sizes = `min(100vw, ${docContainerSize}px)`;
	const highestSrc = getImgProxySrc({ src, preset: 'full' });

	const hasCaption = caption === true || typeof caption === 'string';

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
		<div
			class="shadow-c-shadow/[var(--o-shadow-strong) relative z-0 rounded-lg
			{caption
				? 'bg-c-bg-secondary ring-c-bg-secondary'
				: 'bg-c-bg-tertiary ring-c-bg-tertiary'} shadow-xl ring-2 transition focus-within:ring-c-primary/75 hover:ring-c-primary/75"
		>
			{#if hasCaption}
				<figure class="flex w-full flex-col">
					<a
						aria-label={alt}
						class="w-full {typeof caption === 'string' && caption === 'top'
							? 'rounded-b-lg'
							: ' rounded-t-lg'}"
						{href}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div
							class="relative z-0 w-full overflow-hidden {caption === 'top'
								? 'rounded-b-lg'
								: ' rounded-t-lg'}"
						>
							<img
								loading="lazy"
								class="h-auto w-full transform"
								{sizes}
								src={_src}
								{srcset}
								{alt}
								{width}
								{height}
							/>
						</div>
					</a>
					<figcaption
						class="text-balance px-4 py-3 text-center text-sm text-c-on-bg/75 {caption === 'top'
							? 'order-first'
							: ''}"
					>
						{alt}
					</figcaption>
				</figure>
			{:else}
				<a
					class="w-full focus-visible:outline-none focus-visible:ring-0"
					{href}
					aria-label={alt}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						loading="lazy"
						class="h-auto w-full rounded-lg"
						{sizes}
						src={_src}
						{srcset}
						{alt}
						{width}
						{height}
					/>
				</a>
			{/if}
		</div>
	</div>
{:else}
	<div class="w-full {classes}">
		<div
			class="shadow-c-shadow/[var(--o-shadow-strong) relative z-0 rounded-lg
			{caption
				? 'bg-c-bg-secondary ring-c-bg-secondary'
				: 'bg-c-bg-tertiary ring-c-bg-tertiary'} shadow-xl ring-2"
		>
			{#if hasCaption}
				<figure class="flex w-full flex-col">
					<button
						class="group/docimage flex w-full flex-col not-touch:hover:cursor-zoom-in {caption ===
						'top'
							? 'rounded-b-lg'
							: ' rounded-t-lg'}"
						on:click={() => toggleFullscreen()}
					>
						<div
							class="relative z-0 w-full overflow-hidden {typeof caption === 'string' &&
							caption === 'top'
								? 'rounded-b-lg'
								: ' rounded-t-lg'}"
						>
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
					<figcaption
						class="text-balance px-4 py-3 text-center text-sm text-c-on-bg/75 {typeof caption ===
							'string' && caption === 'top'
							? 'order-first'
							: ''}"
					>
						{alt}
					</figcaption>
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
