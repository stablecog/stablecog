<script lang="ts">
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import { createCheckbox } from '@melt-ui/svelte';
	import type { Writable } from 'svelte/store';

	export let id: string;
	export let checked: Writable<boolean>;

	const {
		elements: { root, input },
		helpers: { isChecked }
	} = createCheckbox({
		checked
	});
</script>

<form>
	<button
		class="flex h-6 w-6 appearance-none ring-1.5 ring-c-primary rounded-md relative"
		{...$root}
		use:root
	>
		<div
			class="bg-c-primary ring-1 rounded ring-c-primary w-full h-full
			transition-[transform,opacity] duration-[0.2s,0.1s] p-0.75 {$isChecked
				? 'scale-100 opacity-100'
				: 'scale-65 opacity-0'}"
		>
			<IconTickOnly class="w-full h-full text-c-on-primary" />
		</div>
		<input {...$input} use:input {id} />
	</button>
</form>
