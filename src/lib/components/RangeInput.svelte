<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let value: number;
	export let min: number;
	export let max: number;
	export { classes as class };
	let classes = '';
	export let classInput = '';

	$: progress = (value - min) / (max - min);
</script>

<div class="relative {classes}">
	<input
		class="transition range-input {!$isTouchscreen ? 'range-input-not-touch' : ''} {classInput}"
		style="width: 100%; background: transparent; position: relative; z-index: 1"
		bind:value
		type="range"
		{min}
		{max}
	/>
	<div class="track">
		<div class="track-progressed" style="width: calc({progress * 100}%);" />
	</div>
</div>

<style>
	.track {
		pointer-events: none;
		width: 100%;
		height: var(--track-height);
		background: var(--track-bg);
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		border-radius: var(--track-radius);
		z-index: 0;
		overflow: hidden;
	}
	.track-progressed {
		height: 100%;
		background: var(--track-bg-progressed);
		transition: var(--transition);
	}
	.range-input:active + div > div {
		background: var(--track-bg-progressed-active);
	}
	.range-input {
		width: 100%;
		height: 100%;
		-webkit-appearance: none;
		cursor: pointer;
	}
	.range-input:focus {
		outline: none;
	}
	.range-input:active {
		cursor: grabbing;
	}
	.range-input::-webkit-slider-runnable-track {
		width: 100%;
		height: var(--thumb-size);
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	.range-input::-webkit-slider-thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: var(--thumb-radius);
		box-shadow: var(--thumb-shadow);
		background: var(--thumb-bg);
		-webkit-appearance: none;
		transition: var(--transition);
		border-style: none;
	}
	.range-input::-moz-range-track {
		width: 100%;
		height: var(--thumb-size);
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	.range-input::-moz-range-thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: var(--thumb-radius);
		box-shadow: var(--thumb-shadow);
		background: var(--thumb-bg);
		transition: var(--transition);
		border-style: none;
	}
	.range-input::-ms-track {
		width: 100%;
		height: var(--thumb-size);
		background: transparent;
		border-color: transparent;
		color: transparent;
	}
	.range-input::-ms-fill-lower {
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	.range-input::-ms-fill-upper {
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	.range-input::-ms-thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: var(--thumb-radius);
		box-shadow: var(--thumb-shadow);
		background: var(--thumb-bg);
		transition: var(--transition);
		border-style: none;
	}
	.range-input:active::-webkit-slider-thumb {
		background: var(--thumb-bg-active);
	}
	.range-input:active::-moz-range-thumb {
		background: var(--thumb-bg-active);
	}
	.range-input:active::-ms-thumb {
		background: var(--thumb-bg-active);
	}
	.range-input-not-touch:hover::-webkit-slider-thumb {
		box-shadow: var(--thumb-shadow-hovered);
	}
	.range-input-not-touch:hover::-moz-range-thumb {
		box-shadow: var(--thumb-shadow-hovered);
	}
	.range-input-not-touch:hover:-ms-thumb {
		box-shadow: var(--thumb-shadow-hovered);
	}
	.range-input:active::-webkit-slider-thumb {
		box-shadow: var(--thumb-shadow-active);
	}
	.range-input:active::-moz-range-thumb {
		box-shadow: var(--thumb-shadow-active);
	}
	.range-input:active:-ms-thumb {
		box-shadow: var(--thumb-shadow-active);
	}
	.range-input:focus::-webkit-slider-runnable-track,
	.range-input:focus::-ms-fill-lower,
	.range-input:focus::-ms-fill-upper {
		background: transparent;
	}
</style>
