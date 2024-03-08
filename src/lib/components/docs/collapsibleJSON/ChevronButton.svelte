<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import type { TKeyObject } from '$components/docs/collapsibleJSON/types';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let keyObject: TKeyObject;
	export let onButtonClicked: () => void;
</script>

<button
	aria-label="Toggle Code Block"
	disabled={keyObject.children === undefined}
	class="group relative mr-1 flex h-8 w-8 items-center justify-center {keyObject.children ===
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
		class="h-4.5 w-4.5 transform text-c-on-bg/50 transition not-touch:group-hover:text-c-on-bg {keyObject.isOpen
			? 'rotate-0'
			: '-rotate-90'}"
	/>
</button>
