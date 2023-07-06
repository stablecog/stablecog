<script lang="ts">
	import { locale } from '$i18n/i18n-svelte';
	import IconToken from './icons/IconToken.svelte';
	export let creditCost: number;
</script>

<div
	class="ring-1 ring-c-bg/15 rounded-bl bg-c-bg/10 pointer-events-none
    text-xs flex flex-row justify-end px-1.25
	  items-center font-semibold text-c-bg absolute right-0 top-0"
>
	<IconToken class="w-3.5 h-3.5 -ml-1 -mr-0.25" />
	<p class="text-right mt-0.25">
		{creditCost.toLocaleString($locale)}
	</p>
</div>
