<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import IconHeight from '$components/icons/IconHeight.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconWidth from '$components/icons/IconWidth.svelte';
	import TabBar from '$components/TabBar.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		guidanceScaleDefault,
		guidanceScaleTabs,
		heightDefault,
		heightTabs,
		inferenceStepsDefault,
		inferenceStepsTabs,
		widthDefault,
		widthTabs
	} from '$ts/constants/main';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { guidanceScale } from '$ts/stores/guidanceScale';
	import { imageSize } from '$ts/stores/imageSize';
	import { inferenceSteps } from '$ts/stores/inferenceSteps';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus } from '$ts/types/main';
	import { onMount, tick } from 'svelte';

	export let generationWidth = widthDefault;
	export let generationHeight = heightDefault;
	export let generationInferenceSteps = inferenceStepsDefault;
	export let generationGuidanceScale = guidanceScaleDefault;
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
	let inputElement: HTMLInputElement;

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
		const widthIndex = widthTabs
			.map((w) => w.value)
			.findIndex((i) => i === $imageSize?.width?.toString());
		const heightIndex = heightTabs
			.map((h) => h.value)
			.findIndex((i) => i === $imageSize?.height?.toString());
		const inferenceStepsIndex = inferenceStepsTabs
			.map((i) => i.value)
			.findIndex((i) => i === $inferenceSteps?.toString());
		const guidanceScaleIndex = guidanceScaleTabs
			.map((i) => i.value)
			.findIndex((i) => i === $guidanceScale?.toString());

		if (widthIndex >= 0) generationWidth = widthTabs[widthIndex].value;
		if (heightIndex >= 0) generationHeight = heightTabs[heightIndex].value;
		if (inferenceStepsIndex >= 0)
			generationInferenceSteps = inferenceStepsTabs[inferenceStepsIndex].value;
		if (guidanceScaleIndex >= 0)
			generationGuidanceScale = guidanceScaleTabs[guidanceScaleIndex].value;

		isCheckComplete = true;
	});

	$: [generationWidth, generationHeight], setLocalImageSize();
	$: [generationInferenceSteps], setLocalInferenceSteps();
	$: [generationGuidanceScale], setLocalGuidanceScale();

	const setLocalImageSize = () => {
		if (isCheckComplete) {
			imageSize.set({
				width: generationWidth,
				height: generationHeight
			});
		}
	};

	const setLocalInferenceSteps = () => {
		if (isCheckComplete) {
			inferenceSteps.set(generationInferenceSteps);
		}
	};

	const setLocalGuidanceScale = () => {
		if (isCheckComplete) {
			guidanceScale.set(generationGuidanceScale);
		}
	};
</script>

<form
	disabled={loadingOrSubmitting}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-xl md:max-w-5xl md:px-8 flex flex-col items-center"
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
				bind:this={inputElement}
				bind:value={inputValue}
				on:focus={() => {
					inputElement.select();
				}}
				disabled={loadingOrSubmitting}
				{placeholder}
				type="text"
				class="w-full overflow-hidden overflow-ellipsis bg-transparent relative px-5 md:px-6 py-5 rounded-xl transition 
				focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} {classes} {loadingOrSubmitting ? 'text-c-secondary/75' : 'text-c-on-bg'}"
			/>
		</div>
		<Button disabled={loadingOrSubmitting} loading={loadingOrSubmitting} class="w-full md:w-40">
			{#if status === 'loading'}
				{Math.max(sinceSec, 0).toLocaleString('en-US', {
					minimumFractionDigits: 1,
					maximumFractionDigits: 1
				})}
			{:else}
				Generate
			{/if}
		</Button>
	</div>
	<!-- Tab bars -->
	{#if status !== 'loading'}
		<div
			class="w-full flex flex-col justify-start overflow-hidden"
			transition:expandCollapse|local={{}}
		>
			<div class="w-full flex flex-wrap items-center justify-center px-4px py-4">
				<div class="w-full flex flex-wrap items-center justify-center gap-4">
					<TabBar
						class="{$advancedMode ? 'w-72 md:w-76' : 'w-64 md:w-68'} transition-all max-w-full"
						tabs={widthTabs}
						bind:value={generationWidth}
						name="width"
						hideSelected={!isCheckComplete}
					>
						<div slot="title" class="py-2 px-4 flex items-center justify-center">
							<IconWidth class="w-6 h-6 text-c-on-bg/25" />
						</div>
					</TabBar>
					<TabBar
						class="{$advancedMode ? 'w-72 md:w-76' : 'w-64 md:w-68'} transition-all max-w-full"
						tabs={heightTabs}
						bind:value={generationHeight}
						name="height"
						hideSelected={!isCheckComplete}
					>
						<di slot="title" class="py-2 px-4 flex items-center justify-center">
							<IconHeight class="w-6 h-6 text-c-on-bg/25" />
						</di>
					</TabBar>
				</div>
				{#if $advancedMode}
					<div transition:expandCollapse|local={{}} class="w-full overflow-hidden -mb-4">
						<div class="w-full flex flex-wrap items-center justify-center gap-4 py-4">
							<TabBar
								class="w-72 md:w-76 max-w-full"
								tabs={guidanceScaleTabs}
								bind:value={generationGuidanceScale}
								name="scale"
								hideSelected={!isCheckComplete}
							>
								<div slot="title" class="py-2 px-4 flex items-center justify-center">
									<IconScale class="w-6 h-6 text-c-on-bg/25" />
								</div>
							</TabBar>
							<TabBar
								class="w-72 md:w-76 max-w-full"
								tabs={inferenceStepsTabs}
								bind:value={generationInferenceSteps}
								name="steps"
								hideSelected={!isCheckComplete}
							>
								<div slot="title" class="py-2 px-4 flex items-center justify-center">
									<IconSteps class="w-6 h-6 text-c-on-bg/25" />
								</div>
							</TabBar>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</form>
