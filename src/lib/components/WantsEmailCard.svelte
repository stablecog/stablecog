<script lang="ts">
	import Checkbox from '$components/Checkbox.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import LL from '$i18n/i18n-svelte';

	export let checked: boolean;
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
		: 'bg-c-bg-secondary ring-c-bg-tertiary ring-0 not-touch:hover:ring-2'} flex justify-start text-c-on-bg/75
  items-center gap-3.75 cursor-pointer transition group relative {classes}"
>
	{#if bg === 'primary'}
		<ButtonHoverEffect hoverFrom="left" color="bg-secondary" />
	{/if}
	<Checkbox bind:checked name="want-email-checkbox" />
	<p class="w-full text-sm select-none relative">
		{$LL.SignUp.WantsEmailCheckbox.Paragraph()}{#if !oneLine}
			<br />
		{/if}
		<span class="font-semibold"> {$LL.SignUp.WantsEmailCheckbox.NoSpamParagraph()}</span>
	</p>
</label>
