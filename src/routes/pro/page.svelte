<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import type Stripe from 'stripe';

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
		<h1 class="text-center font-bold text-4xl">Become a Pro</h1>
		<p class="max-w-2xl mt-4 text-left leading-relaxed text-c-on-bg/75">
			Unlock all the features of Stablecog and support the project. Without the pro members,
			Stablecog wouldn't be able to stay completely open source and offer free generations to
			everyone without a sign up.
		</p>
		<div
			class="mt-8 max-w-[34rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] 
			p-6 md:p-8 rounded-2xl md:rounded-3xl ring-2 ring-c-primary"
		>
			<h2 class="font-bold text-3xl text-c-primary -mt-2 flex items-center gap-2">
				<IconStar class="w-8 h-8" /> Pro
			</h2>
			<ul class="mt-4 flex flex-col gap-3">
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> Full speed without set limits
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> Different image dimensions
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> Upscale images
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> Different inference steps
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> More models
					<span class="text-c-on-bg/50">(soon)</span>
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> More schedulers
					<span class="text-c-on-bg/50">(soon)</span>
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> Generations saved to cloud
					<span class="text-c-on-bg/50">(soon)</span>
				</li>
				<li class="flex items-center gap-3">
					<IconTickOnly class="text-c-primary w-5 h-5 shrink-0" /> Upcoming features
					<span class="text-c-on-bg/50">(Canvas, Img2Img)</span>
				</li>
			</ul>
			{#if $page.data.session?.user.email}
				<Button
					withSpinner
					loading={checkoutCreationStatus === 'loading'}
					onClick={createCheckoutSessionAndRedirect}
					class="w-full mt-8">Become a Pro</Button
				>
			{:else}
				<Button
					href={`/signup?redirect_to=${encodeURIComponent('/pro')}`}
					withSpinner
					loading={checkoutCreationStatus === 'loading'}
					class="w-full mt-8">Sign Up</Button
				>
			{/if}
		</div>
	</div>
</div>
