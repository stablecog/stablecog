<script lang="ts">
	import Button from '$components/primitives/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
</script>

<div
	transition:expandCollapse={{ duration: 200 }}
	class="max-w-full flex flex-col items-center justify-start"
>
	<div class="w-full flex justify-center items-start max-w-md py-4 px-4">
		<div
			class="flex flex-col justify-start items-center p-3 md:p-4 bg-c-primary/10 ring-2 ring-c-primary/20 rounded-2xl"
		>
			<div class="w-full flex items-center gap-3 px-2">
				<IconConfetti class="w-8 h-8 text-c-primary flex-shrink-0" />
				<h1 class="flex-1 font-bold text-2xl text-c-primary">
					{$LL.Error.UpdateAvailable.Title()}
				</h1>
			</div>
			<p class="w-full leading-normal text-c-on-bg text-left px-2 mt-3">
				{$LL.Error.UpdateAvailable.Paragraph()}
			</p>
			<Button onClick={() => document.location.reload()} class="mt-5 w-full">
				{$LL.Shared.RefreshButton()}
			</Button>
		</div>
	</div>
	<div class="w-full h-[2vh]" />
</div>
