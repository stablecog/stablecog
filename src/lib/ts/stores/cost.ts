import type { TGeneration } from '$ts/stores/user/generation';
import type { TUpscale } from '$ts/stores/user/upscale';
import { writable as writableLocal } from 'svelte-local-storage-store';

const defaultUpscaleDurationMs = 6000;
const defaultGenerationCostCompletionPerMs = 6000;

export const generationCostCompletionPerMs = writableLocal<number | null>(
	'generationCostCompletionPerMs',
	defaultGenerationCostCompletionPerMs
);
export const estimatedUpscaleDurationMs = writableLocal<number>(
	'estimatedUpscaleDurationMs',
	defaultUpscaleDurationMs
);

const widthBase = 512;
const heightBase = 512;
const outputsBase = 4;
const stepsBase = 30;
const costBase = widthBase * heightBase * outputsBase * stepsBase;

export const calculateGenerationCost = (
	width: number,
	height: number,
	numOutputs: number,
	inferenceSteps: number
) => {
	const widthMul = width / widthBase;
	const heightMul = height / heightBase;
	const outputsMul = numOutputs / outputsBase;
	const stepsMul = inferenceSteps / stepsBase;
	const costMul = widthMul * heightMul * outputsMul * stepsMul;
	const cost = costBase * costMul;
	return cost;
};

export const getCostFromGeneration = (generation: TGeneration) => {
	if (generation.status !== 'succeeded' || !generation.completed_at || !generation.started_at) {
		return null;
	}
	const cost = calculateGenerationCost(
		generation.width,
		generation.height,
		generation.outputs.length,
		generation.inference_steps
	);
	return cost;
};

export const getCostCompletionPerMsFromGeneration = (generation: TGeneration) => {
	if (generation.status !== 'succeeded' || !generation.completed_at || !generation.started_at) {
		return null;
	}
	const cost = getCostFromGeneration(generation);
	if (cost === null) {
		return null;
	}
	const durationMs = generation.completed_at - generation.started_at;
	const costRatePerMs = cost / durationMs;
	return costRatePerMs;
};

export const getUpscaleDurationMsFromUpscale = (upscale: TUpscale) => {
	if (upscale.status !== 'succeeded' || !upscale.completed_at || !upscale.started_at) {
		return null;
	}
	const durationMs = upscale.completed_at - upscale.started_at;
	return durationMs;
};
