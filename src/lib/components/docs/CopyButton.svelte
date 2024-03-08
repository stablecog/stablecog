<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
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
	class="group relative flex items-stretch justify-center self-stretch p-1"
	use:copy={textToCopy || ''}
	on:svelte-copy={onCopied}
	on:svelte-copy:error={(e) => console.log(e)}
>
	<ButtonHoverEffect color="success" hoverFrom="bottom" size="sm" hovered={isCopied} />
	<div
		class="relative flex items-center justify-center self-stretch rounded-lg p-2 text-sm transition"
	>
		<Morpher morphed={isCopied}>
			<div slot="0" class="flex items-center justify-center">
				<IconCopy class="h-6 w-6 text-c-on-bg transition not-touch:group-hover:text-c-success" />
			</div>
			<div slot="1" class="flex items-center justify-center">
				<IconTick class="h-9 w-9 flex-shrink-0 text-c-success" />
			</div>
		</Morpher>
	</div>
</button>
