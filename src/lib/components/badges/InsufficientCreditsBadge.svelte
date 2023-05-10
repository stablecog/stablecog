<script lang="ts">
	import LL from '$i18n/i18n-svelte';

	export let neededCredits: number;
	export let remainingCredits: number;
	export let isSmallOnMobile = true;
</script>

<p class="text-xs font-medium h-0 opacity-0 px-2 md:px-3">
	<span class={isSmallOnMobile ? 'hidden lg:block' : ''}>
		{$LL.Shared.InsufficientCreditsTitle({
			remainingCredits,
			neededCredits
		})}
	</span>
	{#if isSmallOnMobile}
		<span class="lg:hidden">
			{remainingCredits}/{neededCredits}
		</span>
	{/if}
</p>
<div class="w-full flex justify-end absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5">
	<div class="z-10 bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] rounded-lg">
		<div class="w-full border-2 bg-c-secondary/10 border-c-secondary/20 rounded-lg">
			<p class="text-xs font-medium text-c-secondary px-1.25 py-0.75 md:px-1.5 md:py-1">
				<span class={isSmallOnMobile ? 'hidden lg:block' : ''}>
					{$LL.Shared.InsufficientCreditsTitle({
						remainingCredits,
						neededCredits
					})}
				</span>
				{#if isSmallOnMobile}
					<span class="lg:hidden">
						{remainingCredits}/{neededCredits}
					</span>
				{/if}
			</p>
		</div>
	</div>
</div>
