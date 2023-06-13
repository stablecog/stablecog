import { PUBLIC_BUCKET_URL, PUBLIC_BUCKET_VOICEOVER_URL } from '$env/static/public';
import { getAudioFileNameFromVoiceover } from '$ts/helpers/getAudioFileNameFromVoiceover';
import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

export async function downloadVoicoverOutput(output: TVoiceoverFullOutput) {
	const url = `${output.audio_file_url.replace(PUBLIC_BUCKET_URL, PUBLIC_BUCKET_VOICEOVER_URL)}`;
	const res = await fetch(`${url}?download=true`);
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
