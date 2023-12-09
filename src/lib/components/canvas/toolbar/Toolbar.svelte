<script lang="ts">
	import SliderInput from '$components/SliderInput.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import ToolbarButton from '$components/canvas/toolbar/ToolbarButton.svelte';
	import ToolbarSectionWrapper from '$components/canvas/toolbar/ToolbarSectionWrapper.svelte';
	import type { TTool } from '$components/canvas/toolbar/types';
	import IconEraser from '$components/icons/IconEraser.svelte';
	import IconPaintBrush from '$components/icons/IconPaintBrush.svelte';
	import IconRedo from '$components/icons/IconRedo.svelte';
	import IconUndo from '$components/icons/IconUndo.svelte';
	import { createRadioGroup } from '@melt-ui/svelte';
	import { writable, type Writable } from 'svelte/store';

	export let selectedTool: Writable<TTool> = writable('brush');
	export let onUndo: () => void;
	export let onRedo: () => void;
	export let undoDisabled = false;
	export let redoDisabled = false;
	export let brushSize: number;
	export let canvasWidth: number;
	export let canvasHeight: number;

	const tools: { value: TTool; name: string; icon: ConstructorOfATypedSvelteComponent }[] = [
		{ value: 'brush', name: 'Brush', icon: IconPaintBrush },
		{ value: 'eraser', name: 'Eraser', icon: IconEraser }
	];

	let brushMin = 0;
	let brushMax = 100;
	let brushStep = 1;
	$: {
		if (canvasWidth && canvasHeight) {
			const minWidth = Math.min(canvasWidth, canvasHeight);
			brushMin = minWidth / 100;
			brushMax = minWidth / 10;
			brushStep = minWidth / 100;
		}
	}

	let historyActions: {
		name: string;
		onClick: () => void;
		icon: ConstructorOfATypedSvelteComponent;
		disabled?: boolean;
		onClickClass?: string;
		iconClass?: string;
	}[];

	$: historyActions = [
		{
			name: 'Undo',
			icon: IconUndo,
			onClick: onUndo,
			disabled: undoDisabled,
			onClickClass: '-rotate-30',
			iconClass: 'group-active:-rotate-30'
		},
		{
			name: 'Redo',
			icon: IconRedo,
			onClick: onRedo,
			disabled: redoDisabled,
			onClickClass: 'rotate-30',
			iconClass: 'group-active:rotate-30'
		}
	];

	const sizeClass = 'w-11 h-11';
	const paddingClass = 'p-0.75';

	const {
		elements: { root, item, hiddenInput }
	} = createRadioGroup({
		defaultValue: 'brush',
		value: selectedTool
	});

	$: selectedIndex = tools.findIndex((tool) => tool.value === $selectedTool);
</script>

<div class="flex items-center justify-start gap-3">
	<ToolbarSectionWrapper>
		<div
			{...$root}
			use:root
			class="flex flex-row items-center justify-start group"
			aria-label="Toolbar"
		>
			<div
				style="transform: translateX({(selectedIndex / (tools.length - 1)) * 100}%)"
				class="{sizeClass} {paddingClass} absolute left-0 top-0 transition"
			>
				<div
					class="w-full h-full rounded-md bg-c-on-bg shadow-md shadow-c-shadow/[var(--o-shadow-strong)]"
				/>
			</div>
			{#each tools as tool}
				<button
					{...$item(tool.value)}
					use:item
					class="{sizeClass} p-2 flex items-center justify-center group relative"
					id={tool.value}
					aria-label={tool.name}
				>
					<ButtonHoverEffect color="on-bg" noPadding {paddingClass} size="sm" />
					<svelte:component
						this={tool.icon}
						data-selected={$selectedTool === tool.value ? true : undefined}
						class="w-full h-full group-data-[state=checked]:text-c-bg transition"
					/>
				</button>
			{/each}
			<input name="line-height" {...$hiddenInput} use:hiddenInput />
		</div>
	</ToolbarSectionWrapper>

	<ToolbarSectionWrapper class="px-4">
		<SliderInput
			class="w-32 h-11"
			name="Brush Size"
			bind:value={brushSize}
			min={brushMin}
			max={brushMax}
			step={brushStep}
		/>
	</ToolbarSectionWrapper>

	<ToolbarSectionWrapper>
		{#each historyActions as action}
			<ToolbarButton
				onClick={action.onClick}
				icon={action.icon}
				label={action.name}
				{paddingClass}
				{sizeClass}
				disabled={action.disabled}
				onClickClass={action.onClickClass}
				iconClass={action.iconClass}
			/>
		{/each}
	</ToolbarSectionWrapper>
</div>
