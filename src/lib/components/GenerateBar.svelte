<script lang="ts">
	import TabBar from '$components/TabBar.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { imageSize } from '$ts/stores/imageSize';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus, TTab } from '$ts/types/main';
	import { onMount, tick } from 'svelte';

	const widths: TTab[] = [
		{ label: '256', value: '256' },
		{ label: '512', value: '512' },
		{ label: '768', value: '768' }
		/* { label: '1024', value: '1024' } */
	];
	const heights: TTab[] = [
		{ label: '256', value: '256' },
		{ label: '512', value: '512' },
		{ label: '768', value: '768' }
		/* { label: '1024', value: '1024' } */
	];

	export let generationWidth = widths[1].value;
	export let generationHeight = heights[1].value;
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let inputValue: string | undefined;
	export let startTimestamp: number | undefined;
	export let estimatedDuration: number;
	export { classes as class };
	let classes = '';

	let submitting = false;
	const placeholder = 'Portrait of a monkey by Van Gogh';
	let now: number | undefined;
	let nowInterval: NodeJS.Timeout | undefined;

	$: loadingOrSubmitting = status === 'loading' || submitting;
	$: sinceSec =
		now !== undefined && startTimestamp !== undefined ? (now - startTimestamp) / 1000 : 0;
	$: [status], createOrDestroyInterval();

	async function createOrDestroyInterval() {
		if (nowInterval) clearInterval(nowInterval);
		if (status === 'loading') {
			nowInterval = setInterval(() => {
				now = Date.now();
			}, 100);
		}
	}

	async function onSubmit() {
		submitting = true;
		if (!inputValue) {
			await new Promise((resolve) => setTimeout(resolve, 75));
			await tick();
			inputValue = placeholder;
		}
		await onCreate();
		submitting = false;
	}

	let isCheckComplete = false;

	onMount(() => {
		isCheckComplete = false;
		const widthIndex = widths
			.map((w) => w.value)
			.findIndex((i) => i === $imageSize?.width?.toString());
		const heightIndex = heights
			.map((h) => h.value)
			.findIndex((i) => i === $imageSize?.height?.toString());
		if (widthIndex >= 0) generationWidth = widths[widthIndex].value;
		if (heightIndex >= 0) generationHeight = heights[heightIndex].value;
		isCheckComplete = true;
	});

	$: [generationWidth, generationHeight], setLocalImageSize();

	const setLocalImageSize = () => {
		if (isCheckComplete) {
			imageSize.set({
				width: parseInt(generationWidth),
				height: parseInt(generationHeight)
			});
		}
	};
</script>

<form
	disabled={loadingOrSubmitting}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-xl md:max-w-6xl md:px-8 flex flex-col items-center"
>
	<!-- Prompt bar -->
	<div class="w-full flex flex-col md:flex-row gap-4 items-center py-4">
		<div class="w-full relative">
			<div
				class="w-full h-full rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] 
				overflow-hidden z-0 absolute left-0 top-0"
			>
				<div
					style="transition-duration: {loadingOrSubmitting ? estimatedDuration : 0.2}s"
					class="w-full h-full ease-linear transition bg-c-secondary/10 
					absolute left-0 top-0 rounded-xl {loadingOrSubmitting ? 'translate-x-0' : '-translate-x-full'}"
				/>
			</div>
			<input
				bind:value={inputValue}
				disabled={loadingOrSubmitting}
				{placeholder}
				type="text"
				class="w-full bg-transparent relative px-6 md:px-8 py-5 rounded-xl transition 
				focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} {classes} {loadingOrSubmitting ? 'text-c-secondary/75' : 'text-c-on-bg'}"
			/>
		</div>
		<button
			disabled={loadingOrSubmitting}
			class="w-full md:w-40 px-8 relative flex items-center justify-center text-center py-5 
			shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]  text-c-on-primary rounded-xl font-bold gap-2 
			overflow-hidden z-0 group {loadingOrSubmitting ? 'bg-c-secondary' : 'bg-c-primary'}"
		>
			<div
				class="w-full h-full origin-left rounded-xl transition transform -translate-x-full 
				bg-c-secondary absolute left-0 top-0 {!$isTouchscreen
					? 'group-enabled:group-hover:translate-x-0'
					: ''}"
			/>
			{#if status === 'loading'}
				<!-- <IconLoading class="w-5 h-5 animate-spin relative" /> -->
				<p class="relative">
					{Math.max(sinceSec, 0).toLocaleString('en-US', {
						minimumFractionDigits: 1,
						maximumFractionDigits: 1
					})}
				</p>
			{:else}
				<p class="relative">Generate</p>
			{/if}
		</button>
	</div>
	<!-- Tab bars -->
	{#if status !== 'loading'}
		<div class="w-full flex flex-col justify-start overflow-hidden" transition:expandCollapse={{}}>
			<div class="w-full flex flex-wrap items-center justify-center gap-4 py-4">
				<TabBar
					title="W"
					class="w-72 max-w-full"
					tabs={widths}
					bind:value={generationWidth}
					name="width"
					hideSelected={!isCheckComplete}
				/>
				<TabBar
					title="H"
					class="w-72 max-w-full"
					tabs={heights}
					bind:value={generationHeight}
					name="height"
					hideSelected={!isCheckComplete}
				/>
			</div>
		</div>
	{/if}
</form>
