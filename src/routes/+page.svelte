<script lang="ts">
	import CreateBar from '$components/CreateBar.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
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
	$: duration =
		endTimestamp !== undefined && startTimestamp !== undefined
			? endTimestamp - startTimestamp
			: undefined;

	async function onCreate() {
		if (!$serverUrl || !inputValue) return;
		status = 'loading';
		endTimestamp = undefined;
		generatedImageSrc = undefined;
		startTimestamp = Date.now();
		try {
			let res = await generateImage($serverUrl, inputValue);
			let { data, error } = res;
			if (data && !error) {
				const img = new Image();
				img.src = data;
				img.onload = () => {
					generatedImageSrc = data;
					status = 'success';
					console.log('loaded');
				};
			} else {
				throw new Error(error);
			}
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

<div class="w-full flex flex-col flex-1 justify-center items-center px-5 pt-12 pb-32">
	<CreateBar bind:inputValue {status} {onCreate} {since} duration={30} />
	{#if status === 'error'}
		<p transition:expandCollapse={{}} class="text-c-on-bg/40 text-center">
			Something went wrong...
		</p>
	{:else if status === 'success' && generatedImageSrc !== undefined && duration !== undefined}
		<div transition:expandCollapse={{}} class="overflow-hidden rounded-xl relative z-0">
			<div class="flex flex-col items-center pt-6 gap-4">
				<img
					class="w-full max-w-lg h-auto origin-top rounded-xl shadow-xl shadow-c-shadow/20"
					src={generatedImageSrc}
					height="756"
					width="512"
					alt="Generated"
				/>
				<p class="text-c-on-bg/40 text-center">
					{(duration / 1000).toLocaleString('en-US', {
						maximumFractionDigits: 1
					})} seconds
				</p>
			</div>
		</div>
	{/if}
</div>
