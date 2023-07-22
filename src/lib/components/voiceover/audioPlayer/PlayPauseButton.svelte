<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
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
	class="touch-manipulation relative rounded-lg group/play-button {size === 'lg'
		? 'w-12 h-12'
		: 'w-10 h-10'}"
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
				class="w-full h-full transition text-c-on-bg not-touch:group-hover/play-button:text-c-primary"
			/>
		{:else}
			<Morpher class="w-full h-full" morphed={!isPaused && !isPlaying && hasBeenLoadingForAWhile}>
				<div slot="0">
					<IconPause
						class="w-full h-full transition text-c-on-bg not-touch:group-hover/play-button:text-c-primary"
					/>
				</div>
				<div class="w-full h-full" slot="1">
					<IconAnimatedSpinner
						class="w-full h-full not-touch:group-hover/play-button:text-c-primary"
						loading={!isPaused && !isPlaying && hasBeenLoadingForAWhile}
					/>
				</div>
			</Morpher>
		{/if}
	</div>
</button>
