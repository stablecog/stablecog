<script lang="ts">
	import IconButton from '$components/buttons/IconButton.svelte';
	import GenerationSettings from '$components/generateBar/GenerationSettings.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconGenerationSettings from '$components/icons/IconGenerationSettings.svelte';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';
	import LL from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { portal } from 'svelte-portal';

	export let isCheckComplete: boolean;
	export let formElement: HTMLFormElement;
	export let disabled = false;
	export let isGenerationSettingsSheetOpen = false;
	let innerContainer: HTMLDivElement;
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
			: 'translate-y-[calc(100%+2rem)]'} transition {$advancedModeApp
			? 'duration-300'
			: ''} ring-2 ring-c-bg-secondary bg-c-bg w-full flex flex-col relative
			rounded-t-3xl justify-end overflow-hidden shadow-sheet shadow-c-shadow/[var(--o-shadow-stronger)]"
	>
		<div class="w-full flex flex-col items-start max-h-[85vh] relative z-0 overflow-hidden">
			<div class="w-full flex items-center border-b-2 border-c-bg-secondary">
				<div class="w-14 h-14" />
				<div
					class="flex-1 min-w-0 text-lg flex font-bold justify-center items-center px-6 py-4 gap-2.5"
				>
					<IconGenerationSettings class="w-7 h-7 flex-shrink-0 -ml-0.5" />
					<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
						{$LL.Settings.Title()}
					</p>
				</div>
				<IconButton
					class="p-1.5"
					name="Close"
					noPadding
					onClick={() => (isGenerationSettingsSheetOpen = false)}
				>
					<div class="p-2.5">
						<IconCancel
							class="text-c-on-bg/25 w-6 h-6 transition {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						/>
					</div>
				</IconButton>
			</div>
			<div bind:this={innerContainer} class="w-full flex flex-col justify-start flex-1 min-h-0">
				<ScrollAreaWithChevron class="relative pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-1">
					<div class="w-full overflow-hidden relative z-10">
						<div class="w-full flex flex-col items-start px-4">
							<GenerationSettings
								calculateDistance={isGenerationSettingsSheetOpen}
								container={innerContainer}
								containerTopMinDistance={12}
								containerBottomMinDistance={12}
								{disabled}
								{formElement}
								{isCheckComplete}
							/>
						</div>
					</div>
				</ScrollAreaWithChevron>
			</div>
		</div>
	</div>
</div>
