<script lang="ts">
	import { onDestroy } from 'svelte';

	type T = $$Generic;
	export let defaultValue: T;
	export let value: T;
	export let delay = 500;
	export let minStay = 500;
	export let dependencies: any[];

	let delayedValue: T = defaultValue;
	let timer: NodeJS.Timeout;

	$: dependencies, reset();
	$: value, onValueChanged();

	async function onValueChanged() {
		if (value === defaultValue) {
			await new Promise((resolve) => setTimeout(resolve, minStay));
		}
		delayedValue = defaultValue;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			delayedValue = value;
		}, delay);
	}

	function reset() {
		if (timer) clearTimeout(timer);
		delayedValue = defaultValue;
	}

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

<slot {delayedValue} />
