<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconSoundOff from '$components/icons/IconSoundOff.svelte';
	import IconSoundOn from '$components/icons/IconSoundOn.svelte';
	import LL from '$i18n/i18n-svelte';

	export let onClick: () => void;
	export let isMuted: boolean;
	export let size: 'md' | 'lg' = 'md';
	export let element: HTMLButtonElement;
	export let disabled = false;
</script>

<button
	bind:this={element}
	on:click={onClick}
	{disabled}
	aria-label={isMuted ? $LL.Voiceover.UnmuteButton() : $LL.Voiceover.MuteButton()}
	class="group/mute-button relative touch-manipulation rounded-lg {size === 'lg'
		? 'h-12 w-12'
		: 'h-10 w-10'}"
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/mute-button:translate-x-0 not-touch:group-hover/mute-button:translate-y-0 not-touch:group-hover/mute-button:opacity-100"
		size={size === 'lg' ? 'md' : 'sm'}
		noPadding
		color="primary"
	/>
	<div class="p-2">
		{#if isMuted}
			<IconSoundOff
				class="h-full w-full text-c-on-bg transition not-touch:group-hover/mute-button:text-c-primary"
			/>
		{:else}
			<IconSoundOn
				class="h-full w-full text-c-on-bg transition not-touch:group-hover/mute-button:text-c-primary"
			/>
		{/if}
	</div>
</button>
