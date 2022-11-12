<script lang="ts">
	import '$css/app.css';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
</script>

<div
	class="w-full flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-[calc(4vh+1.5rem)]"
>
	<div class="w-full flex flex-col items-center justify-center max-w-lg gap-8">
		<div class="w-full max-w-xl flex flex-col items-center gap-3">
			<h1 class="text-6xl font-bold">{$page.status}</h1>
			<p class="text-c-on-bg/60">
				{$page.status === 404
					? $LL.Error.NotFound()
					: $page.error
					? $page.error.message
					: $LL.Error.SomethingWentWrong()}
			</p>
		</div>
		<Button class="w-56 max-w-full" href="/">{$LL.Shared.GoHomeButton()}</Button>
	</div>
</div>
