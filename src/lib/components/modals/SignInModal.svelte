<script lang="ts">
	import SignInCard from '$components/cards/SignInCard.svelte';
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
	class="fixed left-0 top-0 z-[10000] h-full w-full bg-c-barrier/80 px-3"
/>
<div
	use:portal={'body'}
	transition:fly={{ duration: 200, y: 50, easing: quadOut }}
	class="fixed left-0 top-0 z-[10001] flex h-full w-full flex-col items-center overflow-auto px-3 py-20"
>
	<div
		use:clickoutside={{
			callback: onClickoutside
		}}
		class="my-auto flex justify-center"
	>
		<SignInCard isModal={true} {redirectTo} />
	</div>
</div>
