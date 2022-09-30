<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus } from '$ts/types/main';
	import IconLoading from '$components/icons/IconLoading.svelte';

	export { classes as class };
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let inputValue: string | undefined;

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
		class="w-40 px-8 relative flex justify-center text-center py-5 bg-c-primary shadow-lg shadow-c-shadow/25 text-c-on-primary rounded-xl font-bold"
	>
		<div
			class="w-6 h-6 absolute left-1/2 top-1/2 transform transition -translate-x-1/2 -translate-y-1/2 {status ===
			'loading'
				? 'scale-100 opacity-100'
				: 'scale-0 opacity-0'}"
		>
			<IconLoading class="w-full h-full animate-spin" />
		</div>
		<p
			class="transition transform {status === 'loading'
				? 'opacity-0 scale-0'
				: 'opacity-100 scale-100'}"
		>
			Create
		</p>
	</button>
</form>
