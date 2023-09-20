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
	class="w-64 max-w-full transition duration-300 transform {side === 'start' && status === 'success'
		? 'translate-y-4 md:translate-y-0 md:translate-x-4'
		: side === 'end' && status === 'success'
		? '-translate-y-4 md:translate-y-0 md:-translate-x-4'
		: ''} {status === 'success'
		? 'ring-c-success ring-3'
		: 'ring-c-bg-tertiary ring-2'} bg-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
		flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative px-6 pt-4 pb-5 md:pt-5 md:pb-6"
>
	<IconSc type={icon} class="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 transition duration-300" />
	<p
		class="w-full font-semibold whitespace-nowrap overflow-hidden
    overflow-ellipsis text-xl md:text-2xl"
	>
		{platform}
	</p>
</div>
