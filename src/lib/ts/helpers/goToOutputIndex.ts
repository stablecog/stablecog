import { activeGeneration, type TGenerationFullOutput } from '$ts/stores/user/generation';
import { get } from 'svelte/store';

export function setActiveGenerationToOutputIndex(
	outputs: TGenerationFullOutput[] | undefined,
	index: number
) {
	if (outputs === undefined) return;
	const card_type = get(activeGeneration)?.card_type;
	activeGeneration.set({
		...outputs[index].generation,
		selected_output: outputs[index],
		card_type
	});
}
