<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let close: () => void;
	export let serverUrlInputValue: string | undefined;

	const setServerUrl = () => {
		if (serverUrlInputValue) {
			try {
				let urlString = serverUrlInputValue;
				if (!urlString.startsWith('http')) {
					urlString = 'https://' + urlString;
				}
				let url = new URL(urlString).toString();
				if (url.endsWith('/')) {
					url = url.slice(0, -1);
				}
				if (!url) {
					throw new Error('Invalid URL');
				}
				serverUrl.set(url.toString());
				serverUrlInputValue = $serverUrl;
				close();
			} catch (error) {
				console.log(error);
			}
		}
	};
</script>

<div
	transition:fade={{ duration: 300, easing: quadOut }}
	class="w-screen h-screen flex items-center justify-center fixed left-0 
    top-0 bg-c-barrier/50 z-[100] p-4"
>
	<div
		transition:expandCollapse={{ duration: 200, easing: quadOut }}
		use:clickoutside={{ callback: close }}
		class="w-full max-w-xl bg-c-bg-secondary rounded-2xl 
      shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] overflow-hidden z-0 origin-top"
	>
		<div class="w-full flex flex-col px-3 py-4 md:p-5 gap-5">
			<p class="font-bold text-xl px-2">{$serverUrl ? 'Switch' : 'Set'} Server</p>
			<form
				on:submit|preventDefault={setServerUrl}
				class="w-full relative flex flex-col md:flex-row items-center justify-center gap-3"
			>
				<div class="w-full md:w-auto flex-1 min-w-0 relative">
					<div
						class="w-full h-full rounded-xl bg-c-bg-tertiary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]  overflow-hidden absolute left-0 top-0"
					/>
					<input
						bind:value={serverUrlInputValue}
						type="text"
						placeholder="Set server URL"
						class="w-full overflow-hidden overflow-ellipsis bg-transparent relative px-6 md:px-8 py-5 rounded-xl transition 
			        focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
							? 'enabled:hover:ring-2'
							: ''}"
					/>
				</div>
				<Button class="w-full md:w-auto">Set</Button>
			</form>
		</div>
	</div>
</div>
