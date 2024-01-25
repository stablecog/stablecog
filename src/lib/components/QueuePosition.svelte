<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import IconQueue from './icons/IconQueue.svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import { logSkipTheQueueButtonClicked } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import { page } from '$app/stores';
	import { sessionStore } from '$ts/constants/supabase';

	export let position: number;
	export let hasBg = false;
	export let show = false;

	$: hasButton = !$userSummary?.product_id;
</script>

<div
	class="w-full h-full flex flex-col items-center px-5 py-3 absolute left-0 top-0
	transform transition duration-150 {show
		? 'scale-100 opacity-100'
		: 'scale-75 opacity-0 pointer-events-none'}"
>
	<div
		class="my-auto max-w-full flex flex-col items-center justify-center {hasBg
			? `bg-c-barrier/75 rounded-xl px-3 ${hasButton ? 'pt-2.5 pb-3' : 'py-2'}`
			: ''}"
	>
		<p
			class="max-w-full text-center text-sm leading-tight {hasBg
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'}"
		>
			{$LL.Generate.QueueTitle()}
		</p>
		<div class="max-w-full flex items-center justify-center -mt-0.25 gap-1.5">
			<IconQueue
				class="w-5 h-5 -ml-0.5 flex-shrink-0 {hasBg ? 'text-c-on-bg' : 'text-c-on-bg/75'}"
			/>
			<p
				class="flex-shrink min-w-0 text-center text-lg font-medium mt-0.5 {hasBg
					? 'text-c-on-bg'
					: 'text-c-on-bg/75'}"
			>
				{position.toLocaleString($locale)}
			</p>
		</div>
		{#if hasButton}
			<div class="w-full flex items-center justify-center pt-2.5">
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
          rounded-lg px-2.5 py-2 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] overflow-hidden z-0 relative group/button
          {hasBg
						? 'bg-c-primary text-c-on-primary'
						: 'bg-c-bg-secondary text-c-primary ring-c-primary/50 ring-1.5'}"
				>
					<div
						class="w-full h-full bg-c-bg-secondary absolute left-0 top-0 transition -translate-x-full
						not-touch:group-hover/button:translate-x-0"
					>
						<div class="w-full h-full {hasBg ? 'bg-c-secondary' : 'bg-c-primary/15'}" />
					</div>
					<p class="relative max-w-full">
						{$LL.Generate.SkipTheQueueButton()}
					</p>
				</a>
			</div>
		{/if}
	</div>
</div>
