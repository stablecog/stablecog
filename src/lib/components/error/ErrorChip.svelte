<script lang="ts">
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	export let hasIcon = false;

	export let error: string;

	export { classes as class };
	let classes = '';
</script>

<div class="max-w-full bg-c-bg-secondary ring-2 ring-c-danger/20 rounded-full {classes}">
	<div class="px-3 flex items-center justify-center bg-c-danger/10 rounded-full gap-1.5">
		{#if hasIcon}
			<IconSadFaceOutline class="-ml-2 w-6 h-6 text-c-danger flex-shrink-0" />
		{/if}
		<p
			class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-sm font-medium py-1 text-c-danger"
		>
			{error}
		</p>
	</div>
</div>
