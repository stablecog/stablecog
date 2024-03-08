<script lang="ts">
	import DelayedValueProvider from '$components/utils/DelayedValueProvider.svelte';
	import SrcsetProvider from '$components/generationImage/SrcsetProvider.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let backgroundImageUrl: string;
	export let backgroundImageWidth: number;
	export let backgroundImageHeight: number;
	export let imageUrl: string;
	export let imageWidth: number;
	export let imageHeight: number;
	export let prompt: string;
	export let cardType: TGenerationImageCardType;

	let naturalWidth: number;
	let naturalHeight: number;

	$: loading = !naturalWidth || !naturalHeight;
</script>

<SrcsetProvider src={backgroundImageUrl} {cardType} let:sizes let:srcset>
	<img
		class="absolute h-auto w-full transform transition lg:left-0 lg:top-0 lg:h-full lg:object-contain"
		{sizes}
		src={backgroundImageUrl}
		{srcset}
		alt="Background for: {prompt}"
		width={backgroundImageWidth}
		height={backgroundImageHeight}
	/>
</SrcsetProvider>
<img
	class="relative h-auto w-full transition ease-out lg:absolute lg:left-0 lg:top-0 lg:h-full lg:object-contain {naturalWidth &&
	naturalHeight
		? 'opacity-100'
		: 'opacity-0'}"
	src={imageUrl}
	alt={prompt}
	bind:naturalWidth
	bind:naturalHeight
	width={imageWidth}
	height={imageHeight}
/>

<DelayedValueProvider
	value={loading}
	defaultValue={false}
	delay={500}
	minStay={500}
	let:delayedValue={loadingWithDelay}
	dependencies={[imageUrl]}
>
	{#if loadingWithDelay}
		<div
			transition:scale={{ start: 0, opacity: 0, duration: 250, easing: quadOut }}
			class="pointer-events-none absolute left-1 top-1 rounded-full bg-c-barrier/75 p-1"
		>
			<IconAnimatedSpinner class="h-4 w-4 text-c-on-bg" loading={true} />
		</div>
	{/if}
</DelayedValueProvider>
