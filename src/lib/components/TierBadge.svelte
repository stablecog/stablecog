<script lang="ts">
	import IconSubscriptionTier from '$components/icons/IconSubscriptionTier.svelte';
	import type { IStripeSubscriptionTier } from '$ts/types/stripe';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let tier: IStripeSubscriptionTier;
	export { classes as class };
	export let size: 'xs' | 'sm' | 'md' = 'sm';
	let classes = '';
</script>

<div
	transition:scale|local={{ duration: 150, easing: quadOut, start: 0, opacity: 0 }}
	class="bg-c-bg border-2 border-c-bg-secondary overflow-hidden z-10 shadow-lg 
  shadow-c-shadow/[var(--o-shadow-normal)] {size === 'xs'
		? 'rounded-md'
		: size === 'md'
		? 'rounded-lg2'
		: 'rounded-lg'} {classes}"
>
	<div
		class="flex items-center justify-center text-c-primary bg-c-primary/15 z-10
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
			{tier.toUpperCase()}
		</p>
	</div>
</div>
