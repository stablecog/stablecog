<script lang="ts">
	import IconWarning from '$components/icons/IconWarning.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
</script>

<div transition:expandCollapse={{ duration: 300 }} class="relative">
	<div class="flex flex-col items-center pb-7">
		<div
			class="flex max-w-[34rem] items-center justify-start gap-3 rounded-xl bg-c-danger/8 px-4 py-4 text-xs text-c-danger md:text-sm"
		>
			<IconWarning class="h-6 w-6" />
			<p class="flex-1">
				{$LL.Error.ServerSeemsOffline()}
			</p>
		</div>
	</div>
</div>
