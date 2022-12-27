<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main';
	import { onMount } from 'svelte';

	type T = $$Generic;
	export let value: T;
	export let items: TTab<T>[];
	export let name: string;
	export let hasTitle = true;
	export let dontScale = false;
	export let disabled = false;
	export let calculateDistance = true;
	export let dropdownClass = '';
	export let container: HTMLDivElement | undefined = undefined;
	export let containerTopMinDistance = 0;
	export let containerBottomMinDistance = 0;
	export { classes as class };
	let classes = '';

	let minDropdownHeight = 200;

	let isDropdownOpen = false;
	$: selectedItem = items.find((item) => item.value === value);
	const toggleDropdown = () => (isDropdownOpen = !isDropdownOpen);

	let buttonElement: HTMLButtonElement;
	let buttonHeight: number;
	let dropdownPlacement: 'top' | 'bottom' = 'bottom';
	let dropdownHeight: number;
	let dropdownMaxHeight: number;
	$: [$windowWidth, $windowHeight, calculateDistance], setDropdownWrapperPosition();

	function setDropdownWrapperPosition() {
		if (!calculateDistance) return;
		if (!buttonElement || !$windowHeight || !$windowWidth) return;
		if (container) {
			const containerHeight = container.clientHeight;
			const buttonDistanceToTop =
				buttonElement.getBoundingClientRect().top -
				container.getBoundingClientRect().top -
				containerTopMinDistance;
			const buttonDistanceToBottom =
				containerHeight - buttonDistanceToTop - buttonHeight - containerBottomMinDistance;
			if (buttonDistanceToBottom >= dropdownHeight || buttonDistanceToBottom >= minDropdownHeight) {
				dropdownPlacement = 'bottom';
				dropdownMaxHeight = buttonDistanceToBottom;
			} else if (buttonDistanceToTop > buttonDistanceToBottom) {
				dropdownPlacement = 'top';
				dropdownMaxHeight = buttonDistanceToTop;
			} else {
				dropdownPlacement = 'bottom';
				dropdownMaxHeight = buttonDistanceToBottom;
			}
		} else {
			const { top, height: buttonHeight } = buttonElement.getBoundingClientRect();
			const buttonDistanceToTopEdge = top - containerTopMinDistance;
			const buttonDistanceToBottomEdge =
				$windowHeight - buttonDistanceToTopEdge - buttonHeight - containerBottomMinDistance;
			if (buttonDistanceToBottomEdge >= minDropdownHeight) {
				dropdownPlacement = 'bottom';
				dropdownMaxHeight = buttonDistanceToBottomEdge;
			} else if (buttonDistanceToTopEdge > buttonDistanceToBottomEdge) {
				dropdownPlacement = 'top';
				dropdownMaxHeight = buttonDistanceToTopEdge;
			} else {
				dropdownPlacement = 'bottom';
				dropdownMaxHeight = buttonDistanceToBottomEdge;
			}
		}
	}

	onMount(() => {
		setDropdownWrapperPosition();
	});
</script>

<TabBarWrapper class="{classes} {isDropdownOpen ? 'z-20' : 'z-10'} relative" {dontScale}>
	{#if hasTitle}
		<div class="self-stretch flex text-c-on-bg/30">
			<slot name="title" />
		</div>
	{/if}
	<div
		use:clickoutside={{ callback: () => (isDropdownOpen = false) }}
		class="ml-px flex-1 min-w-0 flex flex-col relative rounded-r-xl"
	>
		<button
			{disabled}
			bind:this={buttonElement}
			bind:clientHeight={buttonHeight}
			on:click={() => {
				setDropdownWrapperPosition();
				toggleDropdown();
			}}
			class="flex-1 ring-2 text-left flex items-center justify-between min-w-0 px-4 py-3.25 md:py-3.5 relative 
				group transition-all duration-150 z-30 {isDropdownOpen
				? dropdownPlacement === 'top'
					? 'rounded-br-xl bg-c-bg-secondary ring-c-bg-tertiary'
					: 'rounded-tr-xl bg-c-bg-secondary ring-c-bg-tertiary'
				: 'rounded-r-xl bg-c-bg ring-c-bg-secondary'}"
			type="button"
			aria-label={name}
		>
			<div
				class="w-full h-full absolute left-0 top-0 overflow-hidden z-0 transition-all duration-150 {isDropdownOpen
					? dropdownPlacement === 'top'
						? 'rounded-br-xl'
						: 'rounded-tr-xl'
					: 'rounded-r-xl'}"
			>
				<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
					<div
						class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
							bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
					/>
				</div>
			</div>
			<p
				class="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis text-base font-medium relative transition
					max-w-full z-0 text-c-on-bg/75 {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
			>
				{selectedItem?.label}
			</p>
			<div class="flex-shrink-0 w-5 h-5 transition {isDropdownOpen ? 'rotate-180' : 'rotate-0'}">
				<IconChevronDown
					class="relative w-full h-full transition text-c-on-bg/25 {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				/>
			</div>
		</button>
		<div
			style="transform: translateY({dropdownPlacement === 'top'
				? `${-dropdownHeight}px`
				: `${buttonHeight}px`}); height: {dropdownHeight}px;"
			class="absolute left-0 top-0 w-full pointer-events-none flex flex-col {dropdownPlacement ===
			'top'
				? 'justify-end'
				: 'justify-start'}"
		>
			<div
				style="height: {isDropdownOpen ? dropdownHeight : '0'}px"
				class="w-full flex flex-col overflow-hidden bg-c-bg-secondary shadow-sheet transition-all 
					shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-tertiary {dropdownPlacement === 'top'
					? 'rounded-t-xl origin-bottom justify-end'
					: 'rounded-b-xl origin-top justify-start'} {isDropdownOpen
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'}"
			>
				<div
					style="max-height: {dropdownMaxHeight}px;"
					bind:clientHeight={dropdownHeight}
					class="w-full flex flex-col justify-start relative z-20 {dropdownClass}"
				>
					<div class="w-full flex flex-col overflow-auto">
						{#each items.filter((i) => i.value !== value) as item, index (item.value)}
							<button
								disabled={disabled || !isDropdownOpen}
								on:click={() => {
									isDropdownOpen = false;
									setTimeout(() => {
										value = item.value;
									}, 100);
								}}
								class="w-full text-left flex items-center justify-start min-w-0 px-4 py-3.25 md:py-3.5 relative z-0 group
							{index === items.filter((i) => i.value !== value).length - 1 ? 'rounded-b-lg' : ''}"
								type="button"
								aria-label={item.label}
							>
								<div
									class="w-full h-full absolute left-0 top-0 overflow-hidden z-0 {index ===
									items.filter((i) => i.value !== value).length - 1
										? 'rounded-b-lg'
										: ''}"
								>
									<div
										class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center"
									>
										<div
											class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
											bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
										/>
									</div>
								</div>
								<p
									class="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis text-base font-medium relative transition
								max-w-full z-0 text-c-on-bg/75 {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
								>
									{item.label}
								</p>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</TabBarWrapper>
