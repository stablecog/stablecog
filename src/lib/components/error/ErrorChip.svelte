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
			? 'rounded-lg pl-3 gap-1.5'
			: size === 'sm'
			? 'rounded-md pl-3 gap-1.5'
			: 'rounded-md pl-2 gap-1.5'}"
	>
		{#if !noIcon}
			<IconWarningOutline
				class="{size === 'md'
					? '-ml-1.5 w-6 h-6'
					: size === 'sm'
					? '-ml-1.5 w-5 h-5'
					: '-ml-0.75 w-5 h-5'} text-c-danger flex-shrink-0"
			/>
		{/if}
		<p
			class="{size === 'md'
				? 'text-base max-h-[3.5rem] py-1 pr-3'
				: size === 'sm'
				? 'text-sm max-h-[3rem] py-1 pr-3'
				: 'text-xs max-h-[2.625rem] py-1.25 pr-2'} overflow-auto hide-scrollbar break-words flex-shrink min-w-0 font-medium text-c-danger"
		>
			{error}
		</p>
	</div>
</div>
