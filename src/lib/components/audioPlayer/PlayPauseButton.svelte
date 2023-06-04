<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconPause from '$components/icons/IconPause.svelte';
	import IconPlay from '$components/icons/IconPlay.svelte';

	export let onClick: () => void;
	export let isPlaying: boolean;
	export let size: 'md' | 'lg' = 'md';
</script>

<button
	on:click={onClick}
	class="relative rounded-lg group {size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}"
>
	<ButtonHoverEffect size="sm" noPadding color="primary" />
	<div class="p-2">
		{#if isPlaying}
			<IconPause
				class="w-full h-full transition text-c-on-bg not-touch:group-hover:text-c-primary"
			/>
		{:else}
			<IconPlay
				class="w-full h-full transition text-c-on-bg not-touch:group-hover:text-c-primary"
			/>
		{/if}
	</div>
</button>
