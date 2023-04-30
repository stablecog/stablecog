<script lang="ts">
	import { tooltip, type TTooltipProps } from '$ts/actions/tooltip';

	export let tooltipObj: TTooltipProps;
	export let icon: ConstructorOfATypedSvelteComponent;
	export let title: string;
</script>

<div class="w-full flex flex-col items-start gap-3 px-3 md:px-4">
	<div use:tooltip={tooltipObj} class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2">
		<svelte:component this={icon} class="w-5 h-5 flex-shrink-0" />
		<p class="flex-shrink min-w-0 font-medium break-words">
			{title}
		</p>
	</div>
	<slot />
</div>
