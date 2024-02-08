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
					? 'w-4 h-4 rounded'
					: 'w-5 h-5 rounded'} appearance-none ring-1.5 ring-c-primary relative"
			id="checkbox"
		>
			<div
				class="w-full h-full transition duration-150 transform bg-c-primary ring-c-primary p-0.25
				{$isChecked ? 'scale-100 opacity-100 ring-2' : 'scale-25 opacity-0 ring-0'} {size === 'lg'
					? 'rounded-md'
					: size === 'sm'
						? 'rounded'
						: 'rounded'}"
			>
				<IconTickOnly class="w-full h-full text-c-on-primary" />
			</div>
			<input {...$input} use:input id={name} />
		</button>
	</div>
</form>
