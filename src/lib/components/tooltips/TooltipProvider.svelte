<script lang="ts">
	import { Tooltip } from 'radix-svelte';
	const delayDuration = 100;
	const skipDelayDuration = 200;
	const disableHoverableContent = true;
</script>

<Tooltip.Provider {delayDuration} {skipDelayDuration} {disableHoverableContent}>
	<slot />
</Tooltip.Provider>
