<script lang="ts">
	import { expandCollapse } from '$ts/animation/transitions';
	import { supabase } from '$ts/constants/supabase';
	import { onMount } from 'svelte';

	let generations: TPayload[] = [];
	const maxDurationSec = 60;

	interface TPayload {
		id: string;
		ended: boolean;
		succeeded: boolean;
		created_at: string;
		updated_at: string;
	}

	onMount(() => {
		if (supabase) {
			const channel = supabase.channel('db-generation-process');
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
						generations = [entry, ...generations];
					} else {
						const index = generations.findIndex((i) => i.id === entry.id);
						if (index !== -1) {
							generations[index] = entry;
							generations = [...generations];
						}
					}
					console.log('generations', generations);
				}
			);
			channel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					console.log('subscribed to channel');
				}
			});
			const interval = setInterval(() => {
				if (generations && generations.length > 0) {
					generations = generations.filter((i) => {
						const createdAt = new Date(i.created_at);
						const now = new Date();
						const diff = now.getTime() - createdAt.getTime();
						const diffInSec = diff / 1000;
						return diffInSec <= maxDurationSec;
					});
				}
			}, 1000);
		} else {
			console.log('Supabase is not detected.');
		}
	});
</script>

<div class="w-full flex-1 flex justify-center px-4 md:px-24 pt-8 pb-[calc(6vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		{#if generations && generations.length > 0}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full flex flex-wrap items-center justify-center"
			>
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
								class="w-5 h-5 rounded-full transition {generation.ended === true &&
								generation.succeeded === true
									? 'bg-c-success'
									: generation.ended === true && generation.succeeded === false
									? 'bg-c-danger'
									: 'bg-c-primary animate-pulse-scale'}"
							/>
						</div>
					</div>
				{/each}
			</div>
		{:else if supabase}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full flex flex-col items-center justify-start origin-top gap-5"
			>
				<div class="h-5 w-5 rounded-full bg-c-primary animate-pulse-scale" />
				<p class="w-full max-w-lg text-c-on-bg/40 text-center">Waiting for generations...</p>
			</div>
		{:else}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full flex flex-col items-center justify-start origin-top gap-5"
			>
				<p class="w-full max-w-xl leading-relaxed text-c-on-bg/40 text-center">
					Supabase instance not found. Can't listen for generations.
				</p>
			</div>
		{/if}
	</div>
</div>
