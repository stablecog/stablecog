import { getAudioFileNameFromVoiceover } from '$ts/helpers/getAudioFileNameFromVoiceover';
import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

export async function downloadVoicoverOutput(output: TVoiceoverFullOutput) {
	const url = output.audio_file_url;
	const res = await fetch(`${url}?download=true`);
	if (!res.ok) {
		throw new Error(`Failed to fetch audio: ${res.status}`);
	}
	const blob = await res.blob();
	const fileName = getAudioFileNameFromVoiceover({
		url,
		model_id: output.voiceover.model_id,
		output_index: output.voiceover.outputs.findIndex((o) => o.id === output.id),
		prompt: output.voiceover.prompt.text,
		speaker_id: output.voiceover.speaker.id
	});
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = fileName;
	a.click();
	a.remove();
}
