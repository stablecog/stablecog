<script lang="ts">
	import Logo from '$components/Logo.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import type { TDBGenerationG } from '$ts/types/db';

	export let generation: TDBGenerationG;
	export let width: number;
	export let height: number;

	const imgUrl = `https://ik.imagekit.io/stablecog/tr:f-jpg/${generation.image_id}.webp`;
	const maxPromptLength = 158;
	const padding = 24;
	let imageWidth: number;
	let imageHeight: number;
	let imageContainerWidth: number;
	let imageContainerHeight: number;
	const imageAspectRatio = generation.width / generation.height;
	if (imageAspectRatio > 1) {
		imageHeight = height - padding * 2;
		imageWidth = imageHeight * imageAspectRatio;
		imageContainerWidth = imageHeight;
		imageContainerHeight = imageHeight;
	} else {
		imageHeight = height - padding * 2;
		imageWidth = imageHeight * imageAspectRatio;
		imageContainerWidth = imageWidth;
		imageContainerHeight = imageHeight;
	}
	const containerWidth = width - 2 * padding - imageContainerWidth;
</script>

<div
	style="background: rgb(32, 31, 34); color: rgb(219, 213, 231); padding: {padding}px;"
	tw="flex w-full h-full items-center justify-center"
>
	<img
		tw="absolute left-0 top-0"
		src="{canonicalUrl}/images/patterns/grid-pattern.png"
		alt="Pattern"
		{width}
		height={width}
	/>
	<div
		tw="h-full flex items-center justify-center rounded-2xl relative"
		style="overflow:hidden; width:{imageContainerWidth}px; height:{imageContainerHeight}px; border-color: rgb(32, 31, 34);
		border-width: 4px; border-style: solid; box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.3);"
	>
		<img
			src={imgUrl}
			width={imageWidth}
			height={imageHeight}
			alt={generation.prompt.text.slice(0, 50)}
		/>
	</div>
	<div
		style="width: {containerWidth}px; overflow: hidden; padding-left: {padding *
			2}px; padding-right: {padding * 2}px"
		tw="h-full flex flex-col justify-center"
	>
		<div tw="w-full flex flex-col">
			<div tw="w-full flex items-center">
				<Logo class="w-18 h-18 -ml-2" />
				<h1 tw="font-extrabold text-7xl ml-4">Gallery</h1>
			</div>
			<p style="line-height: 2.5rem" tw="w-full text-3xl opacity-75 mt-6 overflow-hidden">
				{generation.prompt.text.slice(0, maxPromptLength)}{generation.prompt.text.length >
				maxPromptLength
					? '...'
					: ''}
			</p>
		</div>
	</div>
</div>
