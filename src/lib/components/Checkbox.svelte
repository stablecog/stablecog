<script lang="ts">
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import { Checkbox } from 'radix-svelte';
	export let name: string;
	export let checked: boolean;
</script>

<Checkbox.Root
	class="flex h-6 w-6 appearance-none ring-1.5 ring-c-primary rounded-md relative overflow-hidden z-0"
	bind:checked
	{name}
	id={name}
>
	<Checkbox.Indicator class="bg-c-primary w-full h-full p-0.75">
		<IconTickOnly class="w-full h-full text-c-on-primary" />
	</Checkbox.Indicator>
</Checkbox.Root>
