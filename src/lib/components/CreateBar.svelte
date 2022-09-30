<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus } from '$ts/types/main';
	import { tick } from 'svelte';

	export { classes as class };
	let classes = '';
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let inputValue: string | undefined;
	export let since: number | undefined;
	export let duration: number;

	let submitting = false;
	const placeholder = 'Portrait of a monkey, Unreal Engine, Octane Render, 8k';

	async function onSubmit() {
		submitting = true;
		if (!inputValue) {
			await new Promise((resolve) => setTimeout(resolve, 75));
			await tick();
			inputValue = placeholder;
		}
		await onCreate();
		submitting = false;
	}

	$: loadingOrSubmitting = status === 'loading' || submitting;
</script>

<form
	disabled={loadingOrSubmitting}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-xl md:max-w-4xl md:px-8 flex flex-col md:flex-row items-center gap-4"
>
	<div class="w-full relative">
		<div
			class="w-full h-full rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/20 
			overflow-hidden z-0 absolute left-0 top-0"
		>
			<div
				style="transition-duration: {loadingOrSubmitting ? duration : 0.2}s"
				class="w-full h-full ease-out transition bg-c-secondary/8 
				absolute left-0 top-0 rounded-xl {loadingOrSubmitting ? 'translate-x-0' : '-translate-x-full'}"
			/>
		</div>
		<input
			bind:value={inputValue}
			disabled={loadingOrSubmitting}
			{placeholder}
			type="text"
			class="w-full bg-transparent relative px-6 md:px-8 py-5 rounded-xl transition 
			focus:ring-2 focus:ring-c-primary/50 ring-0 ring-c-primary/25 placeholder:text-c-on-bg/30 {!$isTouchscreen
				? 'enabled:hover:ring-2'
				: ''} {classes} {loadingOrSubmitting ? 'text-c-secondary/75' : 'text-c-on-bg'}"
		/>
	</div>
	<button
		disabled={loadingOrSubmitting}
		class="w-full md:w-40 px-8 relative flex items-center justify-center text-center py-5 
		shadow-lg shadow-c-shadow/20 text-c-on-primary rounded-xl font-bold gap-2 
		overflow-hidden z-0 group {loadingOrSubmitting ? 'bg-c-secondary' : 'bg-c-primary'}"
	>
		<div
			class="w-full h-full origin-left rounded-xl transition transform -translate-x-full 
			bg-c-secondary absolute left-0 top-0 {!$isTouchscreen
				? 'group-enabled:group-hover:translate-x-0'
				: ''}"
		/>
		{#if status === 'loading'}
			<!-- <IconLoading class="w-5 h-5 animate-spin relative" /> -->
			<p class="relative">
				{since !== undefined
					? Math.max(since / 1000, 0).toLocaleString('en-US', {
							minimumFractionDigits: 1,
							maximumFractionDigits: 1
					  })
					: '0.0'}
			</p>
		{:else}
			<p class="relative">Create</p>
		{/if}
	</button>
</form>
