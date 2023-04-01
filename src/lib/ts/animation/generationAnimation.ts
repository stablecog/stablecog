import { estimatedGenerationDurationMs } from '$routes/admin/create/estimatedGenerationDurationMs';
import { quadInOut, quadOut } from 'svelte/easing';
import { tweened, type Tweened } from 'svelte/motion';
import { get } from 'svelte/store';

export const longGenerationAnimationMultiplier = 6;
export const longGenerationMaxValue = 0.75;
export const imageLoadExtraMs = 500;

export function newGenerationCompleteAnimation(animation: Tweened<number> | undefined) {
	const value = animation ? get(animation) : 0;
	const duration = get(estimatedGenerationDurationMs);
	const newAnimation = tweened(value, {
		duration: duration + imageLoadExtraMs,
		easing: quadOut
	});
	newAnimation.set(1);
	return newAnimation;
}

export function newGenerationStartAnimation() {
	const duration = get(estimatedGenerationDurationMs);
	const newAnimation = tweened(0, {
		duration: duration * longGenerationAnimationMultiplier + imageLoadExtraMs,
		easing: quadOut
	});
	newAnimation.set(longGenerationMaxValue);
	return newAnimation;
}
