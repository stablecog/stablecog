<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let hoverFrom: 'top' | 'left' | 'bottom' | 'right' = 'bottom';
	export let size: 'lg' | 'md' | 'sm' | 'xs' = 'lg';
	export let color: 'primary' | 'on-bg' | 'bg-secondary' | 'secondary' | 'primary-strong' =
		'primary';
	export let hovered = false;
	export let noPadding = false;
	export let noRounding = false;
	export let paddingClass: string | undefined = undefined;
</script>

<div
	transition:fade|local={{ duration: 200, easing: quadOut }}
	class="w-full h-full absolute left-0 top-0 {paddingClass
		? paddingClass
		: !noPadding
		? 'p-1'
		: ''}"
>
	<div
		class="w-full h-full relative z-0 overflow-hidden {noRounding
			? ''
			: size === 'xs'
			? 'rounded'
			: size === 'sm'
			? 'rounded-md'
			: size === 'md'
			? 'rounded-lg'
			: 'rounded-xl'}"
	>
		<div
			class="w-full h-full origin-left transition transform {hovered
				? 'translate-x-0 translate-y-0'
				: hoverFrom === 'top'
				? '-translate-y-full'
				: hoverFrom === 'right'
				? 'translate-x-1/2 opacity-0'
				: hoverFrom === 'left'
				? '-translate-x-1/2 opacity-0'
				: 'translate-y-full'}
      {color === 'on-bg'
				? 'bg-c-on-bg/10'
				: color === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: color === 'secondary'
				? 'bg-c-secondary/15'
				: color === 'primary-strong'
				? 'bg-c-primary/25'
				: 'bg-c-primary/15'} {noRounding
				? ''
				: size === 'xs'
				? 'rounded'
				: size === 'sm'
				? 'rounded-md'
				: size === 'md'
				? 'rounded-lg'
				: 'rounded-xl'} {!$isTouchscreen
				? 'group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100'
				: ''}"
		/>
	</div>
</div>
