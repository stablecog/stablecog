<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let element: HTMLButtonElement;
	export let name: string;
	export let onClick: () => void;
	export let side: 'left' | 'right' = 'left';
	export { classes as class };
	let classes = `absolute ${
		side === 'left' ? 'left-0' : 'right-0'
	} w-18 flex items-center justify-center top-1/2 transform -translate-y-1/2 h-64`;
	export let iconClass = 'w-7 h-7';
	let isRecentlyClicked = false;
	let isRecentlyClickedTimeout: NodeJS.Timeout;

	function _onClick() {
		isRecentlyClicked = true;
		clearTimeout(isRecentlyClickedTimeout);
		isRecentlyClickedTimeout = setTimeout(() => {
			isRecentlyClicked = false;
		}, 100);
		onClick();
	}
</script>

<button
	aria-label={name}
	bind:this={element}
	on:click={_onClick}
	class="z-10 group p-1 rounded-xl max-h-full {classes}"
>
	<div class="w-full h-full relative flex items-center rounded-xl justify-center">
		<ButtonHoverEffect hoverFrom={side === 'left' ? 'right' : 'left'} />
		<IconChevronDown
			class="{iconClass} text-c-on-bg transition duration-100 transform {isRecentlyClicked
				? side === 'left'
					? '-translate-x-1.5'
					: 'translate-x-1.5'
				: ''} {side === 'left' ? 'rotate-90' : '-rotate-90'} {!$isTouchscreen
				? 'group-hover:text-c-primary'
				: ''}"
		/>
	</div>
</button>