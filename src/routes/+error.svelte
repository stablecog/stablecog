<script lang="ts">
	import '$css/app.css';
	import { page } from '$app/stores';
</script>

<div class="w-full flex-1 flex flex-col items-center justify-center px-5">
	<div class="w-full flex flex-col items-center justify-center max-w-lg pt-8 pb-12">
		<h1 class="text-6xl font-bold">{$page.status}</h1>
		<p class="mt-3 text-c-on-bg/60">
			{$page.error ? $page.error.message : 'Something went wrong :('}
		</p>
		<div class="h-[10vh]" />
	</div>
</div>
