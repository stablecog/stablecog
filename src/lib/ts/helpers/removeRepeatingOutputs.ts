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
	const uniqueOutputsMap = new Map<string, TGenerationFullOutput>();

	outputs.forEach((output) => {
		if (output?.id && !uniqueOutputsMap.has(output.id)) {
			uniqueOutputsMap.set(output.id, output);
		}
	});

	outputsPinned.forEach((output) => {
		if (
			output?.id &&
			!uniqueOutputsMap.has(output.id) &&
			(!onlySucceeded || output.status === 'succeeded')
		) {
			uniqueOutputsMap.set(output.id, output);
		}
	});

	return Array.from(uniqueOutputsMap.values()).sort(
		(a, b) =>
			new Date(b.generation.created_at).getTime() - new Date(a.generation.created_at).getTime()
	);
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
	const uniqueOutputsMap = new Map<string, TVoiceoverFullOutput>();

	outputs.forEach((output) => {
		if (!uniqueOutputsMap.has(output.id)) {
			uniqueOutputsMap.set(output.id, output);
		}
	});

	outputsPinned.forEach((output) => {
		if (!uniqueOutputsMap.has(output.id) && (!onlySucceeded || output.status === 'succeeded')) {
			uniqueOutputsMap.set(output.id, output);
		}
	});

	return Array.from(uniqueOutputsMap.values()).sort(
		(a, b) =>
			new Date(b.voiceover.created_at).getTime() - new Date(a.voiceover.created_at).getTime()
	);
};
