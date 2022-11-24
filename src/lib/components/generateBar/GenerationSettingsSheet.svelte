<script lang="ts">
	import GenerationSettings from '$components/generateBar/GenerationSettings.svelte';
	import IconGenerationSettings from '$components/icons/IconGenerationSettings.svelte';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';
	import LL from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { portal } from 'svelte-portal';

	export let generationWidth: string;
	export let generationHeight: string;
	export let generationInferenceSteps: string;
	export let generationGuidanceScale: number;
	export let generationSeed: number | undefined;
	export let negativePromptInputValue: string | undefined;
	export let isCheckComplete: boolean;
	export let formElement: HTMLFormElement;
	export let disabled = false;
	export let isGenerationSettingsSheetOpen = false;
</script>

<div
	use:portal={'body'}
	style="height: {$windowHeight}px; width: {$windowWidth}px"
	class="md:hidden fixed bottom-0 flex flex-col justify-end z-100 overflow-hidden transition {isGenerationSettingsSheetOpen
		? 'bg-c-barrier/85'
		: 'pointer-events-none bg-c-barrier/0'}"
>
	<div
		use:clickoutside={{
			callback: () => (isGenerationSettingsSheetOpen = false)
		}}
		class="{isGenerationSettingsSheetOpen
			? 'translate-y-0'
			: 'translate-y-[calc(100%+2rem)]'} transition {$advancedMode
			? 'duration-300'
			: ''} ring-2 ring-c-bg-secondary bg-c-bg w-full flex flex-col relative
			rounded-t-3xl justify-end overflow-hidden shadow-sheet shadow-c-shadow/[var(--o-shadow-stronger)]"
	>
		<div class="w-full flex flex-col items-start max-h-[70vh] relative z-0 overflow-hidden">
			<div
				class="w-full text-lg flex font-bold justify-center items-center px-6 py-4 border-b-2 border-c-bg-secondary
				gap-2.5"
			>
				<IconGenerationSettings class="w-7 h-7 flex-shrink-0 -ml-0.5" />
				<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
					{$LL.Settings.Title()}
				</p>
			</div>
			<div class="w-full flex flex-col justify-start flex-1 min-h-0 overflow-hidden">
				<ScrollAreaWithChevron
					class="overflow-auto max-h-full flex flex-col justify-start px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-1"
				>
					<div class="w-full flex flex-col">
						<GenerationSettings
							{disabled}
							bind:generationWidth
							bind:generationHeight
							bind:generationGuidanceScale
							bind:generationInferenceSteps
							bind:generationSeed
							bind:negativePromptInputValue
							{formElement}
							{isCheckComplete}
						/>
					</div>
				</ScrollAreaWithChevron>
			</div>
		</div>
	</div>
</div>
