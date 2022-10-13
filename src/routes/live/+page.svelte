<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';

	let channel: RealtimeChannel;
	let generations: TPayload[] = [];
	let clearMessageInterval: NodeJS.Timeout;
	const clearMessageIntervalDuration = 1000 * 10;
	const maxDurationSec = 60 * 10;
	const timestampDescSort = (a: TPayload, b: TPayload) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	};

	interface TPayload {
		id: string;
		ended: boolean;
		succeeded: boolean;
		country_code: string | null;
		created_at: string;
		updated_at: string;
	}

	onMount(() => {
		if (supabase) {
			channel = supabase.channel('db-generation-process');
			channel.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'generation_process'
				},
				(payload) => {
					console.log(payload);
					const entry = payload.new as TPayload;
					if (!generations.map((i) => i.id).includes(entry.id)) {
						generations = [entry, ...generations].sort(timestampDescSort);
					} else {
						const index = generations.findIndex((i) => i.id === entry.id);
						if (index !== -1) {
							generations[index] = entry;
							generations = [...generations].sort(timestampDescSort);
						}
					}
					console.log('generations', generations);
				}
			);
			channel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					console.log('subscribed to db-generation-process');
				}
			});
			clearMessageInterval = setInterval(() => {
				if (generations && generations.length > 0) {
					generations = generations.filter((i) => {
						const createdAt = new Date(i.created_at);
						const now = new Date();
						const diff = now.getTime() - createdAt.getTime();
						const diffInSec = diff / 1000;
						return diffInSec <= maxDurationSec;
					});
				}
			}, clearMessageIntervalDuration);
		} else {
			console.log('Supabase is not detected.');
		}
	});

	onDestroy(() => {
		if (supabase) {
			supabase.removeAllChannels();
			if (channel) {
				channel.unsubscribe();
			}
		}
		clearInterval(clearMessageInterval);
	});
</script>

<MetaTag
	title="Live | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(6vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		{#if generations && generations.length > 0}
			<div transition:expandCollapse|local={{ duration: 300 }} class="w-full">
				<div class="w-full flex flex-wrap items-center justify-center py-4">
					{#each generations as generation (generation.id)}
						<div
							transition:expandCollapse|local={{
								duration: 300,
								both: true,
								transformOrigin: 'center'
							}}
							class="overflow-hidden relative rounded-full z-0"
						>
							<div class="p-3">
								<div
									class="w-8 h-8 rounded-full transition-all flex items-center justify-center overflow-hidden z-0 {generation.ended ===
										true && generation.succeeded === true
										? 'bg-c-success'
										: generation.ended === true && generation.succeeded === false
										? 'bg-c-danger'
										: 'bg-c-primary animate-pulse-scale-small'}"
								>
									{#if generation.country_code}
										<p class="text-center text-xs font-bold text-c-on-primary/50">
											{generation.country_code}
										</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if supabase}
			<div transition:expandCollapse|local={{ duration: 300 }} class="w-full max-w-lg">
				<div class="w-full flex flex-col items-center justify-start gap-5 py-4">
					<div class="h-8 w-8 rounded-full transition-all bg-c-primary animate-pulse-scale-small" />
					<p class="w-full text-c-on-bg/40 text-center">Waiting for generations</p>
				</div>
			</div>
		{:else}
			<div transition:expandCollapse|local={{ duration: 300 }} class="w-full max-w-xl">
				<div class="w-full flex flex-col items-center justify-start gap-5 py-4">
					<p class="w-full leading-relaxed text-c-on-bg/40 text-center">
						Supabase instance not found. Can't listen for generations.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
