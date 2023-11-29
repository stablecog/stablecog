<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let element: HTMLButtonElement;
	export let name: string;
	export let onClick: (() => void) | undefined;
	export let side: 'left' | 'right' = 'left';
	export let iconClass = 'w-8 h-8';
	export let wrapperClass = 'w-full h-full relative flex items-center rounded-xl justify-center';
	export let hasAnimation = true;
	export let count: number | undefined = undefined;
	export { classes as class };
	let classes = `absolute ${
		side === 'left' ? 'left-0' : 'right-0'
	} w-18 flex items-center justify-center top-1/2 transform -translate-y-1/2 h-64`;

	let isRecentlyClicked = false;
	let isRecentlyClickedTimeout: NodeJS.Timeout;

	function _onClick() {
		if (!onClick) return;
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
	disabled={onClick === undefined}
	class="z-10 group p-0.5 md:p-1 rounded-xl touch-manipulation max-h-full {classes}"
>
	<div class={wrapperClass}>
		{#if onClick}
			<ButtonHoverEffect hoverFrom={side === 'left' ? 'right' : 'left'} />
		{/if}
		<div class="max-w-full flex flex-col items-center">
			{#if count !== undefined}
				<p
					class="max-w-full transition duration-100 {onClick
						? 'not-touch:group-hover:text-c-primary'
						: ''} group-disabled:opacity-15 overflow-hidden overflow-ellipsis text-center text-xs font-semibold py-1 -mt-6 px-3"
				>
					{count}
				</p>
			{/if}
			<IconChevronDown
				strokeWidth={3}
				class="{iconClass} text-c-on-bg transition duration-100 transform {isRecentlyClicked &&
				hasAnimation
					? side === 'left'
						? '-translate-x-1.5'
						: 'translate-x-1.5'
					: ''} {side === 'left' ? 'rotate-90' : '-rotate-90'} {onClick
					? 'not-touch:group-hover:text-c-primary'
					: ''} group-disabled:opacity-15"
			/>
		</div>
	</div>
</button>
