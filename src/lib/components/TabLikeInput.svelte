<script lang="ts">
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import TabBarWrapper from '$components/TabBarWrapper.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let value: number | string | undefined;
	export let placeholder: string | undefined = undefined;
	export { classes as class };
	export let type: 'text' | 'number' = 'number';
	export let max: undefined | number = undefined;
	export let formElement: HTMLFormElement | undefined = undefined;
	let classes = '';

	let inputElement: HTMLInputElement;

	let clearInput = () => {
		value = '';
		inputElement.focus();
	};

	$: showClearInputButton = value !== undefined && value !== '' && value !== null;

	const handleKeypress = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && e.shiftKey === false) {
			e.preventDefault();
			e.stopPropagation();
			const inputsOrTextareas = formElement?.querySelectorAll(
				'input[type=text], input[type=number], textarea'
			);
			if (inputsOrTextareas) {
				for (let i = 0; i < inputsOrTextareas.length; i++) {
					if (inputsOrTextareas[i] === e.target) {
						if (i < inputsOrTextareas.length - 1) {
							(inputsOrTextareas[i + 1] as HTMLInputElement | HTMLTextAreaElement).focus();
						} else {
							(inputsOrTextareas[0] as HTMLInputElement | HTMLTextAreaElement).focus();
						}
						break;
					}
				}
			}
		}
	};
</script>

<TabBarWrapper class={classes}>
	{#if type === 'text'}
		<div class="self-stretch flex text-c-on-bg/30">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch">
			<div class="w-full h-full bg-c-bg-secondary" />
		</div>
		<div class="flex-1 min-w-0 flex relative rounded-r-xl group">
			<input
				bind:this={inputElement}
				bind:value
				on:keypress={(e) => handleKeypress(e)}
				on:input={() => {
					if (
						max !== undefined &&
						value !== null &&
						value !== undefined &&
						value.toString().length > max
					) {
						value = parseInt(value.toString().slice(0, max));
					}
				}}
				{placeholder}
				type="text"
				class="text-base w-full text-c-on-bg/75 self-stretch overflow-ellipsis ring-0 transition ring-c-primary/20 focus:ring-2 
						pl-4 py-3 md:py-3.5 rounded-r-xl bg-transparent placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'hover:ring-2 group-hover:ring-2'
					: ''} {showClearInputButton ? 'pr-10 md:pr-12' : 'pr-4'}"
			/>
			<ClearButton show={showClearInputButton} onClick={clearInput} type="sm" />
		</div>
	{:else}
		<div class="self-stretch flex text-c-on-bg/30">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch">
			<div class="w-full h-full bg-c-bg-secondary" />
		</div>
		<div class="flex-1 min-w-0 flex relative rounded-r-xl group">
			<input
				bind:this={inputElement}
				bind:value
				on:keypress={(e) => handleKeypress(e)}
				on:input={() => {
					if (
						max !== undefined &&
						value !== null &&
						value !== undefined &&
						value.toString().length > max
					) {
						value = parseInt(value.toString().slice(0, max));
					}
				}}
				{placeholder}
				type="number"
				inputmode="numeric"
				pattern="[0-9]*"
				class="text-base w-full text-c-on-bg/75 self-stretch overflow-ellipsis ring-0 transition ring-c-primary/20 focus:ring-2 
					pl-4 py-3 md:py-3.5 rounded-r-xl bg-transparent placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'hover:ring-2 group-hover:ring-2'
					: ''} {showClearInputButton ? 'pr-10 md:pr-12' : 'pr-4'}"
			/>
			<ClearButton show={showClearInputButton} onClick={clearInput} type="sm" />
		</div>
	{/if}
</TabBarWrapper>
