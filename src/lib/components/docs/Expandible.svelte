<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { Collapsible } from 'radix-svelte';

	export let title: string;
	export let titleExpanded: string | undefined = undefined;
	export { classes as class };
	export let color: 'on-bg' | 'tertiary' = 'on-bg';
	export let yPadding = false;
	let classes = 'mt-4';

	let isRootOpen = false;
</script>

<Collapsible.Root bind:open={isRootOpen} class="flex w-full flex-col items-start {classes}">
	<Collapsible.Trigger
		class="group group relative z-0 flex max-w-full items-center 
		gap-1 overflow-hidden rounded-lg border-2 border-c-bg-secondary px-3 
		py-1.5 transition not-touch:hover:border-c-primary/25"
	>
		<ButtonHoverEffect noPadding noRounding hoverFrom="left" />
		<IconChevronDown
			class="{color === 'tertiary'
				? 'text-c-tertiary'
				: 'text-c-on-bg/75'} -ml-1 h-5 w-5 transform transition not-touch:group-hover:text-c-primary {isRootOpen
				? 'rotate-0'
				: '-rotate-90'}"
		/>
		<p
			class="{color === 'tertiary'
				? 'text-c-tertiary'
				: 'text-c-on-bg/75'} min-w-0 flex-1 overflow-hidden text-left
				font-medium not-touch:group-hover:text-c-primary"
		>
			{titleExpanded !== undefined && isRootOpen ? titleExpanded : title}
		</p>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex w-full items-stretch gap-4 pt-2" transition={true}>
		<div class="w-2px rounded-full bg-c-bg-secondary" />
		<div class="min-w-0 flex-1 overflow-hidden {yPadding ? 'py-3' : ''}">
			<slot />
		</div>
	</Collapsible.Content>
</Collapsible.Root>
