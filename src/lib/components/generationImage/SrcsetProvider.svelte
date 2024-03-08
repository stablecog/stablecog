<script lang="ts">
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import { getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let cardType: TGenerationImageCardType;
	export let src: string;

	$: srcset =
		cardType !== 'stage'
			? getImgProxySrcSet({
					src
				})
			: undefined;
	$: sizes =
		cardType !== 'stage'
			? cardType === 'generate'
				? `128px`
				: '(min-width: 1920px) 14.28w, (min-width: 1536px) 16.66vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33.33vw, 50vw'
			: undefined;
</script>

<slot {srcset} {sizes} />
