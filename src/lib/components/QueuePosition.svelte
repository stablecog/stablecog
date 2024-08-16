<script lang="ts">
	import { page } from '$app/stores';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { sessionStore } from '$ts/constants/supabase';
	import { logSkipTheQueueButtonClicked } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';

	export let position: number;
	export let hasBg = false;
	export let show = false;

	$: hasButton = !$userSummary?.product_id;
</script>

<div
	class="absolute left-0 top-0 flex h-full w-full transform flex-col items-center px-5
	py-3 transition duration-150 {show
		? 'scale-100 opacity-100'
		: 'pointer-events-none scale-75 opacity-0'}"
>
	<div
		class="my-auto flex max-w-full flex-col items-center justify-center {hasBg
			? `rounded-xl bg-c-barrier/75 px-3 ${hasButton ? 'pb-3 pt-2.5' : 'py-2'}`
			: ''}"
	>
		<p
			class="max-w-full text-center text-sm leading-tight {hasBg
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'}"
		>
			{$LL.Generate.QueueTitle()}
		</p>
		<div class="-mt-0.25 flex max-w-full items-center justify-center gap-1.5">
			<IconPulsing class="-ml-2 -mr-1 h-6 w-6 flex-shrink-0" />
			<p
				class="mt-0.5 min-w-0 flex-shrink text-center text-lg font-medium {hasBg
					? 'text-c-on-bg'
					: 'text-c-on-bg/75'}"
			>
				{position.toLocaleString($locale)}
			</p>
		</div>
		{#if hasButton}
			<div class="flex w-full items-center justify-center pt-2.5">
				<a
					on:click={() => {
						logSkipTheQueueButtonClicked({
							'SC - App Version': $appVersion,
							'SC - Locale': $locale,
							'SC - Page': `${$page.url.pathname}${$page.url.search}`,
							'SC - User Id': $sessionStore?.user.id,
							'SC - Stripe Product Id': $userSummary?.product_id
						});
					}}
					href="/pricing#plan-starter"
					target="_blank"
					class="max-w-full text-center text-sm font-semibold {show ? 'pointer-events-auto' : ''}
          group/button relative z-0 overflow-hidden rounded-lg px-2.5 py-2 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]
          {hasBg
						? 'bg-c-primary text-c-on-primary'
						: 'bg-c-bg-secondary text-c-primary ring-1.5 ring-c-primary/50'}"
				>
					<div
						class="absolute left-0 top-0 h-full w-full -translate-x-full bg-c-bg-secondary transition
						not-touch:group-hover/button:translate-x-0"
					>
						<div class="h-full w-full {hasBg ? 'bg-c-secondary' : 'bg-c-primary/15'}" />
					</div>
					<p class="relative max-w-full">
						{$LL.Generate.SkipTheQueueButton()}
					</p>
				</a>
			</div>
		{/if}
	</div>
</div>
