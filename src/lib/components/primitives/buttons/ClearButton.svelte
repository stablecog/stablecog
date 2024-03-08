<script lang="ts">
	import IconCancel from '$components/icons/IconCancel.svelte';

	export let show = false;
	export let onClick: () => void;
	export let type: 'sm' | 'md' = 'md';
	export let disabled = false;
	export let roundingClass = 'rounded-lg';
	export { classes as class };
	let classes = 'absolute right-0 top-0 rounded-r-xl';
</script>

<div
	class="h-full overflow-hidden rounded-r-xl transition-all {classes} {!show
		? 'pointer-events-none'
		: ''} {type === 'sm' ? 'w-10 md:w-12' : 'w-10 md:w-14'}"
>
	<button
		on:click|preventDefault={onClick}
		class="group/clearbutton relative z-0 flex h-full w-full touch-manipulation items-center justify-center overflow-hidden rounded-r-xl
			transition {show ? 'translate-x-0 opacity-100 focus:translate-x-0' : 'translate-x-full opacity-0'}"
		disabled={!show || disabled}
		type="button"
		aria-label="Clear"
	>
		<div
			class="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden {type === 'sm'
				? 'p-1'
				: 'p-0.75 md:p-1'}"
		>
			<div class="h-full w-full {roundingClass} relative z-0 overflow-hidden">
				<div
					class="h-full w-full origin-left {roundingClass} -translate-x-full transform bg-c-primary/25
						transition group-focus/clearbutton:translate-x-0
						group-active/clearbutton:translate-x-0 not-touch:group-hover/clearbutton:translate-x-0"
				/>
			</div>
		</div>
		<IconCancel
			class="{type === 'sm'
				? 'h-6 w-6'
				: 'h-6 w-6 md:h-7 md:w-7'} text-c-on-bg/25 transition group-focus/clearbutton:text-c-primary
				group-active/clearbutton:text-c-primary not-touch:group-hover/clearbutton:text-c-primary"
		/>
	</button>
</div>
