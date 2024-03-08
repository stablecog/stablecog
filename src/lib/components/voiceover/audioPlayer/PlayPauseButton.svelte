<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconPause from '$components/icons/IconPause.svelte';
	import IconPlay from '$components/icons/IconPlay.svelte';
	import LL from '$i18n/i18n-svelte';

	export let onClick: () => void;
	export let isPaused: boolean;
	export let isPlaying: boolean;
	export let size: 'md' | 'lg' = 'md';
	export let element: HTMLButtonElement;
	export let disabled = false;

	let hasBeenLoadingForAWhileTimeout: NodeJS.Timeout | undefined = undefined;
	let hasBeenLoadingForAWhile = false;

	$: if (!isPaused && !isPlaying) {
		clearTimeout(hasBeenLoadingForAWhileTimeout);
		hasBeenLoadingForAWhileTimeout = setTimeout(() => {
			hasBeenLoadingForAWhile = true;
		}, 500);
	} else {
		clearTimeout(hasBeenLoadingForAWhileTimeout);
		hasBeenLoadingForAWhile = false;
	}
</script>

<button
	bind:this={element}
	on:click={onClick}
	{disabled}
	aria-label={isPaused ? $LL.Voiceover.PlayButton() : $LL.Voiceover.PauseButton()}
	class="group/play-button relative touch-manipulation rounded-lg {size === 'lg'
		? 'h-12 w-12'
		: 'h-10 w-10'}"
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/play-button:translate-x-0 not-touch:group-hover/play-button:translate-y-0 not-touch:group-hover/play-button:opacity-100"
		size={size === 'lg' ? 'md' : 'sm'}
		noPadding
		color="primary"
	/>
	<div class="p-2">
		{#if isPaused}
			<IconPlay
				class="h-full w-full text-c-on-bg transition not-touch:group-hover/play-button:text-c-primary"
			/>
		{:else}
			<Morpher class="h-full w-full" morphed={!isPaused && !isPlaying && hasBeenLoadingForAWhile}>
				<div slot="0">
					<IconPause
						class="h-full w-full text-c-on-bg transition not-touch:group-hover/play-button:text-c-primary"
					/>
				</div>
				<div class="h-full w-full" slot="1">
					<IconAnimatedSpinner
						class="h-full w-full not-touch:group-hover/play-button:text-c-primary"
						loading={!isPaused && !isPlaying && hasBeenLoadingForAWhile}
					/>
				</div>
			</Morpher>
		{/if}
	</div>
</button>
