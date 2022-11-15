<script lang="ts">
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import Logo from '$components/Logo.svelte';
	import type { TDBGenerationG } from '$ts/types/db';

	export let generation: TDBGenerationG;
	export let width: number;
	export let height: number;
	export let imgUrl: string;

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

	const bgColor = 'rgb(32, 31, 34)';
	const onBgColor = 'rgb(219, 213, 231)';
	const bgSecondaryColor = 'rgb(41, 40, 43)';
</script>

<div
	style="background: {bgColor}; color: {onBgColor}; padding: {padding}px;"
	tw="flex w-full h-full items-center justify-center"
>
	<div
		tw="h-full flex items-center justify-center rounded-2xl relative"
		style="overflow:hidden; width:{imageContainerWidth}px; height:{imageContainerHeight}px; border-color: {bgSecondaryColor};
		border-width: 4px; border-style: solid"
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
			<div class="w-full flex mt-2">
				<div class="flex items-center mr-10">
					<IconScale class="w-8 h-8" color={onBgColor} />
					<p class="ml-3 font-bold text-3xl">{Math.round(generation.guidance_scale)}</p>
				</div>
				<div class="flex items-center mr-10">
					<IconSteps class="w-8 h-8" color={onBgColor} />
					<p class="ml-3 font-bold text-3xl">{generation.inference_steps}</p>
				</div>
				<div class="flex items-center">
					<IconDimensions class="w-8 h-8" color={onBgColor} />
					<p class="ml-3 font-bold text-3xl">
						{generation.width}<span class="mx-2">×</span>{generation.height}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
