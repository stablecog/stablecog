<script lang="ts">
	import { PUBLIC_BUCKET_AUX_URL } from '$env/static/public';
	import type { TVoiceoverSpeakerId } from '$ts/constants/voiceover/models';
	import { getImgProxySrc, getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let type: TVoiceoverSpeakerId;
	export { classes as class };
	let classes = '';

	$: _src = `${PUBLIC_BUCKET_AUX_URL}/speakers/${type}.jpeg`;
	$: src = getImgProxySrc({ src: _src, preset: '64w' });
	$: srcset = getImgProxySrcSet({ src: _src });
	const sizes = '32px';
</script>

{#key src}
	<img
		class="{classes} bg-c-bg-secondary"
		alt={type}
		width="3072"
		height="3072"
		{sizes}
		{srcset}
		{src}
	/>
{/key}
