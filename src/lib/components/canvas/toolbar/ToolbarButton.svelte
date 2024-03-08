<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';

	export let label: string;
	export let icon: ConstructorOfATypedSvelteComponent;
	export let sizeClass = 'w-11 h-11';
	export let paddingClass = 'p-0.75';
	export let iconClass = '';
	export let disabled = false;

	export let onClick: () => void;
	export let onClickClass: string = '';

	let recentlyClicked = false;
	let onClickTimeout: NodeJS.Timeout;

	function _onClick() {
		recentlyClicked = true;
		onClick();
		clearTimeout(onClickTimeout);
		onClickTimeout = setTimeout(() => {
			recentlyClicked = false;
		}, 100);
	}
</script>

<button
	on:click={_onClick}
	class="{sizeClass} group relative flex items-center justify-center p-2"
	aria-label={label}
	{disabled}
>
	<ButtonHoverEffect {disabled} color="on-bg" noPadding {paddingClass} size="sm" />
	<svelte:component
		this={icon}
		class="h-full w-full transform transition duration-100 group-disabled:opacity-50 {recentlyClicked
			? onClickClass
			: ''} {iconClass}"
	/>
</button>
