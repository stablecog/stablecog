<script lang="ts">
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import { createCheckbox } from '@melt-ui/svelte';
	import type { Writable } from 'svelte/store';

	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let name: string;
	export let checked: Writable<boolean>;

	const {
		elements: { root, input },
		helpers: { isChecked }
	} = createCheckbox({
		checked
	});
</script>

<form aria-label={name}>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			use:root
			class="flex {size === 'lg'
				? 'h-6 w-6 rounded-md'
				: size === 'sm'
					? 'h-4 w-4 rounded'
					: 'h-5 w-5 rounded'} relative appearance-none ring-1.5 ring-c-primary"
			id="checkbox"
		>
			<div
				class="h-full w-full transform bg-c-primary p-0.25 ring-c-primary transition duration-150
				{$isChecked ? 'scale-100 opacity-100 ring-2' : 'scale-25 opacity-0 ring-0'} {size === 'lg'
					? 'rounded-md'
					: size === 'sm'
						? 'rounded'
						: 'rounded'}"
			>
				<IconTickOnly class="h-full w-full text-c-on-primary" />
			</div>
			<input {...$input} use:input id={name} />
		</button>
	</div>
</form>
