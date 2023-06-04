<script lang="ts">
	import AudioPlayer from '$components/audioPlayer/AudioPlayer.svelte';
	import AudioPlayerWithWaveform from '$components/audioPlayer/AudioPlayerWithWaveform.svelte';
</script>

<div class="w-full flex flex-col items-center justify-center px-5 py-12 gap-12">
	<div class="w-full max-w-sm flex flex-col gap-3">
		<AudioPlayer
			src="/audio/test.mp3"
			label="We like simple things. Our old interface was simple, too simple. It was getting in the way of adding new features."
			title="We like simple things. Our old interface was simple, too simple. It was getting in the way of adding new features."
		/>
	</div>
	<div class="w-full max-w-6xl">
		<AudioPlayerWithWaveform
			class="h-128"
			src="/audio/test-2.mp3"
			label="We like simple things. Our old interface was simple, too simple. It was getting in the way of adding new features."
		/>
	</div>
</div>
