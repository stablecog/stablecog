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
		class="w-full transform transition h-auto lg:h-full lg:object-contain absolute lg:left-0 lg:top-0"
		{sizes}
		src={backgroundImageUrl}
		{srcset}
		alt="Background for: {prompt}"
		width={backgroundImageWidth}
		height={backgroundImageHeight}
	/>
</SrcsetProvider>
<img
	class="w-full relative transition ease-out h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0 {naturalWidth &&
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
			class="p-1 bg-c-barrier/75 rounded-full absolute left-1 top-1 pointer-events-none"
		>
			<IconAnimatedSpinner class="w-4 h-4 text-c-on-bg" loading={true} />
		</div>
	{/if}
</DelayedValueProvider>
