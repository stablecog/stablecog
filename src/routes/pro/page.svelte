<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import LL from '$i18n/i18n-svelte';
	import type Stripe from 'stripe';
	import type { PageServerData } from './$types';

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
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<h1 class="text-center font-bold text-4xl">{$LL.Pro.PageTitle()}</h1>
		<p class="max-w-2xl mt-4 text-left leading-relaxed text-c-on-bg/75">
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
				{$LL.Pro.ProPlanTitle()}
			</h2>
			<h3
				class="w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] text-center bg-c-primary text-c-on-primary
				-mx-4 md:-mx-6 mt-4 px-5 py-3 font-bold flex justify-center items-start"
			>
				<span class="text-xl">$</span><span class="text-4xl font-extrabold">
					{data.prices.pro / 100}
				</span>
				<span class="self-end mb-1">{$LL.Pro.Month()}</span>
			</h3>
			<ul class="mt-6 flex flex-col gap-3 px-2 md:px-4">
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.FullSpeed()}
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.ImageDimensions()}
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.Upscale()}
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.Steps()}
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.MoreModels()}
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.MoreSchedulers()}
					<span class="text-c-on-bg/50">{$LL.Pro.Soon()}</span>
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
					{$LL.Pro.Features.SavedToCloud()}
					<span class="text-c-on-bg/50">{$LL.Pro.Soon()}</span>
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" />
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
					href={`/signup?redirect_to=${encodeURIComponent('/pro')}`}
					withSpinner
					loading={checkoutCreationStatus === 'loading'}
					class="w-full mt-8">{$LL.SignUp.SignUpButton()}</Button
				>
			{/if}
		</div>
	</div>
</div>
