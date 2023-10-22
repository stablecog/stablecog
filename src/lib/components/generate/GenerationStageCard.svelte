<script lang="ts">
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import GenerationAnimation from '$components/generate/GenerationAnimation.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { quadIn, quadOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import IconImage from '$components/icons/IconImage.svelte';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import IconNsfwPrompt from '$components/icons/IconNSFWPrompt.svelte';
	import { getQueuePositionFromId, queue } from '$ts/stores/user/queue';
	import { userSummary } from '$ts/stores/user/summary';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import IconQueue from '$components/icons/IconQueue.svelte';
	import QueuePosition from '$components/QueuePosition.svelte';

	export let generation: TGenerationWithSelectedOutput;
	export let cardWidth: number;

	$: output = generation.selected_output;
	$: status = output.status;
	$: animation = output.animation;
	$: positionInQueue = getQueuePositionFromId(generation.queued_id, $queue);
	$: positionInQueue, onPositionInQueueChanged();

	let debouncedPositionInQueue: number | undefined = undefined;
	let positionInQueueTimeout: NodeJS.Timeout;

	function onPositionInQueueChanged() {
		let hasPrevValue = debouncedPositionInQueue !== undefined;
		clearTimeout(positionInQueueTimeout);
		// First entry
		if (positionInQueue !== undefined && !hasPrevValue) {
			positionInQueueTimeout = setTimeout(() => {
				debouncedPositionInQueue = positionInQueue;
			}, 750);
			return;
		}
		// Updates after the first entry except exit
		if (positionInQueue !== undefined && hasPrevValue) {
			debouncedPositionInQueue = positionInQueue;
			return;
		}
		// Exit
		positionInQueueTimeout = setTimeout(() => {
			debouncedPositionInQueue = positionInQueue;
		}, 750);
	}
</script>

<div class="w-full h-full relative group">
	<ImagePlaceholder width={generation.width} height={generation.height} />
	<div
		class="absolute w-full h-full left-0 top-0 overflow-hidden z-0 rounded-xl bg-c-bg-secondary
		transition border-2 border-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
	>
		<div class="w-full h-full relative rounded-xl z-0 overflow-hidden">
			{#if generation.is_placeholder}
				{@const sizeClasses =
					generation.height > generation.width
						? 'h-full max-h-[2rem] md:max-h-[2.5rem] w-auto'
						: 'w-full max-w-[2rem] md:max-w-[2.5rem] h-auto'}
				<div
					out:scale={{ duration: 200, easing: quadOut, opacity: 0 }}
					class="w-full h-full absolute left-0 top-0 flex flex-col gap-3 items-center justify-center"
				>
					<IconImage class="{sizeClasses} text-c-on-bg/20" />
				</div>
			{:else if status !== 'failed' && status !== 'failed-nsfw' && status !== 'failed-nsfw-prompt'}
				{#if status !== undefined && status !== 'succeeded' && animation !== undefined}
					<div
						out:fade={{ duration: 3000, easing: quadIn }}
						class="w-full h-full absolute left-0 top-0 flex items-center justify-center"
					>
						{#if debouncedPositionInQueue && (!($userSummary?.product_id || $userSummary?.has_nonfree_credits) || isSuperAdmin($userSummary?.roles))}
							<QueuePosition position={debouncedPositionInQueue} />
						{/if}
						<GenerationAnimation {animation} />
					</div>
				{/if}
				{#if status === undefined || status === 'succeeded'}
					<GenerationImage cardType="stage" {generation} {cardWidth} />
				{/if}
			{:else}
				{@const sizeClasses =
					generation.height > generation.width
						? 'h-full max-h-[2rem] md:max-h-[2.5rem] w-auto'
						: 'w-full max-w-[2rem] md:max-w-[2.5rem] h-auto'}
				<div
					in:fade={{ duration: 200, easing: quadOut }}
					class="w-full h-full flex flex-col items-center bg-c-bg-secondary justify-center relative px-4 md:px-5 py-3 gap-2"
				>
					{#if status === 'failed-nsfw'}
						<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
					{:else if status === 'failed-nsfw-prompt'}
						<IconNsfwPrompt class="{sizeClasses} text-c-on-bg/50" />
					{:else}
						<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
					{/if}
					<p
						class="text-xs md:text-sm text-c-on-bg/50 text-center leading-normal md:leading-normal"
					>
						{status === 'failed-nsfw'
							? $LL.Error.ImageWasNSFW()
							: status === 'failed-nsfw-prompt'
							? $LL.Error.PromptWasNSFW()
							: $LL.Error.SomethingWentWrong()}
					</p>
					{#if status !== 'failed-nsfw' && status !== 'failed-nsfw-prompt' && generation.error !== undefined}
						<ErrorChip class="mt-2" error={generation.error} />
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
