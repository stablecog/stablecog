<script lang="ts">
	import SignInCard from '$components/SignInCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { onDestroy } from 'svelte';
	import { portal } from 'svelte-portal';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let redirectTo: string;
	export let onClickoutside: () => void;

	onDestroy(() => {
		onClickoutside();
	});

	function onKeyDown(e: any) {
		if (e.key === 'Escape') {
			onClickoutside();
		}
	}
</script>

<svelte:body on:keydown={onKeyDown} />

<div
	use:portal={'body'}
	transition:fade={{ duration: 300, easing: quadOut }}
	class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
/>
<div
	use:portal={'body'}
	transition:fly={{ duration: 200, y: 50, easing: quadOut }}
	class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
>
	<div
		use:clickoutside={{
			callback: onClickoutside
		}}
		class="flex justify-center my-auto"
	>
		<SignInCard isModal={true} {redirectTo} />
	</div>
</div>
