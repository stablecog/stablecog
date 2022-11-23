<script lang="ts">
	import IconCancel from '$components/icons/IconCancel.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let show = false;
	export let onClick: () => void;
	export let type: 'sm' | 'md' = 'md';
	export let disabled = false;
</script>

<div
	class="absolute right-0 top-0 h-full transition-all overflow-hidden rounded-r-xl {!show
		? 'pointer-events-none'
		: ''} {type === 'sm' ? 'w-10 md:w-12' : 'w-12 md:w-16'}"
>
	<button
		on:click|preventDefault={onClick}
		class="w-full h-full relative rounded-r-xl flex items-center justify-center group-1
			transition {show ? 'focus:translate-x-0 translate-x-0 opacity-100' : 'translate-x-full opacity-0'}"
		disabled={!show || disabled}
		type="button"
	>
		<div
			class="w-full h-full absolute left-0 top-0 pointer-events-none {type === 'sm'
				? 'p-1'
				: 'p-1.5'}"
		>
			<div class="w-full h-full rounded-lg relative z-0 overflow-hidden">
				<div
					class="w-full h-full origin-left rounded-lg transition transform -translate-x-full
						bg-c-primary/25 group-1-focus:translate-x-0 {!$isTouchscreen
						? 'group-1-hover:translate-x-0'
						: 'group-1-active:translate-x-0'}"
				/>
			</div>
		</div>
		<IconCancel
			class="{type === 'sm'
				? 'w-6 h-6'
				: 'w-7 h-7'} transition text-c-on-bg/15 group-1-focus:text-c-primary {!$isTouchscreen
				? 'group-1-hover:text-c-primary'
				: 'group-1-active:text-c-primary'}"
		/>
	</button>
</div>
