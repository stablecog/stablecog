<script lang="ts">
	import Button from '$components/primitives/buttons/Button.svelte';
	import ClearButton from '$components/primitives/buttons/ClearButton.svelte';

	export let type: 'text' | 'email' | 'password' | 'number' = 'text';
	export let name: string | undefined = undefined;
	export let value: string;
	export let title: string;
	export let disabled = false;
	export { classes as class };
	export let hasIcon = false;
	export let inputElement: HTMLInputElement | undefined = undefined;
	export let bg: 'bg-secondary' | 'bg-tertiary' = 'bg-tertiary';
	export let hasClearButton = false;
	export let shadow: 'normal' | 'strong' | 'strongest' = 'normal';
	export let onClearButtonClicked: (() => void) | undefined = undefined;
	export let noAutocomplete = false;
	export let noAutocorrect = false;
	export let noAutocapitalize = false;
	export let onInput: (() => void) | undefined = undefined;
	export let maxLength: number | undefined = undefined;
	export let minLength: number | undefined = undefined;
	export let onKeyPress:
		| ((
				e: KeyboardEvent & {
					currentTarget: EventTarget & HTMLInputElement;
				}
		  ) => void)
		| null = null;
	export let onFocus: ((e: FocusEvent) => void) | null = null;
	export let onBlur: ((e: FocusEvent) => void) | null = null;
	export let enterkeyhint:
		| 'enter'
		| 'done'
		| 'go'
		| 'next'
		| 'previous'
		| 'search'
		| 'send'
		| undefined = undefined;
	export let readonly: boolean | null | undefined = undefined;
	export let rounding: string | undefined = undefined;
	export let iconForButton: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let iconForButtonLabel: string | undefined = undefined;
	let classes = '';

	$: showClearButton = value !== undefined && value !== '' && value !== null;
	$: if (onInput && value) {
		onInput();
	}
</script>

<div class="flex-1 min-w-0 flex flex-row relative {classes}">
	{#if type === 'email'}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			minlength={minLength}
			maxlength={maxLength}
			{readonly}
			autocomplete={noAutocomplete ? 'off' : undefined}
			autocorrect={noAutocorrect ? 'off' : undefined}
			autocapitalize={noAutocapitalize ? 'off' : undefined}
			{enterkeyhint}
			{disabled}
			type="email"
			name={name || title}
			id={title}
			placeholder=" "
			class="peer w-full overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton && iconForButton
				? 'pr-20 md:pr-27'
				: hasClearButton || iconForButton
					? 'pr-10 md:pr-16'
					: 'pr-5'} pt-6.5 pb-2.5 {rounding ? rounding : 'rounded-xl'} transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/50 not-touch:enabled:hover:ring-2 not-touch:enabled:group-hover:ring-2"
		/>
	{:else if type === 'password'}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			minlength={minLength}
			maxlength={maxLength}
			{readonly}
			autocomplete={noAutocomplete ? 'off' : undefined}
			autocorrect={noAutocorrect ? 'off' : undefined}
			autocapitalize={noAutocapitalize ? 'off' : undefined}
			{enterkeyhint}
			{disabled}
			type="password"
			name={name || title}
			id={title}
			placeholder=" "
			class="peer w-full overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton && iconForButton
				? 'pr-20 md:pr-27'
				: hasClearButton || iconForButton
					? 'pr-10 md:pr-16'
					: 'pr-5'} pt-6.5 pb-2.5 {rounding ? rounding : 'rounded-xl'} transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'} 
      placeholder:text-c-on-bg/50 not-touch:enabled:hover:ring-2 not-touch:enabled:group-hover:ring-2"
		/>
	{:else if type === 'number'}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			minlength={minLength}
			maxlength={maxLength}
			{readonly}
			autocomplete={noAutocomplete ? 'off' : undefined}
			autocorrect={noAutocorrect ? 'off' : undefined}
			autocapitalize={noAutocapitalize ? 'off' : undefined}
			{enterkeyhint}
			{disabled}
			type="number"
			name={name || title}
			id={title}
			placeholder=" "
			class="peer w-full overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton && iconForButton
				? 'pr-20 md:pr-27'
				: hasClearButton || iconForButton
					? 'pr-10 md:pr-16'
					: 'pr-5'} pt-6.5 pb-2.5 {rounding ? rounding : 'rounded-xl'} transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/50 not-touch:enabled:hover:ring-2 not-touch:enabled:group-hover:ring-2"
		/>
	{:else}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			minlength={minLength}
			maxlength={maxLength}
			{readonly}
			autocomplete={noAutocomplete ? 'off' : undefined}
			autocorrect={noAutocorrect ? 'off' : undefined}
			autocapitalize={noAutocapitalize ? 'off' : undefined}
			{enterkeyhint}
			{disabled}
			type="text"
			name={name || title}
			id={title}
			placeholder=" "
			class="peer w-full overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton && iconForButton
				? 'pr-22 md:pr-27'
				: hasClearButton || iconForButton
					? 'pr-10 md:pr-16'
					: 'pr-5'} pt-6.5 pb-2.5 {rounding ? rounding : 'rounded-xl'} transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/50 not-touch:enabled:hover:ring-2 not-touch:enabled:group-hover:ring-2"
		/>
	{/if}
	<label
		class="{hasIcon ? 'pl-12 pr-5' : 'px-5'} input-label absolute transition-all duration-150
		text-c-on-bg/75 peer-placeholder-shown:text-c-on-bg/50 peer-focus:text-c-on-bg/75
		transform top-4 -translate-y-1/2 pointer-events-none text-xs peer-placeholder-shown:text-base peer-focus:text-xs
		peer-placeholder-shown:top-1/2 peer-focus:top-4"
		for={title}
	>
		{title}
	</label>
	<div
		class="absolute left-4 top-1/2 transform transition -translate-y-1/2 w-5 h-5 icon text-c-on-bg/75
		peer-placeholder-shown:text-c-on-bg/50 peer-focus:text-c-on-bg/75 pointer-events-none"
	>
		<slot name="icon" />
	</div>
	{#if hasClearButton || iconForButton}
		<div
			class="h-full absolute right-0 top-0 flex items-stretch {!showClearButton &&
				'pointer-events-none'}"
		>
			<ClearButton
				class="rounded-xl"
				{disabled}
				show={showClearButton}
				onClick={() => {
					value = '';
					inputElement?.focus();
					if (onClearButtonClicked) {
						onClearButtonClicked();
					}
				}}
				type="md"
			/>
			{#if iconForButton}
				<Button
					label={iconForButtonLabel}
					noRounding
					noPadding
					class="py-2 px-3 md:p-3 rounded-r-xl"
					size="sm"
				>
					<svelte:component this={iconForButton} strokeWidth={2} class="w-6 h-6 md:w-7 md:h-7" />
				</Button>
			{/if}
		</div>
	{/if}
</div>
