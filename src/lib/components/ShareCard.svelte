<script lang="ts">
	import IconSc from '$components/icons/IconSc.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TIconSc } from '$ts/types/main';

	export let url: string;

	interface TShareButton {
		icon: TIconSc;
		buttonText: string;
		url: string;
	}

	let buttons: TShareButton[];
	$: buttons = [
		{
			icon: 'instagram',
			buttonText: $LL.Scl.Instagram(),
			url: 'https://instagram.com'
		},
		{
			icon: 'twitter',
			buttonText: $LL.Scl.Twitter(),
			url: 'https://twitter.com'
		},
		{
			icon: 'facebook',
			buttonText: $LL.Scl.Facebook(),
			url: 'https://facebook.com'
		},
		{
			icon: 'email',
			buttonText: $LL.Scl.Email(),
			url: 'mailto:'
		}
	];
</script>

<div
	class="w-full flex flex-col max-w-sm bg-c-bg-secondary ring-2 ring-c-bg-tertiary
  rounded-xl px-4 py-3 md:p-5 gap-3"
>
	<h1 class="font-bold text-xl -mt-1">{$LL.ShareCard.Title()}</h1>
	<div class="w-full flex flex-wrap items-center justify-start gap-4 px-1">
		{#each buttons as button}
			<a href={button.url} class="flex flex-col items-center justify-center gap-1">
				<div
					class="w-12 h-12 bg-c-on-bg rounded-full text-c-bg flex items-center justify-center p-1.5"
				>
					<IconSc type={button.icon} class="w-full h-full" />
				</div>
				<p class="text-sm w-full text-center flex-shrink min-w-0">{button.buttonText}</p>
			</a>
		{/each}
	</div>
	<div class="w-full flex items-center gap-4 rounded-lg bg-c-bg px-3 py-2">
		<p
			class="w-full text-sm flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{url}
		</p>
		<button>{$LL.Shared.CopyButton()}</button>
	</div>
</div>
