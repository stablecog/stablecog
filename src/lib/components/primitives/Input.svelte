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

<div class="relative flex min-w-0 flex-1 flex-row {classes}">
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
					: 'pr-5'} pb-2 pt-6 {rounding ? rounding : 'rounded-xl'} shadow-lg
      transition {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} ring-0 focus:ring-2 {bg === 'bg-secondary'
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
					: 'pr-5'} pb-2 pt-6 {rounding ? rounding : 'rounded-xl'} shadow-lg
      transition {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} ring-0 focus:ring-2 {bg === 'bg-secondary'
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
					: 'pr-5'} pb-2 pt-6 {rounding ? rounding : 'rounded-xl'} shadow-lg
      transition {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} ring-0 focus:ring-2 {bg === 'bg-secondary'
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
					: 'pr-5'} pb-2 pt-6 {rounding ? rounding : 'rounded-xl'} shadow-lg
      transition {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
					? 'shadow-c-shadow/[var(--o-shadow-strong)'
					: 'shadow-c-shadow/[var(--o-shadow-normal)]'} ring-0 focus:ring-2 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/50 not-touch:enabled:hover:ring-2 not-touch:enabled:group-hover:ring-2"
		/>
	{/if}
	<label
		class="{hasIcon
			? 'pl-12 pr-5'
			: 'px-5'} input-label top-4.25 peer-focus:top-4.25 pointer-events-none
		absolute -translate-y-1/2 transform
		text-xs text-c-on-bg/75 transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-c-on-bg/50
		peer-focus:text-xs peer-focus:text-c-on-bg/75"
		for={title}
	>
		{title}
	</label>
	<div
		class="icon pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-c-on-bg/75
		transition peer-placeholder-shown:text-c-on-bg/50 peer-focus:text-c-on-bg/75"
	>
		<slot name="icon" />
	</div>
	{#if hasClearButton || iconForButton}
		<div
			class="absolute right-0 top-0 flex h-full items-stretch {!showClearButton &&
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
					class="pointer-events-auto rounded-r-xl px-3 py-2 md:p-3"
					size="sm"
				>
					<svelte:component this={iconForButton} strokeWidth={2} class="h-6 w-6 md:h-7 md:w-7" />
				</Button>
			{/if}
		</div>
	{/if}
</div>
