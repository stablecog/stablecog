<script lang="ts">
	import MethodBadge from '$components/docs/MethodBadge.svelte';

	export let method: 'GET' | 'POST' | 'PUT' | 'DELETE' | undefined = undefined;
	export let color: 'primary' | 'on-bg' = 'on-bg';
	export { classes as class };
	let classes = 'mt-4';
</script>

<div
	class="flex w-full items-center gap-3.5 rounded-[0.6rem] bg-c-bg-secondary px-3
  py-2 font-mono ring-2 ring-c-bg-tertiary {classes}"
>
	{#if method}
		<MethodBadge {method} class="-ml-1" />
	{/if}
	<p class="min-w-0 flex-1 font-medium {color === 'primary' ? 'text-c-primary' : 'text-c-on-bg'}">
		<slot />
	</p>
</div>
