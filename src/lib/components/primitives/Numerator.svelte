<script lang="ts">
	export let max: number;
	export let min: number;
	export let value: number;
	export let step = 1;
	export let maxDecimals = 1;
	export let numeratorFormatter: (value: number) => string = (value) => value.toString();
	export { classes as class };
	let classes = '';
	let itemHeight: number;

	$: array = Array.from(
		{ length: (max - min) / step + 1 },
		(_, i) => Math.round((i * step + min) * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals)
	);

	let showWheel = false;
	let isInitialChange = true;
	let valueChangedTimeout: NodeJS.Timeout;
	$: value, onValueChanged();

	function onValueChanged() {
		if (isInitialChange) {
			isInitialChange = false;
			return;
		}
		showWheel = true;
		clearTimeout(valueChangedTimeout);
		valueChangedTimeout = setTimeout(() => (showWheel = false), 400);
	}
</script>

<div class="relative py-0.5">
	<div class="relative overflow-hidden py-3.5 {classes}">
		<div class="relative z-0 text-center">
			<p bind:clientHeight={itemHeight} class="select-none leading-5 opacity-0">
				{numeratorFormatter(max)}
			</p>
			<div
				style="transform: translateY(-{array.findIndex((i) => i === value) * itemHeight}px)"
				class="absolute left-0 top-0 flex flex-col transition"
			>
				{#each array as n}
					<p
						class="transform cursor-default select-none font-medium transition {n === value
							? 'scale-100'
							: 'scale-75 opacity-50'} leading-5"
					>
						{numeratorFormatter(n)}
					</p>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="absolute left-0 top-0 h-4.5 w-full
		bg-gradient-to-b from-c-bg via-c-bg/50 to-c-bg/0 transition"
	/>
	<div
		class="absolute bottom-0 left-0 h-4.5 w-full
		bg-gradient-to-t from-c-bg via-c-bg/50 to-c-bg/0 transition"
	/>
	<div
		class="absolute left-0 top-0 h-4.5 w-full
		bg-c-bg bg-gradient-to-b transition {!showWheel ? 'opacity-100' : 'opacity-0'}"
	/>
	<div
		class="absolute bottom-0 left-0 h-4.5 w-full
		bg-c-bg bg-gradient-to-t transition {!showWheel ? 'opacity-100' : 'opacity-0'}"
	/>
</div>
