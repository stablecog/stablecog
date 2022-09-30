import { quadOut } from 'svelte/easing';

interface IExpandCollapseOptions {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	y?: number;
	durationMultiplier?: number;
}

export const expandCollapse = (node: Node, options: IExpandCollapseOptions) => {
	let { delay = 0, duration, easing = quadOut, y, durationMultiplier = 1 } = options;
	let height = Number(getComputedStyle(node as HTMLElement).height.split('px')[0]);
	const durationCalculated = Math.min(Math.round(height / 2 + 175), 300);
	return {
		delay,
		duration: duration ?? durationCalculated * durationMultiplier,
		easing,
		css: (t: number) => {
			return `height: ${t * height}px; transform: translateY(${
				y ?? 0 * (1 - t)
			}rem); transform-origin: top;`;
		}
	};
};
