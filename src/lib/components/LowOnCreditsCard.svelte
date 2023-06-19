<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS } from '$ts/constants/stripePublic';
	import {
		logLowCreditsCardSeen,
		logLowCreditsCardBuyCredits,
		logLowCreditsCardDiscord,
		logLowCreditsCardSubscribe,
		logLowCreditsCardUpgradeClicked
	} from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import { onMount } from 'svelte';

	export { classes as class };
	let classes = '';

	$: logProps = {
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - User Id': $page.data.session?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - App Version': $appVersion
	};

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
		logLowCreditsCardSeen(logProps);
	});
</script>

<div
	class="max-w-full flex flex-col md:flex-row justify-between md:items-center items-start rounded-xl md:rounded-2xl bg-c-primary/10 ring-2 ring-c-primary/20 {classes}"
>
	<div class="flex flex-1 flex-col px-4 py-4 max-w-xl">
		<p class="font-bold text-base md:text-lg text-c-primary -mt-0.5 md:-mt-1">
			{$LL.LowOnCreditsCard.Title({ remainingCredits: $userSummary?.total_remaining_credits })}
		</p>
		<p class="mt-1 leading-relaxed text-xs md:text-base">
			{#if !$userSummary?.product_id}
				{$LL.LowOnCreditsCard.FreeParagraph()}
			{:else if $userSummary?.product_id === STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS}
				{$LL.LowOnCreditsCard.HighestPlanParagraph()}
			{:else}
				{$LL.LowOnCreditsCard.OtherPlansParagraph()}
			{/if}
		</p>
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
