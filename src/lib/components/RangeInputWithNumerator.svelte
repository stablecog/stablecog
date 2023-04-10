<script lang="ts">
	import Numerator from '$components/Numerator.svelte';
	import RangeInput from '$components/RangeInput.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let disabled: boolean;
	export let valueSize: 'sm' | 'md' = 'sm';
	export let numeratorFormatter: (value: number) => string = (value) => value.toString();
	export { classes as class };
	let classes = 'px-4 gap-3.5';

	let focused = false;
	let focusedTimeout: NodeJS.Timeout;
	const focusedTimeoutDuration = 400;

	let mouseDeltaY = 0;
	let mouseDeltaYResetTimeout: NodeJS.Timeout;
	const mouseDeltaYResetTimeoutDuration = 50;
	const deltaYCutoff = 500;

	const createFocusTimeout = () => {
		focused = true;
		clearTimeout(focusedTimeout);
		focusedTimeout = setTimeout(() => {
			focused = false;
		}, focusedTimeoutDuration);
	};

	const createMouseDeltaYResetTimeout = () => {
		clearTimeout(mouseDeltaYResetTimeout);
		mouseDeltaYResetTimeout = setTimeout(() => {
			mouseDeltaY = 0;
		}, mouseDeltaYResetTimeoutDuration);
	};
</script>

<div
	on:wheel={async (e) => {
		createFocusTimeout();
		createMouseDeltaYResetTimeout();
		if (mouseDeltaY === 0) {
			mouseDeltaY = mouseDeltaY + e.deltaY;
			if (e.deltaY > 0 && value < max) {
				value++;
			} else if (e.deltaY < 0 && value > min) {
				value--;
			}
		} else {
			mouseDeltaY = mouseDeltaY + e.deltaY;
			if (mouseDeltaY > deltaYCutoff && value < max) {
				value++;
				mouseDeltaY = 0;
			} else if (mouseDeltaY < -deltaYCutoff && value > min) {
				value--;
				mouseDeltaY = 0;
			}
		}
	}}
	class="range-input flex-1 min-w-0 flex items-center relative rounded-r-xl {classes}"
>
	<Numerator
		{min}
		{max}
		{step}
		{numeratorFormatter}
		bind:value
		class="{valueSize === 'md'
			? 'text-sm md:text-base px-0.5 md:px-1'
			: 'text-xs md:text-sm'} text-c-on-bg"
		showWheel={focused}
	/>
	<RangeInput
		{disabled}
		class="flex-1 h-12 md:h-13"
		classInput="rounded-lg"
		bind:value
		bind:focused
		{min}
		{max}
		{step}
	/>
</div>
