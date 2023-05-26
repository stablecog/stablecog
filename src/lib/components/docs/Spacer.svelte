<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<div class="w-full {size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8'}" />
