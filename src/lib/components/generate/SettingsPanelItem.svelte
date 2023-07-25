<script lang="ts">
	import WithTooltip from '$components/WithTooltip.svelte';

	export let tooltipTitle: string;
	export let tooltipParagraph: string;
	export let icon: ConstructorOfATypedSvelteComponent;
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
			<svelte:component this={icon} class="w-5 h-5 flex-shrink-0" />
			<p class="flex-shrink min-w-0 font-medium break-words">
				{title}
			</p>
		</div>
	</WithTooltip>
	<slot />
</div>
