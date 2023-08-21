<script lang="ts">
	import { page } from '$app/stores';
	import Morpher from '$components/Morpher.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import { copyTimeoutDuration } from '$components/generationFullScreen/constants';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import { PUBLIC_FACEBOOK_APP_ID } from '$env/static/public';
	import LL from '$i18n/i18n-svelte';
	import { modelIdToDisplayName } from '$ts/constants/generationModels';
	import { removeSpecialCharacters } from '$ts/helpers/removeSpecialCharacters';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import type { TIconSc } from '$ts/types/main';

	export let url: string;
	export let generation: TGenerationWithSelectedOutput;
	export let content: any;
	export let close: any;
	export let title: any;
	export { classes as class };
	let classes = '';

	$: prompt = generation.prompt.text;

	let copiedTimeout: NodeJS.Timeout;
	let copied = false;

	function onCopied() {
		copied = true;
		clearTimeout(copiedTimeout);
		copiedTimeout = setTimeout(() => {
			copied = false;
		}, copyTimeoutDuration);
	}

	const hashtagMain = '#stablecog';
	const hashtagAll = `${hashtagMain} #stablediffusion #${removeSpecialCharacters(
		$modelIdToDisplayName[generation.model_id]
	)}`;

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
				`${
					generation.user.username === $userSummary?.username
						? $LL.ShareCard.MessageUsersOwn()
						: $LL.ShareCard.Message()
				}\n\n${hashtagAll}`
			)}&url=${encodeURIComponent(url)}`
		},
		{
			icon: 'facebook',
			iconClasses: 'bg-c-facebook text-white',
			buttonText: $LL.Scl.Facebook(),
			href: `https://facebook.com/dialog/share?display=popup&href=${encodeURIComponent(
				url
			)}&app_id=${PUBLIC_FACEBOOK_APP_ID}&hashtag=${hashtagMain}`
		},
		{
			icon: 'reddit',
			iconClasses: 'bg-c-reddit text-white',
			buttonText: $LL.Scl.Reddit(),
			href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(
				generation.user.username === $userSummary?.username
					? $LL.ShareCard.MessageUsersOwn()
					: $LL.ShareCard.Message()
			)}`
		},
		{
			icon: 'email',
			iconClasses: 'bg-c-on-bg text-c-bg',
			buttonText: $LL.Scl.Email(),
			href: `mailto:,?subject=${encodeURIComponent(
				generation.user.username === $userSummary?.username
					? $LL.ShareCard.MessageUsersOwn()
					: $LL.ShareCard.Message()
			)}&body=${encodeURIComponent(`${prompt}\n\n${url}`)}`
		}
	];
</script>

<div
	use:content
	{...$content}
	class="w-full flex flex-col max-w-md bg-c-bg-secondary ring-2 ring-c-bg-tertiary relative
  rounded-2xl p-3 md:p-5 gap-3 shadow-generation-modal shadow-c-shadow/[var(--o-shadow-stronger)] {classes}"
>
	<button
		class="absolute right-0 top-0 p-3 rounded-xl overflow-hidden z-0 group"
		{...$close}
		use:close
	>
		<ButtonHoverEffect color="primary" hoverFrom="bottom" />
		<IconCancel class="text-c-on-bg/25 w-6 h-6 not-touch:group-hover:text-c-primary transition" />
	</button>
	<h1 use:title {...$title} class="w-full text-center font-bold text-2xl md:-mt-1.5 px-9">
		{$LL.ShareCard.Title()}
	</h1>
	<div class="w-full flex flex-wrap items-center justify-center -mt-1.5">
		{#each buttons as button}
			<a
				href={button.href}
				target="_blank"
				class="flex flex-col items-center justify-center gap-1.5 group relative p-3"
			>
				<ButtonHoverEffect noPadding color="bg-tertiary" hoverFrom="left" noFade />
				<div
					class="{button.iconClasses} w-11 h-11 rounded-full text-c-bg flex items-center justify-center p-1.5 relative"
				>
					<IconSc type={button.icon} class="w-full h-full" />
				</div>
				<p class="text-xs w-full text-center flex-shrink min-w-0 relative">{button.buttonText}</p>
			</a>
		{/each}
	</div>
	<div class="w-full flex items-center rounded-xl bg-c-bg p-1.5 -mt-0.5">
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
			buttonType="button"
			noHoverEffect={copied}
		>
			<Morpher morphed={!copied}>
				<p slot="1" class="flex flex-shrink min-w-0">
					{$LL.Shared.CopyButton()}
				</p>
				<div slot="0" class="flex items-center justify-center gap-0.75 text-c-on-primary">
					<div class="w-5.5 h-5.5 transform flex-shrink-0 -ml-1">
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
