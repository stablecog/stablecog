<script lang="ts">
	export { classes as class };
	let classes = '';
</script>

<div
	class="w-full text-xs md:text-sm flex items-stretch bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] 
	ring-2 ring-c-bg-secondary rounded-xl transition relative {classes}"
>
	<slot />
</div>
