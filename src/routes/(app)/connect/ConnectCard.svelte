<script lang="ts">
	import Avatar from '$components/Avatar.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import type { TConnectionStatus } from '$routes/(app)/connect/types';
	import type { TIconSc } from '$ts/types/main';

	export let icon: TIconSc;
	export let platform: string;
	export let username: string;
	export let status: TConnectionStatus;
	export let src: string | undefined | null = undefined;
	export let srcWidth: number | undefined = undefined;
	export let srcHeight: number | undefined = undefined;
	export let srcAlt: string | undefined = undefined;
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
		flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative"
>
	<div
		class="w-full flex items-center justify-center bg-c-bg-tertiary py-2 md:py-2.5 px-4 {icon ===
		'stablecog'
			? 'gap-0.5 md:gap-0.75'
			: 'gap-1.5 md:gap-2'}"
	>
		<IconSc type={icon} class="w-7 h-7 md:w-8 md:h-8 flex-shrink-0 transition duration-300" />
		<p
			class="font-bold text-lg md:text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
		>
			{platform}
		</p>
	</div>
	<div
		class="mt-2.5 md:mt-4 w-9 h-9 md:w-14 md:h-14 flex items-center justify-center ring-2 ring-c-on-bg/25
    overflow-hidden rounded-full transition duration-300 transform relative"
	>
		{#if srcWidth && srcHeight && srcAlt}
			{#if !src}
				<div class="w-full h-full bg-c-bg-secondary" />
			{:else}
				<img class="w-full h-full" {src} width={srcWidth} height={srcHeight} alt={srcAlt} />
			{/if}
		{:else}
			<Avatar str={username} class="w-9 h-9 transform scale-[100%] md:scale-[156%] relative" />
		{/if}
	</div>
	<p
		class="w-full font-semibold mt-0.5 md:mt-1 px-5 md:px-6 pb-3 md:pb-5 whitespace-nowrap overflow-hidden
    overflow-ellipsis"
	>
		{username}
	</p>
</div>
