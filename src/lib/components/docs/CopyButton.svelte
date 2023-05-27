<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import LL from '$i18n/i18n-svelte';
	import { copy } from 'svelte-copy';

	export let textToCopy: string;
	export let onCopied: () => void;
	export let isCopied: boolean = false;
</script>

<button
	class="flex items-stretch justify-center p-1 self-stretch group relative"
	use:copy={textToCopy || ''}
	on:svelte-copy={onCopied}
	on:svelte-copy:error={(e) => console.log(e)}
>
	<ButtonHoverEffect color="success" hoverFrom="bottom" size="sm" hovered={isCopied} />
	<div
		class="flex justify-center items-center self-stretch px-3 py-2 rounded-lg text-sm transition {isCopied
			? 'bg-c-success'
			: 'bg-c-bg'}"
	>
		<Morpher morphed={isCopied}>
			<div slot="0" class="flex items-center justify-center gap-1">
				<IconCopy
					class="w-4 h-4 transition text-c-on-bg not-touch:group-hover:text-c-success flex-shrink-0"
				/>
				<p class="transition text-c-on-bg not-touch:group-hover:text-c-success">
					{$LL.Shared.CopyButton()}
				</p>
			</div>
			<div slot="1" class="flex items-center justify-center gap-1 text-c-on-primary font-semibold">
				<IconTickOnly class="w-4 h-4 flex-shrink-0" />
				<p>
					{$LL.Shared.DoneButton()}
				</p>
			</div>
		</Morpher>
	</div>
</button>
