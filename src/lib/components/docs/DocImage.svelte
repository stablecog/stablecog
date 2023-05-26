<script lang="ts">
	import { docContainerSize } from '$components/docs/constants';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';

	export let src: string;
	export let alt: string;
	export let width: string;
	export let height: string;
	export let href: string | undefined = undefined;

	export { classes as class };

	let classes = 'mt-6 mb-3';
	$: _src = getImgProxySrcDefault(src);
	$: srcset = getImgProxySrcSet({ src });
	const sizes = `min(100vw, ${docContainerSize}px)`;
</script>

{#if href}
	<div class="w-full {classes}">
		<a class="w-full group" {href} target="_blank" rel="noopener noreferrer">
			<img
				loading="lazy"
				class="w-full bg-c-bg-tertiary h-auto rounded-lg transition ring-2 ring-c-bg-tertiary
        group-hover:ring-c-primary/75 shadow-xl shadow-c-shadow/[var(--o-shadow-strong)"
				{sizes}
				src={_src}
				{srcset}
				{alt}
				{width}
				{height}
			/>
		</a>
	</div>
{:else}
	<div class="w-full {classes}">
		<img
			loading="lazy"
			class="w-full bg-c-bg-tertiary h-auto rounded-lg ring-2 ring-c-bg-tertiary
      shadow-xl shadow-c-shadow/[var(--o-shadow-strong)"
			{sizes}
			src={_src}
			{srcset}
			{alt}
			{width}
			{height}
		/>
	</div>
{/if}
