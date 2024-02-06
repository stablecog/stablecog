<script lang="ts">
	export let key: string;
</script>

<div class="w-full flex-1 flex flex-col">
	{#key key}
		<slot />
	{/key}
</div>
