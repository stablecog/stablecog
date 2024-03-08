<script lang="ts">
	import ClearButton from '$components/primitives/buttons/ClearButton.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';

	export let value: number | string | undefined | null;
	export let placeholder: string | undefined = undefined;
	export { classes as class };
	export let type: 'text' | 'number' = 'number';
	export let max: undefined | number = undefined;
	export let formElement: HTMLFormElement | undefined = undefined;
	export let disabled = false;
	export let hasTitle = false;
	export let name: string;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let dontHandleKeypress = false;
	export let inputElement: HTMLInputElement | undefined = undefined;
	export let inputmode: 'search' | undefined = undefined;

	let classes = '';

	let clearInput = () => {
		value = null;
		inputElement?.focus();
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
		{#if hasTitle}
			<div class="flex self-stretch text-c-on-bg/50">
				<slot name="title" />
			</div>
			<div class="-ml-px mr-px w-2px self-stretch">
				<div class="h-full w-full bg-c-bg-secondary" />
			</div>
		{/if}
		<div class="relative flex min-w-0 flex-1 {hasTitle ? 'rounded-r-xl' : 'rounded-xl'} group">
			<input
				aria-label={name}
				{disabled}
				bind:this={inputElement}
				bind:value
				on:keypress={dontHandleKeypress ? undefined : (e) => handleKeypress(e)}
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
				type="text"
				{inputmode}
				class="group/input w-full touch-manipulation self-stretch overflow-ellipsis text-base text-c-on-bg ring-0 ring-c-primary/25
				transition focus:ring-2 focus:ring-c-primary/50
					{icon ? 'pl-12' : 'pl-4'} py-3.5 {hasTitle
					? 'rounded-r-xl'
					: 'rounded-xl'} bg-transparent placeholder:text-c-on-bg/50
					not-touch:hover:ring-2 not-touch:group-hover:ring-2
					{showClearInputButton ? 'pr-10 md:pr-12' : 'pr-4'} peer"
			/>
			<ClearButton {disabled} show={showClearInputButton} onClick={clearInput} type="sm" />
			{#if icon}
				<svelte:component
					this={icon}
					class="pointer-events-none absolute left-4 top-1/2 h-5.5 w-5.5
					flex-shrink-0 -translate-y-1/2 transform text-c-on-bg transition peer-focus:text-c-primary not-touch:group-hover:text-c-primary"
				/>
			{/if}
		</div>
	{:else}
		{#if hasTitle}
			<div class="flex self-stretch text-c-on-bg/50">
				<slot name="title" />
			</div>
			<div class="-ml-px mr-px w-2px self-stretch">
				<div class="h-full w-full bg-c-bg-secondary" />
			</div>
		{/if}
		<div class="relative flex min-w-0 flex-1 {hasTitle ? 'rounded-r-xl' : 'rounded-xl'} group">
			<input
				{disabled}
				bind:this={inputElement}
				bind:value
				on:keypress={dontHandleKeypress ? undefined : (e) => handleKeypress(e)}
				on:input={() => {
					if (max !== undefined && value !== null && value !== undefined) {
						if (value.toString().length > max.toString().length) {
							value = parseInt(value.toString().slice(0, max.toString().length));
						}
						if (Number(value) > max) {
							value = parseInt(value.toString().slice(0, -1));
						}
					}
				}}
				{placeholder}
				type="number"
				inputmode="numeric"
				pattern="[0-9]*"
				class="w-full touch-manipulation self-stretch overflow-ellipsis py-3.5 pl-4 text-base text-c-on-bg ring-0 ring-c-primary/25 transition
					focus:ring-2 focus:ring-c-primary/50 {hasTitle
					? 'rounded-r-xl'
					: 'rounded-xl'} bg-transparent placeholder:text-c-on-bg/50
					not-touch:hover:ring-2 not-touch:group-hover:ring-2
					{showClearInputButton ? 'pr-10 md:pr-12' : 'pr-4'}"
			/>
			<ClearButton {disabled} show={showClearInputButton} onClick={clearInput} type="sm" />
		</div>
	{/if}
</TabBarWrapper>
