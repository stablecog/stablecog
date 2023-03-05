<script>
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
</script>

<MetaTag
	title="Update Subscription | Stablecog"
	description="Update your Stablecog subscription."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="plans" class="w-full flex flex-col items-center justify-start">
			<h1 class="text-center font-bold text-4xl">
				{$LL.Account.Subscription.UpdateSubscriptionTitle()}
			</h1>
			<div
				class="w-full max-w-sm flex flex-col items-center p-4 rounded-3xl bg-c-bg ring-2 ring-c-bg-secondary mt-6 
        shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
			>
				<div class="w-full flex flex-col items-start px-1 md:px-2 gap-5">
					<div class="w-full flex flex-col">
						<p class="text-sm text-c-on-bg/60 font-medium">
							{$LL.Account.Subscription.CurrentPlanTitle()}
						</p>
						<p class="max-w-xl text-left font-bold text-2xl mt-1 text-c-on-bg">
							Pro<span class="text-base font-medium text-c-on-bg/40 ml-1.5">($25/month)</span>
						</p>
					</div>
					<div class="transform rotate-90 -mt-2">
						<IconArrowRight class="w-8 h-8 text-c-on-bg/40 flex-shrink-0" />
					</div>
					<div class="w-full flex flex-col">
						<p class="text-sm text-c-on-bg/60 font-medium">
							{$LL.Account.Subscription.Downgrade.DowngradingToTitle()}
						</p>
						<p class="max-w-xl text-left font-bold text-2xl mt-1 text-c-on-bg">
							Starter<span class="text-base font-medium text-c-on-bg/40 ml-1.5">($10/month)</span>
						</p>
					</div>
				</div>
				<p class="w-full rounded-lg px-3 md:px-4 py-3 bg-c-on-bg/5 text-c-on-bg/60 text-sm mt-6">
					{$LL.Account.Subscription.Downgrade.Explanation()}
				</p>
				<Button class="mt-4 w-full" onClick={() => null}>{$LL.Shared.ConfirmButton()}</Button>
			</div>
		</section>
	</div>
</PageWrapper>
