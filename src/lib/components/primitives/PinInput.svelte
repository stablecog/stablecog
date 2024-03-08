<script lang="ts">
	import { createPinInput } from '@melt-ui/svelte';

	export const length = 6;
	export let value: string;
	export let onInput: (() => void) | undefined = undefined;
	export { classes as class };
	let classes = '';

	const {
		elements: { root, input },
		states: { value: _value, valueStr: _valueStr }
	} = createPinInput({
		placeholder: '-'
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
	class="group flex w-full cursor-text items-center gap-[6px] {classes}"
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
			class="rounded-xl bg-c-bg-secondary py-4 text-center text-lg font-semibold text-c-on-bg
      {$_valueStr || index === 0
				? 'focus:ring-2 not-touch:enabled:hover:ring-2'
				: ''} {!$_valueStr && index === 0
				? 'not-touch:group-hover:enabled:ring-2'
				: ''} ring-0 ring-c-primary/20 transition placeholder:text-c-on-bg/30
      focus:ring-c-primary/30"
			{...$input()}
			use:input
		/>
	{/each}
</div>
