<script lang="ts">
	import CreateBar from '$components/CreateBar.svelte';
	import { generateImage } from '$ts/queries/generateImage';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TStatus } from '$ts/types/main';
	import { onDestroy, onMount } from 'svelte';

	let status: TStatus = 'idle';
	let generatedImageSrc: string | undefined;
	let inputValue: string | undefined;
	let now: number | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let startTimestamp: number | undefined;
	let endTimestamp: number | undefined;

	$: since = now !== undefined && startTimestamp !== undefined ? now - startTimestamp : undefined;

	async function onCreate() {
		if (!$serverUrl || !inputValue) return;
		status = 'loading';
		startTimestamp = Date.now();
		try {
			let res = await generateImage($serverUrl, inputValue);
			generatedImageSrc = res;
			console.log(generatedImageSrc);
			status = 'success';
		} catch (error) {
			status = 'error';
			console.log(error);
		} finally {
			endTimestamp = Date.now();
		}
	}

	onMount(() => {
		nowInterval = setInterval(() => {
			now = Date.now();
		}, 100);
	});

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

<div class="w-full flex flex-col flex-1 justify-center items-center px-5 pt-12 pb-32 gap-5">
	<CreateBar bind:inputValue {status} {onCreate} {since} />
	{#if generatedImageSrc}
		<img
			class="w-full max-w-lg h-auto rounded-xl shadow-xl shadow-c-shadow/25"
			src={generatedImageSrc}
			alt="Generated"
		/>
	{/if}
</div>
