<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import LL from '$i18n/i18n-svelte';
	import Sidebar from '$routes/guide/Sidebar.svelte';
	import { sidebar } from '$routes/guide/constants';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isDrawerOpen } from '$ts/stores/isDrawerOpen';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { portal } from 'svelte-portal';
	import { quadIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
</script>

<div style="min-height: 100vh; min-height: 100svh" class="w-full flex items-stretch relative">
	<Sidebar class="w-64 lg:w-72 hidden md:flex" {sidebar} />
	<div class="flex-1 overflow-hidden">
		<slot />
	</div>
	<div class="w-64 lg:w-72 hidden xl:block" />
</div>

{#if $isDrawerOpen && $windowWidth < mdBreakpoint}
	<div
		transition:fade={{ duration: 200, easing: quadIn }}
		use:portal={'body'}
		style="height: 100vh; height: 100svh"
		class="w-full md:hidden md:pointer-events-none fixed left-0 top-0 bg-c-barrier/80 z-100"
	/>
{/if}
<div
	use:clickoutside={{
		callback: () => {
			isDrawerOpen.set(false);
		}
	}}
	style={$windowHeight ? `height: ${$windowHeight}px` : 'height: 100vh; height: 100svh'}
	use:portal={'body'}
	class="fixed md:hidden md:pointer-events-none w-4/5 bg-c-bg rounded-r-3xl ring-2 ring-c-bg-secondary left-0 top-0 z-[101] 
	shadow-drawer shadow-c-shadow/[var(--o-shadow-stronger)] transition {$isDrawerOpen
		? 'translate-x-0'
		: 'pointer-events-none -translate-x-[calc(100%+4px)]'} overflow-hidden"
>
	<div class="w-full flex flex-row justify-between gap-5 items-stretch">
		<p
			class="flex-1 min-w-0 overflow-hidden overflow-ellipsis px-5 font-bold text-2xl py-4 bg-c-bg relative z-10"
		>
			{$LL.Guide.PageTitle()}
		</p>
		<button
			on:click={() => isDrawerOpen.set(false)}
			class="w-14 flex items-center justify-center group overflow-hidden relative z-0"
		>
			<ButtonHoverEffect size="md" noRounding noPadding hoverFrom="right" />
			<IconCancel class="text-c-on-bg/40 w-7 h-7 transition group-hover:text-c-primary" />
		</button>
	</div>
	<div class="w-full h-2px bg-c-bg-secondary" />
	<Sidebar class="w-full h-full -mt-2" style="" {sidebar} />
</div>
