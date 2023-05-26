<script lang="ts" context="module">
	export type TAddToValues = (s: string) => void;
	export const getAddToValues = () => getContext<TAddToValues>('tabs-add-to-values');
	const setAddToValues = (addToValuesFunc: TAddToValues) =>
		setContext('tabs-add-to-values', addToValuesFunc);
</script>

<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import { Tabs } from 'radix-svelte';
	import { getContext, setContext } from 'svelte/internal';

	export let defaultValue: string | undefined = undefined;
	export { classes as class };
	let classes = 'mt-5';

	let values = [] as string[];
	let value: string;

	const addToValues: TAddToValues = (s) => {
		values = [...new Set([...values, s])];
		if (defaultValue) {
			value = defaultValue;
		} else {
			value = values[0];
		}
	};
	setAddToValues(addToValues);

	let widths: number[];
	$: widths = Array.from({ length: values.length }).map((_, index) => widths?.[index] ?? 0);
	$: selectedIndex = values.indexOf(value);
	$: selectedElementWidth = widths[selectedIndex];
	$: selectedElementTranslateX = widths
		.slice(0, selectedIndex)
		.reduce((acc, curr) => acc + curr, 0);
</script>

<Tabs.Root class="w-full tabs {classes} font-mono" bind:value>
	<div class="w-full flex flex-col-reverse">
		<slot />
		<Tabs.List
			class="w-full overflow-hidden flex flex-wrap items-center justify-between ring-2 ring-c-bg-tertiary bg-c-bg rounded-t-[0.6rem] pb-2px"
		>
			<div class="flex-1 min-w-0 overflow-auto flex justify-start">
				<div class="flex justify-start items-center relative">
					<div
						style="transform: translateX({selectedElementTranslateX !== undefined
							? selectedElementTranslateX
							: 0}px); width: {selectedElementWidth + 'px'}"
						class="absolute left-0 bottom-0 transition-all h-4px rounded-t-full bg-c-primary pointer-events-none"
					/>
					{#each values as val, index}
						<div bind:clientWidth={widths[index]}>
							<Tabs.Trigger
								class="px-4 py-3 transition font-medium group relative flex items-center 
								justify-center"
								value={val}
							>
								<ButtonHoverEffect
									size="sm"
									color={val === value ? 'primary' : 'on-bg'}
									paddingClass="py-1 px-1"
								/>
								<p
									class="relative transition {val === value
										? 'text-c-primary'
										: 'text-c-on-bg/50'} group-data-[state=active]:text-c-primary"
								>
									{val}
								</p>
							</Tabs.Trigger>
						</div>
					{/each}
				</div>
			</div>
		</Tabs.List>
	</div>
</Tabs.Root>
