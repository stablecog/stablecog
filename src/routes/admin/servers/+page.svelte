<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabaseClient } from '$ts/constants/supabaseClient';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import type { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';
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

	interface TServerUI extends TServer {
		enableDisableLoading: boolean;
		removeLoading: boolean;
	}

	interface TServerRes {
		data: TServer[] | null;
		error: PostgrestError | null;
	}

	let serverUrl: string;
	let serverAddStatus: 'idle' | 'loading' = 'idle';
	let servers: TServerUI[];
	let nowInterval: NodeJS.Timeout;
	let now = Date.now();
	let channelServers: RealtimeChannel | undefined;

	onMount(async () => {
		getAndSetServers();
		now = Date.now();
		nowInterval = setInterval(() => {
			now = Date.now();
		}, 1000);
		if (supabaseClient) {
			channelServers = supabaseClient
				.channel('server-realtime-changes')
				.on('postgres_changes', { event: '*', schema: 'public', table: 'server' }, (payload) => {
					console.log('Payload', payload);
					getAndSetServers();
				})
				.subscribe();
		}
		return () => {
			clearInterval(nowInterval);
			channelServers?.unsubscribe();
			supabaseClient?.removeAllChannels();
		};
	});

	async function getAndSetServers() {
		if (!supabaseClient) return;
		try {
			const { data, error }: TServerRes = await supabaseClient
				?.from('server')
				.select('*')
				.order('url');
			console.log('Server data:', data, error);
			if (data) {
				const serversOld = servers ? [...servers] : [];
				servers = data.map((server) => {
					const serverOld = serversOld.find((s) => s.id === server.id);
					return {
						...server,
						enableDisableLoading: serverOld?.enableDisableLoading || false,
						removeLoading: serverOld?.removeLoading || false
					};
				});
				now = Date.now();
			}
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
			}
		} catch (error) {
			console.log(error);
		}
		serverAddStatus = 'idle';
	}

	async function removeServer(id: string) {
		if (!supabaseClient) return;
		const index = servers.findIndex((s) => s.id === id);
		if (index >= 0) servers[index].removeLoading = true;
		try {
			const { data, error } = await supabaseClient?.from('server').delete().eq('id', id);
			console.log(data, error);
		} catch (error) {
			console.log(error);
			servers[index].removeLoading = false;
		}
	}

	async function disableServer(id: string) {
		if (!supabaseClient) return;
		const index = servers.findIndex((s) => s.id === id);
		if (index >= 0) servers[index].enableDisableLoading = true;
		try {
			const { data, error } = await supabaseClient
				?.from('server')
				.update({ enabled: false })
				.eq('id', id)
				.select();
			console.log(data, error);
		} catch (error) {
			console.log(error);
		}
		if (index >= 0) servers[index].enableDisableLoading = false;
	}

	async function enableServer(id: string) {
		if (!supabaseClient) return;
		const index = servers.findIndex((s) => s.id === id);
		if (index >= 0) servers[index].enableDisableLoading = true;
		try {
			const { data, error } = await supabaseClient
				?.from('server')
				.update({ enabled: true })
				.eq('id', id)
				.select();
			console.log(data, error);
		} catch (error) {
			console.log(error);
		}
		if (index >= 0) servers[index].enableDisableLoading = false;
	}
</script>

<MetaTag
	title="Servers | Admin"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

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
			<Button withSpinner={true} loading={serverAddStatus === 'loading'}>Add</Button>
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
							<div class="flex justify-center min-w-[7rem] max-w-full">
								<SubtleButton
									disabled={server.enableDisableLoading}
									onClick={() => {
										server.enabled ? disableServer(server.id) : enableServer(server.id);
									}}
								>
									<div class="relative">
										<div
											class="px-3 py-1 transition {server.enabled
												? 'text-c-danger'
												: ''} {server.enableDisableLoading
												? 'scale-0 opacity-0'
												: 'scale-100 opacity-100'}"
										>
											{server.enabled ? 'Disable' : 'Enable'}
										</div>
										<div
											class="w-full h-full absolute left-0 top-0 flex items-center justify-center 
											pointer-events-none transform transition {server.enableDisableLoading
												? 'scale-100 opacity-100'
												: 'scale-0 opacity-100'}"
										>
											<IconLoading
												class="w-5 h-5 {server.enableDisableLoading ? 'animate-spin-faster' : ''}"
											/>
										</div>
									</div>
								</SubtleButton>
							</div>
							<p class="text-c-on-bg/50 min-w-[6rem] max-w-full">
								{getRelativeDate(new Date(server.last_health_check_at).getTime(), now)}
							</p>
							<SubtleButton
								disabled={server.removeLoading}
								class="-mr-1"
								noPadding
								onClick={() => removeServer(server.id)}
							>
								<div class="p-2.5 relative">
									<IconTrashcan
										class="w-6 h-6 text-c-danger transition {server.removeLoading
											? 'scale-0 opacity-0'
											: 'scale-100 opacity-100'}"
									/>
									<div
										class="w-full h-full absolute left-0 top-0 flex items-center justify-center 
										pointer-events-none transform transition {server.removeLoading
											? 'scale-100 opacity-100'
											: 'scale-0 opacity-100'}"
									>
										<IconLoading
											class="w-5 h-5 {server.removeLoading ? 'animate-spin-faster' : ''}"
										/>
									</div>
								</div>
							</SubtleButton>
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-c-on-bg/50 py-6.5">Loading...</p>
			{/if}
		</div>
	</div>
</div>
