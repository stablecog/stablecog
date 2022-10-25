import type { TGenerationUI } from '$ts/types/main';

export const generationId = (generation: TGenerationUI) => {
	return `${generation.prompt}-${generation.seed}-${generation.duration_ms}-${generation.num_inference_steps}-${generation.num_inference_steps}`;
};
