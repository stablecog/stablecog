<script lang="ts">
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let onClickoutside: () => void;
	export let serverUrlInputValue: string | undefined;
	export let setServerUrl: () => void;
</script>

<div
	transition:fade={{ duration: 300, easing: quadOut }}
	class="w-screen h-screen flex items-center justify-center fixed left-0 
    top-0 bg-c-barrier/50 z-[100] p-4"
>
	<div
		transition:expandCollapse={{ duration: 200, easing: quadOut }}
		use:clickoutside={{ callback: onClickoutside }}
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
						class="w-full bg-transparent relative px-6 md:px-8 py-5 rounded-xl transition 
			        focus:ring-2 focus:ring-c-primary/50 ring-0 ring-c-primary/25 placeholder:text-c-on-bg/30 {!$isTouchscreen
							? 'enabled:hover:ring-2'
							: ''}"
					/>
				</div>
				<button
					class="w-full md:w-auto px-8 relative flex items-center justify-center text-center py-5 
            shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]  text-c-on-primary rounded-xl font-bold gap-2 
            overflow-hidden z-0 group bg-c-primary"
				>
					<div
						class="w-full h-full origin-left rounded-xl transition transform -translate-x-full 
              bg-c-secondary absolute left-0 top-0 {!$isTouchscreen
							? 'group-enabled:group-hover:translate-x-0'
							: ''}"
					/>
					<p class="relative">Set</p>
				</button>
			</form>
		</div>
	</div>
</div>
