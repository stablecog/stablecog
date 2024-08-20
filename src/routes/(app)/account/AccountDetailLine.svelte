<script lang="ts">
	export let title: string;
	export let id: string | undefined = undefined;
	export let titleClass = 'px-1 text-c-on-bg/75';
</script>

<div class="h-2px w-full bg-c-bg-secondary" />
<div {id} class="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-5">
	<p class={titleClass}>{title}</p>
	<slot />
</div>
