<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import type Stripe from 'stripe';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import ConfettiFullScreen from '$components/ConfettiFullScreen.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import IconInfo from '$components/icons/IconInfo.svelte';

	export let data: PageServerData;

	let checkoutCreationStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';

	async function createCheckoutSessionAndRedirect() {
		try {
			checkoutCreationStatus = 'loading';
			const res = await fetch('/api/stripe/create-checkout-session?tier=pro');
			const resJson: ICheckoutSessionRes = await res.json();
			if (resJson.error) {
				throw new Error(resJson.error);
			}
			const checkoutSession = resJson.data.checkoutSession;
			if (!checkoutSession.url) {
				throw new Error('No checkout session url returned');
			}
			checkoutCreationStatus = 'success';
			await goto(checkoutSession.url);
		} catch (error) {
			checkoutCreationStatus = 'error';
			console.log(error);
		}
	}

	interface ICheckoutSessionRes {
		data: {
			checkoutSession: Stripe.Response<Stripe.Checkout.Session>;
		};
		error: string;
	}

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<MetaTag
	title="Pro | Stablecog"
	description="Become a pro member on Stablecog to unlock all of its features."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		{#if $page.data.tier === 'FREE'}
			{#if data.reason}
				<div class="bg-c-bg rounded-xl -mx-2 md:mx-0 -mt-4 md:-mt-2 mb-6 md:mb-8">
					<div
						class="flex items-center justify-center max-w-2xl bg-c-primary/10 text-left
						border-2 border-c-primary/20 text-c-primary px-4 md:px-5 py-2.5 md:py-3 rounded-xl gap-2 md:gap-2.5 
						shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
					>
						<IconInfo class="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 -ml-1.5" />
						<p class="font-medium text-sm md:text-base min-w-0 flex-shrink leading-relaxed">
							{#if data.reason === 'upscale'}
								{$LL.Pro.Reason.ParagraphUpscale()}
							{:else if data.reason === 'model'}
								{$LL.Pro.Reason.ParagraphModel()}
							{:else if data.reason === 'dimensions'}
								{$LL.Pro.Reason.ParagraphDimensions()}
							{:else if data.reason === 'width'}
								{$LL.Pro.Reason.ParagraphWidth()}
							{:else if data.reason === 'height'}
								{$LL.Pro.Reason.ParagraphHeight()}
							{:else if data.reason === 'scheduler'}
								{$LL.Pro.Reason.ParagraphScheduler()}
							{:else if data.reason === 'steps'}
								{$LL.Pro.Reason.ParagraphInferenceSteps()}
							{:else if data.reason === 'model_generation'}
								{$LL.Pro.Reason.ParagraphModelGeneration()}
							{:else if data.reason === 'dimensions_generation'}
								{$LL.Pro.Reason.ParagraphDimensionsGeneration()}
							{:else if data.reason === 'steps_generation'}
								{$LL.Pro.Reason.ParagraphInferenceStepsGeneration()}
							{:else if data.reason === 'scheduler_generation'}
								{$LL.Pro.Reason.ParagraphSchedulerGeneration()}
							{/if}
						</p>
					</div>
				</div>
			{/if}
			<h1 class="text-center font-bold text-4xl">{$LL.Pro.PageTitle()}</h1>
			<p class="max-w-2xl mt-4 text-center leading-relaxed text-c-on-bg/75">
				{$LL.Pro.PageParagraph()}
			</p>
			<div
				class="mt-8 max-w-[34rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] 
				p-4 md:p-6 rounded-2xl md:rounded-3xl ring-2 ring-c-primary"
			>
				<h2
					class="font-bold text-3xl text-c-primary md:-mt-2 flex justify-center items-center gap-2 text-center"
				>
					<IconStar class="w-8 h-8" />
					{$LL.Pro.Tier.Title.Pro()}
				</h2>
				<h3
					class="w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] text-center bg-c-primary text-c-on-primary
					-mx-4 md:-mx-6 mt-4 px-5 py-3 font-bold flex justify-center items-start"
				>
					<span class="text-xl">{data.prices.pro.currency === 'eur' ? '€' : '$'}</span><span
						class="text-4xl font-extrabold"
					>
						{data.prices.pro.amount / data.prices.pro.amountDivider}
					</span>
					<span class="self-end mb-1">{$LL.Pro.Month()}</span>
				</h3>
				<ul class="mt-6 flex flex-col gap-3 px-4 md:px-6">
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.FullSpeed()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.ImageDimensions()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.Upscale()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.Steps()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.MoreModels()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.SavedToCloud()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.CommercialUse()}
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.MoreSchedulers()}
						<span class="text-c-on-bg/50">{$LL.Pro.Soon()}</span>
					</li>
					<li class="flex items-center gap-3">
						<IconTickOnly class="text-c-primary w-5 h-5 shrink-0 -ml-2" />
						{$LL.Pro.Features.Upcoming()}
					</li>
				</ul>
				{#if $page.data.session?.user.email}
					<Button
						withSpinner
						loading={checkoutCreationStatus === 'loading'}
						onClick={createCheckoutSessionAndRedirect}
						class="w-full mt-8">{$LL.Pro.BecomeProButton()}</Button
					>
				{:else}
					<Button
						href={`/sign-up?redirect_to=${encodeURIComponent('/pro')}`}
						withSpinner
						loading={checkoutCreationStatus === 'loading'}
						class="w-full mt-8">{$LL.SignUp.SignUpButton()}</Button
					>
				{/if}
			</div>
		{:else}
			<IconConfetti class="w-24 h-24 text-c-primary" />
			<h1 class="text-center font-bold text-4xl mt-4 text-c-primary">
				{$LL.Pro.PageTitleAlreadyPro()}
			</h1>
			<p class="max-w-2xl mt-4 text-center leading-relaxed text-c-on-bg/75">
				{$LL.Pro.PageParagraphAlreadyPro()}
			</p>
			<Button href="/" target="_self" prefetch={true} class="mt-6">
				{$LL.Shared.StartGeneratingButton()}
			</Button>
		{/if}
	</div>
</PageWrapper>

{#if mounted && $page.data.tier === 'PRO'}
	<ConfettiFullScreen />
{/if}
