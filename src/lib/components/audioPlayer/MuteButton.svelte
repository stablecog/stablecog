<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconSoundOff from '$components/icons/IconSoundOff.svelte';
	import IconSoundOn from '$components/icons/IconSoundOn.svelte';

	export let onClick: () => void;
	export let isMuted: boolean;
	export let size: 'md' | 'lg' = 'md';
</script>

<button
	on:click={onClick}
	class="relative rounded-lg group {size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}"
>
	<ButtonHoverEffect size="sm" noPadding color="primary" />
	<div class="p-2">
		{#if isMuted}
			<IconSoundOff
				class="w-full h-full transition text-c-on-bg not-touch:group-hover:text-c-primary"
			/>
		{:else}
			<IconSoundOn
				class="w-full h-full transition text-c-on-bg not-touch:group-hover:text-c-primary"
			/>
		{/if}
	</div>
</button>
