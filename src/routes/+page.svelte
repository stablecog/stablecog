<script lang="ts">
	import CreateBar from '$components/CreateBar.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { base64toBlob } from '$ts/helpers/base64toBlob';
	import { generateImage } from '$ts/queries/generateImage';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TGeneration, TStatus } from '$ts/types/main';
	import { onDestroy, onMount } from 'svelte';

	let status: TStatus = 'idle';
	let inputValue: string | undefined;
	let now: number | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let startTimestamp: number | undefined;
	let endTimestamp: number | undefined;
	let lastGeneration: TGeneration | undefined;
	let generationWidth: string;
	let generationHeight: string;

	$: since = now !== undefined && startTimestamp !== undefined ? now - startTimestamp : undefined;
	$: duration =
		endTimestamp !== undefined && startTimestamp !== undefined
			? endTimestamp - startTimestamp
			: undefined;

	async function onCreate() {
		if (!$serverUrl || !inputValue) return;
		status = 'loading';
		endTimestamp = undefined;
		startTimestamp = Date.now();
		try {
			console.log(generationWidth, generationHeight);
			lastGeneration = {
				url: $serverUrl,
				prompt: inputValue,
				width: Number(generationWidth),
				height: Number(generationHeight),
				seed: Math.floor(Math.random() * 1000000000),
				guidance_scale: 7,
				num_inference_steps: 100
			};
			let res = await generateImage({
				url: lastGeneration.url,
				prompt: lastGeneration.prompt,
				width: lastGeneration.width,
				height: lastGeneration.height,
				seed: lastGeneration.seed,
				guidance_scale: lastGeneration.guidance_scale,
				num_inference_steps: lastGeneration.num_inference_steps
			});
			let { data, error } = res;
			if (data && !error) {
				const blob = base64toBlob(data);
				const blobUrl = URL.createObjectURL(blob);
				const img = new Image();
				img.src = blobUrl;
				img.onload = () => {
					if (lastGeneration) {
						lastGeneration.imageUrl = blobUrl;
					}
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

<div class="w-full flex flex-col flex-1 justify-center items-center px-5 pb-8">
	<CreateBar
		bind:inputValue
		bind:generationWidth
		bind:generationHeight
		{status}
		{onCreate}
		{since}
		duration={30}
	/>
	{#if status === 'error'}
		<div transition:expandCollapse={{}} class="flex flex-col origin-top">
			<p class="text-c-on-bg/40 text-center mt-4">Something went wrong...</p>
		</div>
	{:else if status === 'success' && duration !== undefined && lastGeneration && lastGeneration.imageUrl}
		<div transition:expandCollapse={{}} class="overflow-hidden rounded-xl origin-top relative z-0">
			<div class="flex flex-col items-center pb-6 md:px-5 gap-4">
				<div class="relative">
					<img
						class="w-full max-w-md h-auto rounded-2xl shadow-xl shadow-c-shadow/20 border-4 border-c-bg"
						src={lastGeneration.imageUrl}
						height={lastGeneration.width}
						width={lastGeneration.height}
						alt={lastGeneration.prompt}
					/>
					<a
						class="absolute right-3 top-3 transition group"
						href={lastGeneration.imageUrl}
						download="{lastGeneration.prompt}-[seed_{lastGeneration.seed}].png"
						aria-label="Download Image"
					>
						<div class="p-3 rounded-full bg-c-bg/50 relative overflow-hidden z-0">
							<div
								class="w-full h-full rounded-full transition transform -translate-x-full 
			        		bg-c-primary absolute left-0 top-0 {!$isTouchscreen ? 'group-hover:translate-x-0' : ''}"
							/>
							<IconDownload
								class="w-6 h-6 transition text-c-on-bg relative {!$isTouchscreen
									? 'group-hover:text-c-on-primary'
									: ''}"
							/>
							<p class="hidden">Download Image</p>
						</div>
					</a>
				</div>
				<p class="text-c-on-bg/40 text-center">
					{(duration / 1000).toLocaleString('en-US', {
						maximumFractionDigits: 1
					})} seconds
				</p>
			</div>
		</div>
	{:else}
		<div transition:expandCollapse={{}} class="h-[10vh]" />
	{/if}
</div>
