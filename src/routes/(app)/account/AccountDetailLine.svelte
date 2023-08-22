<script lang="ts">
	export let title: string;
	export let id: string | undefined = undefined;
</script>

<div class="w-full h-2px bg-c-bg-secondary" />
<div {id} class="w-full flex flex-wrap items-center justify-between gap-4 py-5 px-4 md:px-5">
	<p class="text-c-on-bg/75 px-1">{title}</p>
	<slot />
</div>
