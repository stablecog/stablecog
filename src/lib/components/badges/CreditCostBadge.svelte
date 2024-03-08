<script lang="ts">
	import { locale } from '$i18n/i18n-svelte';
	import IconToken from '../icons/IconToken.svelte';
	export let creditCost: number;
</script>

<div
	class="pointer-events-none absolute right-0 top-0 flex
    flex-row items-center justify-end rounded-bl bg-c-bg/10
	  px-1 text-xs font-semibold text-c-bg ring-1 ring-c-bg/15"
>
	<IconToken class="-ml-1 -mr-0.25 h-3.5 w-3.5" />
	<p class="mt-0.25 text-right">
		{creditCost.toLocaleString($locale)}
	</p>
</div>
