<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend, expandCollapse } from '$ts/animation/transitions';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import { onMount, onDestroy } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { tooltip, type TRow, type TTooltipProps } from '$ts/actions/tooltip';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { browser } from '$app/environment';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import { getAspectRatioFromWidthAndHeight } from '$ts/constants/generationSize';
	import IconRobot from '$components/icons/IconRobot.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	let sse: EventSource | undefined = undefined;
	$: if (browser && (!sse || sse.readyState === sse.CLOSED)) {
		sse = new EventSource(`${apiUrl.href}v1/sse?id=live`);
		sse.onopen = () => {
			console.log(`Connected to SSE with ID: live`);
		};
		sse.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.process_type === 'generate') {
				const generation = data as TBaseRealtimePayload;
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
	let generationsAndUpscales: (TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt)[] = [];

	$: [generations, upscales], setGenerationsAndUpscales();

	const maxLengthGenerationsAndUpscales = 50;
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

	type TProcessType = 'upscale' | 'generate';
	type TStatus = 'queued' | 'succeeded' | 'failed' | 'processing';

	interface TBaseRealtimePayload {
		process_type: TProcessType;
		id: string;
		country_code: string;
		status: TStatus;
		created_at: string;
		started_at?: string;
		completed_at?: string;
		width: number;
		height: number;
		target_num_outputs: number;
		actual_num_outputs?: number;
		product_id?: string;
		system_generated?: boolean;
	}
	interface TGenerationRealtimePayloadExt extends TBaseRealtimePayload {
		aspect_ratio?: string;
	}
	interface TUpscaleRealtimePayloadExt extends TBaseRealtimePayload {
		aspect_ratio?: string;
	}

	const calculateAnimationDuration = (curr: number, next: number) => {
		return Math.min((next - curr) * msForEachDifference, maxDuration);
	};

	const getCountryName = (locale: Locales, countryCode: string) => {
		try {
			const displayName = new Intl.DisplayNames([locale], { type: 'region' });
			const countryName = displayName.of(countryCode);
			return countryName ?? 'Unknown';
		} catch (error) {
			return 'Unknown';
		}
	};

	function setGenerationsAndUpscales() {
		const all = [...generations, ...upscales];
		const allSorted = all
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			.slice(0, maxLengthGenerationsAndUpscales);
		generationsAndUpscales = [...allSorted];
	}

	const getDurationSec = (
		generationOrUpscale: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt
	) => {
		const createdAt = new Date(generationOrUpscale.created_at).getTime();
		const completedAt = generationOrUpscale.completed_at
			? new Date(generationOrUpscale.completed_at).getTime()
			: Date.now();
		return (completedAt - createdAt) / 1000;
	};

	function getOptionalInfo(
		$LL: TranslationFunctions,
		generationOrUpscale: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt
	): TRow[] {
		const asGeneration = generationOrUpscale as TGenerationRealtimePayloadExt;
		const asUpscale = generationOrUpscale as TUpscaleRealtimePayloadExt;
		if (generationOrUpscale.process_type === 'upscale') {
			return [];
		} else if (generationOrUpscale.process_type === 'generate') {
			return [];
		}
		return [];
	}

	function withAspectRatio(payload: TBaseRealtimePayload) {
		const aspect_ratio = getAspectRatioFromWidthAndHeight(payload.width, payload.height);
		return {
			...payload,
			aspect_ratio: aspect_ratio ?? undefined
		} as TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt;
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

	const tooltipStyleProps: TTooltipProps = {
		titleClass: 'font-normal text-c-on-bg/50 text-sm leading-relaxed text-left',
		descriptionClass: 'font-semibold text-sm leading-relaxed text-right',
		rowClass: 'w-full flex gap-4 justify-between',
		wrapperClass: 'w-full transition duration-250 transform -mt-0.25',
		animationTime: 250,
		animateFrom: 'opacity-0 translate-y-3',
		animateTo: 'opacity-100 translate-y-0',
		containerClass:
			'max-w-[min(100vw-32px,16rem)] px-5 py-3 transform -translate-y-3 overflow-hidden text-c-on-bg/75 flex flex-col gap-1 rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
		indicatorClass: 'w-5 h-5',
		indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-secondary rounded`
	};

	interface IStatsRes {
		generation_output_count: number;
		upscale_output_count: number;
	}

	function planBasedColor(entry: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt) {
		return entry.product_id
			? entry.status === 'succeeded'
				? 'rgb(var(--c-success-secondary))'
				: entry.status === 'failed'
				? 'rgb(var(--c-danger-secondary))'
				: 'rgb(var(--c-primary-secondary))'
			: 'transparent';
	}
</script>

<MetaTag
	title="Live | Stablecog"
	description="Watch generations happening live on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center pb-[calc(2vh)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		<div
			class="w-full px-8 md:px-16 flex flex-wrap items-center justify-center py-2 md:pt-10 gap-10 lg:gap-14"
		>
			<div class="w-full lg:w-64 max-w-full flex flex-col gap-1.5 text-center lg:text-right">
				<h1 class="text-c-on-bg/50 font-medium text-base">{$LL.Live.GenerationsTitle()}</h1>
				<p class="font-bold text-4xl">
					{Math.floor($generationTotalCount).toLocaleString($locale)}
				</p>
			</div>
			<div class="w-full lg:w-64 max-w-full flex flex-col gap-1.5 text-center lg:text-left">
				<h1 class="text-c-on-bg/50 font-medium text-base">{$LL.Live.UpscalesTitle()}</h1>
				<p class="font-bold text-4xl">
					{Math.floor($upscaleTotalCount).toLocaleString($locale)}
				</p>
			</div>
		</div>
		{#if generationsAndUpscales.length > 0}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full px-8 md:px-24 z-0 relative"
			>
				<div class="w-full flex flex-wrap items-center justify-center py-4">
					{#each generationsAndUpscales as generationOrUpscale (generationOrUpscale.id)}
						<div
							in:elementreceive|local={{ key: generationOrUpscale.id }}
							out:elementsend|local={{ key: generationOrUpscale.id }}
							animate:flip={{ duration: 300, easing: quadOut }}
							class="flex items-center justify-center relative overflow-hidden z-0 {generationOrUpscale.process_type ===
							'generate'
								? 'rounded-full'
								: 'rounded-xl'} -m-3"
						>
							<div
								class="p-8 relative overflow-hidden z-0 {generationOrUpscale.process_type ===
								'generate'
									? 'rounded-full'
									: 'rounded-xl'}"
							>
								{#if generationOrUpscale.status === 'queued' || generationOrUpscale.status === 'processing'}
									<div
										transition:scale|local={{ duration: 300, easing: quadOut }}
										class="absolute w-full h-full left-0 top-0 origin-center"
									>
										<div class="w-full h-full">
											<div
												class="w-full h-full absolute left-0 top-0 {generationOrUpscale.process_type ===
												'generate'
													? 'rounded-full'
													: 'rounded-4xl'} bg-c-primary/50 animate-ping-custom"
											/>
										</div>
									</div>
								{/if}
								<div class="w-10 h-10 relative">
									{#if generationOrUpscale.status === 'queued' || generationOrUpscale.status === 'processing'}
										<div
											transition:scale|local={{ duration: 300, easing: quadOut }}
											class="w-full h-full absolute left-0 top-0 {generationOrUpscale.process_type ===
											'generate'
												? 'rounded-full'
												: 'rounded-xl'} bg-c-primary animate-ping-custom-bg"
										/>
									{/if}
									<div
										use:tooltip={{
											rows: [
												{
													key: $LL.Live.GenerationTooltip.CountryTitle() + ':',
													value: generationOrUpscale.country_code
														? getCountryName($locale, generationOrUpscale.country_code) ??
														  $LL.Live.GenerationTooltip.UnknownTitle()
														: $LL.Live.GenerationTooltip.UnknownTitle()
												},
												{
													key: $LL.Account.SubscriptionPlanTitle() + ':',
													value: getTitleFromProductId($LL, generationOrUpscale.product_id)
												},
												{
													key: $LL.Live.GenerationTooltip.Type.Title() + ':',
													value:
														generationOrUpscale.process_type === 'upscale'
															? $LL.Live.GenerationTooltip.Type.Upscale()
															: $LL.Live.GenerationTooltip.Type.Generation()
												},
												...(generationOrUpscale.width && generationOrUpscale.height
													? [
															{
																key: $LL.Live.GenerationTooltip.DimensionsTitle() + ':',
																value: `${generationOrUpscale.width} × ${generationOrUpscale.height}`
															}
													  ]
													: []),
												...(generationOrUpscale.aspect_ratio
													? [
															{
																key: $LL.Live.GenerationTooltip.AspectRatioTitle() + ':',
																value: generationOrUpscale.aspect_ratio
															}
													  ]
													: []),
												...(generationOrUpscale.actual_num_outputs
													? [
															{
																key: $LL.Live.GenerationTooltip.OutputsTitle() + ':',
																value: generationOrUpscale.actual_num_outputs.toString()
															}
													  ]
													: []),
												...getOptionalInfo($LL, generationOrUpscale),
												...(generationOrUpscale.completed_at !== undefined
													? [
															{
																key: $LL.Live.GenerationTooltip.DurationTitle() + ':',
																value: `${getDurationSec(generationOrUpscale).toLocaleString(
																	$locale,
																	{
																		maximumFractionDigits: 1
																	}
																)}`
															}
													  ]
													: []),
												{
													key: $LL.Live.GenerationTooltip.Status.Title() + ':',
													value:
														generationOrUpscale.status === 'queued' ||
														generationOrUpscale.status === 'processing'
															? $LL.Live.GenerationTooltip.Status.Started()
															: generationOrUpscale.status === 'succeeded'
															? $LL.Live.GenerationTooltip.Status.Succeeded()
															: $LL.Live.GenerationTooltip.Status.Failed()
												}
											],
											...tooltipStyleProps
										}}
										class="w-full h-full {generationOrUpscale.process_type === 'generate'
											? 'rounded-full'
											: 'rounded-xl'} transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {generationOrUpscale.status ===
										'succeeded'
											? 'bg-c-success'
											: generationOrUpscale.status === 'failed'
											? 'bg-c-danger'
											: 'bg-c-primary'}"
									>
										<div
											class="w-full h-full flex items-center justify-center"
											style="
													background-color: transparent;
													background-image:  linear-gradient(135deg, {planBasedColor(
												generationOrUpscale
											)} 25%, transparent 25%), linear-gradient(225deg, {planBasedColor(
												generationOrUpscale
											)} 25%, transparent 25%), linear-gradient(45deg, {planBasedColor(
												generationOrUpscale
											)} 25%, transparent 25%), linear-gradient(315deg, {planBasedColor(
												generationOrUpscale
											)} 25%, transparent 25%);
													background-position:  8px 0, 8px 0, 0 0, 0 0;
													background-size: 8px 8px;
													background-repeat: repeat;
												"
										>
											{#if generationOrUpscale.system_generated === true}
												<IconRobot class="text-c-on-primary/75 w-6 h-6 -mt-1" />
											{:else if generationOrUpscale.country_code}
												<p
													class="text-center text-xs font-bold text-c-on-primary/75 cursor-default relative"
												>
													{generationOrUpscale.country_code}
												</p>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
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
