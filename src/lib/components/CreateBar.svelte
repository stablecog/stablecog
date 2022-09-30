<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus } from '$ts/types/main';
	import IconLoading from '$components/icons/IconLoading.svelte';

	export { classes as class };
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let inputValue: string | undefined;
	export let since: number | undefined;

	let classes = '';
</script>

<form
	disabled={status === 'loading'}
	on:submit|preventDefault={onCreate}
	class="w-full max-w-5xl flex flex-row items-center gap-4"
>
	<input
		bind:value={inputValue}
		disabled={status === 'loading'}
		placeholder="Monkeys having fun on a tree"
		type="text"
		class="w-full bg-c-bg-secondary shadow-lg shadow-c-shadow/15 px-8 py-5 rounded-xl transition focus:ring-2 focus:ring-c-primary/50 ring-0 ring-c-primary/25 placeholder:text-c-on-bg/40 {!$isTouchscreen
			? 'enabled:hover:ring-2'
			: ''} {classes}"
	/>
	<button
		disabled={status === 'loading'}
		class="w-40 px-8 relative flex items-center justify-center text-center py-5 bg-c-primary shadow-lg shadow-c-shadow/25 text-c-on-primary rounded-xl font-bold gap-2"
	>
		{#if status === 'loading'}
			<IconLoading class="w-5 h-5 animate-spin" />
			<p class="transition transform font-mono">
				{since !== undefined
					? Math.max(since / 1000, 0).toLocaleString('en-US', {
							minimumFractionDigits: 1,
							maximumFractionDigits: 1
					  })
					: '0.0'}
			</p>
		{:else}
			<p class="transition transform">Create</p>
		{/if}
	</button>
</form>
