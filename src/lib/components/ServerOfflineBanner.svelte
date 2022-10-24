<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import IconWarning from '$components/icons/IconWarning.svelte';
	import { PUBLIC_DEFAULT_SERVER_URL } from '$env/static/public';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		currentServer,
		currentServerHealthStatus,
		defaultServer,
		defaultServerHealthStatus
	} from '$ts/stores/serverHealth';
	import { serverUrl } from '$ts/stores/serverUrl';

	const switchToDefaultServer = () => {
		serverUrl.set(PUBLIC_DEFAULT_SERVER_URL);
		localStorage.removeItem('serverUrl');
		currentServer.set($defaultServer);
		currentServerHealthStatus.set($defaultServerHealthStatus);
	};
</script>

<div transition:expandCollapse|local={{ duration: 300 }} class="overflow-hidden relative z-0">
	<div class="pb-7 flex flex-col items-center">
		<div
			class="py-4 px-4 text-xs md:text-sm gap-3 flex items-center justify-start max-w-[34rem] rounded-xl bg-c-danger/8 text-c-danger"
		>
			<IconWarning class="w-6 h-6" />
			<p class="flex-1">
				The server seems to be offline. You might want to refresh the page or set another server in
				the settings.
			</p>
		</div>
		{#if PUBLIC_DEFAULT_SERVER_URL && $serverUrl !== PUBLIC_DEFAULT_SERVER_URL && ($defaultServerHealthStatus === 'healthy' || $defaultServerHealthStatus === 'loading')}
			<div transition:expandCollapse|local={{ duration: 300 }} class="overflow-hidden relative z-0">
				<div class="pt-3.5">
					<Button size="sm" onClick={switchToDefaultServer}>Switch to Default Server</Button>
				</div>
			</div>
		{/if}
	</div>
</div>
