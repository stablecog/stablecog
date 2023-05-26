<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import type { TKeyObject } from '$components/docs/collapsibleJSON/types';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let keyObject: TKeyObject;
	export let onButtonClicked: () => void;
</script>

<button
	aria-label="Toggle Code Block"
	disabled={keyObject.children === undefined}
	class="h-8 w-8 mr-1 group relative flex items-center justify-center {keyObject.children ===
	undefined
		? 'opacity-0'
		: ''}"
	on:click={onButtonClicked}
>
	<ButtonHoverEffect
		size="sm"
		noPadding
		color="on-bg"
		hoverFrom={keyObject.isOpen ? 'bottom' : 'top'}
	/>
	<IconChevronDown
		class="w-4.5 h-4.5 transition text-c-on-bg/50 not-touch:group-hover:text-c-on-bg transform {keyObject.isOpen
			? 'rotate-0'
			: '-rotate-90'}"
	/>
</button>
