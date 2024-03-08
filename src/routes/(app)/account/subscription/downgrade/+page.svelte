<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/primitives/buttons/Button.svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO
	} from '$ts/constants/stripePublic';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import { getUserSummary } from '$ts/helpers/user/user';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';

	export let data;

	const currentPriceId = data.current_price_id;
	const targetPriceId = data.target_price_id;
	const currentProductId = data.current_product_id;
	const targetProductId = data.target_product_id;
	const currency = data.currency;

	let changePlanStatus: 'idle' | 'loading' | 'success' = 'idle';

	$: currentPlan = {
		title: getTitleFromProductId($LL, currentProductId),
		amount:
			currency === 'eur'
				? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[currentProductId].prices[currentPriceId]
						.currencies.eur.amount
				: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[currentProductId].prices[currentPriceId]
						.currencies.usd.amount
	};

	$: targetPlan = {
		title: getTitleFromProductId($LL, targetProductId),
		amount:
			currency === 'eur'
				? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[targetProductId].prices[targetPriceId]
						.currencies.eur.amount
				: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[targetProductId].prices[targetPriceId]
						.currencies.usd.amount
	};

	async function changePlan() {
		changePlanStatus = 'loading';
		try {
			const res = await fetch(`${apiUrl.origin}/v1/user/subscription/downgrade`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sessionStore?.access_token}`
				},
				body: JSON.stringify({
					target_price_id: targetPriceId
				})
			});
			const data = await res.json();
			if (data.success) {
				const summary = await getUserSummary($sessionStore?.access_token);
				if (summary) {
					userSummary.set(summary);
				}
				await goto('/account/subscription/downgrade/succeeded');
				changePlanStatus = 'success';
			} else {
				changePlanStatus = 'idle';
			}
		} catch (error) {
			changePlanStatus = 'idle';
			console.log(error);
		}
	}
</script>

<MetaTag
	title="Change Plan | Stablecog"
	description="Change your Stablecog subscription plan. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<section class="flex w-full flex-col items-center justify-start">
			<h1 class="text-center text-4xl font-bold">
				{$LL.Account.Subscription.ChangePlanTitle()}
			</h1>
			<div
				class="mt-6 flex w-full max-w-sm flex-col items-center rounded-3xl bg-c-bg p-4 shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
        ring-2 ring-c-bg-secondary"
			>
				<div class="flex w-full flex-col items-start gap-5 px-1 md:px-2">
					<div class="flex w-full flex-col">
						<p class="text-sm font-medium text-c-on-bg/60">
							{$LL.Account.Subscription.CurrentPlanTitle()}
						</p>
						<p
							class="mt-1 flex flex-wrap items-center gap-1.5 text-left text-2xl font-bold text-c-on-bg"
						>
							<span class="pr-1">{currentPlan.title}</span><span
								class="my-auto rounded-md bg-c-primary/15 px-1.5 py-0.5
								text-base font-medium text-c-primary"
								>{STRIPE_CURRENCY_TO_SYMBOL[
									currency
								]}{currentPlan.amount}{$LL.Pricing.SlashMonth()}</span
							>
						</p>
					</div>
					<div class="-mt-2 rotate-90 transform">
						<IconArrowRight class="h-8 w-8 flex-shrink-0 text-c-on-bg/50" />
					</div>
					<div class="flex w-full flex-col">
						<p class="text-sm font-medium text-c-on-bg/60">
							{$LL.Account.Subscription.Downgrade.DowngradingToTitle()}
						</p>
						<p
							class="mt-1 flex flex-wrap items-center gap-1.5 text-left text-2xl font-bold text-c-on-bg"
						>
							<span class="pr-1">{targetPlan.title}</span><span
								class="rounded-md bg-c-primary/15 px-1.5 py-0.5 text-base font-medium text-c-primary"
								>{STRIPE_CURRENCY_TO_SYMBOL[
									currency
								]}{targetPlan.amount}{$LL.Pricing.SlashMonth()}</span
							>
						</p>
					</div>
				</div>
				<p class="mt-6 w-full rounded-lg bg-c-on-bg/5 px-3 py-3 text-sm text-c-on-bg/60 md:px-4">
					{$LL.Account.Subscription.Downgrade.Explanation()}
				</p>
				<Button
					class="mt-4 w-full"
					loading={changePlanStatus === 'loading'}
					withSpinner
					onClick={changePlan}>{$LL.Shared.ConfirmButton()}</Button
				>
			</div>
			<div class="mt-4">
				<NoBgButton href="/pricing" hoverFrom="right">
					<div class="flex items-center justify-center gap-2.5 px-2 py-1">
						<IconBack
							class="h-6 w-6 transform text-c-on-bg/50 transition group-hover:-translate-x-1
							not-touch:group-hover:text-c-primary"
						/>
						<p class="text-c-on-bg/50 transition not-touch:group-hover:text-c-primary">
							{$LL.Shared.GoBackButton()}
						</p>
					</div>
				</NoBgButton>
			</div>
		</section>
	</div>
</PageWrapper>
