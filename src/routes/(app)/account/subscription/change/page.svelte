<script lang="ts">
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import { getApiUrl, staticAssetBaseUrl } from '$ts/constants/main.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS
	} from '$ts/constants/stripePublic.js';
	import { sessionStore } from '$ts/constants/supabase.js';
	import { getInfoFromPriceId } from '$ts/helpers/stripe/plan.js';
	import { userSummary } from '$ts/stores/user/summary.js';
	import { createMutation } from '@tanstack/svelte-query';

	export let data;

	$: info = data.previewData;

	$: currentPlanInfo = {
		...getInfoFromPriceId($LL, info.current_plan),
		priceId: info.current_plan
	};
	$: newPlanInfo = {
		...getInfoFromPriceId($LL, info.new_plan),
		priceId: info.new_plan
	};

	$: confirmPlanChangeMutation = createMutation({
		mutationFn: confirmPlanChange,
		mutationKey: [
			'confirmPlanChange',
			info.current_plan,
			info.new_plan,
			$sessionStore?.access_token
		]
	});

	async function confirmPlanChange() {
		if (!$sessionStore?.access_token) {
			throw new Error('No access token');
		}
		const url = `${getApiUrl().origin}/v1/user/subscription/update/commit`;
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$sessionStore.access_token}`
			},
			body: JSON.stringify({
				target_price_id: newPlanInfo.priceId
			})
		});
		const data = await res.json();
		console.log(data);
		try {
			if ($userSummary?.refetch) {
				console.log('Refetching user summary');
				await $userSummary.refetch();
			}
		} catch (error) {
			console.error('Error refetching user summary', error);
		}
		return data;
	}
</script>

<MetaTag
	title="Change Plan | Stablecog"
	description="Change your Stablecog subscription plan. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<div class="flex w-full flex-1 justify-center px-4 pb-20 pt-12">
	<div class="my-auto flex w-full max-w-md flex-col items-center">
		<div class="flex w-full flex-row items-center justify-center">
			<IconTick
				class="{$confirmPlanChangeMutation.isSuccess
					? 'mr-2 size-7 text-c-success opacity-100 md:size-9'
					: 'mr-0 size-0'} mb-1 transition"
			/>
			<h1
				class="min-w-0 flex-shrink text-center text-4xl font-bold transition {$confirmPlanChangeMutation.isSuccess
					? 'text-c-success'
					: 'text-c-on-bg'}"
			>
				{!$confirmPlanChangeMutation.isSuccess
					? $LL.Account.Subscription.ChangePlanTitle()
					: $LL.Account.Subscription.PlanChangedTitle()}
			</h1>
		</div>
		<div
			class="mt-6 flex w-full flex-col break-words rounded-2xl bg-c-bg px-5 py-4 shadow-xl
      shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary md:rounded-3xl md:px-6 md:py-5"
		>
			<!-- Current Plan -->
			{#if !$confirmPlanChangeMutation.isSuccess}
				<div out:expandCollapse={{ duration: 200 }} class="w-full">
					<div class="flex w-full items-end justify-between gap-6">
						<div class="flex min-w-0 flex-shrink flex-col">
							<p class="w-full text-base text-c-on-bg/60">
								{$LL.Account.Subscription.CurrentPlanTitle()}
							</p>
							<h2 class="w-full text-lg font-bold md:text-xl">
								{currentPlanInfo.title}
							</h2>
						</div>
						<div class="flex flex-col items-end">
							<h3 class="text-lg font-bold md:text-xl">
								{STRIPE_CURRENCY_TO_SYMBOL[info.currency]}{STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
									currentPlanInfo.productId
								].prices[currentPlanInfo.billingType === 'yearly' ? 'yearly' : 'monthly'][
									currentPlanInfo.priceId
								].currencies[info.currency === 'eur' ? 'eur' : 'usd'].amount}
							</h3>
							<p class="-mt-1 text-c-on-bg/60">
								{currentPlanInfo.billingType === 'yearly'
									? $LL.Pricing.SlashYear()
									: $LL.Pricing.SlashMonth()}
							</p>
						</div>
					</div>
					<div class="flex w-full items-center justify-start py-4">
						<IconArrowRight strokeWidth={2} class="-mt-1.5 h-6 w-6 rotate-90 text-c-on-bg" />
					</div>
				</div>
			{/if}
			<!-- New Plan -->
			<div class="flex w-full items-end justify-between gap-6">
				<div class="flex min-w-0 flex-shrink flex-col">
					<p class="text-base text-c-on-bg/60">
						{$LL.Account.Subscription.NewPlanTitle()}
					</p>
					<h2 class="text-lg font-bold md:text-xl">
						{newPlanInfo.title}
					</h2>
				</div>
				<div class="flex flex-col items-end">
					<h3 class="text-lg font-bold md:text-xl">
						{STRIPE_CURRENCY_TO_SYMBOL[info.currency]}{STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
							newPlanInfo.productId
						].prices[newPlanInfo.billingType === 'yearly' ? 'yearly' : 'monthly'][
							newPlanInfo.priceId
						].currencies[info.currency === 'eur' ? 'eur' : 'usd'].amount}
					</h3>
					<p class="-mt-1 text-c-on-bg/60">
						{newPlanInfo.billingType === 'yearly'
							? $LL.Pricing.SlashYear()
							: $LL.Pricing.SlashMonth()}
					</p>
				</div>
			</div>
			{#if !$confirmPlanChangeMutation.isSuccess}
				<div class="w-full">
					<div class="w-full pt-4">
						<div
							class="-mx-5 mt-0 h-2px w-[calc(100%+2.5rem)] bg-c-bg-secondary md:-mx-6 md:mt-1 md:w-[calc(100%+3rem)]"
						/>
					</div>
					<!-- Amount Due -->
					<div class="-mt-1 flex w-full items-center justify-between gap-5 py-5 md:-mt-0.5">
						<h2 class="min-w-0 flex-shrink text-lg font-bold md:text-xl">
							{$LL.Account.Subscription.AmountDueTitle()}
						</h2>
						<p class="text-lg font-bold text-c-primary md:text-xl">
							{STRIPE_CURRENCY_TO_SYMBOL[info.currency]}{info.new_amount}
						</p>
					</div>
					<div
						class="-mx-5 -mt-1 h-2px w-[calc(100%+2.5rem)] bg-c-bg-secondary md:-mx-6 md:mt-0 md:w-[calc(100%+3rem)]"
					/>
				</div>
			{/if}
			<div class="-mx-1 flex w-[calc(100%+0.5rem)] pt-4.5">
				<Button
					onClick={$confirmPlanChangeMutation.mutate}
					loading={$confirmPlanChangeMutation.isPending}
					disabled={$confirmPlanChangeMutation.isPending || $confirmPlanChangeMutation.isSuccess}
					type={$confirmPlanChangeMutation.isSuccess ? 'success' : 'primary'}
					withSpinner
					class="-mt-1 w-full md:mt-0"
				>
					<div class="flex min-w-0 items-center justify-center gap-2">
						<IconTick
							class="-m-1 h-6 w-6 flex-shrink-0 transition {$confirmPlanChangeMutation.isSuccess
								? 'scale-100 opacity-100'
								: 'scale-50 opacity-0'}"
						/>
						<p class="min-w-0 flex-shrink">
							{$confirmPlanChangeMutation.isSuccess
								? $LL.Shared.SuccessfulButton()
								: $LL.Shared.ConfirmButton()}
						</p>
						<div
							class="-m-1 h-6 w-6 flex-shrink-0 transition {$confirmPlanChangeMutation.isSuccess
								? 'scale-100 opacity-100'
								: 'scale-50 opacity-0'}"
						/>
					</div>
				</Button>
			</div>
		</div>
		<NoBgButton
			href={$confirmPlanChangeMutation.isSuccess ? '/generate' : data.from}
			hoverFrom="right"
			class="mt-4"
		>
			<div class="flex items-center justify-center gap-2.5 px-2">
				{#if $confirmPlanChangeMutation.isSuccess}
					<IconHome
						class="h-6 w-6 transform text-c-on-bg/60 transition group-hover:-translate-x-1
						not-touch:group-hover:text-c-primary"
					/>
				{:else}
					<IconBack
						class="h-6 w-6 transform text-c-on-bg/60 transition group-hover:-translate-x-1
         	 	not-touch:group-hover:text-c-primary"
					/>
				{/if}
				<p class="text-c-on-bg/60 transition not-touch:group-hover:text-c-primary">
					{$confirmPlanChangeMutation.isSuccess
						? $LL.Shared.GoHomeButton()
						: $LL.Shared.GoBackButton()}
				</p>
			</div>
		</NoBgButton>
	</div>
</div>
