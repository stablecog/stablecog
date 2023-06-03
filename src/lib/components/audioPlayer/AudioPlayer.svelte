<script lang="ts">
	import AudioPlayerInner from '$components/audioPlayer/AudioPlayerInner.svelte';
	import { writable } from 'svelte/store';

	export let src: string;
</script>

<AudioPlayerInner {src} />
