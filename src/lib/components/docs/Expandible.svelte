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

<Collapsible.Root bind:open={isRootOpen} class="w-full flex flex-col items-start {classes}">
	<Collapsible.Trigger
		class="max-w-full flex gap-1 items-center group border-2 border-c-bg-secondary 
		not-touch:hover:border-c-primary/25 transition px-3 py-1.5 rounded-lg group 
		relative overflow-hidden z-0"
	>
		<ButtonHoverEffect noPadding noRounding hoverFrom="left" />
		<IconChevronDown
			class="{color === 'tertiary'
				? 'text-c-tertiary'
				: 'text-c-on-bg/75'} transform transition -ml-1 w-5 h-5 not-touch:group-hover:text-c-primary {isRootOpen
				? 'rotate-0'
				: '-rotate-90'}"
		/>
		<p
			class="{color === 'tertiary'
				? 'text-c-tertiary'
				: 'text-c-on-bg/75'} flex-1 min-w-0 overflow-hidden text-left
				not-touch:group-hover:text-c-primary font-medium"
		>
			{titleExpanded !== undefined && isRootOpen ? titleExpanded : title}
		</p>
	</Collapsible.Trigger>
	<Collapsible.Content class="w-full flex items-stretch gap-4 pt-2" transition={true}>
		<div class="bg-c-bg-secondary rounded-full w-2px" />
		<div class="flex-1 min-w-0 overflow-hidden {yPadding ? 'py-3' : ''}">
			<slot />
		</div>
	</Collapsible.Content>
</Collapsible.Root>
