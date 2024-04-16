<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import LikeButton from '$components/primitives/buttons/LikeButton.svelte';
	import GenerationAnimation from '$components/generate/GenerationAnimation.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconBug from '$components/icons/IconBug.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconNsfwPrompt from '$components/icons/IconNSFWPrompt.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { isAdmin } from '$ts/helpers/admin/roles';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { quadIn, quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { imageQualityLowDefault } from '$ts/helpers/imgproxy';

	export let cardType: TGenerationImageCardType;
	export let output: TGenerationFullOutput;
	export let isSelected: boolean;
	export let isHoverable: boolean;
	export let didLoadBefore: boolean;
	export let cardWidth: number | undefined;
	export let setSearchQuery: ((query: string) => void) | undefined = undefined;
	export let isGalleryEditActive: boolean;
	export let now: number;

	$: isAdminView = cardType === 'admin-gallery' && isAdmin($userSummary?.roles);

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});
</script>

<div
	class="relative z-0 flex h-full w-full flex-col overflow-hidden bg-c-bg-secondary
		transition {cardType === 'generate'
		? output.image_url &&
			!output.is_deleted &&
			output.status !== 'failed' &&
			output.status !== 'failed-nsfw' &&
			output.status !== 'failed-nsfw-prompt'
			? 'rounded-lg border-2 hover:border-c-primary'
			: 'rounded-lg border-2'
		: 'rounded-xl border-2'} {isSelected
		? 'border-c-primary'
		: 'border-c-bg-secondary'} {isHoverable ? 'hover:border-c-primary/75' : ''}"
>
	<div class="group relative z-0 w-full flex-1 overflow-hidden">
		{#if output.generation.outputs !== undefined}
			{#if output.status !== 'failed' && output.status !== 'failed-nsfw' && output.status !== 'failed-nsfw-prompt'}
				{#if output.status !== undefined && output.status !== 'succeeded' && output.animation !== undefined}
					<div
						out:fade={{ duration: 3000, easing: quadIn }}
						class="absolute left-0 top-0 h-full w-full"
					>
						<GenerationAnimation animation={output.animation} />
					</div>
				{/if}
				{#if output.status === undefined || output.status === 'succeeded'}
					<GenerationImage
						imageQualityPreset={cardType === 'stage' ? undefined : imageQualityLowDefault}
						{cardType}
						{cardWidth}
						{didLoadBefore}
						{isGalleryEditActive}
						generation={{
							...output.generation,
							selected_output: output
						}}
						{setSearchQuery}
					/>
				{/if}
			{:else}
				<div
					in:fade={{ duration: 200, easing: quadOut }}
					class="relative flex h-full w-full items-center justify-center bg-c-bg-secondary p-2"
				>
					{#if cardType === 'generate'}
						{@const sizeClasses =
							output.generation.height > output.generation.width
								? 'h-full max-h-[1.75rem] xl:fmax-h-[2rem] w-auto'
								: 'w-full max-w-[1.75rem] xl:max-w-[2rem] h-auto'}
						{#if output.status === 'failed-nsfw'}
							<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
						{:else if output.status === 'failed-nsfw-prompt'}
							<IconNsfwPrompt class="{sizeClasses} text-c-on-bg/50" />
						{:else}
							<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
						{/if}
					{:else}
						<p class="px-5 py-3 text-center text-sm leading-relaxed text-c-on-bg/50">
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
		<div class="flex w-full flex-col rounded-b-xl bg-c-bg-secondary text-sm">
			{#if cardType === 'admin-gallery' && (output.aesthetic_artifact_score !== undefined || output.aesthetic_rating_score !== undefined)}
				<div
					class="-mb-0.5 flex flex-row flex-wrap items-center justify-start gap-2.5 px-2 pt-2 md:-mb-1.25 md:px-3 md:pt-2.25"
				>
					{#if output.aesthetic_rating_score !== undefined}
						<div class="flex items-center gap-1">
							<IconStar class="h-4 w-4" />
							<p class="pt-0.25 font-medium">
								{numberFormatter.format(output.aesthetic_rating_score * 100)}
							</p>
						</div>
					{/if}
					{#if output.aesthetic_artifact_score !== undefined}
						<div class="flex items-center gap-1">
							<IconBug class="h-4 w-4" />
							<p class="pt-0.25 font-medium">
								{numberFormatter.format(output.aesthetic_artifact_score * 100)}
							</p>
						</div>
					{/if}
				</div>
			{/if}
			<p
				class="w-full overflow-hidden overflow-ellipsis whitespace-nowrap px-2 pt-1.75 md:px-3 md:pt-2.5"
			>
				{output.generation.prompt.text}
			</p>
			<div class="flex w-full items-end justify-between px-0.5 pb-0.5 md:px-1 md:pb-1">
				<a
					href="/{output.generation.user.username}"
					data-sveltekit-preload-data="hover"
					class="group relative flex min-w-0 flex-shrink items-center gap-2 rounded-md px-2 py-1.5"
				>
					<ButtonHoverEffect noPadding color="bg-tertiary" size="md" />
					<Avatar
						class="relative h-5 w-5 flex-shrink-0 md:h-6 md:w-6"
						text={output.generation.user.username}
					/>
					<div class="relative flex min-w-0 flex-shrink flex-col pr-0.5">
						<p
							class="overflow-hidden overflow-ellipsis whitespace-nowrap text-xs font-medium
							text-c-on-bg/75 transition not-touch:group-hover:text-c-on-bg md:text-sm"
						>
							<span class="text-c-on-bg/50 transition not-touch:group-hover:text-c-on-bg/75">@</span
							>{output.generation.user.username}
						</p>
						<p
							class="overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-c-on-bg/75
							transition not-touch:group-hover:text-c-on-bg"
						>
							{getRelativeDate({
								date: output.created_at,
								locale: $locale,
								now,
								decimals: isAdminView ? 1 : 0
							})}
						</p>
					</div>
				</a>
				<LikeButton
					type="on-grid-card"
					modalType={cardType}
					generation={{ ...output.generation, selected_output: output }}
				/>
			</div>
		</div>
	{/if}
</div>
