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
	class="mt-4 w-full md:w-1/2 {size === 'wider'
		? ''
		: 'lg:w-1/3'} flex flex-col justify-start p-1.5"
>
	<h3 class="w-full px-1 text-lg font-semibold">{title}</h3>
	<img
		loading="lazy"
		class="mt-2 h-auto w-full rounded-lg bg-c-bg-tertiary ring-2 ring-c-bg-tertiary"
		{sizes}
		src={_src}
		{srcset}
		alt={title}
		{width}
		{height}
	/>
</div>
