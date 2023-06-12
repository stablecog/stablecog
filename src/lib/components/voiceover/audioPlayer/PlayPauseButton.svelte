<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconPause from '$components/icons/IconPause.svelte';
	import IconPlay from '$components/icons/IconPlay.svelte';

	export let onClick: () => void;
	export let isPaused: boolean;
	export let size: 'md' | 'lg' = 'md';
	export let element: HTMLButtonElement;
</script>

<button
	bind:this={element}
	on:click={onClick}
	class="relative rounded-lg group/play-button {size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}"
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/play-button:translate-x-0 not-touch:group-hover/play-button:translate-y-0 not-touch:group-hover/play-button:opacity-100"
		size="sm"
		noPadding
		color="primary"
	/>
	<div class="p-2">
		{#if isPaused}
			<IconPlay
				class="w-full h-full transition text-c-on-bg not-touch:group-hover/play-button:text-c-primary"
			/>
		{:else}
			<IconPause
				class="w-full h-full transition text-c-on-bg not-touch:group-hover/play-button:text-c-primary"
			/>
		{/if}
	</div>
</button>
