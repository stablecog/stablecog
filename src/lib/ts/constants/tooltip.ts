import LL from '$i18n/i18n-svelte';
import type { TTooltipProps } from '$ts/actions/tooltip';
import { derived, type Readable } from 'svelte/store';

export let widthTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.WidthTabBar.Title(),
	description: $LL.Home.WidthTabBar.Paragraph(),
	...tooltipStyleProps
}));

export let heightTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.HeightTabBar.Title(),
	description: $LL.Home.HeightTabBar.Paragraph(),
	...tooltipStyleProps
}));

export let guidanceScaleTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.GuidanceScaleSlider.Title(),
	description: $LL.Home.GuidanceScaleSlider.Paragraph(),
	...tooltipStyleProps
}));

export let inferenceStepsTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.InferenceStepsTabBar.Title(),
	description: $LL.Home.InferenceStepsTabBar.Paragraph(),
	...tooltipStyleProps
}));

export let negativePromptTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.NegativePromptInput.Title(),
	description: $LL.Home.NegativePromptInput.Paragraph(),
	...tooltipStyleProps
}));

export let seedTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.SeedInput.Title(),
	description: $LL.Home.SeedInput.Paragraph(),
	...tooltipStyleProps
}));

export let advancedModeTooltip: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Settings.AdvancedModeToggle(),
	...tooltipStyleProps
}));

export let widthTooltipAlt: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.WidthTabBar.Title(),
	description: $LL.Home.WidthTabBar.Paragraph(),
	...tooltipStylePropsAlt
}));

export let heightTooltipAlt: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.HeightTabBar.Title(),
	description: $LL.Home.HeightTabBar.Paragraph(),
	...tooltipStylePropsAlt
}));

export let guidanceScaleTooltipAlt: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.GuidanceScaleSlider.Title(),
	description: $LL.Home.GuidanceScaleSlider.Paragraph(),
	...tooltipStylePropsAlt
}));

export let inferenceStepsTooltipAlt: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.InferenceStepsTabBar.Title(),
	description: $LL.Home.InferenceStepsTabBar.Paragraph(),
	...tooltipStylePropsAlt
}));

export let negativePromptTooltipAlt: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.NegativePromptInput.Title(),
	description: $LL.Home.NegativePromptInput.Paragraph(),
	...tooltipStylePropsAlt
}));

export let seedTooltipAlt: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Home.SeedInput.Title(),
	description: $LL.Home.SeedInput.Paragraph(),
	...tooltipStylePropsAlt
}));

const tooltipStyleProps: TTooltipProps = {
	parentContainerId: 'tooltip-container',
	titleClass: 'font-bold text-sm leading-relaxed',
	descriptionClass: 'text-c-on-bg/60 text-xs leading-relaxed',
	wrapperClass: 'w-full transition duration-250 transform -mt-0.25',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,18rem)] px-5 py-3 transform -translate-y-3 text-c-on-bg/75 flex flex-col gap-0.5 rounded-xl bg-c-bg-secondary overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
	containerAlign: 'left',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-secondary rounded`
};

const tooltipStylePropsAlt: TTooltipProps = {
	parentContainerId: 'tooltip-container',
	titleClass: 'font-bold text-sm leading-relaxed',
	descriptionClass: 'text-c-on-bg/60 text-xs leading-relaxed',
	wrapperClass: 'w-full transition duration-250 transform mt-1.5',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,18rem)] px-5 py-3 transform -translate-y-3 text-c-on-bg/75 flex flex-col gap-0.5 rounded-xl bg-c-bg-tertiary overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
	containerAlign: 'center',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-tertiary rounded`
};
