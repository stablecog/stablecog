<script lang="ts">
	export { classes as class };
	let classes = '';
</script>

<div
	class="flex flex-row items-center relative bg-c-bg-secondary rounded-lg shadow-md shadow-c-shadow/[var(--o-shadow-strong)] {classes}"
>
	<slot />
</div>
