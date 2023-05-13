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
	const durationCalculated = Math.min(Math.round(height / 2 + 100), 300);
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
			}rem); transform-origin: ${transformOrigin}; overflow: hidden;`;
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

export const flyAndScale = (node: Node, options: IFlyAndScaleOptions) => {
	let {
		delay = 0,
		duration,
		easing = quadOut,
		yRem,
		xRem,
		yPercent,
		xPercent,
		scaleX,
		scaleY,
		opacity,
		transformOrigin = 'top'
	} = options;
	return {
		delay,
		duration: duration,
		easing,
		css: (t: number) => {
			let css = 'transform:';
			if (yPercent !== undefined) {
				css += ` translateY(${(yPercent !== undefined ? yPercent : 0) * (1 - t)}%)`;
			} else if (yRem !== undefined) {
				css += ` translateY(${(yRem !== undefined ? yRem : 0) * (1 - t)}rem)`;
			}
			if (xPercent !== undefined) {
				css += ` translateX(${(xPercent !== undefined ? xPercent : 0) * (1 - t)}%)`;
			} else if (xRem !== undefined) {
				css += ` translateX(${(xRem !== undefined ? xRem : 0) * (1 - t)}rem)`;
			}
			if (scaleX !== undefined) {
				css += ` scaleX(${scaleX + (1 - scaleX) * t})`;
			}
			if (scaleY !== undefined) {
				css += ` scaleY(${scaleY + (1 - scaleY) * t});`;
			}
			css += ';';
			if (opacity !== undefined) {
				css += ` opacity: ${opacity + (1 - opacity) * t};`;
			} else {
				css += ` opacity: ${t};`;
			}
			css += ` transform-origin: ${transformOrigin};`;
			return css;
		}
	};
};

interface IFlyAndScaleOptions {
	delay?: number;
	duration?: number;
	transformOrigin?: string;
	easing?: (t: number) => number;
	yRem?: number;
	xRem?: number;
	yPercent?: number;
	xPercent?: number;
	scaleX?: number;
	scaleY?: number;
	opacity?: number;
}
