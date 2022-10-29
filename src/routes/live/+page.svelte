<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend, expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { tooltip, type TTooltipProps } from '$ts/actions/tooltip';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import type { TDBGenerationRealtimePayload, TDBUpscaleRealtimePayload } from '$ts/types/db';

	type TProcessType = 'upscale' | 'generation';
	interface TDBGenerationRealtimePayloadExt extends TDBGenerationRealtimePayload {
		type: TProcessType;
	}
	interface TDBUpscaleRealtimePayloadExt extends TDBUpscaleRealtimePayload {
		type: TProcessType;
	}

	let generations: TDBGenerationRealtimePayloadExt[] = [];
	let upscales: TDBUpscaleRealtimePayloadExt[] = [];
	let generationsAndUpscales: (TDBGenerationRealtimePayloadExt | TDBUpscaleRealtimePayloadExt)[] =
		[];

	$: [generations, upscales], setGenerationsAndUpscales();

	const maxLengthGenerationAndUpscales = 100;
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
	let generationAndUpscaleTotalDurationMs = tweened(0, {
		duration: 500,
		easing: quadOut
	});

	const calculateAnimationDuration = (curr: number, next: number) => {
		return Math.min((next - curr) * msForEachDifference, maxDuration);
	};

	let channelGeneration: RealtimeChannel | undefined;
	let channelUpscale: RealtimeChannel | undefined;
	const getCountryName = (countryCode: string) => {
		try {
			const displayName = new Intl.DisplayNames(['en'], { type: 'region' });
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
			.slice(0, maxLengthGenerationAndUpscales);
		generationsAndUpscales = [...allSorted];
	}

	function getOptionalInfo(
		generationOrUpscale: TDBGenerationRealtimePayloadExt | TDBUpscaleRealtimePayloadExt
	) {
		const asGeneration = generationOrUpscale as TDBGenerationRealtimePayloadExt;
		const asUpscale = generationOrUpscale as TDBUpscaleRealtimePayloadExt;
		if (generationOrUpscale.type === 'upscale' && asUpscale.scale) {
			return asUpscale.scale
				? [
						{
							key: 'Scale:',
							value: asUpscale.scale.toString()
						}
				  ]
				: [];
		} else {
			return asGeneration.num_inference_steps
				? [
						{
							key: 'Steps',
							value: asGeneration.num_inference_steps.toString()
						}
				  ]
				: [];
		}
	}

	onMount(async () => {
		if (supabase) {
			getAndSetTotals();
			channelGeneration = supabase
				.channel('generation-realtime-changes')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'generation_realtime' },
					(payload) => {
						const newData = payload.new as TDBGenerationRealtimePayload;
						if (newData.id && newData.status && newData.created_at) {
							if (generations.map((i) => i.id).includes(newData.id)) {
								const index = generations.findIndex((i) => i.id === newData.id);
								generations[index] = {
									...newData,
									type: 'generation'
								};
								generations = [...generations];
							} else {
								generations = [{ ...newData, type: 'generation' }, ...generations];
							}
							getAndSetTotals();
						}
					}
				)
				.subscribe();
			channelUpscale = supabase
				.channel('upscale-realtime-changes')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'upscale_realtime' },
					(payload) => {
						const newData = payload.new as TDBUpscaleRealtimePayload;
						if (newData.id && newData.status && newData.created_at) {
							if (upscales.map((i) => i.id).includes(newData.id)) {
								const index = upscales.findIndex((i) => i.id === newData.id);
								upscales[index] = { ...newData, type: 'upscale' };
								upscales = [...upscales];
							} else {
								upscales = [{ ...newData, type: 'upscale' }, ...upscales];
							}
							getAndSetTotals();
						}
					}
				)
				.subscribe();
		} else {
			console.log('Supabase is not detected.');
		}
	});

	onDestroy(() => {
		channelGeneration?.unsubscribe();
		channelUpscale?.unsubscribe();
		supabase?.removeAllChannels();
	});

	async function getAndSetTotals() {
		try {
			if (supabase) {
				const [gDurationRes, gCountRes, uDurationRes, uCountRes] = await Promise.all([
					supabase.rpc('generation_duration_ms_total_estimate_with_constant'),
					supabase.rpc('generation_count'),
					supabase.rpc('upscale_duration_ms_total_estimate_with_constant'),
					supabase.rpc('upscale_count')
				]);
				if ((gDurationRes.data && gCountRes.data, uDurationRes.data && uCountRes.data)) {
					const gCount = Number(gCountRes.data);
					const gDuration = Number(gDurationRes.data);
					const uCount = Number(uCountRes.data);
					const uDuration = Number(uDurationRes.data);
					if (gCount > $generationTotalCount) {
						generationTotalCount = tweened($generationTotalCount, {
							duration: calculateAnimationDuration($generationTotalCount, gCount),
							easing: quadOut
						});
						generationTotalCount.set(gCount);
						console.log('generationTotalCount:', gCount);
					}
					if (uCount > $upscaleTotalCount) {
						upscaleTotalCount = tweened($upscaleTotalCount, {
							duration: calculateAnimationDuration($upscaleTotalCount, uCount),
							easing: quadOut
						});
						upscaleTotalCount.set(uCount);
						console.log('upscaleTotalCount:', uCount);
					}
					const durationTotal = gDuration + uDuration;
					if (durationTotal > $generationAndUpscaleTotalDurationMs) {
						generationAndUpscaleTotalDurationMs = tweened($generationAndUpscaleTotalDurationMs, {
							duration: calculateAnimationDuration(
								$generationAndUpscaleTotalDurationMs,
								durationTotal
							),
							easing: quadOut
						});
						generationAndUpscaleTotalDurationMs.set(durationTotal);
						console.log('totalDurationMs:', durationTotal);
					}
				} else {
					console.log(gDurationRes.error, gCountRes.error, uDurationRes.error, uCountRes.error);
				}
			}
		} catch (error) {
			console.log('Error getting totals:', error);
		}
	}

	const tooltipStyleProps: TTooltipProps = {
		parentContainerId: 'tooltip-container',
		titleClass: 'font-medium text-c-on-bg/50 text-sm leading-relaxed text-left',
		descriptionClass: 'font-bold text-sm leading-relaxed text-right',
		rowClass: 'w-full flex gap-4 justify-between',
		wrapperClass: 'w-full transition duration-250 transform -mt-0.25',
		animationTime: 250,
		animateFrom: 'opacity-0 translate-y-3',
		animateTo: 'opacity-100 translate-y-0',
		containerClass:
			'max-w-[min(100vw-32px,16rem)] px-5 py-3 transform -translate-y-3 overflow-hidden text-c-on-bg/75 flex flex-col gap-1 rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-strong)',
		indicatorClass: 'w-5 h-5',
		indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-secondary rounded`
	};
</script>

<MetaTag
	title="Live | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-8 lg:px-16 pt-4 pb-[calc(3vh)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		{#if supabase}
			<div class="w-full flex flex-wrap items-center justify-center py-6 gap-10 lg:gap-14">
				<div class="w-full lg:w-64 max-w-full flex flex-col gap-1.5 text-center lg:text-right">
					<h1 class="text-c-on-bg/50 text-sm">Generations</h1>
					<p class="font-bold text-4xl">
						{Math.floor($generationTotalCount).toLocaleString('en-US')}
					</p>
				</div>
				<div
					class="w-full order-last lg:order-none lg:w-64 max-w-full flex flex-col gap-1.5 text-center"
				>
					<h1 class="text-c-on-bg/50 text-sm">Total Duration</h1>
					<p class="font-bold text-4xl">
						{Math.round($generationAndUpscaleTotalDurationMs / 1000).toLocaleString('en-US')}s
					</p>
				</div>
				<div class="w-full lg:w-64 max-w-full flex flex-col gap-1.5 text-center lg:text-left">
					<h1 class="text-c-on-bg/50 text-sm">Upscales</h1>
					<p class="font-bold text-4xl">
						{Math.floor($upscaleTotalCount).toLocaleString('en-US')}
					</p>
				</div>
			</div>
			{#if generationsAndUpscales.length > 0}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="w-[calc(100%+4rem)] md:w-[calc(100%+12rem)] px-4 md:px-24 overflow-hidden z-0 relative -mx-8"
				>
					<div class="w-full flex flex-wrap items-center justify-center py-4">
						{#each generationsAndUpscales as generationOrUpscale (generationOrUpscale.id)}
							<div
								in:elementreceive|local={{ key: generationOrUpscale.id }}
								out:elementsend|local={{ key: generationOrUpscale.id }}
								animate:flip={{ duration: 300, easing: quadOut }}
								class="flex items-center justify-center relative overflow-hidden z-0 {generationOrUpscale.type ===
								'generation'
									? 'rounded-full'
									: 'rounded-xl'} -m-3"
							>
								<div
									class="p-8 relative overflow-hidden z-0 {generationOrUpscale.type === 'generation'
										? 'rounded-full'
										: 'rounded-xl'}"
								>
									{#if generationOrUpscale.status === 'started'}
										<div
											transition:scale|local={{ duration: 300, easing: quadOut }}
											class="absolute w-full h-full left-0 top-0 origin-center"
										>
											<div class="w-full h-full">
												<div
													class="w-full h-full absolute left-0 top-0 {generationOrUpscale.type ===
													'generation'
														? 'rounded-full'
														: 'rounded-4xl'} bg-c-primary/50 animate-ping-custom"
												/>
											</div>
										</div>
									{/if}
									<div class="w-10 h-10 relative">
										{#if generationOrUpscale.status === 'started'}
											<div
												transition:scale|local={{ duration: 300, easing: quadOut }}
												class="w-full h-full absolute left-0 top-0 {generationOrUpscale.type ===
												'generation'
													? 'rounded-full'
													: 'rounded-xl'} bg-c-primary animate-ping-custom-bg"
											/>
										{/if}
										{#key generationOrUpscale.status}
											<div
												use:tooltip={{
													rows: [
														{
															key: 'Country:',
															value: generationOrUpscale.country_code
																? getCountryName(generationOrUpscale.country_code) ?? 'Unknown'
																: 'Unknown'
														},
														{
															key: 'Type:',
															value:
																generationOrUpscale.type === 'upscale' ? 'Upscale' : 'Generation'
														},
														...(generationOrUpscale.width && generationOrUpscale.height
															? [
																	{
																		key: 'Dimensions:',
																		value:
																			generationOrUpscale.width && generationOrUpscale.height
																				? `${generationOrUpscale.width} × ${generationOrUpscale.height}`
																				: 'Unknown'
																	}
															  ]
															: []),
														...getOptionalInfo(generationOrUpscale),
														...(generationOrUpscale.duration_ms
															? [
																	{
																		key: 'Duration:',
																		value: generationOrUpscale.duration_ms
																			? `${(generationOrUpscale.duration_ms / 1000).toLocaleString(
																					'en-US',
																					{
																						maximumFractionDigits: 1
																					}
																			  )}s`
																			: 'Unfinished'
																	}
															  ]
															: []),
														{
															key: 'Status:',
															value:
																generationOrUpscale.status.slice(0, 1).toUpperCase() +
																generationOrUpscale.status.slice(1)
														},
														{
															key: 'Server:',
															value: generationOrUpscale.uses_default_server ? 'Default' : 'Custom'
														}
													],
													...tooltipStyleProps
												}}
												class="w-full h-full {generationOrUpscale.type === 'generation'
													? 'rounded-full'
													: 'rounded-xl'} transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {generationOrUpscale.status ===
												'succeeded'
													? 'bg-c-success'
													: generationOrUpscale.status === 'failed'
													? 'bg-c-danger'
													: 'bg-c-primary'}"
											>
												{#if generationOrUpscale.country_code}
													<p
														class="text-center text-xs font-bold text-c-on-primary/50 cursor-default"
													>
														{generationOrUpscale.country_code}
													</p>
												{/if}
											</div>
										{/key}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="w-full overflow-hidden z-0 relative max-w-lg"
				>
					<div class="w-full flex flex-col items-center justify-center py-4">
						<IconPulsing />
						<p class="w-full text-c-on-bg/40 text-center mt-1.5">Waiting for generations</p>
					</div>
				</div>
			{/if}
		{:else}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full overflow-hidden z-0 relative max-w-lg"
			>
				<div class="w-full flex flex-col items-center justify-center gap-5 py-4">
					<p class="w-full leading-relaxed text-c-on-bg/40 text-center">
						Supabase instance not found. Can't listen for generations.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
