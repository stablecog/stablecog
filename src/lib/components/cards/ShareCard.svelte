<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import { copyTimeoutDuration } from '$components/generationFullScreen/constants';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import { PUBLIC_FACEBOOK_APP_ID } from '$env/static/public';
	import LL from '$i18n/i18n-svelte';
	import { modelIdToDisplayName } from '$ts/constants/generationModels';
	import { logShareButtonClicked } from '$ts/helpers/loggers';
	import { removeSpecialCharacters } from '$ts/helpers/removeSpecialCharacters';
	import { appVersion } from '$ts/stores/appVersion';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import type { TIconSc } from '$ts/types/main';
	import { sessionStore } from '$ts/constants/supabase';

	export let url: string;
	export let generation: TGenerationWithSelectedOutput;
	export let close: () => void;
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
			icon: 'x',
			iconClasses: 'bg-c-x text-white',
			buttonText: $LL.Platform.X(),
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
			buttonText: $LL.Platform.Facebook(),
			href: `https://facebook.com/dialog/share?display=popup&href=${encodeURIComponent(
				url
			)}&app_id=${PUBLIC_FACEBOOK_APP_ID}`
		},
		{
			icon: 'reddit',
			iconClasses: 'bg-c-reddit text-white',
			buttonText: $LL.Platform.Reddit(),
			href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(
				generation.user.username === $userSummary?.username
					? $LL.ShareCard.MessageUsersOwn()
					: $LL.ShareCard.Message()
			)}`
		},
		{
			icon: 'email',
			iconClasses: 'bg-c-on-bg text-c-bg',
			buttonText: $LL.Platform.Email(),
			href: `mailto:,?subject=${encodeURIComponent(
				generation.user.username === $userSummary?.username
					? $LL.ShareCard.MessageUsersOwn()
					: $LL.ShareCard.Message()
			)}&body=${encodeURIComponent(`${prompt}\n\n${url}`)}`
		}
	];

	$: sharedLogProps = {
		'SC - App Version': $appVersion,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - User Id': $sessionStore?.user.id,
		'SC - Output Id': generation.selected_output.id
	};
</script>

<div
	class="relative flex w-full max-w-md flex-col gap-3 rounded-2xl bg-c-bg-secondary
  p-2 shadow-generation-modal shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-tertiary md:p-5 {classes}"
>
	<button class="group absolute right-0 top-0 z-0 overflow-hidden rounded-xl p-3" on:click={close}>
		<ButtonHoverEffect color="primary" hoverFrom="bottom" />
		<IconCancel class="h-6 w-6 text-c-on-bg/25 transition not-touch:group-hover:text-c-primary" />
	</button>
	<h1 class="mt-1 w-full px-9 text-center text-2xl font-bold md:-mt-1.5">
		{$LL.ShareCard.Title()}
	</h1>
	<div class="-mt-1.5 flex w-full flex-wrap items-center justify-center">
		{#each buttons as button}
			<a
				href={button.href}
				on:click={() => {
					logShareButtonClicked({
						...sharedLogProps,
						'SC - Share Type': button.icon
					});
				}}
				target="_blank"
				class="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-3"
			>
				<ButtonHoverEffect noPadding color="on-bg" noFade />
				<div
					class="{button.iconClasses} relative flex h-11 w-11 items-center justify-center
					rounded-full p-1.5 text-c-bg"
				>
					<IconSc type={button.icon} class="h-full w-full" />
				</div>
				<p class="relative w-full min-w-0 flex-shrink text-center text-xs font-medium">
					{button.buttonText}
				</p>
			</a>
		{/each}
	</div>
	<div class="-mt-0.5 flex w-full items-center rounded-xl bg-c-bg p-1.5">
		<p
			class="w-full min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap px-2 text-sm"
		>
			{url}
		</p>
		<Button
			stringToCopy={url}
			type={copied ? 'success' : 'primary'}
			onClick={() => {
				logShareButtonClicked({
					...sharedLogProps,
					'SC - Share Type': 'copy-link'
				});
				onCopied();
			}}
			noPadding
			noRounding
			class="rounded-lg px-8 py-2.5"
			size="xs"
			buttonType="button"
			noHoverEffect={copied}
		>
			<Morpher morphed={!copied}>
				<div slot="1" class="flex items-center justify-center gap-0.75 text-c-on-primary">
					<div class="-ml-1 h-5.5 w-5.5 flex-shrink-0 transform">
						<IconCopy class="h-full w-full" />
					</div>
					<p class="flex min-w-0 flex-shrink">
						{$LL.Shared.CopyButton()}
					</p>
				</div>
				<div slot="0" class="flex items-center justify-center gap-0.75 text-c-on-primary">
					<div class="-ml-1 h-5.5 w-5.5 flex-shrink-0 transform">
						<IconTick class="h-full w-full" />
					</div>
					<p class="flex min-w-0 flex-shrink">
						{$LL.Shared.CopiedButton()}
					</p>
				</div>
			</Morpher>
		</Button>
	</div>
</div>
