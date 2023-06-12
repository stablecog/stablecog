<script lang="ts">
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	export let noIcon = false;

	export let error: string;

	export { classes as class };
	let classes = '';
</script>

<div class="max-w-full bg-c-bg-secondary ring-2 ring-c-danger/20 rounded-md {classes}">
	<div class="px-3 flex items-center justify-center bg-c-danger/10 rounded-md gap-1.5">
		{#if !noIcon}
			<IconWarningOutline class="-ml-1.5 w-5 h-5 text-c-danger flex-shrink-0" />
		{/if}
		<p
			class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-sm font-medium py-1 text-c-danger"
		>
			{error}
		</p>
	</div>
</div>
