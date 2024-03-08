<script lang="ts">
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	export let noIcon = false;

	export let error: string;
	export let size: 'xs' | 'sm' | 'md' = 'xs';

	export { classes as class };
	let classes = '';
</script>

<div
	class="max-w-full bg-c-bg-secondary ring-2 ring-c-danger/20 {size === 'md'
		? 'rounded-lg'
		: size === 'sm'
			? 'rounded-md'
			: 'rounded-md'} {classes}"
>
	<div
		class="flex items-center justify-center bg-c-danger/10 {size === 'md'
			? 'gap-1.5 rounded-lg pl-3'
			: size === 'sm'
				? 'gap-1.5 rounded-md pl-3'
				: 'gap-1.5 rounded-md pl-2'}"
	>
		{#if !noIcon}
			<IconWarningOutline
				class="{size === 'md'
					? '-ml-1.5 h-6 w-6'
					: size === 'sm'
						? '-ml-1.5 h-5 w-5'
						: '-ml-0.75 h-5 w-5'} flex-shrink-0 text-c-danger"
			/>
		{/if}
		<p
			class="{size === 'md'
				? 'max-h-[3.5rem] py-1 pr-3 text-base'
				: size === 'sm'
					? 'max-h-[3rem] py-1 pr-3 text-sm'
					: 'max-h-[2.625rem] py-1.25 pr-2 text-xs'} hide-scrollbar min-w-0 flex-shrink overflow-auto break-words font-medium text-c-danger"
		>
			{error}
		</p>
	</div>
</div>
