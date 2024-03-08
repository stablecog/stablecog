<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
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
	class="w-64 max-w-full transform transition duration-300 {side === 'start' && status === 'success'
		? 'translate-y-4 md:translate-x-4 md:translate-y-0'
		: side === 'end' && status === 'success'
			? '-translate-y-4 md:-translate-x-4 md:translate-y-0'
			: ''} {status === 'success'
		? 'ring-3 ring-c-success'
		: 'ring-2 ring-c-bg-tertiary'} relative z-0 flex flex-col
		items-center justify-center gap-2 overflow-hidden rounded-xl bg-c-bg-secondary text-center shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
>
	<div
		class="flex w-full items-center justify-center bg-c-bg-tertiary px-4 py-2 md:py-2.5 {icon ===
		'stablecog'
			? 'gap-0.5 md:gap-0.75'
			: 'gap-1.5 md:gap-2'}"
	>
		<IconSc type={icon} class="h-7 w-7 flex-shrink-0 transition duration-300 md:h-8 md:w-8" />
		<p
			class="flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-bold md:text-xl"
		>
			{platform}
		</p>
	</div>
	<div
		class="relative mt-2.5 flex h-9 w-9 transform items-center justify-center overflow-hidden rounded-full ring-2
    ring-c-on-bg/25 transition duration-300 md:mt-4 md:h-14 md:w-14"
	>
		{#if srcWidth && srcHeight && srcAlt}
			{#if !src}
				<div class="h-full w-full bg-c-bg-secondary" />
			{:else}
				<img class="h-full w-full" {src} width={srcWidth} height={srcHeight} alt={srcAlt} />
			{/if}
		{:else}
			<Avatar text={username} class="relative h-full w-full" />
		{/if}
	</div>
	<p
		class="mt-0.5 w-full overflow-hidden overflow-ellipsis whitespace-nowrap px-5 pb-3 font-semibold md:mt-1 md:px-6
    md:pb-5"
	>
		{username}
	</p>
</div>
