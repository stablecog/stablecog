<script lang="ts">
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import GenerationAnimation from '$components/grids/GenerationAnimation.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { quadIn, quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let generation: TGenerationWithSelectedOutput;

	$: output = generation.selected_output;
	$: status = output.status;
	$: animation = output.animation;
</script>

<div class="w-full h-full relative group">
	<ImagePlaceholder width={generation.width} height={generation.height} />
	<div
		class="absolute w-full h-full left-0 top-0 overflow-hidden z-0 rounded-xl bg-c-bg-secondary
		transition border-2 border-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
	>
		<div class="w-full h-full relative rounded-xl z-0 overflow-hidden">
			{#if generation.is_placeholder}
				<!-- content here -->
			{:else if status !== 'failed' && status !== 'failed-nsfw'}
				{#if status !== undefined && status !== 'succeeded' && animation !== undefined}
					<div
						out:fade|local={{ duration: 3000, easing: quadIn }}
						class="w-full h-full absolute left-0 top-0"
					>
						<GenerationAnimation {animation} />
					</div>
				{/if}
				{#if status === undefined || status === 'succeeded'}
					<GenerationImage cardType="stage" useUpscaledImage {generation} />
				{/if}
			{:else}
				{@const sizeClasses =
					generation.height > generation.width
						? 'h-full max-h-[3rem] w-auto'
						: 'w-full max-w-[3rem] h-auto'}
				<div
					in:fade|local={{ duration: 200, easing: quadOut }}
					class="w-full h-full flex flex-col items-center bg-c-bg-secondary justify-center relative px-5 py-3 gap-2"
				>
					{#if status === 'failed-nsfw'}
						<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
					{:else}
						<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
					{/if}
					<p class="text-sm text-c-on-bg/50 text-center leading-relaxed">
						{status === 'failed-nsfw' ? $LL.Error.ImageWasNSFW() : $LL.Error.SomethingWentWrong()}
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
