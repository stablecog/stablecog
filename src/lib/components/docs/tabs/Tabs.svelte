<script lang="ts" context="module">
	export type TAddToValues = (s: string) => void;
	export const getAddToValues = () => getContext<TAddToValues>('tabs-add-to-values');
	const setAddToValues = (addToValuesFunc: TAddToValues) =>
		setContext('tabs-add-to-values', addToValuesFunc);
</script>

<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import { Tabs } from 'radix-svelte';
	import { getContext, setContext } from 'svelte';
	import { onMount } from 'svelte';
	import CopyButton from '$components/docs/CopyButton.svelte';

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

	let mounted = false;
	let innerElement: HTMLDivElement;
	$: [value, mounted], setTextToCopy();

	let textToCopy: string | null | undefined;
	let isCopied = false;
	let isCopiedTimeout: NodeJS.Timeout;
	let isCopiedTimeoutDuration = 1500;

	function setTextToCopy() {
		if (value === undefined || !innerElement) return;
		clearTimeout(isCopiedTimeout);
		isCopied = false;
		const nodes = [...innerElement.childNodes.values()];
		const node = nodes.find(
			// @ts-ignore
			(node) => node.attributes?.getNamedItem('data-state')?.value === 'active'
		);
		if (node) {
			textToCopy = node.textContent;
		}
	}

	function onCopied() {
		isCopied = true;
		clearTimeout(isCopiedTimeout);
		isCopiedTimeout = setTimeout(() => {
			isCopied = false;
		}, isCopiedTimeoutDuration);
	}

	onMount(() => {
		mounted = true;
	});
</script>

<Tabs.Root class="tabs w-full font-mono {classes}" bind:value>
	<div bind:this={innerElement} class="flex w-full flex-col-reverse">
		<slot />
		<Tabs.List
			class="relative z-10 flex w-full flex-wrap items-center justify-between overflow-hidden rounded-t-[0.6rem] bg-c-bg ring-2 ring-c-bg-tertiary"
		>
			<div class="flex min-w-0 flex-1 justify-start overflow-auto pr-8">
				<div class="relative flex items-center justify-start">
					<div
						style="transform: translateX({selectedElementTranslateX !== undefined
							? selectedElementTranslateX
							: 0}px); width: {selectedElementWidth + 'px'}"
						class="pointer-events-none absolute bottom-0 left-0 h-4px rounded-t-full bg-c-primary transition-all"
					/>
					{#each values as val, index}
						<div bind:clientWidth={widths[index]}>
							<Tabs.Trigger
								class="group relative flex items-center justify-center px-4 py-3 font-medium 
								transition"
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
										: 'text-c-on-bg/60'} group-data-[state=active]:text-c-primary"
								>
									{val}
								</p>
							</Tabs.Trigger>
						</div>
					{/each}
				</div>
			</div>
			<CopyButton textToCopy={textToCopy || ''} {onCopied} bind:isCopied />
		</Tabs.List>
	</div>
</Tabs.Root>
