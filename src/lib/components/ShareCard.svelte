<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TIconSc } from '$ts/types/main';

	export let url: string;

	interface TShareButton {
		icon: TIconSc;
		iconClasses: string;
		buttonText: string;
		href: string;
	}

	let buttons: TShareButton[];
	$: buttons = [
		{
			icon: 'instagram',
			iconClasses: 'bg-c-instagram text-white',
			buttonText: $LL.Scl.Instagram(),
			href: 'https://ins'
		},
		{
			icon: 'twitter',
			iconClasses: 'bg-c-twitter text-white',
			buttonText: $LL.Scl.Twitter(),
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				'Check out this generation on Stablecog!\n#stablecog\n\n'
			)}&url=${encodeURIComponent(url)}`
		},
		{
			icon: 'facebook',
			iconClasses: 'bg-c-facebook text-white',
			buttonText: $LL.Scl.Facebook(),
			href: `https://facebook.com/dialog/share?display=popup&href=${encodeURIComponent(url)}`
		},
		{
			icon: 'email',
			iconClasses: 'bg-c-on-bg text-c-bg',
			buttonText: $LL.Scl.Email(),
			href: 'mailto:'
		}
	];
</script>

<div
	class="w-full flex flex-col max-w-sm bg-c-bg-secondary ring-2 ring-c-bg-tertiary
  rounded-2xl p-4 md:p-5 gap-3"
>
	<h1 class="w-full text-center font-bold text-xl -mt-0.5 md:-mt-1">{$LL.ShareCard.Title()}</h1>
	<div class="w-full flex flex-wrap items-center justify-center -mt-1">
		{#each buttons as button}
			<a
				href={button.href}
				target="_blank"
				class="flex flex-col items-center justify-center gap-1.5 group relative p-3"
			>
				<ButtonHoverEffect noPadding color="bg-tertiary" />
				<div
					class="{button.iconClasses} w-11 h-11 rounded-full text-c-bg flex items-center justify-center p-1.5 relative"
				>
					<IconSc type={button.icon} class="w-full h-full" />
				</div>
				<p class="text-xs w-full text-center flex-shrink min-w-0 relative">{button.buttonText}</p>
			</a>
		{/each}
	</div>
	<div class="w-full flex items-center rounded-xl bg-c-bg p-1.5 -mt-1">
		<p
			class="px-2 w-full text-sm flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{url}
		</p>
		<Button noPadding noRounding class="px-5 py-2 rounded-lg" size="xs"
			>{$LL.Shared.CopyButton()}</Button
		>
	</div>
</div>
