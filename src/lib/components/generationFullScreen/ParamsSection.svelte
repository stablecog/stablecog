<script lang="ts">
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconGenerationSettingsSet from '$components/icons/iconGenerationSettingsSet/IconGenerationSettingsSet.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import LL from '$i18n/i18n-svelte';
	import { generationModelIdDefault, modelIdToDisplayName } from '$ts/constants/generationModels';
	import { userSummary } from '$ts/stores/user/summary';
	import type { TGenerationWithSelectedOutput } from '$userStores/generation';
	import { copy } from 'svelte-copy';

	export let generation: TGenerationWithSelectedOutput;
	export let currentImageWidth: number;
	export let currentImageHeight: number;
	export let setButtonObjectWithState: TSetButtonObjectWithState;
	export let buttonObjectsWithState: TButtonObjectsWithState;
	export let modalType: TGenerationFullScreenModalType;
	export { classes as class };
	let classes = '';
</script>

<div class={classes}>
	<div class="flex flex-wrap gap-6">
		<div class="flex min-w-[calc(50%-0.75rem)] flex-col items-start gap-1">
			<WithTooltip
				title={$LL.Home.ModelDropdown.Title()}
				paragraph={$LL.Home.ModelDropdown.Paragraph()}
				let:trigger
				let:triggerStoreValue
				color="bg-tertiary"
			>
				<div
					tabindex="-1"
					use:trigger
					{...triggerStoreValue}
					class="flex cursor-default items-center gap-1.5 text-sm text-c-on-bg/75"
				>
					<IconGenerationSettingsSet type="model" class="h-4 w-4" />
					<p class="font-medium">{$LL.Home.ModelDropdown.Title()}</p>
				</div>
			</WithTooltip>

			<p class="font-semibold">
				{$modelIdToDisplayName[generation.model_id ?? generationModelIdDefault] ??
					$LL.Shared.UnknownTitle()}
			</p>
		</div>
		<div class="flex min-w-[calc(50%-0.75rem)] flex-col items-start gap-1">
			<WithTooltip
				title={$LL.Home.GuidanceScaleSlider.Title()}
				paragraph={$LL.Home.GuidanceScaleSlider.Paragraph()}
				let:trigger
				let:triggerStoreValue
				color="bg-tertiary"
			>
				<div
					tabindex="-1"
					use:trigger
					{...triggerStoreValue}
					class="flex cursor-default items-center gap-1.5 text-sm text-c-on-bg/75"
				>
					<IconGenerationSettingsSet type="guidance-scale" class="h-4 w-4" />
					<p class="font-medium">{$LL.Home.GuidanceScaleSlider.Title()}</p>
				</div>
				<p class="font-semibold">{generation.guidance_scale}</p>
			</WithTooltip>
		</div>
		{#if generation.prompt_strength}
			<div class="flex min-w-[calc(50%-0.75rem)] flex-col items-start gap-1">
				<WithTooltip
					title={$LL.Home.InitialImageStrengthTabBar.TitleAlt()}
					paragraph={$LL.Home.InitialImageStrengthTabBar.Paragraph()}
					let:trigger
					let:triggerStoreValue
					color="bg-tertiary"
				>
					<div
						tabindex="-1"
						use:trigger
						{...triggerStoreValue}
						class="flex cursor-default items-center gap-1.5 text-sm text-c-on-bg/75"
					>
						<IconGenerationSettingsSet type="image-strength" class="h-4 w-4" />
						<p class="font-medium">{$LL.Home.InitialImageStrengthTabBar.TitleAlt()}</p>
					</div>
				</WithTooltip>
				<p class="font-semibold">
					{Math.round((1 - generation.prompt_strength) * 10) / 10}
				</p>
			</div>
		{/if}
		{#if modalType === 'generate' || (modalType === 'history' && generation.user.username === $userSummary?.username) || modalType === 'admin-gallery'}
			<div class="flex min-w-[calc(50%-0.75rem)] flex-wrap items-center gap-3.5">
				<div class="flex flex-col items-start gap-1">
					<WithTooltip
						title={$LL.Home.SeedInput.Title()}
						paragraph={$LL.Home.SeedInput.Paragraph()}
						let:trigger
						let:triggerStoreValue
						color="bg-tertiary"
					>
						<div
							tabindex="-1"
							use:trigger
							{...triggerStoreValue}
							class="flex cursor-default items-center gap-1.5 text-sm text-c-on-bg/75"
						>
							<IconGenerationSettingsSet type="seed" class="h-4 w-4" />
							<p class="font-medium">{$LL.Home.SeedInput.Title()}</p>
						</div>
					</WithTooltip>
					<p class="font-semibold">{generation.seed}</p>
				</div>
				{#key generation.selected_output.id}
					<div
						use:copy={String(generation.seed)}
						on:svelte-copy={() => setButtonObjectWithState('seed', 'success')}
						on:svelte-copy:error={(e) => console.log(e)}
					>
						<SubtleButton
							noPadding
							class="p-2.5"
							state={buttonObjectsWithState.seed.state === 'success' ? 'success' : 'idle'}
						>
							<Morpher morphed={buttonObjectsWithState.seed.state === 'success'}>
								<div slot="0" class="flex items-center justify-center gap-1.5">
									<IconCopy class="h-5 w-5" />
								</div>
								<div slot="1" class="flex items-center justify-center gap-1.5">
									<IconTick class="h-8 w-8" />
								</div>
							</Morpher>
						</SubtleButton>
					</div>
				{/key}
			</div>
		{/if}
		<div class="flex min-w-[calc(50%-0.75rem)] flex-col items-start gap-1">
			<div class="flex cursor-default items-center gap-1.5 text-sm text-c-on-bg/75">
				<IconGenerationSettingsSet type="dimensions" class="h-4 w-4" />
				<p class="font-medium">{$LL.GenerationFullscreen.Dimensions.Title()}</p>
			</div>
			<p class="font-semibold">{currentImageWidth} × {currentImageHeight}</p>
		</div>
	</div>
</div>
