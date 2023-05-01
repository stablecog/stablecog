import type { TGenerationFullOutput } from '$ts/stores/user/generation';

export let removeRepeatingOutputs = ({
	outputsPinned,
	outputs,
	onlySucceeded
}: {
	outputsPinned: TGenerationFullOutput[];
	outputs: TGenerationFullOutput[];
	onlySucceeded?: boolean;
}) => {
	const outputsMap = new Map<string, boolean>(outputs.map((output) => [output.id, true]));
	let filteredPinnedOutputs: TGenerationFullOutput[] = [];
	outputsPinned.forEach((o) => {
		if (!outputsMap.has(o.id) && (onlySucceeded === true ? o.status === 'succeeded' : true)) {
			filteredPinnedOutputs.push(o);
		}
	});
	let newOutputs = [...outputs];
	filteredPinnedOutputs.forEach((filteredOutput) => {
		const newerThanIndex = newOutputs.findIndex(
			(newOutput) =>
				new Date(filteredOutput.generation.created_at).getTime() >
				new Date(newOutput.generation.created_at).getTime()
		);
		if (newerThanIndex === -1) {
			newOutputs.unshift(filteredOutput);
		} else {
			newOutputs.splice(newerThanIndex, 0, filteredOutput);
		}
	});
	return newOutputs;
};
