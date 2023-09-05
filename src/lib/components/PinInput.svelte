<script lang="ts">
	import { createPinInput } from '@melt-ui/svelte';

	export const length = 6;
	export let value: string;

	const {
		elements: { root, input },
		states: { value: _value, valueStr: _valueStr }
	} = createPinInput({
		placeholder: '0'
	});

	$: value = $_valueStr;
</script>

<div {...$root} use:root class="w-full flex items-center gap-[6px]">
	{#each Array.from({ length }) as _}
		<input
			inputmode="numeric"
			enterkeyhint="go"
			style="width: {(1 / length) * 100}%"
			class="bg-c-bg-secondary text-c-on-bg rounded-md text-center text-lg font-semibold py-3
      focus:ring-2 ring-0 transition ring-c-primary/20 focus:ring-c-primary/30 not-touch:enabled:hover:ring-2
      placeholder:text-c-on-bg/40"
			{...$input()}
			use:input
		/>
	{/each}
</div>
