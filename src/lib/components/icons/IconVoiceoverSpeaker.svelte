<script lang="ts">
	import { PUBLIC_BUCKET_AUX_URL } from '$env/static/public';
	import type { TVoiceoverSpeakerId } from '$ts/constants/voiceover/models';
	import { getImgProxySrc, getImgProxySrcSetSmall } from '$ts/helpers/imgproxy';

	export let type: TVoiceoverSpeakerId;
	export { classes as class };
	export let sizes = '32px';
	let classes = 'w-6 h-6';

	$: _src = `${PUBLIC_BUCKET_AUX_URL}/voiceover/speakers/${type}.jpeg`;
	$: src = getImgProxySrc({ src: _src, preset: '64w' });
	$: srcset = getImgProxySrcSetSmall({ src: _src });

	const width = '64';
	const height = '64';
</script>

{#key src}
	<img
		loading="lazy"
		class="{classes} bg-c-bg-secondary"
		alt={type}
		{width}
		{height}
		{sizes}
		{srcset}
		{src}
	/>
{/key}
