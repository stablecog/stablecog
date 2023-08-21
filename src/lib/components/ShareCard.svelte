<script lang="ts">
	import { page } from '$app/stores';
	import DelayedValueProvider from '$components/DelayedValueProvider.svelte';
	import Morpher from '$components/Morpher.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import { copyTimeoutDuration } from '$components/generationFullScreen/constants';
	import IconSc from '$components/icons/IconSc.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import { PUBLIC_FACEBOOK_APP_ID } from '$env/static/public';
	import LL from '$i18n/i18n-svelte';
	import type { TIconSc } from '$ts/types/main';

	export let url: string;

	let prompt = 'Portrait of a cat by van Gogh';

	let copiedTimeout: NodeJS.Timeout;
	let copied = false;

	function onCopied() {
		copied = true;
		clearTimeout(copiedTimeout);
		copiedTimeout = setTimeout(() => {
			copied = false;
		}, copyTimeoutDuration);
	}

	interface TShareButton {
		icon: TIconSc;
		iconClasses: string;
		buttonText: string;
		href: string;
	}

	let buttons: TShareButton[];
	$: buttons = [
		{
			icon: 'twitter',
			iconClasses: 'bg-c-twitter text-white',
			buttonText: $LL.Scl.Twitter(),
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				'Check out this generation on Stablecog!\n\n#stablecog\n\n'
			)}&url=${encodeURIComponent(url)}`
		},
		{
			icon: 'instagram',
			iconClasses: 'bg-c-instagram text-white',
			buttonText: $LL.Scl.Instagram(),
			href: 'https://ins'
		},
		{
			icon: 'facebook',
			iconClasses: 'bg-c-facebook text-white',
			buttonText: $LL.Scl.Facebook(),
			href: `https://facebook.com/dialog/share?display=popup&href=${encodeURIComponent(
				url
			)}&app_id=${PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${$page.url.href}`
		},
		{
			icon: 'reddit',
			iconClasses: 'bg-c-reddit text-white',
			buttonText: $LL.Scl.Reddit(),
			href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(
				'Check out this generation on Stablecog!'
			)}`
		},
		{
			icon: 'email',
			iconClasses: 'bg-c-on-bg text-c-bg',
			buttonText: $LL.Scl.Email(),
			href: `mailto:,?subject=${encodeURIComponent(
				'Check out this generation on Stablecog!'
			)}&body=${encodeURIComponent(`${prompt}\n\n${url}`)}`
		}
	];
</script>

<div
	class="w-full flex flex-col max-w-md bg-c-bg-secondary ring-2 ring-c-bg-tertiary
  rounded-2xl p-4 md:p-5 gap-3"
>
	<h1 class="w-full text-center font-bold text-2xl -mt-0.5 md:-mt-1">{$LL.ShareCard.Title()}</h1>
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
		<Button
			stringToCopy={url}
			type={copied ? 'success' : 'primary'}
			onClick={onCopied}
			noPadding
			noRounding
			class="px-6 py-2.5 rounded-lg"
			size="xs"
		>
			<Morpher morphed={!copied}>
				<p slot="1" class="flex flex-shrink min-w-0">
					{copied ? $LL.Shared.CopiedButton() : $LL.Shared.CopyButton()}
				</p>
				<div slot="0" class="flex items-center justify-center gap-0.75">
					<div class="w-5 h-5 transform flex-shrink-0 -ml-1 {copied ? 'scale-100' : 'scale-0'}">
						<IconTick class="w-full h-full" />
					</div>
					<p class="flex flex-shrink min-w-0">
						{$LL.Shared.CopiedButton()}
					</p>
				</div>
			</Morpher>
		</Button>
	</div>
</div>
