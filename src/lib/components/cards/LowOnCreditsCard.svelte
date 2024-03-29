<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/primitives/buttons/Button.svelte';
	import IconToken from '$components/icons/IconToken.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS } from '$ts/constants/stripePublic';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import {
		logLowCreditsCardSeen,
		logLowCreditsCardBuyCredits,
		logLowCreditsCardDiscord,
		logLowCreditsCardSubscribe,
		logLowCreditsCardUpgradeClicked
	} from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import { onDestroy, onMount } from 'svelte';
	import { sessionStore } from '$ts/constants/supabase';

	export { classes as class };
	let classes = '';

	$: logProps = {
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - User Id': $sessionStore?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - App Version': $appVersion
	};

	let nowInterval: NodeJS.Timeout | undefined;
	const nowIntervalDuration = 1000;
	let now = Date.now();

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

	function logEvent(type: 'subscribe' | 'discord' | 'upgrade' | 'buy-credits') {
		switch (type) {
			case 'subscribe':
				logLowCreditsCardSubscribe(logProps);
				break;
			case 'discord':
				logLowCreditsCardDiscord(logProps);
				break;
			case 'upgrade':
				logLowCreditsCardUpgradeClicked(logProps);
				break;
			case 'buy-credits':
				logLowCreditsCardBuyCredits(logProps);
				break;
		}
	}

	onMount(() => {
		nowInterval = setInterval(() => {
			now = Date.now();
		}, nowIntervalDuration);
		logLowCreditsCardSeen(logProps);
	});

	onDestroy(() => {
		if (nowInterval) {
			clearInterval(nowInterval);
		}
	});
</script>

<div
	class="flex max-w-full flex-col items-start justify-between rounded-xl bg-c-primary/10 ring-2 ring-c-primary/20 md:flex-row md:items-center md:rounded-2xl {classes}"
>
	<div class="flex max-w-lg flex-1 flex-col px-4 py-4">
		<p class="-mt-0.5 text-base font-bold text-c-primary md:-mt-1 md:text-lg">
			{$LL.LowOnCreditsCard.Title({ remainingCredits: $userSummary?.total_remaining_credits })}
		</p>
		{#if !$userSummary?.product_id && $userSummary?.more_credits_at && $userSummary?.more_credits_at_credit_amount}
			<p class="mt-1">
				{$LL.LowOnCreditsCard.FreeWithMoreOnTheWay.Paragraph()}
			</p>
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
						)}
					</p>
				</div>
				<p
					class="min-w-0 max-w-full flex-shrink rounded-md bg-c-primary/10 px-1.75 py-0.25 text-sm font-medium"
				>
					{relativeDate}
				</p>
			</div>
		{:else}
			<p class="mt-1 text-sm leading-relaxed md:text-base">
				{#if !$userSummary?.product_id}
					{$LL.LowOnCreditsCard.FreeParagraph()}
				{:else if $userSummary?.product_id === STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS}
					{$LL.LowOnCreditsCard.HighestPlanParagraph()}
				{:else}
					{$LL.LowOnCreditsCard.OtherPlansParagraph()}
				{/if}
			</p>
		{/if}
	</div>
	<div
		class="-mt-4 flex w-full flex-wrap items-center justify-start gap-2 p-3.5 md:mt-0 md:w-auto md:flex-col md:items-stretch md:p-3"
	>
		{#if !$userSummary?.product_id}
			<Button onClick={() => logEvent('subscribe')} size="sm" href="/pricing#plans"
				>{$LL.Pricing.SubscribeButton()}</Button
			>
			<Button onClick={() => logEvent('discord')} size="sm" href="/discord"
				>{$LL.Shared.JoinOnDiscord()}</Button
			>
		{:else}
			{#if $userSummary?.product_id !== STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS}
				<Button onClick={() => logEvent('upgrade')} size="sm" href="/pricing#plans"
					>{$LL.Pricing.UpgradeButton()}</Button
				>
			{/if}
			<Button onClick={() => logEvent('buy-credits')} size="sm" href="/pricing#credit-packs"
				>{$LL.Pricing.BuyCreditsButton()}</Button
			>
		{/if}
	</div>
</div>
