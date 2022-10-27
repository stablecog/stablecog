import { quadOut, quartOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

interface IExpandCollapseOptions {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	y?: number;
	durationMultiplier?: number;
	horizontal?: boolean;
	both?: boolean;
	opacity?: number;
	transformOrigin?: string;
}

export const expandCollapse = (node: Node, options: IExpandCollapseOptions) => {
	let {
		delay = 0,
		duration,
		easing = quadOut,
		y,
		durationMultiplier = 1,
		horizontal = false,
		both = false,
		opacity = 0,
		transformOrigin = 'top'
	} = options;
	let height = Number(getComputedStyle(node as HTMLElement).height.split('px')[0]);
	let width = Number(getComputedStyle(node as HTMLElement).width.split('px')[0]);
	const durationCalculated = Math.min(Math.round(height / 2 + 175), 300);
	return {
		delay,
		duration: duration ?? durationCalculated * durationMultiplier,
		easing,
		css: (t: number) => {
			return `${
				both
					? `width: ${t * width}px; height: ${t * height}px`
					: horizontal
					? `width: ${t * width}px`
					: `height: ${t * height}px`
			}; opacity: ${opacity + (1 - opacity) * t}; transform: translateY(${
				(y !== undefined ? y : 0) * (1 - t)
			}rem); transform-origin: ${transformOrigin};`;
		}
	};
};

export const [elementsend, elementreceive] = crossfade({
	duration: () => 350,
	easing: quartOut,
	fallback(node) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 400,
			easing: quartOut,
			css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
		};
	}
});
