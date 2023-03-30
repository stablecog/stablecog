<script lang="ts">
	import { browser } from '$app/environment';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import SettingsPanel from '$routes/create/SettingsPanel.svelte';
	import { activeGeneration, generations } from '$ts/stores/user/generation';
	import { windowHeight } from '$ts/stores/window';
	import { onDestroy, onMount } from 'svelte';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import PromptBar from '$routes/create/PromptBar.svelte';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { portal } from 'svelte-portal';
	import { clickoutside } from '$ts/actions/clickoutside';
	import SignInCard from '$components/SignInCard.svelte';
	import { page } from '$app/stores';

	let topbarHeight: number;
	let leftPanelHeight: number;

	let isCheckCompleted = false;
	let isSignInModalOpen = false;

	function openSignInModal() {
		isSignInModalOpen = true;
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration === undefined) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			return;
		}
		if (key === 'ArrowLeft' || key === 'ArrowRight') {
			const outputs = $activeGeneration.outputs;
			const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
			if (index === -1) return;
			const addition = key === 'ArrowLeft' ? -1 : 1;
			const newIndex =
				(index + addition + $activeGeneration.outputs.length) % $activeGeneration.outputs.length;
			activeGeneration.set({
				...$activeGeneration,
				selected_output: $activeGeneration.outputs[newIndex]
			});
		}
	}

	onMount(() => {
		if (!browser) return;
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100%';
		isCheckCompleted = true;
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<div
	style="height: {$windowHeight && $navbarHeight ? $windowHeight - $navbarHeight + 'px' : '100vh'}"
	class="w-full flex flex-row items-stretch overflow-hidden"
>
	<div bind:clientHeight={leftPanelHeight} class="flex-1 h-full flex flex-col px-5 relative">
		<div bind:clientHeight={topbarHeight} class="w-full pt-3">
			<PromptBar {isCheckCompleted} {openSignInModal} />
		</div>
		<div
			style="height: {leftPanelHeight - topbarHeight}px"
			class="w-full flex-1 flex flex-col py-5"
		>
			<div
				class="w-full min-h-full rounded-3xl px-2 py-2 pb-6 flex flex-wrap overflow-auto bg-c-bg
        shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] border-4 border-c-bg-secondary"
			>
				{#if $generations && $generations.length > 0}
					{#each $generations as generation}
						{#if !generation.completed_at}
							{#each Array(generation.num_outputs) as output, i}
								<div class="p-0.5 w-1/4">
									<div class="w-full h-auto relative">
										<ImagePlaceholder width={generation.width} height={generation.height} />
										<div
											class="absolute flex items-center justify-center w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
										>
											<IconAnimatedSpinner class="text-c-on-bg/50 w-12 h-12" loading={true} />
										</div>
									</div>
								</div>
							{/each}
						{:else}
							{#each generation.outputs as output, i}
								<div class="p-0.5 w-1/4">
									<div class="w-full h-auto relative">
										<ImagePlaceholder width={generation.width} height={generation.height} />
										<div
											class="absolute w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
										>
											<GenerationImage
												generation={{ ...generation, selected_output: output }}
												useUpscaledImage
												cardType="generate"
											/>
										</div>
									</div>
								</div>
							{/each}
						{/if}
					{/each}
				{:else}
					<div class="m-auto">Create a generation</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="w-80 lg:w-96 h-full pr-5 pb-5 pt-2.5">
		<SettingsPanel />
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="generate" />
{/if}

{#if isSignInModalOpen && !$page.data.session?.user.id}
	<div
		use:portal={'body'}
		transition:fade|local={{ duration: 300, easing: quadOut }}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
	/>
	<div
		use:portal={'body'}
		transition:fly|local={{ duration: 200, y: 50, easing: quadOut }}
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
	>
		<div
			use:clickoutside={{ callback: () => (isSignInModalOpen = false) }}
			class="flex justify-center my-auto"
		>
			<SignInCard isModal={true} redirectTo="/create" />
		</div>
	</div>
{/if}
