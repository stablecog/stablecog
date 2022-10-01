<script lang="ts">
	import GenerateBar from '$components/GenerateBar.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { estimatedDurationBufferRatio, estimatedDurationDefault } from '$ts/constants/main';
	import { base64toBlob } from '$ts/helpers/base64toBlob';
	import { generateImage } from '$ts/queries/generateImage';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { iterationMpPerSecond } from '$ts/stores/iterationMpPerSecond';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TGeneration, TStatus } from '$ts/types/main';
	import { onDestroy, onMount } from 'svelte';

	let status: TStatus = 'idle';
	let inputValue: string | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let startTimestamp: number | undefined;
	let endTimestamp: number | undefined;
	let lastGeneration: TGeneration | undefined;
	let generationWidth: string;
	let generationHeight: string;
	let generationError: string | undefined;
	let estimatedDuration = estimatedDurationDefault;

	const num_inference_steps = 100;

	$: duration =
		endTimestamp !== undefined && startTimestamp !== undefined
			? endTimestamp - startTimestamp
			: undefined;

	$: [generationWidth, generationHeight], setEstimatedDuration();

	async function setEstimatedDuration() {
		if (isCheckComplete) {
			estimatedDuration =
				$iterationMpPerSecond && generationWidth && generationHeight
					? Math.ceil(
							((Number(generationWidth) * Number(generationHeight) * num_inference_steps) /
								$iterationMpPerSecond) *
								(1 + estimatedDurationBufferRatio)
					  )
					: estimatedDurationDefault;
		}
	}

	async function onCreate() {
		if (!$serverUrl || !inputValue) {
			!inputValue && console.log('no input');
			!$serverUrl && console.log('no server url');
			return;
		}
		generationError = undefined;
		lastGeneration = {
			server_url: $serverUrl,
			prompt: inputValue,
			width: Number(generationWidth),
			height: Number(generationHeight),
			seed: Math.floor(Math.random() * 1000000000),
			guidance_scale: 7,
			num_inference_steps: 100
		};
		console.log('generation', lastGeneration);
		console.log('estimatedDuration', estimatedDuration);
		status = 'loading';
		endTimestamp = undefined;
		startTimestamp = Date.now();
		try {
			let res = await generateImage({
				server_url: lastGeneration.server_url,
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
					if (lastGeneration && startTimestamp !== undefined) {
						lastGeneration.iterationMpPerSecond = Math.ceil(
							(lastGeneration.width * lastGeneration.height * lastGeneration.num_inference_steps) /
								((Date.now() - startTimestamp) / 1000)
						);
						iterationMpPerSecond.set(lastGeneration.iterationMpPerSecond);
						setEstimatedDuration();
					}
					status = 'success';
					console.log('image loaded for:', `"${lastGeneration?.prompt}"`);
				};
			} else {
				generationError = error;
				throw new Error(error);
			}
		} catch (error) {
			status = 'error';
			console.log(error);
		} finally {
			endTimestamp = Date.now();
		}
	}

	let isCheckComplete = false;

	onMount(() => {
		if ($iterationMpPerSecond === undefined) {
			iterationMpPerSecond.set(1500000);
		}

		setEstimatedDuration();
		isCheckComplete = true;
	});

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

<div class="w-full flex flex-col flex-1 justify-center items-center px-4 pb-8">
	<GenerateBar
		bind:inputValue
		bind:generationWidth
		bind:generationHeight
		{status}
		{onCreate}
		{startTimestamp}
		{estimatedDuration}
	/>
	{#if status === 'error'}
		<div transition:expandCollapse={{}} class="flex flex-col justify-start origin-top">
			<p class="w-full max-w-lg text-c-on-bg/40 text-center py-4">
				{generationError ?? 'Something went wrong...'}
			</p>
		</div>
	{:else if status === 'success' && duration !== undefined && lastGeneration && lastGeneration.imageUrl}
		<div
			transition:expandCollapse={{}}
			class="overflow-hidden flex flex-col justify-start rounded-xl origin-top relative z-0"
		>
			<div class="flex flex-col items-center md:px-5 gap-4 py-4">
				<div class="relative">
					<img
						class="w-full max-w-md h-auto rounded-2xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]  border-4 border-c-bg"
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
						<div class="p-3 rounded-full bg-c-bg relative overflow-hidden z-0">
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
