import { estimatedGenerationDurationMs } from '$routes/admin/create/estimatedGenerationDurationMs';
import { estimatedUpscaleDurationMs } from '$ts/stores/cost';
import { linear, quadOut } from 'svelte/easing';
import { tweened, type Tweened } from 'svelte/motion';
import { get } from 'svelte/store';

export const longProcessAnimationMultiplier = 6;
export const longProcessMaxValue = 0.75;
export const imageLoadExtraMs = 1000;

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
		duration: duration * longProcessAnimationMultiplier + imageLoadExtraMs,
		easing: quadOut
	});
	newAnimation.set(longProcessMaxValue);
	return newAnimation;
}

export function newUpscaleCompleteAnimation(animation: Tweened<number> | undefined) {
	const value = animation ? get(animation) : 0;
	const duration = get(estimatedUpscaleDurationMs);
	const newAnimation = tweened(value, {
		duration: duration + imageLoadExtraMs,
		easing: quadOut
	});
	newAnimation.set(1);
	return newAnimation;
}

export function newUpscaleStartAnimation() {
	const duration = get(estimatedUpscaleDurationMs);
	const newAnimation = tweened(0, {
		duration: duration * longProcessAnimationMultiplier + imageLoadExtraMs,
		easing: quadOut
	});
	newAnimation.set(longProcessMaxValue);
	return newAnimation;
}
