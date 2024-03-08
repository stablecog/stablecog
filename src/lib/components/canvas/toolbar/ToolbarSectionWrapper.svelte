<script lang="ts">
	export { classes as class };
	let classes = '';
</script>

<div
	class="relative flex flex-row items-center rounded-lg bg-c-bg-secondary shadow-md shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	<slot />
</div>
