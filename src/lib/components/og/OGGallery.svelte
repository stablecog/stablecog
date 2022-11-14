<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$components/Logo.svelte';
	import type { TDBGenerationG } from '$ts/types/db';

	export let generation: TDBGenerationG;
	export let width: number;
	export let height: number;
	export let originUrl: string;

	const imgUrl = `https://ik.imagekit.io/stablecog/tr:f-jpg/${generation.image_id}.webp`;
	const maxPromptLength = 130;
	const padding = 24;
	let imageWidth: number;
	let imageHeight: number;
	const imageAspectRatio = generation.width / generation.height;
	if (imageAspectRatio > 1) {
		imageWidth = (width - padding * 2) / 2;
		imageHeight = imageWidth / imageAspectRatio;
	} else {
		imageHeight = height - padding * 2;
		imageWidth = imageHeight * imageAspectRatio;
	}
	const containerWidth = width - 2 * padding - imageWidth;
</script>

<div
	style="background: rgb(32, 31, 34); color: rgb(219, 213, 231); padding: {padding}px;"
	tw="flex w-full h-full items-center justify-center"
>
	<img
		tw="absolute left-0 top-0"
		src="{originUrl}/images/patterns/grid-pattern.png"
		alt="Pattern"
		{width}
		height={width}
	/>
	<div
		style="width: {imageWidth}px; height: {imageHeight}px"
		tw="h-full flex justify-center items-center"
	>
		<img
			style="border-color: rgb(32, 31, 34); border-width: 4px; border-style: solid;
			box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.3);"
			tw="rounded-2xl"
			src={imgUrl}
			width={imageWidth}
			height={imageHeight}
			alt={generation.prompt.text.slice(0, 50)}
		/>
	</div>
	<div
		style="width: {containerWidth}px; overflow: hidden; padding-left: {padding *
			2}px; padding-right: {padding * 2 + 6}px"
		tw="h-full flex flex-col justify-center"
	>
		<div tw="w-full flex flex-col">
			<div tw="w-full flex items-center">
				<Logo class="w-20 h-20 -ml-2" />
				<h1 tw="font-extrabold text-7xl ml-3">Gallery</h1>
			</div>
			<p style="line-height: 2.5rem;" tw="w-full text-3xl opacity-75 mt-6">
				{generation.prompt.text.slice(0, maxPromptLength)}{generation.prompt.text.length >
				maxPromptLength
					? '...'
					: ''}
			</p>
		</div>
	</div>
</div>
