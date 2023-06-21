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
	class="transition-all h-full overflow-hidden rounded-r-xl {classes} {!show
		? 'pointer-events-none'
		: ''} {type === 'sm' ? 'w-10 md:w-12' : 'w-10 md:w-14'}"
>
	<button
		on:click|preventDefault={onClick}
		class="touch-manipulation w-full h-full relative z-0 rounded-r-xl overflow-hidden flex items-center justify-center group/clearbutton
			transition {show ? 'focus:translate-x-0 translate-x-0 opacity-100' : 'translate-x-full opacity-0'}"
		disabled={!show || disabled}
		type="button"
		aria-label="Clear"
	>
		<div
			class="w-full h-full absolute left-0 top-0 pointer-events-none overflow-hidden {type === 'sm'
				? 'p-1'
				: 'p-0.75 md:p-1'}"
		>
			<div class="w-full h-full {roundingClass} relative z-0 overflow-hidden">
				<div
					class="w-full h-full origin-left {roundingClass} transition transform -translate-x-full
						bg-c-primary/25 group-focus/clearbutton:translate-x-0
						group-active/clearbutton:translate-x-0 not-touch:group-hover/clearbutton:translate-x-0"
				/>
			</div>
		</div>
		<IconCancel
			class="{type === 'sm'
				? 'w-6 h-6'
				: 'w-6 h-6 md:w-7 md:h-7'} transition text-c-on-bg/25 group-focus/clearbutton:text-c-primary
				group-active/clearbutton:text-c-primary not-touch:group-hover/clearbutton:text-c-primary"
		/>
	</button>
</div>
