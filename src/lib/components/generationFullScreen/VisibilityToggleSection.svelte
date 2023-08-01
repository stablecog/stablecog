<script lang="ts">
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconEyeOutline from '$components/icons/IconEyeOutline.svelte';
	import IconHeart from '$components/icons/IconHeart.svelte';
	import IconShare from '$components/icons/IconShare.svelte';
	import LL from '$i18n/i18n-svelte';
	import { createCheckbox } from '@melt-ui/svelte';

	const { checked, input, root } = createCheckbox();
</script>

<form class="w-full flex px-1">
	<button
		{...$root}
		use:root
		class="w-full flex items-center justify-between rounded-lg pl-4.5 md:pl-6 pr-3
    md:pr-4 py-2.5 relative cursor-pointer group"
		id="checkbox"
	>
		<ButtonHoverEffect noPadding size="md" hoverFrom="left" />
		<label
			class="font-semibold flex gap-2 justify-start items-center
      flex-1 min-w-0 relative cursor-pointer pointer-events-none
      transition text-c-on-bg not-touch:group-hover:text-c-primary"
			for="checkbox"
		>
			<IconShare class="flex-shrink-0 w-5 h-5" />
			<p class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-left">
				{$LL.GenerationFullscreen.ShowOnProfileButton()}
			</p>
		</label>
		<input {...$input} use:input />
		<ToggleIndicator isToggled={$checked === 'indeterminate' ? false : $checked} />
	</button>
</form>
