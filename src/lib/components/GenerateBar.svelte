<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import IconHeight from '$components/icons/IconHeight.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconWidth from '$components/icons/IconWidth.svelte';
	import TabBar from '$components/TabBar.svelte';
	import TabLikeInput from '$components/TabLikeInput.svelte';
	import TabLikeRangeInput from '$components/TabLikeRangeInput.svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		guidanceScaleDefault,
		guidanceScaleMax,
		guidanceScaleMin,
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
	import { seed } from '$ts/stores/seed';
	import type { TStatus } from '$ts/types/main';
	import { onMount, tick } from 'svelte';

	export let generationWidth = widthDefault;
	export let generationHeight = heightDefault;
	export let generationInferenceSteps = inferenceStepsDefault;
	export let generationGuidanceScale = guidanceScaleDefault;
	export let generationSeed: number;
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

	$: [generationWidth, generationHeight], setLocalImageSize();
	$: [generationInferenceSteps], setLocalInferenceSteps();
	$: [generationGuidanceScale], setLocalGuidanceScale();
	$: [generationSeed], setLocalSeed();

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
			guidanceScale.set(Math.round(generationGuidanceScale));
		}
	};

	const setLocalSeed = () => {
		if (isCheckComplete) {
			if (generationSeed !== undefined && generationSeed !== null) {
				seed.set(parseInt(generationSeed.toString()));
			} else {
				localStorage.removeItem('seed');
			}
		}
	};

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

		if (widthIndex >= 0) generationWidth = widthTabs[widthIndex].value;
		if (heightIndex >= 0) generationHeight = heightTabs[heightIndex].value;
		if (inferenceStepsIndex >= 0) {
			generationInferenceSteps = inferenceStepsTabs[inferenceStepsIndex].value;
		}
		if ($guidanceScale >= guidanceScaleMin && $guidanceScale <= guidanceScaleMax) {
			generationGuidanceScale = $guidanceScale;
		}
		if ($seed !== undefined && $seed !== null) generationSeed = $seed;

		isCheckComplete = true;
	});

	const tooltipStyleProps = {
		titleClass: 'font-bold text-sm leading-relaxed',
		descriptionClass: 'text-c-on-bg/50 text-xs leading-relaxed',
		wrapperClass: 'transition duration-250 transform',
		animationTime: 250,
		animateFrom: 'opacity-0 translate-y-2',
		animateTo: 'opacity-100 translate-y-0',
		containerClass:
			'px-5 py-3 text-c-on-bg/75 flex flex-col gap-1 rounded-xl bg-c-bg-secondary max-w-[17rem] shadow-lg shadow-c-shadow/[var(--o-shadow-strong)',
		indicatorClass:
			'ml-4.5 w-5 h-5 transform -mt-0.5 -mb-2.5 rotate-135 bg-c-bg-secondary rounded-bl'
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
			<div class="w-full flex flex-wrap items-center justify-center py-4">
				<div class="w-full flex flex-wrap items-center justify-center px-4px gap-4">
					<TabBar
						class="{$advancedMode ? 'w-76' : 'w-64 md:w-68'} transition-all max-w-full"
						tabs={widthTabs}
						bind:value={generationWidth}
						name="width"
						hideSelected={!isCheckComplete}
					>
						<div
							use:tooltip={{
								title: 'Width',
								description: 'The width of the image.',
								...tooltipStyleProps
							}}
							slot="title"
							class="py-2 px-4 flex items-center justify-center"
						>
							<IconWidth class="w-6 h-6 text-c-on-bg/25" />
						</div>
					</TabBar>
					<TabBar
						class="{$advancedMode ? 'w-76' : 'w-64 md:w-68'} transition-all max-w-full"
						tabs={heightTabs}
						bind:value={generationHeight}
						name="height"
						hideSelected={!isCheckComplete}
					>
						<div
							use:tooltip={{
								title: 'Height',
								description: 'The height of the image.',
								...tooltipStyleProps
							}}
							slot="title"
							class="py-2 px-4 flex items-center justify-center"
						>
							<IconHeight class="w-6 h-6 text-c-on-bg/25" />
						</div>
					</TabBar>
				</div>
				{#if $advancedMode}
					<div transition:expandCollapse|local={{}} class="w-full overflow-hidden -mb-4">
						<div class="w-full flex flex-wrap items-center justify-center px-4px gap-4 py-4">
							<TabBar
								class="w-76 max-w-full"
								tabs={inferenceStepsTabs}
								bind:value={generationInferenceSteps}
								name="steps"
								hideSelected={!isCheckComplete}
							>
								<div
									use:tooltip={{
										title: 'Steps',
										description: 'How many steps will be taken to generate (diffuse) the image.',
										...tooltipStyleProps
									}}
									slot="title"
									class="py-2 px-4 flex items-center justify-center"
								>
									<IconSteps class="w-6 h-6 text-c-on-bg/25" />
								</div>
							</TabBar>
							<TabLikeRangeInput
								class="w-76 max-w-full"
								bind:value={generationGuidanceScale}
								min={guidanceScaleMin}
								max={guidanceScaleMax}
							>
								<div
									use:tooltip={{
										title: 'Guidance Scale',
										description:
											'How similar the image will be to your prompt. Higher values make the image closer to your prompt.',
										...tooltipStyleProps
									}}
									slot="title"
									class="py-2 px-4 flex items-center justify-center"
								>
									<IconScale class="w-6 h-6 text-c-on-bg/25" />
								</div>
							</TabLikeRangeInput>
							<TabLikeInput
								class="w-76 max-w-full"
								placeholder="Enter a number"
								bind:value={generationSeed}
							>
								<div
									use:tooltip={{
										title: 'Seed',
										description:
											'Get repeatable results. The same seed combined with the same prompt and options will generate the same image.',
										...tooltipStyleProps
									}}
									slot="title"
									class="py-2 px-4 flex items-center justify-center"
								>
									<IconSeed class="w-6 h-6 text-c-on-bg/25" />
								</div>
							</TabLikeInput>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</form>
