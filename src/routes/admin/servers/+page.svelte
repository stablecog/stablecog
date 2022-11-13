<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconHeartBroken from '$components/icons/IconHeartBroken.svelte';
	import IconHeart from '$components/icons/IconHeart.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconServer from '$components/icons/IconServer.svelte';
	import IconServerDisabled from '$components/icons/IconServerDisabled.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabaseClient } from '$ts/constants/supabaseClient';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import type { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { elementreceive, elementsend } from '$ts/animation/transitions';

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
						enableDisableLoading: false,
						removeLoading: false
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
		if (!serverUrl.startsWith('http')) {
			serverUrl = 'http://' + serverUrl;
		}
		let url = new URL(serverUrl).toString();
		if (!url) {
			throw new Error('Invalid URL');
		}
		if (url.endsWith('/')) {
			serverUrl = url.slice(0, -1);
		}
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
			if (index >= 0) servers[index].enableDisableLoading = false;
		}
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
			if (index >= 0) servers[index].enableDisableLoading = false;
		}
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
				placeholder={$LL.Shared.ServerUrlInput.Placeholder()}
				bind:value={serverUrl}
			/>
			<Button withSpinner={true} loading={serverAddStatus === 'loading'}>
				{$LL.Shared.AddButton()}
			</Button>
		</form>
		<div class="w-full max-w-md md:max-w-4xl flex flex-col items-center justify-center gap-2">
			{#if servers}
				{#each [...servers
						.filter((s) => s.enabled)
						.sort((a, b) => a.url.localeCompare(b.url)), ...servers
						.filter((s) => !s.enabled)
						.sort((a, b) => a.url.localeCompare(b.url))] as server (server.id)}
					<div
						animate:flip={{ duration: 300 }}
						in:elementsend|local={{ key: server.id }}
						out:elementreceive|local={{ key: server.id }}
						class="w-full shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] bg-c-bg-secondary px-5 py-4 rounded-xl 
						flex flex-wrap justify-between items-center text-sm gap-8"
					>
						<div class="w-full md:w-auto flex flex-col gap-2 text-xs">
							<p
								class="w-full break-all {server.enabled
									? server.healthy
										? 'text-c-on-bg/75'
										: 'text-c-danger'
									: 'text-c-on-bg/40'}"
							>
								{server.url}
							</p>
							<p class="w-full text-c-on-bg/40 min-w-[6rem] max-w-full">
								{getRelativeDate(new Date(server.last_health_check_at).getTime(), now)}
							</p>
						</div>
						<div class="flex flex-wrap justify-end items-center gap-8 text-left">
							<div class="flex items-center gap-3">
								{#if !server.enabled}
									<IconHeart class="w-8 h-8 text-c-on-bg/40" />
								{:else if server.healthy}
									<IconHeart class="w-8 h-8 text-c-success" />
								{:else}
									<IconHeartBroken class="w-8 h-8 text-c-danger" />
								{/if}
								{#if server.enabled}
									<IconServer class="w-8 h-8 text-c-success" />
								{:else}
									<IconServerDisabled class="w-8 h-8 text-c-on-bg/40" />
								{/if}
							</div>
							<div class="flex items-center gap-3">
								<SubtleButton
									class=" min-w-[6.5rem]"
									loading={server.enableDisableLoading}
									onClick={() => {
										server.enabled ? disableServer(server.id) : enableServer(server.id);
									}}
								>
									<div class="relative">
										<div
											class="px-3 py-1 transition {server.enabled
												? 'text-c-danger'
												: 'text-c-success'} {server.enableDisableLoading
												? 'scale-0 opacity-0'
												: 'scale-100 opacity-100'}"
										>
											{server.enabled ? 'Disable' : 'Enable'}
										</div>
										<div
											class="w-full h-full absolute left-0 top-0 flex items-center justify-center 
											pointer-events-none transform transition {server.enableDisableLoading
												? 'scale-100 opacity-100'
												: 'scale-0 opacity-0'}"
										>
											<IconLoading
												class="w-5 h-5 {server.enableDisableLoading ? 'animate-spin-faster' : ''}"
											/>
										</div>
									</div>
								</SubtleButton>
								<SubtleButton
									loading={server.removeLoading}
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
												: 'scale-0 opacity-0'}"
										>
											<IconLoading
												class="w-5 h-5 {server.removeLoading ? 'animate-spin-faster' : ''}"
											/>
										</div>
									</div>
								</SubtleButton>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-c-on-bg/50 py-6.5">{$LL.Shared.LoadingParagraph()}</p>
			{/if}
		</div>
	</div>
</div>
