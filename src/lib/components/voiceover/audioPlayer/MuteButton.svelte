<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconSoundOff from '$components/icons/IconSoundOff.svelte';
	import IconSoundOn from '$components/icons/IconSoundOn.svelte';

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
	class="relative rounded-lg group/mute-button {size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}"
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
				class="w-full h-full transition text-c-on-bg not-touch:group-hover/mute-button:text-c-primary"
			/>
		{:else}
			<IconSoundOn
				class="w-full h-full transition text-c-on-bg not-touch:group-hover/mute-button:text-c-primary"
			/>
		{/if}
	</div>
</button>
