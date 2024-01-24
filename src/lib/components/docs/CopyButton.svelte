<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import LL from '$i18n/i18n-svelte';
	import { copy } from 'svelte-copy';

	export let textToCopy: string;
	export let onCopied: () => void;
	export let isCopied: boolean = false;
</script>

<button
	aria-label={$LL.Shared.CopyButton()}
	class="flex items-stretch justify-center p-1 self-stretch group relative"
	use:copy={textToCopy || ''}
	on:svelte-copy={onCopied}
	on:svelte-copy:error={(e) => console.log(e)}
>
	<ButtonHoverEffect color="success" hoverFrom="bottom" size="sm" hovered={isCopied} />
	<div
		class="flex justify-center items-center self-stretch p-2 rounded-lg text-sm transition relative"
	>
		<Morpher morphed={isCopied}>
			<div slot="0" class="flex items-center justify-center">
				<IconCopy class="w-6 h-6 transition text-c-on-bg not-touch:group-hover:text-c-success" />
			</div>
			<div slot="1" class="flex items-center justify-center">
				<IconTick class="w-9 h-9 flex-shrink-0 text-c-success" />
			</div>
		</Morpher>
	</div>
</button>
