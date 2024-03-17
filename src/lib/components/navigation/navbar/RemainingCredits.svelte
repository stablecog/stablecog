<script lang="ts">
	import { page } from '$app/stores';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import IconToken from '$components/icons/IconToken.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { flyAndScale } from '$ts/animation/transitions';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { isNoCreditsInfoRoute } from '$ts/stores/navbar';
	import { notAtTheVeryTop } from '$ts/stores/scroll';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';
	import { onDestroy } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { sessionStore } from '$ts/constants/supabase';

	let nowInterval: NodeJS.Timeout | undefined;
	const nowIntervalDuration = 1000;
	let now = Date.now();

	$: onUpcomingCreditsTooltipOpenChanged = $userSummary?.refetch
		? (isOpen: boolean) => {
				clearInterval(nowInterval);
				if (isOpen) {
					now = Date.now();
					nowInterval = setInterval(() => {
						now = Date.now();
					}, nowIntervalDuration);
				}
				if ($userSummary?.refetch && isOpen) $userSummary.refetch();
			}
		: undefined;

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});

	$: relativeDate = getRelativeDate({
		now,
		date: $userSummary?.renews_at ?? $userSummary?.more_free_credits_at ?? Date.now(),
		locale: $locale,
		dateStyle: 'long'
	});

	let isFirstRender = true;
	$: totalRemainingCreditsString =
		$userSummary?.total_remaining_credits.toLocaleString($locale) || '';
	$: [totalRemainingCreditsString], onCreditsChanged();

	$: hasUpcomingCredits = $userSummary
		? ($userSummary.renews_at !== undefined &&
				$userSummary.renews_at_credit_amount !== undefined) ||
			($userSummary.more_free_credits_at !== undefined &&
				$userSummary.more_free_credits_at_credit_amount !== undefined)
		: false;

	let creditsChangedCounter = 0;
	function onCreditsChanged() {
		if (isFirstRender) {
			isFirstRender = false;
			return;
		}
		creditsChangedCounter++;
	}

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

{#if $sessionStore && $userSummary}
	<WithTooltip
		delay={150}
		let:trigger
		let:triggerStoreValue
		onOpenChanged={onUpcomingCreditsTooltipOpenChanged}
	>
		<div slot="tooltip" class="flex max-w-full flex-col break-words text-sm">
			<p class="min-w-0 flex-shrink font-bold">
				{!hasUpcomingCredits
					? $LL.UpcomingCredits.NoUpcomingCreditsTooltip.Title()
					: $userSummary.renews_at
						? $LL.UpcomingCredits.MorePaidPlanCreditsTooltip.Title()
						: $LL.UpcomingCredits.MoreFreeCreditsTooltip.Title()}
			</p>
			<p class="mt-0.5 min-w-0 flex-shrink font-medium text-c-on-bg/75">
				{!hasUpcomingCredits
					? $LL.UpcomingCredits.NoUpcomingCreditsTooltip.Paragraph()
					: $userSummary.renews_at
						? $LL.UpcomingCredits.MorePaidPlanCreditsTooltip.Paragraph()
						: $LL.UpcomingCredits.MoreFreeCreditsTooltip.Paragraph()}
			</p>
			{#if hasUpcomingCredits}
				<div
					class="flex flex-wrap items-center justify-start gap-2 rounded-md
					pb-0.25 pt-1.25 text-left font-bold text-c-primary"
				>
					<div class="flex min-w-0 max-w-full flex-shrink items-center justify-center">
						<IconToken class="-ml-0.75 h-4.5 w-4.5 flex-shrink-0" />
						<p class="-mb-0.5 min-w-0 flex-shrink text-lg">
							{numberFormatter.format(
								$userSummary.renews_at_credit_amount ??
									$userSummary.more_free_credits_at_credit_amount ??
									0
							)}&nbsp;&nbsp;<span
								class="rounded-md bg-c-primary/10 px-1.75 py-1 align-middle text-sm font-medium"
								>{relativeDate}</span
							>
						</p>
					</div>
				</div>
			{/if}
		</div>
		<div
			use:trigger
			{...triggerStoreValue}
			tabindex="0"
			role="button"
			class="mr-3.5 cursor-default flex-col items-end rounded md:mr-4 {$isNoCreditsInfoRoute
				? 'hidden md:flex'
				: 'flex'} {$page.url.pathname === '/' && $themeApp === 'light' && !$notAtTheVeryTop
				? 'text-c-bg'
				: 'text-c-on-bg'}"
		>
			<p
				class="text-xs font-medium {$page.url.pathname === '/' &&
				$themeApp === 'light' &&
				!$notAtTheVeryTop
					? 'text-c-bg/60'
					: 'text-c-on-bg/60'}"
			>
				{$LL.Account.RemainingTitle()}
			</p>
			<div class="-mt-0.25 flex items-center gap-0.25">
				<div
					class="flex-shrink-0 transition duration-1000"
					style="transform: rotate({creditsChangedCounter * 180}deg)"
				>
					<IconToken class="-ml-0.25 h-4 w-4" />
				</div>
				<div class="numerator-fade relative z-0 mt-0.25 flex overflow-hidden text-sm font-bold">
					{#each totalRemainingCreditsString.split('') as character, index (character + index)}
						<p
							class="leading-6"
							in:flyAndScale={{
								duration: 1000,
								easing: quadOut,
								yPercent: -100,
								opacity: 0
							}}
							out:flyAndScale={{
								duration: 1000,
								easing: quadOut,
								yPercent: 100,
								opacity: 0,
								isAbsolute: true
							}}
						>
							{character}
						</p>
					{/each}
				</div>
			</div>
		</div>
	</WithTooltip>
{/if}

<style>
	.numerator-fade {
		mask-image: linear-gradient(
			to bottom,
			transparent 0rem,
			black 0.3rem,
			black 1.2rem,
			transparent 1.5rem
		);
	}
</style>
