<script lang="ts">
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';

	export let isToggled: boolean;
	export let onClick: () => void;
	export { classes as class };
	export let disabled = false;
	let classes = '';
</script>

<TabBarWrapper class={classes}>
	<div class="self-stretch flex text-c-on-bg/50">
		<slot name="title" />
	</div>
	<div class="w-2px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary" />
	</div>
	<button
		class="touch-manipulation self-stretch p-3.5 relative group rounded-r-xl"
		type="button"
		on:click={onClick}
		{disabled}
	>
		<div class="w-full h-full absolute left-0 top-0 rounded-r-lg">
			<div class="w-full h-full overflow-hidden relative z-0 rounded-r-lg">
				<div
					class="w-full h-full origin-left rounded-r-lg transition transform translate-y-full
					bg-c-bg-secondary not-touch:group-hover:translate-y-0"
				/>
			</div>
		</div>
		<ToggleIndicator {isToggled} color="on-bg" />
	</button>
</TabBarWrapper>
