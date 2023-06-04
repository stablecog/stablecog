<script lang="ts">
	import AudioPlayer from '$components/audioPlayer/AudioPlayer.svelte';
	import AudioPlayerWithWaveform from '$components/audioPlayer/AudioPlayerWithWaveform.svelte';

	const examplePrompt =
		'Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky.';
</script>

<div class="w-full flex flex-col items-center justify-center px-5 py-12 gap-12">
	<div class="w-full max-w-sm flex flex-col gap-3">
		<AudioPlayer src="/audio/example.mp3" label={examplePrompt} title={examplePrompt} />
	</div>
	<div class="w-full max-w-6xl">
		<AudioPlayerWithWaveform
			class="h-128"
			src="/audio/example.mp3"
			label={examplePrompt}
			title={examplePrompt}
		/>
	</div>
</div>
