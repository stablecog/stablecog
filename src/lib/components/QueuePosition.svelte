<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconQueue from './icons/IconQueue.svelte';
	import { userSummary } from '$ts/stores/user/summary';

	export let position: number;
	export let hasBg = false;
</script>

<div
	transition:scale={{ start: 0.75, opacity: 0, easing: quadOut, duration: 150 }}
	class="w-full h-full flex flex-col items-center px-5 py-3 absolute left-0 top-0"
>
	<div
		class="my-auto max-w-full flex flex-col items-center justify-center {hasBg
			? 'bg-c-barrier/75 rounded-xl px-3 py-2'
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
			<IconQueue class="w-5 h-5 flex-shrink-0 {hasBg ? 'text-c-on-bg' : 'text-c-on-bg/75'}" />
			<p
				class="flex-shrink min-w-0 text-center text-lg font-medium mt-0.5 {hasBg
					? 'text-c-on-bg'
					: 'text-c-on-bg/75'}"
			>
				{position.toLocaleString($locale)}
			</p>
		</div>
		{#if !$userSummary?.product_id}
			<div class="w-full flex items-center justify-center pb-0.5">
				<a
					href="/pricing#plan-starter"
					target="_blank"
					class="max-w-full text-sm font-semibold pointer-events-auto
          rounded-lg px-2.5 py-2 mt-2 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] overflow-hidden z-0 relative group/button
          {hasBg
						? 'bg-c-primary text-c-on-primary'
						: 'bg-c-bg-secondary text-c-primary ring-c-bg-tertiary ring-2'}"
				>
					<div
						class="w-full h-full absolute left-0 top-0 transition -translate-x-full
          not-touch:group-hover/button:translate-x-0 {hasBg
							? 'bg-c-secondary'
							: 'bg-c-bg-tertiary'}"
					/>
					<p class="relative max-w-full">{$LL.Generate.SkipTheQueueButton()}</p>
				</a>
			</div>
		{/if}
	</div>
</div>
