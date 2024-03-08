<script lang="ts">
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import ToggleIndicator from '$components/primitives/ToggleIndicator.svelte';

	export let isToggled: boolean;
	export { classes as class };
	export let disabled = false;
	export let disabledIsToggled: boolean | undefined = undefined;
	export let hasTitle = false;
	export let text: string | undefined;
	let classes = 'w-full';
</script>

<TabBarWrapper class={classes}>
	{#if hasTitle}
		<div class="flex self-stretch text-c-on-bg/50">
			<slot name="title" />
		</div>
		<div class="-ml-px w-2px self-stretch">
			<div class="h-full w-full bg-c-bg-secondary" />
		</div>
	{/if}
	<button
		class="group relative flex min-w-0 flex-1 touch-manipulation items-center justify-between gap-2 self-stretch rounded-xl p-3.5
		disabled:cursor-not-allowed disabled:opacity-50"
		type="button"
		{disabled}
		on:click={() => (isToggled = !isToggled)}
	>
		{#if !disabled}
			<div
				class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden rounded-xl transition-all duration-150"
			>
				<div class="absolute left-0 top-0 flex h-full w-[200%] items-center justify-center">
					<div
						class="aspect-square w-full origin-left -translate-x-full transform rounded-full bg-c-primary/10 opacity-0
						transition not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
		{/if}
		{#if text}
			<p
				class="relative flex-shrink overflow-hidden
				overflow-ellipsis break-words pl-1
				pr-4 text-left text-base font-medium transition group-enabled:not-touch:group-hover:text-c-primary"
			>
				{text}
			</p>
		{/if}
		<ToggleIndicator isToggled={isToggled || (disabled && disabledIsToggled)} color="on-bg" />
	</button>
</TabBarWrapper>
