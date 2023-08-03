<script lang="ts">
	import WithTooltip from '$components/WithTooltip.svelte';
	import IconGenerationSettingsSet from '$components/icons/iconGenerationSettingsSet/IconGenerationSettingsSet.svelte';
	import type { TIconGenerationSettingsSet } from '$components/icons/iconGenerationSettingsSet/types';

	export let tooltipTitle: string;
	export let tooltipParagraph: string;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let iconType: TIconGenerationSettingsSet | undefined = undefined;
	export let title: string;
</script>

<div class="w-full flex flex-col items-start gap-3 px-3 md:px-4">
	<WithTooltip let:trigger let:triggerStoreValue title={tooltipTitle} paragraph={tooltipParagraph}>
		<div
			tabindex="-1"
			use:trigger
			{...triggerStoreValue}
			class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2 cursor-default"
		>
			{#if icon}
				<svelte:component this={icon} class="w-5 h-5 flex-shrink-0" />
			{:else if iconType}
				<IconGenerationSettingsSet type={iconType} class="w-5 h-5 flex-shrink-0" />
			{/if}
			<p class="flex-shrink min-w-0 font-medium break-words">
				{title}
			</p>
		</div>
	</WithTooltip>
	<slot />
</div>
