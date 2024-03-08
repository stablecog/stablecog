<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import type { TConnectionStatus } from '$routes/(app)/connect/types';
	import type { TIconSc } from '$ts/types/main';

	export let icon: TIconSc;
	export let platform: string;
	export let status: TConnectionStatus;
	export let side: 'start' | 'end';
</script>

<div
	class="w-64 max-w-full transform transition duration-300 {side === 'start' && status === 'success'
		? 'translate-y-4 md:translate-x-4 md:translate-y-0'
		: side === 'end' && status === 'success'
			? '-translate-y-4 md:-translate-x-4 md:translate-y-0'
			: ''} {status === 'success'
		? 'ring-3 ring-c-success'
		: 'ring-2 ring-c-bg-tertiary'} relative z-0 flex flex-col
		items-center justify-center gap-2 overflow-hidden rounded-xl bg-c-bg-secondary px-6 pb-4 pt-3.5 text-center shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] md:pb-6 md:pt-5"
>
	<IconSc type={icon} class="h-16 w-16 flex-shrink-0 transition duration-300 md:h-20 md:w-20" />
	<p
		class="-mt-0.5 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xl
    font-semibold md:mt-0 md:text-2xl"
	>
		{platform}
	</p>
</div>
