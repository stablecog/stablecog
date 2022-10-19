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
	import type { TDBGenerationRealtimePayload } from '$ts/types/db';

	let generations: TDBGenerationRealtimePayload[] = [];
	const generationsMaxLength = 100;
	const msForEachDifference = 50;
	const maxDuration = 500;
	let generationTotalCount = tweened(0, {
		duration: 500,
		easing: quadOut
	});
	let generationTotalDurationMs = tweened(0, {
		duration: 500,
		easing: quadOut
	});
	const calculateAnimationDuration = (curr: number, next: number) => {
		return Math.min((next - curr) * msForEachDifference, maxDuration);
	};
	let channel: RealtimeChannel | undefined;

	const getCountryName = (countryCode: string) => {
		try {
			const displayName = new Intl.DisplayNames(['en'], { type: 'region' });
			const countryName = displayName.of(countryCode);
			return countryName ?? 'Unknown';
		} catch (error) {
			return 'Unknown';
		}
	};

	onMount(async () => {
		if (supabase) {
			getAndSetTotals();
			channel = supabase
				.channel('generation-realtime-changes')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'generation_realtime' },
					(payload) => {
						const newData = payload.new as TDBGenerationRealtimePayload;
						if (newData.created_at && generations.map((i) => i.id).includes(newData.id)) {
							const index = generations.findIndex((i) => i.id === newData.id);
							generations[index] = newData;
							generations = [...generations];
						} else {
							generations = [newData, ...generations];
						}
						generations = generations
							.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
							.slice(0, generationsMaxLength);
						getAndSetTotals();
					}
				)
				.subscribe();
		} else {
			console.log('Supabase is not detected.');
		}
	});

	onDestroy(() => {
		channel?.unsubscribe();
		supabase?.removeAllChannels();
	});

	async function getAndSetTotals() {
		try {
			if (supabase) {
				const [durationRes, countRes] = await Promise.all([
					supabase.rpc('generation_duration_ms_total_estimate_with_constant'),
					supabase.rpc('generation_count')
				]);
				if (durationRes.data && countRes.data) {
					const count = Number(countRes.data);
					const duration = Number(durationRes.data);
					if (count > $generationTotalCount) {
						generationTotalCount = tweened($generationTotalCount, {
							duration: calculateAnimationDuration($generationTotalCount, count),
							easing: quadOut
						});
						generationTotalCount.set(count);
						console.log('generationTotalCount:', count);
					}
					if (duration > $generationTotalDurationMs) {
						generationTotalDurationMs = tweened($generationTotalDurationMs, {
							duration: calculateAnimationDuration($generationTotalDurationMs, duration),
							easing: quadOut
						});
						generationTotalDurationMs.set(duration);
						console.log('generationTotalDurationMs:', duration);
					}
				} else {
					console.log(durationRes.error, countRes.error);
				}
			}
		} catch (error) {
			console.log('Error getting totals:', error);
		}
	}

	const tooltipStyleProps: TTooltipProps = {
		parentContainerId: 'main-container',
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

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(7vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		<div class="w-full flex flex-wrap items-center justify-center py-6 gap-10 md:gap-14">
			<div class="w-full md:w-64 max-w-full flex flex-col gap-1.5 text-center md:text-right">
				<h1 class="text-c-on-bg/50 text-sm">Generations</h1>
				<p class="font-bold text-4xl">
					{Math.floor($generationTotalCount).toLocaleString('en-US')}
				</p>
			</div>
			<div class="w-full md:w-64 max-w-full flex flex-col gap-1.5 text-center md:text-left">
				<h1 class="text-c-on-bg/50 text-sm">Total Duration</h1>
				<p class="font-bold text-4xl">
					{Math.round($generationTotalDurationMs / 1000).toLocaleString('en-US')}s
				</p>
			</div>
		</div>
		{#if generations && generations.length > 0}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-[calc(100%+4rem)] md:w-[calc(100%+12rem)] px-4 md:px-24 overflow-hidden z-0 relative -mx-8"
			>
				<div class="w-full flex flex-wrap items-center justify-center py-4">
					{#each generations as generation (generation.id)}
						<div
							in:elementreceive|local={{ key: generation.id }}
							out:elementsend|local={{ key: generation.id }}
							animate:flip={{ duration: 300, easing: quadOut }}
							class="flex items-center justify-center relative overflow-hidden z-0 rounded-full -m-3"
						>
							<div class="p-8 relative overflow-hidden z-0 rounded-full">
								{#if generation.status === 'started'}
									<div
										transition:scale|local={{ duration: 300, easing: quadOut }}
										class="absolute w-full h-full left-0 top-0 origin-center"
									>
										<div class="w-full h-full">
											<div
												class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
											/>
										</div>
									</div>
								{/if}
								<div class="w-10 h-10 relative">
									{#if generation.status === 'started'}
										<div
											transition:scale|local={{ duration: 300, easing: quadOut }}
											class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
										/>
									{/if}
									{#key generation.status}
										<div
											use:tooltip={{
												rows: [
													{
														key: 'Country:',
														value: generation.country_code
															? getCountryName(generation.country_code) ?? 'Unknown'
															: 'Unknown'
													},
													{
														key: 'Status:',
														value:
															generation.status.slice(0, 1).toUpperCase() +
															generation.status.slice(1)
													},
													...(generation.duration_ms
														? [
																{
																	key: 'Duration:',
																	value: generation.duration_ms
																		? `${(generation.duration_ms / 1000).toLocaleString('en-US', {
																				maximumFractionDigits: 1
																		  })}s`
																		: 'Unfinished'
																}
														  ]
														: []),
													{
														key: 'Server:',
														value: generation.uses_default_server ? 'Default' : 'Custom'
													}
												],
												...tooltipStyleProps
											}}
											class="w-full h-full rounded-full transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {generation.status ===
											'succeeded'
												? 'bg-c-success'
												: generation.status === 'failed'
												? 'bg-c-danger'
												: 'bg-c-primary'}"
										>
											{#if generation.country_code}
												<p
													class="text-center text-xs font-bold text-c-on-primary/50 cursor-default"
												>
													{generation.country_code}
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
		{:else if supabase}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full overflow-hidden z-0 relative max-w-lg"
			>
				<div class="w-full flex flex-col items-center justify-center py-4">
					<IconPulsing />
					<p class="w-full text-c-on-bg/40 text-center mt-1.5">Waiting for generations</p>
				</div>
			</div>
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
