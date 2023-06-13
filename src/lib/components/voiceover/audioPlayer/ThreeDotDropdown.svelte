<script lang="ts">
	import DropdownWrapperTranslate from '$components/DropdownWrapperTranslate.svelte';
	import Morpher from '$components/Morpher.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconThreeDots from '$components/icons/IconThreeDots.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { downloadVoicoverOutput } from '$ts/helpers/downloadVoiceoverOutput';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

	export let container: HTMLElement | undefined = undefined;
	export let output: TVoiceoverFullOutput;

	$: options = [
		{
			title: 'Download',
			icon: IconDownload,
			isAsync: true,
			onClick: async () => downloadVoicoverOutput(output),
			isLoading: false
		}
	];

	let isDropdownOpen = false;
</script>

<div use:clickoutside={{ callback: () => (isDropdownOpen = false) }} class="relative flex">
	<IconButton name="Toggle Dropdown" onClick={() => (isDropdownOpen = !isDropdownOpen)}>
		<IconThreeDots
			class="w-6 h-6 text-c-on-bg/50 not-touch:group-hover/iconbutton:text-c-primary transition transform {isDropdownOpen
				? 'rotate-90'
				: ''}"
		/>
	</IconButton>
	{#if isDropdownOpen}
		<DropdownWrapperTranslate rounding="rounded-lg" translate="sm">
			{#each options as item}
				<button
					disabled={item.isLoading}
					on:click={async () => {
						if (item.isAsync) {
							try {
								if (item.isLoading) return;
								item.isLoading = true;
								await item.onClick();
							} catch (error) {
								console.error(error);
							} finally {
								item.isLoading = false;
							}
						} else {
							item.onClick();
						}
						isDropdownOpen = false;
					}}
					class="text-sm px-3.5 py-2.5 font-medium relative group flex items-center gap-1.5"
				>
					<ButtonHoverEffect noPadding noRounding hoverFrom="left" />
					<Morpher class="-ml-1.5 w-5 h-5" morphed={item.isLoading}>
						<div slot="0">
							<svelte:component
								this={item.icon}
								class="w-full h-full text-c-on-bg not-touch:group-hover:text-c-primary transition"
							/>
						</div>
						<div slot="1">
							<IconAnimatedSpinner
								loading={item.isLoading}
								class="w-full h-full text-c-on-bg not-touch:group-hover:text-c-primary transition"
							/>
						</div>
					</Morpher>
					<p class="text-c-on-bg not-touch:group-hover:text-c-primary transition">{item.title}</p>
				</button>
			{/each}
		</DropdownWrapperTranslate>
	{/if}
</div>
