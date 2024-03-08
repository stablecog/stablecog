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
		<div class="flex self-stretch text-c-on-bg/50">
			<slot name="title" />
		</div>
		<div class="-ml-px mr-px w-2px self-stretch">
			<div class="h-full w-full bg-c-bg-secondary" />
		</div>
	{/if}
	<div class="relative flex min-w-0 flex-1 {hasTitle ? 'rounded-r-xl' : 'rounded-xl'} group">
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
			class="hide-scrollbar w-full touch-manipulation resize-none self-stretch overflow-ellipsis py-3.5 pl-4
			text-base text-c-on-bg ring-0 ring-c-primary/25 transition
			focus:ring-2 focus:ring-c-primary/50 {hasTitle
				? 'rounded-r-xl'
				: 'rounded-xl'} bg-transparent placeholder:text-c-on-bg/50
				not-touch:hover:ring-2 not-touch:group-hover:ring-2 {showClearInputButton
				? 'pr-10 md:pr-12'
				: 'pr-4'}"
		/>
		<ClearButton {disabled} show={showClearInputButton} onClick={clearInput} type="sm" />
	</div>
</TabBarWrapper>
