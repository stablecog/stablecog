<script lang="ts">
	import AudioPlayer from '$components/audioPlayer/AudioPlayer.svelte';
</script>

<div class="w-full flex items-center justify-center px-5 py-12">
	<div class="max-w-lg flex flex-col gap-3">
		<AudioPlayer src="/audio/test.mp3" />
		<audio controls>
			<source src="/audio/test.mp3" type="audio/mpeg" />
		</audio>
	</div>
</div>
