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
	import PageWrapper from '$components/PageWrapper.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { fade, fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { portal } from 'svelte-portal';
	import type { PageData } from './$types';
	import {
		PUBLIC_STRIPE_PRICE_ID_PRO_TEST,
		PUBLIC_STRIPE_PRICE_ID_STARTER_TEST,
		PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST
	} from '$env/static/public';

	export let data: PageData;

	const starter = data.prices.find((price) => price.id === PUBLIC_STRIPE_PRICE_ID_STARTER_TEST);
	const pro = data.prices.find((price) => price.id === PUBLIC_STRIPE_PRICE_ID_PRO_TEST);
	const ultimate = data.prices.find((price) => price.id === PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST);

	const cards = [
		{
			title: 'Starter',
			priceId: starter?.id!,
			currency: starter?.currency!,
			currencySymbol: starter?.currencySymbol!,
			amount: starter?.amount!
		},
		{
			title: 'Pro',
			priceId: pro?.id!,
			currency: pro?.currency!,
			currencySymbol: pro?.currencySymbol!,
			amount: pro?.amount!
		},
		{
			title: 'Ultimate',
			priceId: ultimate?.id!,
			currency: ultimate?.currency!,
			currencySymbol: ultimate?.currencySymbol!,
			amount: ultimate?.amount!
		}
	];

	console.log('cards', cards);

	let checkoutCreationStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let isSignInModalOpen = false;

	async function createCheckoutSessionAndRedirect({
		priceId,
		currency
	}: {
		priceId: string;
		currency: string;
	}) {
		try {
			checkoutCreationStatus = 'loading';
			const res = await fetch(
				`/api/stripe/create-checkout-session?price_id=${priceId}&currency=${currency}`
			);
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
		<h1 class="text-center font-bold text-4xl">{$LL.Pro.PageTitle()}</h1>
		<p class="max-w-2xl mt-4 text-center leading-relaxed text-c-on-bg/75">
			{$LL.Pro.PageParagraph()}
		</p>
		<div class="w-full max-w-7xl flex gap-5">
			{#each cards as card}
				<div
					class="mt-8 max-w-[34rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] 
					 p-4 md:p-6 rounded-2xl md:rounded-3xl ring-2 ring-c-primary"
				>
					<h2
						class="font-bold text-3xl text-c-primary md:-mt-2 flex justify-center items-center gap-2 text-center"
					>
						{card.title}
					</h2>
					<h3
						class="w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] text-center bg-c-primary text-c-on-primary
				-mx-4 md:-mx-6 mt-4 px-5 py-3 font-bold flex justify-center items-start"
					>
						<span class="text-xl">{card.currencySymbol}</span><span class="text-4xl font-extrabold">
							{card.amount}
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
							onClick={() =>
								createCheckoutSessionAndRedirect({
									priceId: card.priceId,
									currency: card.currency
								})}
							class="w-full mt-8">{$LL.Pro.BecomeProButton()}</Button
						>
					{:else}
						<Button onClick={() => (isSignInModalOpen = true)} class="w-full mt-8">
							{$LL.SignUp.SignUpButton()}
						</Button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</PageWrapper>

{#if isSignInModalOpen && !$page.data.session?.user.id}
	<div
		use:portal={'body'}
		transition:fade|local={{ duration: 300, easing: quadOut }}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
	/>
	<div
		use:portal={'body'}
		transition:fly|local={{ duration: 200, y: 50, easing: quadOut }}
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
	>
		<div
			use:clickoutside={{ callback: () => (isSignInModalOpen = false) }}
			class="w-full max-w-2xl flex justify-center my-auto"
		>
			<SignInCard isModal={true} redirectTo={$page.url.pathname} />
		</div>
	</div>
{/if}
