<script lang="ts">
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import IconGenerationSettingsSet from '$components/icons/iconGenerationSettingsSet/IconGenerationSettingsSet.svelte';
	import type { TIconGenerationSettingsSet } from '$components/icons/iconGenerationSettingsSet/types';

	export let tooltipTitle: string;
	export let tooltipParagraph: string;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let iconType: TIconGenerationSettingsSet | undefined = undefined;
	export let title: string;
	export let wrapperClass = '';
</script>

<div class="flex w-full flex-col items-start px-3 md:px-4 {wrapperClass}">
	<WithTooltip let:trigger let:triggerStoreValue title={tooltipTitle} paragraph={tooltipParagraph}>
		<div
			tabindex="-1"
			use:trigger
			{...triggerStoreValue}
			class="flex max-w-full cursor-default items-center gap-2 px-2 text-c-on-bg/75"
		>
			{#if icon}
				<svelte:component this={icon} class="h-5 w-5 flex-shrink-0" />
			{:else if iconType}
				<IconGenerationSettingsSet type={iconType} class="h-5 w-5 flex-shrink-0" />
			{/if}
			<p class="min-w-0 flex-shrink break-words font-medium">
				{title}
			</p>
		</div>
	</WithTooltip>
	<div class="h-3 w-full" />
	<slot />
</div>
