import type { TTooltipProps } from '$ts/actions/tooltip';

export const tooltipStyleProps: TTooltipProps = {
	parentContainerId: 'tooltip-container',
	titleClass: 'font-bold text-sm leading-relaxed',
	descriptionClass: 'text-c-on-bg/50 text-xs leading-relaxed',
	wrapperClass: 'w-full transition duration-250 transform mt-1.5',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,18rem)] px-5 py-3 transform -translate-y-3 text-c-on-bg/75 flex flex-col gap-0.5 rounded-xl bg-c-bg-tertiary overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)',
	containerAlign: 'center',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-tertiary rounded`
};
