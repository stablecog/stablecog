<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL from '$i18n/i18n-svelte';

	export let size: 'md' | 'lg' | 'sm' = 'md';
	export let faded = false;
	export let onDeleteClicked: () => void;
</script>

<button
	on:click={onDeleteClicked}
	class="group/download-button relative touch-manipulation rounded-lg {size === 'lg'
		? 'h-12 w-12'
		: 'h-10 w-10'}"
	aria-label={$LL.Shared.DownloadButton()}
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/download-button:translate-x-0 not-touch:group-hover/download-button:translate-y-0 not-touch:group-hover/download-button:opacity-100"
		size={size === 'lg' ? 'md' : 'sm'}
		noPadding
		color="danger"
	/>
	<div class="p-2">
		<IconTrashcan
			class="h-full w-full transition {faded
				? 'text-c-danger/50'
				: 'text-c-danger'} not-touch:group-hover/download-button:text-c-danger"
		/>
	</div>
</button>
