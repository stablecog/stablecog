<script lang="ts">
	import Checkbox from '$components/primitives/Checkbox.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { Writable } from 'svelte/store';

	export let checked: Writable<boolean>;
	export let oneLine = false;
	export { classes as class };
	export let bg: 'primary' | 'secondary' = 'secondary';
	let classes = '';

	export let padding = 'px-4 py-3';
</script>

<label
	for="want-email-checkbox"
	class="{padding} w-full rounded-xl {bg === 'primary'
		? 'bg-c-bg'
		: 'bg-c-bg-secondary ring-0 ring-c-bg-tertiary not-touch:hover:ring-2'} group relative flex
  cursor-pointer items-center justify-start gap-3.75 text-c-on-bg/75 transition {classes}"
>
	{#if bg === 'primary'}
		<ButtonHoverEffect hoverFrom="left" color="bg-secondary" />
	{/if}
	<Checkbox {checked} name="want-email-checkbox" />
	<p class="relative w-full select-none text-sm">
		{$LL.SignUp.WantsEmailCheckbox.Paragraph()}{#if !oneLine}
			<br class="hidden md:block" />
		{/if}
		<span class="font-semibold"> {$LL.SignUp.WantsEmailCheckbox.NoSpamParagraph()}</span>
	</p>
</label>
