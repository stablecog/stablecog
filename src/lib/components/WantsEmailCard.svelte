<script lang="ts">
	import Checkbox from '$components/Checkbox.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { Writable } from 'svelte/store';

	export let checked: Writable<boolean>;
	export let oneLine = false;
	export { classes as class };
	export let bg: 'primary' | 'secondary' = 'secondary';
	let classes = '';

	export let padding = 'px-4 py-3';

	const inputId = 'want-email-checkbox';
</script>

<label
	for={inputId}
	class="{padding} w-full rounded-xl {bg === 'primary'
		? 'bg-c-bg'
		: 'bg-c-bg-secondary ring-c-bg-tertiary ring-0 not-touch:hover:ring-2'} flex justify-start text-c-on-bg/75
  items-center gap-3.75 cursor-pointer transition group relative {classes}"
>
	{#if bg === 'primary'}
		<ButtonHoverEffect hoverFrom="left" color="bg-secondary" />
	{/if}
	<Checkbox {checked} id={inputId} />
	<p class="w-full text-sm select-none relative">
		{$LL.SignUp.WantsEmailCheckbox.Paragraph()}{#if !oneLine}
			<br class="hidden md:block" />
		{/if}
		<span class="font-semibold"> {$LL.SignUp.WantsEmailCheckbox.NoSpamParagraph()}</span>
	</p>
</label>
