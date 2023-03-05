<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS } from '$ts/constants/stripePublic';
	import { userSummary } from '$ts/stores/user/summary';

	export { classes as class };
	let classes = '';
</script>

<div
	class="max-w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 rounded-2xl bg-c-primary/10 ring-2 ring-c-primary/20 p-3 md:p-4 {classes}"
>
	<div class="flex flex-1 flex-col px-1 max-w-xl">
		<p class="font-bold text-lg text-c-primary -mt-0.5 md:-mt-1">
			{$LL.LowOnCreditsCard.Title({ remainingCredits: $userSummary?.total_remaining_credits })}
		</p>
		<p class="mt-1 leading-relaxed text-sm">
			{#if !$userSummary?.product_id}
				{$LL.LowOnCreditsCard.FreeParagraph()}
			{:else if $userSummary?.product_id === STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS}
				{$LL.LowOnCreditsCard.HighestPlanParagraph()}
			{:else}
				{$LL.LowOnCreditsCard.OtherPlansParagraph()}
			{/if}
		</p>
	</div>
	<div class="w-full md:w-auto flex justify-start items-center flex-wrap gap-3">
		{#if !$userSummary?.product_id}
			<Button size="sm" href="/pricing#plans">{$LL.Pricing.SubscribeButton()}</Button>
			<Button size="sm" href="/discord">{$LL.Shared.JoinOnDiscord()}</Button>
		{:else}
			{#if $userSummary?.product_id !== STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS}
				<Button size="sm" href="/pricing#plans">{$LL.Pricing.UpgradeButton()}</Button>
			{/if}
			<Button size="sm" href="/pricing#credit-packs">{$LL.Pricing.BuyCreditsButton()}</Button>
		{/if}
	</div>
</div>
