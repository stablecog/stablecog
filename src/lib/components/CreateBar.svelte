<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus } from '$ts/types/main';
	import IconLoading from '$components/icons/IconLoading.svelte';

	export { classes as class };
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let inputValue: string | undefined;
	export let since: number | undefined;
	export let duration: number;

	let input: HTMLInputElement;

	let classes = '';
</script>

<form
	disabled={status === 'loading'}
	on:submit|preventDefault={onCreate}
	class="w-full max-w-4xl flex flex-row items-center gap-4"
>
	<div class="w-full relative">
		<div
			class="w-full h-full rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/20 overflow-hidden absolute left-0 top-0"
		>
			<div
				style="transition-duration: {status === 'loading' ? duration : 0.2}s"
				class="w-full h-full ease-out transition bg-c-secondary/8 
				absolute left-0 top-0 rounded-xl {status === 'loading' ? 'translate-x-0' : '-translate-x-full'}"
			/>
		</div>
		<input
			bind:this={input}
			bind:value={inputValue}
			disabled={status === 'loading'}
			on:focus={() => input.select()}
			placeholder="Monkeys having fun on a tree"
			type="text"
			class="w-full bg-transparent relative px-8 py-5 rounded-xl transition 
			focus:ring-2 focus:ring-c-primary/50 ring-0 ring-c-primary/25 placeholder:text-c-on-bg/40 {!$isTouchscreen
				? 'enabled:hover:ring-2'
				: ''} {classes} {status === 'loading' ? 'text-c-secondary/75' : 'text-c-on-bg'}"
		/>
	</div>
	<button
		disabled={status === 'loading'}
		class="w-40 px-8 relative flex items-center justify-center text-center py-5 
		shadow-lg shadow-c-shadow/20 text-c-on-primary rounded-xl font-bold gap-2 
		overflow-hidden group {status === 'loading' ? 'bg-c-secondary' : 'bg-c-primary'}"
	>
		<div
			class="w-full h-full origin-left rounded-xl transition transform -translate-x-full 
			group-enabled:group-hover:translate-x-0 bg-c-secondary absolute left-0 top-0"
		/>
		{#if status === 'loading'}
			<IconLoading class="w-5 h-5 animate-spin relative" />
			<p class="transition transform relative">
				{since !== undefined
					? Math.max(since / 1000, 0).toLocaleString('en-US', {
							minimumFractionDigits: 1,
							maximumFractionDigits: 1
					  })
					: '0.0'}
			</p>
		{:else}
			<p class="transition transform relative">Create</p>
		{/if}
	</button>
</form>
