<script lang="ts">
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let type: 'text' | 'email' | 'password' | 'number' = 'text';
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
	let classes = '';

	$: showClearButton = value !== undefined && value !== '' && value !== null;
</script>

<div class="flex-1 flex flex-row relative {classes}">
	{#if type === 'email'}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			{enterkeyhint}
			{disabled}
			type="email"
			name={title}
			id={title}
			placeholder=" "
			class="peer flex-1 overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton
				? 'pr-10 md:pr-16'
				: 'pr-5'} pt-7 pb-3 rounded-xl transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
				? 'shadow-c-shadow/[var(--o-shadow-strong)'
				: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/40 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''} "
		/>
	{:else if type === 'password'}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			{enterkeyhint}
			{disabled}
			type="password"
			name={title}
			id={title}
			placeholder=" "
			class="peer flex-1 overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton
				? 'pr-10 md:pr-16'
				: 'pr-5'} pt-7 pb-3 rounded-xl transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
				? 'shadow-c-shadow/[var(--o-shadow-strong)'
				: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'} 
      placeholder:text-c-on-bg/40 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
		/>
	{:else if type === 'number'}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			{enterkeyhint}
			{disabled}
			type="number"
			name={title}
			id={title}
			placeholder=" "
			class="peer flex-1 overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton
				? 'pr-10 md:pr-16'
				: 'pr-5'} pt-7 pb-3 rounded-xl transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
				? 'shadow-c-shadow/[var(--o-shadow-strong)'
				: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/40 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
		/>
	{:else}
		<input
			bind:value
			bind:this={inputElement}
			on:keypress={onKeyPress}
			on:focus={onFocus}
			on:blur={onBlur}
			{enterkeyhint}
			{disabled}
			type="text"
			name={title}
			id={title}
			placeholder=" "
			class="peer flex-1 overflow-hidden overflow-ellipsis {bg === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-tertiary'} relative {hasIcon ? 'pl-12' : 'pl-5'} {hasClearButton
				? 'pr-10 md:pr-16'
				: 'pr-5'} pt-7 pb-3 rounded-xl transition
      shadow-lg {shadow === 'strongest'
				? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
				: shadow === 'strong'
				? 'shadow-c-shadow/[var(--o-shadow-strong)'
				: 'shadow-c-shadow/[var(--o-shadow-normal)]'} focus:ring-2 ring-0 {bg === 'bg-secondary'
				? 'ring-c-primary/20 focus:ring-c-primary/30'
				: 'ring-c-primary/20 focus:ring-c-primary/35'}  
      placeholder:text-c-on-bg/40 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
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
	{#if hasClearButton}
		<ClearButton
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
	{/if}
</div>
