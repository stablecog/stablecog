<script lang="ts">
	import Button from '$components/primitives/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
</script>

<div
	transition:expandCollapse={{ duration: 200 }}
	class="flex max-w-full flex-col items-center justify-start"
>
	<div class="flex w-full max-w-md items-start justify-center px-4 py-4">
		<div
			class="flex flex-col items-center justify-start rounded-2xl bg-c-primary/10 p-3 ring-2 ring-c-primary/20 md:p-4"
		>
			<div class="flex w-full items-center gap-3 px-2">
				<IconConfetti class="h-8 w-8 flex-shrink-0 text-c-primary" />
				<h1 class="flex-1 text-2xl font-bold text-c-primary">
					{$LL.Error.UpdateAvailable.Title()}
				</h1>
			</div>
			<p class="mt-3 w-full px-2 text-left leading-normal text-c-on-bg">
				{$LL.Error.UpdateAvailable.Paragraph()}
			</p>
			<Button onClick={() => document.location.reload()} class="mt-5 w-full">
				{$LL.Shared.RefreshButton()}
			</Button>
		</div>
	</div>
	<div class="h-[2vh] w-full" />
</div>
