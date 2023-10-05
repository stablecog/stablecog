<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend, expandCollapse } from '$ts/animation/transitions';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import { onMount, onDestroy } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { browser } from '$app/environment';
	import { getAspectRatioFromWidthAndHeight } from '$ts/constants/generationSize';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import type {
		TAnyRealtimePayloadExt,
		TGenerationRealtimePayloadExt,
		TUpscaleRealtimePayloadExt
	} from '$approutes/live/types';
	import LiveBubble from '$approutes/live/LiveBubble.svelte';
	import { flip } from 'svelte/animate';
	import type { TRow } from '$ts/actions/tooltip';

	let sse: EventSource | undefined = undefined;
	$: if (browser && (!sse || sse.readyState === sse.CLOSED)) {
		sse = new EventSource(`${apiUrl.href}v1/sse?id=live`);
		sse.onopen = () => {
			console.log(`Connected to SSE with ID: live`);
		};
		sse.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.process_type === 'generate') {
				const generation = data as TGenerationRealtimePayloadExt;
				// check if generation is already in the array
				const generationAlreadyInArray = generations.find((g) => g.id === generation.id);
				if (!generationAlreadyInArray) {
					generations = [withAspectRatio(generation), ...generations];
				} else {
					// update the generation in the array
					generations = generations.map((g) => {
						if (g.id === generation.id) {
							return withAspectRatio(generation);
						} else {
							return withAspectRatio(g);
						}
					});
					if (generation.status === 'succeeded' && generation.actual_num_outputs) {
						const newCount = $generationTotalCount + generation.actual_num_outputs;
						generationTotalCount = tweened($generationTotalCount, {
							duration: calculateAnimationDuration($generationTotalCount, newCount),
							easing: quadOut
						});
						generationTotalCount.set(newCount);
					}
				}
			} else if (data.process_type === 'upscale') {
				const upscale = data as TUpscaleRealtimePayloadExt;
				// check if upscale is already in the array
				const upscaleAlreadyInArray = upscales.find((u) => u.id === upscale.id);
				if (!upscaleAlreadyInArray) {
					upscales = [withAspectRatio(upscale), ...upscales];
				} else {
					// update the upscale in the array
					upscales = upscales.map((u) => {
						if (u.id === upscale.id) {
							return withAspectRatio(upscale);
						} else {
							return withAspectRatio(u);
						}
					});
					if (upscale.status === 'succeeded' && upscale.actual_num_outputs) {
						const newCount = $upscaleTotalCount + upscale.actual_num_outputs;
						upscaleTotalCount = tweened($upscaleTotalCount, {
							duration: calculateAnimationDuration($upscaleTotalCount, newCount),
							easing: quadOut
						});
						upscaleTotalCount.set(newCount);
					}
				}
			}
			console.log('Message from SSE', data);
		};
		sse.onerror = (event) => {
			console.log('Error from SSE', event);
		};
	}

	let generations: TGenerationRealtimePayloadExt[] = [];
	let upscales: TUpscaleRealtimePayloadExt[] = [];
	let allProcesses: TAnyRealtimePayloadExt[] = [];

	$: [generations, upscales], setAllProcesses();

	const maxLengthAllProcesses = 50;
	const msForEachDifference = 50;
	const maxDuration = 500;
	let generationTotalCount = tweened(0, {
		duration: 500,
		easing: quadOut
	});
	let upscaleTotalCount = tweened(0, {
		duration: 500,
		easing: quadOut
	});

	const calculateAnimationDuration = (curr: number, next: number) => {
		return Math.min((next - curr) * msForEachDifference, maxDuration);
	};

	function setAllProcesses() {
		const all = [...generations, ...upscales];
		const allSorted = all
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			.slice(0, maxLengthAllProcesses);
		allProcesses = [...allSorted];
	}

	function withAspectRatio(payload: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt) {
		const aspect_ratio = getAspectRatioFromWidthAndHeight(payload.width, payload.height);
		return {
			...payload,
			aspect_ratio: aspect_ratio ?? undefined
		} as TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt;
	}

	function getCountryName(locale: Locales, countryCode: string) {
		try {
			const displayName = new Intl.DisplayNames([locale], { type: 'region' });
			const countryName = displayName.of(countryCode);
			return countryName ?? 'Unknown';
		} catch (error) {
			return 'Unknown';
		}
	}

	function getDurationSec(processObject: TAnyRealtimePayloadExt) {
		const createdAt = new Date(processObject.created_at).getTime();
		const completedAt = processObject.completed_at
			? new Date(processObject.completed_at).getTime()
			: Date.now();
		return (completedAt - createdAt) / 1000;
	}

	function planBasedColor(entry: TAnyRealtimePayloadExt) {
		return entry.product_id
			? entry.status === 'succeeded'
				? 'rgb(var(--c-success-secondary))'
				: entry.status === 'failed'
				? 'rgb(var(--c-danger-secondary))'
				: 'rgb(var(--c-primary-secondary))'
			: 'transparent';
	}

	function getOptionalInfo(
		$LL: TranslationFunctions,
		processObject: TAnyRealtimePayloadExt
	): TRow[] {
		const asGeneration = processObject as TGenerationRealtimePayloadExt;
		const asUpscale = processObject as TUpscaleRealtimePayloadExt;
		if (processObject.process_type === 'upscale') {
			return [];
		} else if (processObject.process_type === 'generate') {
			return [];
		}
		return [];
	}

	let getAndSetTotalsInterval: NodeJS.Timeout;
	const getAndSetTotalsIntervalTime = 10 * 1000;

	onMount(() => {
		getAndSetTotals();
		getAndSetTotalsInterval = setInterval(getAndSetTotals, getAndSetTotalsIntervalTime);
	});

	onDestroy(() => {
		clearInterval(getAndSetTotalsInterval);
		sse?.close();
	});

	async function getAndSetTotals() {
		const res = await fetch(`${apiUrl.origin}/v1/stats`);
		const resJson: IStatsRes = await res.json();
		const { generation_output_count: gCount, upscale_output_count: uCount } = resJson;
		if (gCount > $generationTotalCount) {
			generationTotalCount = tweened($generationTotalCount, {
				duration: calculateAnimationDuration($generationTotalCount, gCount),
				easing: quadOut
			});
			generationTotalCount.set(gCount);
		}
		if (uCount > $upscaleTotalCount) {
			upscaleTotalCount = tweened($upscaleTotalCount, {
				duration: calculateAnimationDuration($upscaleTotalCount, uCount),
				easing: quadOut
			});
			upscaleTotalCount.set(uCount);
		}
	}

	interface IStatsRes {
		generation_output_count: number;
		upscale_output_count: number;
		voiceover_output_count: number;
	}
