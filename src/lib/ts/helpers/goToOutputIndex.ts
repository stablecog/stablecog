import { activeGeneration, type TGenerationFullOutput } from '$ts/stores/user/generation';
import { get } from 'svelte/store';

export function setActiveGenerationToOutputIndex(
	outputs: TGenerationFullOutput[] | undefined,
	index: number
) {
	if (outputs === undefined) return;
	activeGeneration.set({
		...(get(activeGeneration) || {}),
		...outputs[index].generation,
		selected_output: outputs[index]
	});
}
