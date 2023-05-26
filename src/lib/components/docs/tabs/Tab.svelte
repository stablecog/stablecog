<script lang="ts">
	import { Tabs } from 'radix-svelte';
	import { getAddToValues } from './Tabs.svelte';
	import { browser } from '$app/environment';
	export let value: string;

	const addToValues = getAddToValues();
	addToValues(value);
</script>

<Tabs.Content class="w-full" {value}>
	<slot />
</Tabs.Content>
<div class="hidden {!browser ? 'first:block' : ''}">
	<slot />
</div>