</script>

<MetaTag
	title="Live | Stablecog"
	description="Watch generations happening live on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<div class="w-full flex-1 flex justify-center pb-[calc(2vh)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		<div
			class="w-full px-8 md:px-16 flex flex-wrap items-center justify-center py-2 md:pt-10 gap-8 lg:gap-12"
		>
			<div class="w-full lg:w-64 max-w-full flex flex-col gap-1.5 text-center lg:text-right">
				<h2 class="text-c-on-bg/50 font-medium text-base">{$LL.Live.GenerationsTitle()}</h2>
				<p class="font-bold text-4xl">
					{Math.floor($generationTotalCount).toLocaleString($locale)}
				</p>
			</div>
			<div class="w-full lg:w-64 max-w-full flex flex-col gap-1.5 text-center lg:text-left">
				<h2 class="text-c-on-bg/50 font-medium text-base">{$LL.Live.UpscalesTitle()}</h2>
				<p class="font-bold text-4xl">
					{Math.floor($upscaleTotalCount).toLocaleString($locale)}
				</p>
			</div>
		</div>
		{#if allProcesses.length > 0}
			<div transition:expandCollapse={{ duration: 300 }} class="w-full px-8 md:px-24 z-0 relative">
				<div class="w-full flex flex-wrap items-center justify-center py-4">
					{#each allProcesses as processObject (processObject.id)}
						<div
							in:elementreceive={{ key: processObject.id }}
							out:elementsend={{ key: processObject.id }}
							animate:flip={{ duration: 300, easing: quadOut }}
							class="flex items-center justify-center relative z-0 -m-3"
						>
							<LiveBubble
								{processObject}
								{getDurationSec}
								{getCountryName}
								{getOptionalInfo}
								{planBasedColor}
							/>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div
				transition:expandCollapse={{ duration: 300 }}
				class="w-full px-8 lg:px-16 relative max-w-lg"
			>
				<div class="w-full flex flex-col items-center justify-center py-4">
					<IconPulsing />
					<p class="w-full text-c-on-bg/40 font-medium text-center mt-1.5">
						{$LL.Live.WaitingTitle()}
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
