<script lang="ts">
	import {
		PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST,
		PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST,
		PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST
	} from '$env/static/public';
	import LL from '$i18n/i18n-svelte';
	import type { TStripeSupportedProductId } from '$ts/constants/stripePublic';

	export let productId: TStripeSupportedProductId | undefined;
	export let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
	export { classes as class };
	let classes = '';

	let planText: string;
	$: [$LL], setPlanText();

	function setPlanText() {
		if (productId === PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST) {
			planText = $LL.Pricing.Plans.StarterTitle();
		} else if (productId === PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST) {
			planText = $LL.Pricing.Plans.ProTitle();
		} else if (productId === PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST) {
			planText = $LL.Pricing.Plans.UltimateTitle();
		} else {
			planText = $LL.Pricing.Plans.FreeTitle();
		}
	}
</script>

<div
	class="bg-c-bg border-2 overflow-hidden z-10 shadow-lg flex-shrink-0
  shadow-c-shadow/[var(--o-shadow-normal)] {productId !== undefined
		? 'border-c-primary/30'
		: 'border-c-on-bg/25'} {size === 'xs'
		? 'rounded-md'
		: size === 'md'
		? 'rounded-lg2'
		: size === 'lg'
		? 'rounded-lg2'
		: 'rounded-lg'} {classes}"
>
	<div
		class="flex items-center justify-center z-10 {productId !== undefined
			? 'text-c-primary bg-c-primary/15'
			: 'text-c-on-bg bg-c-on-bg/15'}
    {size === 'xs'
			? 'gap-1 px-1 py-0.5'
			: size === 'md'
			? 'gap-1.5 px-3 py-1.25'
			: size === 'lg'
			? 'gap-1.5 px-3 py-1.25'
			: 'gap-1.5 px-2 py-1'}"
	>
		<p
			class={size === 'xs'
				? 'text-xxs font-semibold'
				: size === 'md'
				? 'text-sm font-bold'
				: size === 'lg'
				? 'text-base font-bold'
				: 'text-xs font-semibold'}
		>
			{planText}
		</p>
	</div>
</div>
