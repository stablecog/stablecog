<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import LikeButton from '$components/buttons/LikeButton.svelte';
	import GenerationAnimation from '$components/generate/GenerationAnimation.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconBrush from '$components/icons/IconBrush.svelte';
	import IconBug from '$components/icons/IconBug.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconNsfwPrompt from '$components/icons/IconNSFWPrompt.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
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
	export let now: number;
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

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});
</script>

<div
	class="w-full h-full flex flex-col relative bg-c-bg-secondary transition overflow-hidden
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
	<div class="w-full flex-1 overflow-hidden z-0 relative group">
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
	{#if cardType === 'gallery' || cardType === 'admin-gallery'}
		<div class="w-full flex flex-col bg-c-bg-secondary rounded-b-xl text-sm">
			<p
				class="w-full whitespace-nowrap overflow-hidden overflow-ellipsis px-2 md:px-3 pt-1.75 md:pt-2.5"
			>
				{output.generation.prompt.text}
			</p>
			<div class="w-full flex items-end justify-between px-0.5 pb-0.5 md:px-1 md:pb-1">
				<a
					href="/user/{output.generation.user.username}"
					data-sveltekit-preload-data="hover"
					class="flex flex-shrink min-w-0 items-center group gap-2 relative px-2 py-1.5 rounded-md"
				>
					<ButtonHoverEffect noPadding color="bg-tertiary" size="md" />
					<Avatar
						class="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 relative"
						text={output.generation.user.username}
					/>
					<div class="flex flex-shrink min-w-0 flex-col pr-0.5 relative">
						<p
							class="whitespace-nowrap overflow-hidden overflow-ellipsis text-xs md:text-sm
							font-medium text-c-on-bg/75 transition not-touch:group-hover:text-c-on-bg"
						>
							<span class="text-c-on-bg/50 transition not-touch:group-hover:text-c-on-bg/75">@</span
							>{output.generation.user.username}
						</p>
						<p
							class="whitespace-nowrap overflow-hidden overflow-ellipsis text-c-on-bg/75 text-xs
							transition not-touch:group-hover:text-c-on-bg"
						>
							{getRelativeDate({ date: output.created_at, locale: $locale, now })}
						</p>
					</div>
				</a>
				<div class="flex items-end justify-end flex-shrink-0">
					{#if cardType === 'admin-gallery' && (output.aesthetic_artifact_score !== undefined || output.aesthetic_rating_score !== undefined)}
						<div class="flex flex-col items-end justify-center px-1 pt-1.5 pb-1 gap-0.5">
							{#if output.aesthetic_rating_score !== undefined}
								<div class="flex items-center gap-1">
									<IconBrush class="w-4 h-4" />
									<p class="font-medium">
										{numberFormatter.format(output.aesthetic_rating_score * 100)}
									</p>
								</div>
							{/if}
							{#if output.aesthetic_artifact_score !== undefined}
								<div class="flex items-center gap-1">
									<IconBug class="w-4 h-4" />
									<p class="font-medium">
										{numberFormatter.format(output.aesthetic_artifact_score * 100)}
									</p>
								</div>
							{/if}
						</div>
					{/if}
					<LikeButton
						type="on-grid-card"
						modalType={cardType}
						generation={{ ...output.generation, selected_output: output }}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
