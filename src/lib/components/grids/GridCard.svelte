<script lang="ts">
	import GenerationAnimation from '$components/generate/GenerationAnimation.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconNsfwPrompt from '$components/icons/IconNSFWPrompt.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import { quadIn, quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let cardType: TGenerationImageCardType;
	export let output: TGenerationFullOutput;
	export let isSelected: boolean;
	export let isHoverable: boolean;
	export let didLoadBefore: boolean;
	export let cardWidth: number | undefined;
	export let setSearchQuery: ((query: string) => void) | undefined = undefined;
	export let isGalleryEditActive: boolean;
	export let onLikesChanged:
		| (({
				newLikeCount,
				newIsLikedByUser,
				action
		  }: {
				newLikeCount: number;
				newIsLikedByUser: boolean;
				action: 'like' | 'unlike';
		  }) => void)
		| undefined = undefined;
</script>

<div
	class="w-full h-full flex flex-col relative bg-c-bg-secondary transition overflow-hidden
    shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]
		z-0 {cardType === 'generate'
		? output.image_url &&
		  !output.is_deleted &&
		  output.status !== 'failed' &&
		  output.status !== 'failed-nsfw' &&
		  output.status !== 'failed-nsfw-prompt'
			? 'border-2 rounded-lg hover:border-c-primary'
			: 'border-2 rounded-lg'
		: 'border-2 rounded-xl'} {isSelected
		? 'border-c-primary'
		: 'border-c-bg-secondary'} {isHoverable ? 'hover:border-c-primary/75' : ''}"
>
	{#if output.generation.outputs !== undefined}
		{#if output.status !== 'failed' && output.status !== 'failed-nsfw' && output.status !== 'failed-nsfw-prompt'}
			{#if output.status !== undefined && output.status !== 'succeeded' && output.animation !== undefined}
				<div
					out:fade={{ duration: 3000, easing: quadIn }}
					class="w-full h-full absolute left-0 top-0"
				>
					<GenerationAnimation animation={output.animation} />
				</div>
			{/if}
			{#if output.status === undefined || output.status === 'succeeded'}
				<GenerationImage
					{cardType}
					{cardWidth}
					{didLoadBefore}
					{isGalleryEditActive}
					generation={{
						...output.generation,
						selected_output: output
					}}
					{setSearchQuery}
					{onLikesChanged}
				/>
			{/if}
		{:else}
			<div
				in:fade={{ duration: 200, easing: quadOut }}
				class="w-full h-full flex items-center bg-c-bg-secondary justify-center relative p-2"
			>
				{#if cardType === 'generate'}
					{@const sizeClasses =
						output.generation.height > output.generation.width
							? 'h-full max-h-[1.75rem] xl:max-h-[2rem] w-auto'
							: 'w-full max-w-[1.75rem] xl:max-w-[2rem] h-auto'}
					{#if output.status === 'failed-nsfw'}
						<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
					{:else if output.status === 'failed-nsfw-prompt'}
						<IconNsfwPrompt class="{sizeClasses} text-c-on-bg/50" />
					{:else}
						<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
					{/if}
				{:else}
					<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
						{output.status === 'failed-nsfw'
							? $LL.Error.ImageWasNSFW()
							: output.status === 'failed-nsfw-prompt'
							? $LL.Error.PromptWasNSFW()
							: $LL.Error.SomethingWentWrong()}
					</p>
				{/if}
			</div>
		{/if}
	{/if}
</div>
