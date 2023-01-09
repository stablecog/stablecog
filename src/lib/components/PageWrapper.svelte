<script lang="ts">
	export let noPadding = false;
</script>

<div class="w-full flex-1 flex flex-col px-6 md:px-12 {noPadding ? '' : 'pt-8 pb-4vh'}">
	<slot />
</div>
