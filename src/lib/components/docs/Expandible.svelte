<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let titleExpanded: string | undefined = undefined;
	export { classes as class };
	export let color: 'on-bg' | 'tertiary' = 'on-bg';
	export let yPadding = false;
	let classes = 'mt-4';

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		defaultOpen: false
	});
</script>

<div {...$root} use:root class="w-full flex flex-col items-start {classes}">
	<button
		{...$trigger}
		use:trigger
		class="max-w-full flex gap-1 items-center group border-2 border-c-bg-secondary
		not-touch:hover:border-c-primary/25 transition px-3 py-1.5 rounded-lg group
		relative overflow-hidden z-0"
	>
		<ButtonHoverEffect noPadding noRounding hoverFrom="left" />
		<IconChevronDown
			class="{color === 'tertiary'
				? 'text-c-tertiary'
				: 'text-c-on-bg/75'} transform transition -ml-1 w-5 h-5 not-touch:group-hover:text-c-primary {$open
				? 'rotate-0'
				: '-rotate-90'}"
		/>
		<p
			class="{color === 'tertiary'
				? 'text-c-tertiary'
				: 'text-c-on-bg/75'} flex-1 min-w-0 overflow-hidden text-left
				not-touch:group-hover:text-c-primary font-medium"
		>
			{titleExpanded !== undefined && $open ? titleExpanded : title}
		</p>
	</button>
	{#if $open}
		<div
			{...$content}
			use:content
			transition:slide={{ duration: 250 }}
			class="w-full flex items-stretch gap-4 pt-2"
		>
			<div class="bg-c-bg-secondary rounded-full w-2px" />
			<div class="flex-1 min-w-0 overflow-hidden {yPadding ? 'py-3' : ''}">
				<slot />
			</div>
		</div>
	{/if}
</div>
