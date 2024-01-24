<script lang="ts">
	import ClearButton from '$components/primitives/buttons/ClearButton.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import { autoresize } from '$ts/actions/textarea/autoresize';

	export let value: string | undefined;
	export let placeholder: string | undefined = undefined;
	export { classes as class };
	export let max: undefined | number = undefined;
	export let formElement: HTMLFormElement | undefined = undefined;
	export let disabled = false;
	export let hasTitle = false;
	export let maxRows = 3;
	let classes = '';

	let textAreaElement: HTMLTextAreaElement;

	let clearInput = () => {
		value = '';
		textAreaElement.value = '';
		textAreaElement.blur();
		textAreaElement.focus();
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
	{#if hasTitle}
		<div class="self-stretch flex text-c-on-bg/50">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch">
			<div class="w-full h-full bg-c-bg-secondary" />
		</div>
	{/if}
	<div class="flex-1 min-w-0 flex relative {hasTitle ? 'rounded-r-xl' : 'rounded-xl'} group">
		<textarea
			use:autoresize={{ maxRows: maxRows, placeholder }}
			rows="1"
			{disabled}
			bind:this={textAreaElement}
			bind:value
			on:keypress={(e) => handleKeypress(e)}
			on:input={() => {
				if (
					max !== undefined &&
					value !== null &&
					value !== undefined &&
					value.toString().length > max
				) {
					value = value.toString().slice(0, max);
				}
			}}
			{placeholder}
			class="touch-manipulation hide-scrollbar resize-none text-base w-full text-c-on-bg self-stretch overflow-ellipsis ring-0 transition ring-c-primary/15 focus:ring-c-primary/25 focus:ring-2
						pl-4 py-3.5 {hasTitle ? 'rounded-r-xl' : 'rounded-xl'} bg-transparent placeholder:text-c-on-bg/50
				not-touch:hover:ring-2 not-touch:group-hover:ring-2 {showClearInputButton
				? 'pr-10 md:pr-12'
				: 'pr-4'}"
		/>
		<ClearButton {disabled} show={showClearInputButton} onClick={clearInput} type="sm" />
	</div>
</TabBarWrapper>
