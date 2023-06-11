<script lang="ts">
	import { PUBLIC_BUCKET_AUX_URL } from '$env/static/public';
	import type { TVoiceoverSpeakerId } from '$ts/constants/voiceover/models';
	import { getImgProxySrc, getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let type: TVoiceoverSpeakerId;
	export { classes as class };
	export let sizes = '32px';
	let classes = 'w-6 h-6';

	$: _src = `${PUBLIC_BUCKET_AUX_URL}/speakers/${type}.jpeg`;
	$: src = getImgProxySrc({ src: _src, preset: '64w' });
	$: srcset = getImgProxySrcSet({ src: _src });
</script>

{#key src}
	<img
		loading="lazy"
		class="{classes} bg-c-bg-secondary"
		alt={type}
		width="2560"
		height="2560"
		{sizes}
		{srcset}
		{src}
	/>
{/key}
