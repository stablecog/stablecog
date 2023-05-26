<script lang="ts">
	import MethodBadge from '$components/docs/MethodBadge.svelte';

	export let method: 'GET' | 'POST' | 'PUT' | 'DELETE' | undefined = undefined;
	export let color: 'primary' | 'on-bg' = 'on-bg';
	export { classes as class };
	let classes = 'mt-4';
</script>

<div
	class="w-full flex bg-c-bg-secondary px-3 py-2 gap-3.5 items-center
  ring-2 ring-c-bg-tertiary rounded-[0.6rem] font-mono {classes}"
>
	{#if method}
		<MethodBadge {method} class="-ml-1" />
	{/if}
	<p class="flex-1 min-w-0 font-medium {color === 'primary' ? 'text-c-primary' : 'text-c-on-bg'}">
		<slot />
	</p>
</div>
