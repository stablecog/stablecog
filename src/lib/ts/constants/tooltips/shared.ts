import type { TTooltipProps } from '$ts/actions/tooltip';

export const tooltipStyleProps: TTooltipProps = {
	titleClass: 'font-semibold text-sm leading-relaxed',
	descriptionClass: 'text-c-on-bg/75 text-sm leading-relaxed',
	wrapperClass: 'w-full transition duration-250 transform -mt-0.25',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,18rem)] px-5 py-3 transform -translate-y-3 text-c-on-bg flex flex-col gap-0.5 rounded-xl bg-c-bg-secondary overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
	containerAlign: 'left',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-secondary rounded`
};
export const tooltipStylePropsSettingsPanel: TTooltipProps = {
	...tooltipStyleProps,
	containerAlign: 'center'
};

export const tooltipStylePropsAlt: TTooltipProps = {
	titleClass: 'font-semibold text-sm leading-relaxed',
	descriptionClass: 'text-c-on-bg/75 text-sm leading-relaxed',
	wrapperClass: 'w-full transition duration-250 transform mt-1.5',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,18rem)] px-5 py-3 transform -translate-y-3 text-c-on-bg flex flex-col gap-0.5 rounded-xl bg-c-bg-tertiary overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
	containerAlign: 'center',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-tertiary rounded`
};

export const tooltipLivePageStyleProps: TTooltipProps = {
	titleClass: 'font-normal text-c-on-bg/75 text-sm leading-relaxed text-left',
	descriptionClass: 'font-medium text-sm leading-relaxed text-right',
	rowClass: 'w-full flex gap-4 justify-between',
	wrapperClass: 'w-full transition duration-250 transform -mt-0.25',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,16rem)] px-5 py-3 transform -translate-y-3 overflow-hidden text-c-on-bg flex flex-col gap-1 rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-secondary rounded`
};
