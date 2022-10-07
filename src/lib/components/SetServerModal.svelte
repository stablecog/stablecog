<script lang="ts">
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { serverUrl } from '$ts/stores/serverUrl';
	import SetServerForm from '$components/SetServerForm.svelte';
	import type { TSetServerProcessStatus } from '$ts/types/main';

	export let close: (() => void) | undefined = undefined;
	export let isOnBarrier = true;

	let setServerProcessStatus: TSetServerProcessStatus;
</script>

<div
	transition:expandCollapse|local={{ duration: isOnBarrier ? 250 : 300 }}
	use:clickoutside={{
		callback: () => (setServerProcessStatus === 'loading' || !close ? null : close())
	}}
	class="w-full flex flex-col justify-start max-w-xl my-auto bg-c-bg-secondary rounded-2xl shadow-xl relative overflow-hidden z-0 origin-top {isOnBarrier
		? 'shadow-c-shadow/[var(--o-shadow-strong)]'
		: 'shadow-c-shadow/[var(--o-shadow-normal)]'}"
>
	<div class="w-full flex flex-col px-3 py-4 md:p-5">
		<div class="flex flex-col px-2 gap-1">
			<h1 class="font-bold text-xl">{$serverUrl ? 'Switch' : 'Set'} Server</h1>
			<p class="text-sm text-c-on-bg/50 leading-relaxed">
				The server will be used to generate images.
			</p>
		</div>
		<SetServerForm bind:setServerProcessStatus />
	</div>
</div>
