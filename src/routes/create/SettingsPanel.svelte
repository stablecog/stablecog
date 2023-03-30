<script lang="ts">
	import IconAspectRatio from '$components/icons/IconAspectRatio.svelte';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import LL from '$i18n/i18n-svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import { availableModelIdDropdownItems } from '$ts/constants/generationModels';
	import { AspectRatioDropdownItems } from '$ts/constants/generationSize';
	import { aspectRatioTooltip, modelTooltip } from '$ts/constants/tooltips';
	import { generationAspectRatio, generationModelId } from '$ts/stores/generationSettings';
</script>

<div
	class="w-full h-full flex flex-col bg-c-bg rounded-3xl border-4 border-c-bg-secondary
  shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] p-5 gap-7 overflow-auto"
>
	<div class="w-full flex flex-col items-start gap-3">
		<div
			use:tooltip={$aspectRatioTooltip}
			class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
		>
			<IconDimensions class="w-5 h-5" />
			<p class="flex-shrink font-medium">{$LL.Home.AspectRatioTabBar.Title()}</p>
		</div>
		<TabLikeDropdown
			class="w-full"
			iconSet={IconAspectRatio}
			items={$AspectRatioDropdownItems}
			hasTitle={false}
			bind:value={$generationAspectRatio}
			name="Aspect Ratio"
		/>
	</div>
	<div class="w-full flex flex-col items-start gap-3">
		<div
			use:tooltip={$modelTooltip}
			class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
		>
			<IconBrain class="w-5 h-5" />
			<p class="flex-shrink font-medium">{$LL.Home.ModelDropdown.Title()}</p>
		</div>
		<TabLikeDropdown
			class="w-full"
			items={$availableModelIdDropdownItems}
			hasTitle={false}
			bind:value={$generationModelId}
			name="Model"
		/>
	</div>
</div>
