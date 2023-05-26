<script lang="ts">
	import { docContainerSize } from '$components/docs/constants';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let title: string;
	export let src: string;
	export let width: string;
	export let height: string;
	export let size: 'normal' | 'wider' = 'normal';

	$: _src = getImgProxySrcDefault(src);
	$: srcset = getImgProxySrcSet({ src });
	const sizes = `(min-width: 1024px) ${
		docContainerSize / (size === 'wider' ? 2 : 3)
	}px, (min-width: 768px) ${docContainerSize / 2}px, 100vw`;
</script>

<div
	class="w-full mt-4 md:w-1/2 {size === 'wider'
		? ''
		: 'lg:w-1/3'} flex flex-col justify-start p-1.5"
>
	<h3 class="w-full text-lg font-semibold px-1">{title}</h3>
	<img
		loading="lazy"
		class="w-full h-auto mt-2 rounded-lg ring-2 bg-c-bg-tertiary ring-c-bg-tertiary"
		{sizes}
		src={_src}
		{srcset}
		alt={title}
		{width}
		{height}
	/>
</div>
