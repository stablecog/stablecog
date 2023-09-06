<script lang="ts">
	import { createPinInput } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';

	export const length = 6;
	export let value: string;
	export let onInput: (() => void) | undefined = undefined;
	export { classes as class };
	let classes = '';

	const {
		elements: { root, input },
		states: { value: _value, valueStr: _valueStr }
	} = createPinInput({
		placeholder: '0'
	});

	$: value = $_valueStr;

	let inputElements: (HTMLInputElement | null)[] = Array.from({ length }, () => null);
</script>

<div
	on:click={(e) => {
		if ($_valueStr) return;
		inputElements[0]?.focus();
	}}
	tabindex="-1"
	role="textbox"
	{...$root}
	use:root
	class="w-full flex items-center gap-[6px] cursor-text group {classes}"
>
	{#each Array.from({ length }) as _, index}
		<input
			bind:this={inputElements[index]}
			inputmode="numeric"
			enterkeyhint="go"
			on:m-keydown={() => {
				if (onInput) onInput();
			}}
			style="width: {(1 / length) * 100}%"
			class="bg-c-bg-secondary text-c-on-bg rounded-xl text-center text-lg font-semibold py-4
      {$_valueStr || index === 0
				? 'focus:ring-2 not-touch:enabled:hover:ring-2'
				: ''} {!$_valueStr && index === 0
				? 'not-touch:group-hover:enabled:ring-2'
				: ''} ring-0 transition ring-c-primary/20 focus:ring-c-primary/30
      placeholder:text-c-on-bg/40"
			{...$input()}
			use:input
		/>
	{/each}
</div>
