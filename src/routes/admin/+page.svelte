<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
</script>

<div class="w-full flex-1 flex justify-center pb-[calc(3vh)]">
	<div class="my-auto w-full flex flex-col items-center max-w-xl gap-6">
		<h1 class="font-bold text-2xl">Admin</h1>
		<div class="w-full flex flex-row items-center justify-center gap-4">
			<Button href="admin/servers">Servers</Button>
		</div>
	</div>
</div>
