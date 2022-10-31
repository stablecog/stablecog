<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import Input from '$components/Input.svelte';
	import { supabaseClient } from '$ts/constants/supabaseClient';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	interface TServer {
		id: string;
		created_at: string;
		updated_at: string;
		enabled: boolean;
		healthy: boolean;
		last_health_check_at: string;
		url: string;
	}

	interface TServerRes {
		data: TServer[] | null;
		error: PostgrestError | null;
	}

	let serverUrl: string;
	let serverAddStatus: 'idle' | 'loading' = 'idle';
	let servers: TServer[];
	let getAndSetServersInterval: NodeJS.Timeout;
	let nowInterval: NodeJS.Timeout;
	let now = Date.now();

	const formatDate = new Intl.RelativeTimeFormat('en', { style: 'short' });
	const getRelativeDate = (now: number, timestamp: number) => {
		const diff = timestamp - now;
		const diffInSeconds = Math.round(diff / 1000);
		return formatDate.format(Math.round(diffInSeconds), 'second');
	};

	onMount(async () => {
		getAndSetServers();
		getAndSetServersInterval = setInterval(getAndSetServers, 5000);
		now = Date.now();
		nowInterval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => {
			clearInterval(nowInterval);
			clearInterval(getAndSetServersInterval);
		};
	});

	async function getAndSetServers() {
		if (!supabaseClient) return;
		try {
			const { data, error }: TServerRes = await supabaseClient
				?.from('server')
				.select('*')
				.order('url');
			console.log(data, error);
			if (data) servers = data;
		} catch (error) {
			console.log(error);
		}
	}

	async function addServer() {
		if (!supabaseClient) return;
		if (!serverUrl) return;
		serverAddStatus = 'loading';
		if (serverUrl.endsWith('/')) serverUrl = serverUrl.slice(0, -1);
		try {
			const { data, error } = await supabaseClient
				?.from('server')
				.insert({ url: serverUrl })
				.select();
			console.log(data, error);
			if (data && !error) {
				serverUrl = '';
				await getAndSetServers();
			}
		} catch (error) {
			console.log(error);
		}
		serverAddStatus = 'idle';
	}

	async function disableServer(id: string) {
		if (!supabaseClient) return;
		try {
			const { data, error } = await supabaseClient
				?.from('server')
				.update({ enabled: false })
				.eq('id', id)
				.select();
			console.log(data, error);
			if (data && !error) {
				await getAndSetServers();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function enableServer(id: string) {
		if (!supabaseClient) return;
		try {
			const { data, error } = await supabaseClient
				?.from('server')
				.update({ enabled: true })
				.eq('id', id)
				.select();
			console.log(data, error);
			if (data && !error) {
				await getAndSetServers();
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="w-full flex-1 flex flex-col items-center-center px-5 md:px-16 pt-8 pb-[calc(3vh+1rem)]">
	<div class="flex flex-col items-center my-auto gap-8">
		<form
			on:submit|preventDefault={addServer}
			class="w-full flex flex-wrap max-w-xl md:max-w-2xl gap-3"
		>
			<Input
				disabled={serverAddStatus === 'loading'}
				placeholder="Server url"
				bind:value={serverUrl}
			/>
			<Button
				withSpinner={true}
				class="w-full md:w-auto min-w-[10rem]"
				loading={serverAddStatus === 'loading'}
			>
				Add
			</Button>
		</form>
		<div class="w-full max-w-md md:max-w-4xl flex flex-col items-center justify-center gap-2">
			{#if servers}
				{#each servers as server}
					<div
						class="w-full shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] bg-c-bg-secondary px-5 py-4 rounded-xl 
						flex flex-wrap justify-between items-center text-sm gap-8"
					>
						<p class="w-full md:w-auto text-c-on-bg/75 text-xs break-all">
							{server.url}
						</p>
						<div class="flex flex-wrap justify-end items-center gap-6 text-right">
							<p class="font-bold {server.healthy ? 'text-c-success' : 'text-c-danger'}">
								{server.healthy ? 'Healthy' : 'Not Healthy'}
							</p>
							<div class="flex justify-center max-w-full min-w-[9rem]">
								<SubtleButton
									onClick={() => {
										server.enabled ? disableServer(server.id) : enableServer(server.id);
									}}
								>
									<div class="px-3 py-1 {server.enabled ? 'text-c-danger' : ''}">
										{server.enabled ? 'Disable' : 'Enable'}
									</div>
								</SubtleButton>
							</div>
							<p class="text-c-on-bg/50 min-w-[7rem] max-w-full">
								{getRelativeDate(now, new Date(server.last_health_check_at).getTime())}
							</p>
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-c-on-bg/50">Loading...</p>
			{/if}
		</div>
	</div>
</div>
