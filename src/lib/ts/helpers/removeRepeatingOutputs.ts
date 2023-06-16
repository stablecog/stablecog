import type { TGenerationFullOutput } from '$ts/stores/user/generation';
import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

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
	filteredPinnedOutputs = filteredPinnedOutputs.sort((a, b) =>
		new Date(b.generation.created_at).getTime() > new Date(a.generation.created_at).getTime()
			? -1
			: 1
	);
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

export let removeRepeatingOutputsForVoiceover = ({
	outputsPinned,
	outputs,
	onlySucceeded
}: {
	outputsPinned: TVoiceoverFullOutput[];
	outputs: TVoiceoverFullOutput[];
	onlySucceeded?: boolean;
}) => {
	const outputsMap = new Map<string, boolean>(outputs.map((output) => [output.id, true]));
	let filteredPinnedOutputs: TVoiceoverFullOutput[] = [];
	outputsPinned.forEach((o) => {
		if (!outputsMap.has(o.id) && (onlySucceeded === true ? o.status === 'succeeded' : true)) {
			filteredPinnedOutputs.push(o);
		}
	});
	filteredPinnedOutputs = filteredPinnedOutputs.sort((a, b) =>
		new Date(b.voiceover.created_at).getTime() > new Date(a.voiceover.created_at).getTime() ? -1 : 1
	);
	let newOutputs = [...outputs];
	filteredPinnedOutputs.forEach((filteredOutput) => {
		const newerThanIndex = newOutputs.findIndex(
			(newOutput) =>
				new Date(filteredOutput.voiceover.created_at).getTime() >
				new Date(newOutput.voiceover.created_at).getTime()
		);
		if (newerThanIndex === -1) {
			newOutputs.unshift(filteredOutput);
		} else {
			newOutputs.splice(newerThanIndex, 0, filteredOutput);
		}
	});
	return newOutputs;
};
