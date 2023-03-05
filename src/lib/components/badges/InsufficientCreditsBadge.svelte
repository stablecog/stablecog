<script lang="ts">
	import LL from '$i18n/i18n-svelte';

	export let neededCredits: number;
	export let remainingCredits: number;
</script>

<p class="text-xs font-medium h-0 opacity-0 px-3">
	{$LL.Shared.InsufficientCreditsTitle({
		remainingCredits,
		neededCredits
	})}
</p>
<div class="w-full flex justify-end absolute -top-1.5 -right-1.5">
	<div class="z-10 bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] rounded-lg">
		<div class="w-full border-2 bg-c-secondary/10 border-c-secondary/20 rounded-lg">
			<p class="text-xs font-medium text-c-secondary px-1.5 py-1">
				{$LL.Shared.InsufficientCreditsTitle({
					remainingCredits,
					neededCredits
				})}
			</p>
		</div>
	</div>
</div>
