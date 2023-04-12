<script lang="ts">
	import IconCancel from '$components/icons/IconCancel.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: () => void;
	export let text: string;
	export let hasCancelIcon = true;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let color: 'primary' | 'secondary' = 'primary';
</script>

<button on:click|preventDefault={onClick} class="group bg-c-bg rounded p-px">
	<div
		class="px-2 py-1 gap-1 flex items-center flex-row {color === 'secondary'
			? 'text-c-secondary bg-c-secondary/10 ring-c-secondary/25'
			: 'text-c-primary bg-c-primary/10 ring-c-primary/25'}  rounded ring-1 text-xs transition {!$isTouchscreen
			? color === 'secondary'
				? 'group-hover:bg-c-secondary/25 group-hover:ring-c-secondary/40'
				: 'group-hover:bg-c-primary/25 group-hover:ring-c-primary/40'
			: ''}"
	>
		{#if icon}
			<svelte:component
				this={icon}
				class="w-4 h-4 flex-shrink-0 -ml-1 {color === 'secondary'
					? 'text-c-secondary/75'
					: 'text-c-primary/75'}"
			/>
		{/if}
		<p
			class="flex-1 min-w-0 max-w-[5rem] md:max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{text}
		</p>
		{#if hasCancelIcon}
			<IconCancel
				class="w-4 h-4 flex-shrink-0 -mr-1 {color === 'secondary'
					? 'text-c-secondary/75'
					: 'text-c-primary/75'}"
			/>
		{/if}
	</div>
</button>
