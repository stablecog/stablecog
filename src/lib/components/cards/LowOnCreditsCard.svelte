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

	export { classes as class };
	let classes = '';

	$: logProps = {
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - User Id': $page.data.session?.user.id,
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
	class="max-w-full flex flex-col md:flex-row justify-between md:items-center items-start rounded-xl md:rounded-2xl bg-c-primary/10 ring-2 ring-c-primary/20 {classes}"
>
	<div class="flex flex-1 flex-col px-4 py-4 max-w-lg">
		<p class="font-bold text-base md:text-lg text-c-primary -mt-0.5 md:-mt-1">
			{$LL.LowOnCreditsCard.Title({ remainingCredits: $userSummary?.total_remaining_credits })}
		</p>
		{#if !$userSummary?.product_id && $userSummary?.more_credits_at && $userSummary?.more_credits_at_credit_amount}
			<p class="mt-1">
				{$LL.LowOnCreditsCard.FreeWithMoreOnTheWay.Paragraph()}
			</p>
			<div
				class="text-left font-bold flex justify-start items-center flex-wrap
					rounded-md pt-1.25 pb-0.25 text-c-primary gap-2"
			>
				<div class="max-w-full flex justify-center items-center flex-shrink min-w-0">
					<IconToken class="w-4.5 h-4.5 -ml-0.75 flex-shrink-0" />
					<p class="text-lg flex-shrink min-w-0 -mb-0.5">
						{numberFormatter.format(
							$userSummary.renews_at_credit_amount ??
								$userSummary.more_free_credits_at_credit_amount ??
								0
						)}
					</p>
				</div>
				<p
					class="max-w-full bg-c-primary/10 px-1.75 py-0.25 rounded-md font-medium text-sm flex-shrink min-w-0"
				>
					{relativeDate}
				</p>
			</div>
		{:else}
			<p class="mt-1 leading-relaxed text-sm md:text-base">
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
		class="w-full md:w-auto flex justify-start items-center md:flex-col md:items-stretch gap-2 flex-wrap -mt-4 md:mt-0 p-3.5 md:p-3"
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
