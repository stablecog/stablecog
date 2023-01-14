<script lang="ts">
	import IconWarning from '$components/icons/IconWarning.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
</script>

<div transition:expandCollapse|local={{ duration: 300 }} class="relative">
	<div class="pb-7 flex flex-col items-center">
		<div
			class="py-4 px-4 text-xs md:text-sm gap-3 flex items-center justify-start max-w-[34rem] rounded-xl bg-c-danger/8 text-c-danger"
		>
			<IconWarning class="w-6 h-6" />
			<p class="flex-1">
				{$LL.Error.ServerSeemsOffline()}
			</p>
		</div>
	</div>
</div>
