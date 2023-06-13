const maxPromptLength = 100;

export function getAudioFileNameFromVoiceover({
	url,
	speaker_id,
	model_id,
	prompt,
	output_index
}: IGetVoiceoverFileNameFromGenerationProps) {
	const extension = url.split('.').pop() || 'jpeg';
	return `${replaceSpaces(
		prompt.slice(0, maxPromptLength)
	)}-[sp_${speaker_id}]-[mi_${model_id}]-[oi_${output_index}].${extension}`;
}

function replaceSpaces(str: string) {
	return str.replace(/ /g, '_');
}

interface IGetVoiceoverFileNameFromGenerationProps {
	url: string;
	prompt: string;
	speaker_id: string;
	output_index: number;
	model_id: string;
}
