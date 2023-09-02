<script lang="ts">
	import { page } from '$app/stores';
	import WithTooltip from '$components/WithTooltip.svelte';
	import IconToken from '$components/icons/IconToken.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { flyAndScale } from '$ts/animation/transitions';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { isNoCreditsInfoRoute } from '$ts/stores/navbar';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';
	import { onDestroy } from 'svelte';
	import { quadOut } from 'svelte/easing';

	export let notAtTheVeryTop: boolean;

	let nowInterval: NodeJS.Timeout | undefined;
	const nowIntervalDuration = 1000;
	let now = Date.now();

	$: onUpcomingCreditsTooltipOpenChanged = $userSummary?.refetch
		? (isOpen: boolean) => {
				clearInterval(nowInterval);
				if (isOpen) {
					now = Date.now();
					nowInterval = setInterval(() => {
						now = Date.now();
					}, nowIntervalDuration);
				}
				if ($userSummary?.refetch && isOpen) $userSummary.refetch();
		  }
		: undefined;

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});

	$: relativeDate = getRelativeDate({
		now,
		date: $userSummary?.renews_at ?? $userSummary?.more_free_credits_at ?? Date.now(),
		locale: $locale,
		dateStyle: 'long'
	});

	let isFirstRender = true;
	$: totalRemainingCreditsString =
		$userSummary?.total_remaining_credits.toLocaleString($locale) || '';
	$: [totalRemainingCreditsString], onCreditsChanged();

	let creditsChangedCounter = 0;
	function onCreditsChanged() {
		if (isFirstRender) {
			isFirstRender = false;
			return;
		}
		creditsChangedCounter++;
	}

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

{#if $page.data.session && $userSummary}
	<WithTooltip
		delay={150}
		let:trigger
		let:triggerStoreValue
		onOpenChanged={onUpcomingCreditsTooltipOpenChanged}
		isActive={($userSummary.renews_at !== undefined &&
			$userSummary.renews_at_credit_amount !== undefined) ||
			($userSummary.more_free_credits_at !== undefined &&
				$userSummary.more_free_credits_at_credit_amount !== undefined)}
	>
		<div slot="tooltip" class="max-w-full flex flex-col text-sm break-words">
			<p class="font-bold flex-shrink min-w-0">
				{$userSummary.renews_at
					? $LL.UpcomingCredits.MorePaidPlanCreditsTooltip.Title()
					: $LL.UpcomingCredits.MoreFreeCreditsTooltip.Title()}
			</p>
			<p class="mt-0.5 flex-shrink min-w-0 text-c-on-bg/75 font-medium">
				{$userSummary.renews_at
					? $LL.UpcomingCredits.MorePaidPlanCreditsTooltip.Paragraph()
					: $LL.UpcomingCredits.MoreFreeCreditsTooltip.Paragraph()}
			</p>
			<div
				class="text-left font-bold flex justify-start items-center flex-wrap
					rounded-md pt-1.25 pb-0.25 text-c-primary gap-2"
			>
				<div class="max-w-full flex justify-center items-center flex-shrink min-w-0">
					<IconToken class="w-4.5 h-4.5 -ml-0.75 flex-shrink-0" />
					<p class="text-lg flex-shrink min-w-0 -mb-0.5">
						{numberFormatter.format(
							$userSummary.renews_at_credit_amount ??
								$userSummary.more_free_credits_at_credit_amount ??
								0
						)}
					</p>
				</div>
				<p
					class="max-w-full bg-c-primary/10 px-1.75 py-0.25 rounded-md font-medium text-sm flex-shrink min-w-0"
				>
					{relativeDate}
				</p>
			</div>
		</div>
		<div
			use:trigger
			{...triggerStoreValue}
			tabindex="0"
			role="button"
			class="flex-col items-end mr-3.5 md:mr-4 cursor-default rounded {$isNoCreditsInfoRoute
				? 'hidden md:flex'
				: 'flex'} {$page.url.pathname === '/' && $themeApp === 'light' && !notAtTheVeryTop
				? 'text-c-bg'
				: 'text-c-on-bg'}"
		>
			<p
				class="text-xs font-medium {$page.url.pathname === '/' &&
				$themeApp === 'light' &&
				!notAtTheVeryTop
					? 'text-c-bg/60'
					: 'text-c-on-bg/60'}"
			>
				{$LL.Account.RemainingTitle()}
			</p>
			<div class="flex gap-0.25 items-center">
				<div
					class="transition duration-1000 flex-shrink-0"
					style="transform: rotate({creditsChangedCounter * 180}deg)"
				>
					<IconToken class="w-4 h-4 -ml-0.25" />
				</div>
				<div class="text-sm font-bold mt-0.5 flex overflow-hidden relative z-0">
					{#each totalRemainingCreditsString.split('') as character, index (character + index)}
						<p
							in:flyAndScale={{
								duration: 1000,
								easing: quadOut,
								yPercent: -100,
								opacity: 0
							}}
							out:flyAndScale={{
								duration: 1000,
								easing: quadOut,
								yPercent: 100,
								opacity: 0,
								isAbsolute: true
							}}
						>
							{character}
						</p>
					{/each}
				</div>
			</div>
		</div>
	</WithTooltip>
{/if}
