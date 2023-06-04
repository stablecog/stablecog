<script lang="ts">
	import AudioPlayerInner from '$components/audioPlayer/AudioPlayerInner.svelte';

	export let src: string;
</script>

<AudioPlayerInner {src} />
