<script lang="ts">
	export let value: number;
	export let min: number;
	export let max: number;
	export { classes as class };
	let classes = '';
	export let classInput = '';

	$: progress = (value - min) / (max - min);
</script>

<div class="relative {classes}">
	<div
		style="width: 100%; height: var(--track-height); background: var(--track-bg); 
		position: absolute; top: 50%; transform: translateY(-50%); border-radius: var(--track-radius); z-index: 0; overflow: hidden;"
	>
		<div
			style="width: calc({progress * 100}%); height: 100%; background: var(--track-bg-progressed);"
		/>
	</div>
	<input
		class={classInput}
		style="width: 100%; background: transparent; position: relative"
		bind:value
		type="range"
		{min}
		{max}
	/>
</div>

<style>
	input[type='range'] {
		width: 100%;
		height: 100%;
		-webkit-appearance: none;
		cursor: pointer;
	}
	input[type='range']:focus {
		outline: none;
	}
	input[type='range']:active {
		cursor: grabbing;
	}
	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: var(--thumb-size);
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	input[type='range']::-webkit-slider-thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: var(--thumb-radius);
		box-shadow: var(--thumb-shadow);
		background: var(--thumb-bg);
		-webkit-appearance: none;
		border-style: none;
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: var(--thumb-size);
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	input[type='range']::-moz-range-thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: var(--thumb-radius);
		box-shadow: var(--thumb-shadow);
		background: var(--thumb-bg);
		border-style: none;
	}
	input[type='range']::-ms-track {
		width: 100%;
		height: var(--thumb-size);
		background: transparent;
		border-color: transparent;
		color: transparent;
	}
	input[type='range']::-ms-fill-lower {
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	input[type='range']::-ms-fill-upper {
		background: transparent;
		box-shadow: none;
		border-style: none;
	}
	input[type='range']::-ms-thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: var(--thumb-radius);
		box-shadow: var(--thumb-shadow);
		background: var(--thumb-bg);
		border-style: none;
	}
	input[type='range']:focus::-webkit-slider-runnable-track,
	input[type='range']:focus::-ms-fill-lower,
	input[type='range']:focus::-ms-fill-upper {
		background: transparent;
	}
</style>
