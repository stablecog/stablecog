<script lang="ts">
	import IconSubscriptionTier from '$components/icons/IconSubscriptionTier.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { IStripeSubscriptionTier } from '$ts/types/stripe';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let tier: IStripeSubscriptionTier;
	export let size: 'xs' | 'sm' | 'md' = 'sm';
	export let outline: 'primary' | 'on-bg' | undefined = undefined;
	export { classes as class };
	let classes = '';

	$: tierText = tier === 'PRO' ? $LL.Pro.Tier.Badge.Pro() : $LL.Pro.Tier.Badge.Free();
</script>

<div
	transition:scale|local={{ duration: 150, easing: quadOut, start: 0, opacity: 0 }}
	class="bg-c-bg border-2 overflow-hidden z-10 shadow-lg flex-shrink-0
  shadow-c-shadow/[var(--o-shadow-normal)] {outline === 'on-bg'
		? 'border-c-on-bg/30'
		: tier === 'FREE'
		? 'border-c-on-bg/25'
		: 'border-c-primary/30'} {size === 'xs'
		? 'rounded-md'
		: size === 'md'
		? 'rounded-lg2'
		: 'rounded-lg'} {classes}"
>
	<div
		class="flex items-center justify-center z-10 {tier === 'FREE'
			? 'text-c-on-bg bg-c-on-bg/15'
			: 'text-c-primary bg-c-primary/15'}
    {size === 'xs'
			? 'gap-1 px-1 py-0.5'
			: size === 'md'
			? 'gap-1.5 px-3 py-1.25'
			: 'gap-1.5 px-2 py-1'}"
	>
		<IconSubscriptionTier
			type={tier}
			class={size === 'xs'
				? 'w-3.5 h-3.5 -ml-0.25'
				: size === 'md'
				? 'w-5 h-5 -ml-0.75'
				: 'w-4 h-4 -ml-0.5'}
		/>
		<p class="font-semibold {size === 'xs' ? 'text-xxs' : size === 'md' ? 'text-sm' : 'text-xs'}">
			{tierText}
		</p>
	</div>
</div>
