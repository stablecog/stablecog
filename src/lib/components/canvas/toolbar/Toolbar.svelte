<script lang="ts">
	import SliderInput from '$components/primitives/SliderInput.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import ToolbarButton from '$components/canvas/toolbar/ToolbarButton.svelte';
	import ToolbarSectionWrapper from '$components/canvas/toolbar/ToolbarSectionWrapper.svelte';
	import type { TBrushConfig, TTool } from '$components/canvas/toolbar/types';
	import IconBrushAlt from '$components/icons/IconBrushAlt.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconEraser from '$components/icons/IconEraser.svelte';
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
	export let brushConfig: TBrushConfig;
	export let onCancelClicked: () => void;

	const tools: { value: TTool; name: string; icon: ConstructorOfATypedSvelteComponent }[] = [
		{ value: 'brush', name: 'Brush', icon: IconBrushAlt },
		{ value: 'eraser', name: 'Eraser', icon: IconEraser }
	];

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
	const paddingClass = 'p-0.5';

	const {
		elements: { root, item, hiddenInput }
	} = createRadioGroup({
		defaultValue: 'brush',
		value: selectedTool
	});

	$: selectedIndex = tools.findIndex((tool) => tool.value === $selectedTool);
</script>

<div class="flex max-w-full flex-wrap items-center justify-center gap-2">
	<ToolbarSectionWrapper>
		<div {...$root} use:root class="flex flex-row items-center justify-start" aria-label="Toolbar">
			<div
				style="transform: translateX({(selectedIndex / (tools.length - 1)) * 100}%)"
				class="{sizeClass} {paddingClass} absolute left-0 top-0 transition"
			>
				<div
					class="h-full w-full rounded-md bg-c-on-bg shadow-md shadow-c-shadow/[var(--o-shadow-strong)]"
				/>
			</div>
			{#each tools as tool}
				<button
					{...$item(tool.value)}
					use:item
					class="{sizeClass} group relative flex items-center justify-center p-2"
					id={tool.value}
					aria-label={tool.name}
				>
					<ButtonHoverEffect color="on-bg" noPadding {paddingClass} size="sm" />
					<svelte:component
						this={tool.icon}
						data-selected={$selectedTool === tool.value ? true : undefined}
						class="h-full w-full transition group-data-[state=checked]:text-c-bg"
					/>
				</button>
			{/each}
			<input name="line-height" {...$hiddenInput} use:hiddenInput />
		</div>
	</ToolbarSectionWrapper>

	<ToolbarSectionWrapper class="gap-3 px-4.5">
		<div class="h-2 w-2 rounded-full ring-2 ring-c-on-bg" />
		<SliderInput
			class="h-11 w-32"
			name="Brush Size"
			size="sm"
			bind:value={brushSize}
			{...brushConfig}
		/>
		<div class="h-3.5 w-3.5 rounded-full ring-2 ring-c-on-bg" />
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

	<ToolbarSectionWrapper>
		<ToolbarButton
			onClick={onCancelClicked}
			icon={IconCancel}
			label={'Stop Editing'}
			{paddingClass}
			{sizeClass}
		/>
	</ToolbarSectionWrapper>
</div>
