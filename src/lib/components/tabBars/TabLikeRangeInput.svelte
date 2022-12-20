<script lang="ts">
	import Numerator from '$components/Numerator.svelte';
	import RangeInput from '$components/RangeInput.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import { guidanceScaleMax, guidanceScaleMin } from '$ts/constants/main';

	export let value: number;
	export let min: number;
	export let max: number;
	export let disabled: boolean;
	export { classes as class };
	let classes = '';

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

<TabBarWrapper class={classes}>
	<div class="self-stretch flex text-c-on-bg/30">
		<slot name="title" />
	</div>
	<div class="w-2px mr-px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary transition" />
	</div>
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
		class="range-input flex-1 min-w-0 flex items-center relative rounded-r-xl pl-4 pr-4 gap-3.5"
	>
		<Numerator
			min={guidanceScaleMin}
			max={guidanceScaleMax}
			bind:value
			class="text-xs md:text-sm text-c-on-bg/75"
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
		/>
	</div>
</TabBarWrapper>

<style>
	.range-input {
		--track-bg: rgba(var(--c-bg-tertiary));
		--track-bg-progressed: rgba(var(--c-on-bg-secondary));
		--track-bg-progressed-active: rgba(var(--c-primary));
		--track-height: 0.5rem;
		--track-radius: 9999px;
		--thumb-size: 1.5rem;
		--thumb-bg: rgba(var(--c-on-bg-secondary));
		--thumb-bg-active: rgba(var(--c-primary));
		--thumb-radius: 9999px;
		--thumb-shadow: 0 0 0 0rem rgba(var(--c-on-bg-secondary) / 0.35),
			0 0.15rem 0.45rem 0 rgba(var(--c-shadow) / var(--o-shadow-stronger));
		--thumb-shadow-hovered: 0 0 0 0.5rem rgba(var(--c-on-bg-secondary) / 0.35),
			0 0.15rem 0.45rem 0 rgba(var(--c-shadow) / var(--o-shadow-stronger));
		--thumb-shadow-active: 0 0 0 0.3rem rgba(var(--c-primary) / 0.35),
			0 0.15rem 0.45rem 0 rgba(var(--c-shadow) / var(--o-shadow-stronger));
		--transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
