<script lang="ts">
	export let hoverFrom: 'top' | 'left' | 'bottom' | 'right' = 'bottom';
	export let size: 'lg' | 'md' | 'sm' | 'xs' = 'lg';
	export let color:
		| 'primary'
		| 'on-bg'
		| 'bg-secondary'
		| 'bg-tertiary'
		| 'secondary'
		| 'secondary-full'
		| 'primary-strong'
		| 'success'
		| 'danger' = 'primary';
	export let hovered = false;
	export let noPadding = false;
	export let noRounding = false;
	export let fullRounding = false;
	export let paddingClass: string | undefined = undefined;
	export let hasShadow = false;
	export let groupClass =
		'not-touch:group-hover:translate-x-0 not-touch:group-hover:translate-y-0 not-touch:group-hover:opacity-100';
	export let noFade = false;
</script>

<div
	class="w-full h-full absolute left-0 top-0 {paddingClass ? paddingClass : noPadding ? '' : 'p-1'}"
>
	<div
		class="w-full h-full relative z-0 overflow-hidden transition {hasShadow
			? 'shadow-md'
			: ''} {hasShadow
			? hovered
				? 'shadow-c-shadow/[var(--o-shadow-strong)]'
				: 'shadow-c-shadow/0'
			: ''} {noRounding
			? ''
			: fullRounding
			? 'rounded-full'
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
				? noFade
					? '-translate-x-full'
					: 'translate-x-1/2 opacity-0'
				: hoverFrom === 'left'
				? noFade
					? '-translate-x-full'
					: '-translate-x-1/2 opacity-0'
				: 'translate-y-full'}
      {color === 'on-bg'
				? 'bg-c-on-bg/8'
				: color === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: color === 'bg-tertiary'
				? 'bg-c-bg-tertiary'
				: color === 'secondary'
				? 'bg-c-secondary/12'
				: color === 'secondary-full'
				? 'bg-c-secondary'
				: color === 'primary-strong'
				? 'bg-c-primary/25'
				: color === 'success'
				? 'bg-c-success/12'
				: color === 'danger'
				? 'bg-c-danger/15'
				: 'bg-c-primary/15'} {noRounding
				? ''
				: fullRounding
				? 'rounded-full'
				: size === 'xs'
				? 'rounded'
				: size === 'sm'
				? 'rounded-md'
				: size === 'md'
				? 'rounded-lg'
				: 'rounded-xl'} {groupClass}"
		/>
	</div>
</div>
