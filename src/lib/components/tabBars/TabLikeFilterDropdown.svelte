<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import ScrollAreaWithChevron from '$components/utils/ScrollAreaWithChevron.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main';
	import { onMount } from 'svelte';

	type T = $$Generic;
	export let values: T[];
	export let items: TTab<T>[];
	export let name: string;
	export let nameIcon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let hasTitle = true;
	export let dontScale = false;
	export let disabled = false;
	export let calculateDistance = true;
	export let dropdownClass = '';
	export let container: HTMLDivElement | undefined = undefined;
	export let containerTopMinDistance = 12;
	export let containerBottomMinDistance = 12;
	export { classes as class };
	let classes = '';

	let minDropdownHeight = 200;

	let isDropdownOpen = false;
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

<TabBarWrapper {dontScale} class="{classes} {isDropdownOpen ? 'z-20' : 'z-10'} relative">
	{#if hasTitle}
		<div class="self-stretch flex text-c-on-bg/50">
			<slot name="title" />
		</div>
	{/if}
	<div
		use:clickoutside={{ callback: () => (isDropdownOpen = false) }}
		class="{hasTitle ? 'ml-px' : ''} flex-1 min-w-0 flex flex-col relative rounded-r-xl {!hasTitle
			? 'rounded-l-xl'
			: ''}"
	>
		<button
			{disabled}
			bind:this={buttonElement}
			bind:clientHeight={buttonHeight}
			on:click={() => {
				setDropdownWrapperPosition();
				toggleDropdown();
			}}
			class="touch-manipulation flex-1 ring-2 text-left flex items-center justify-between min-w-0 {hasTitle
				? 'px-4'
				: 'px-5'} py-3.5 relative
				group transition-all duration-150 z-30 gap-2 {isDropdownOpen
				? dropdownPlacement === 'top'
					? `rounded-br-xl ${!hasTitle ? 'rounded-bl-xl' : ''} bg-c-bg-secondary ring-c-bg-tertiary`
					: `rounded-tr-xl ${!hasTitle ? 'rounded-tl-xl' : ''} bg-c-bg-secondary ring-c-bg-tertiary`
				: `rounded-r-xl ${!hasTitle ? 'rounded-l-xl' : ''} bg-c-bg ring-c-bg-secondary`}"
			type="button"
			aria-label={name}
		>
			<div
				class="w-full h-full absolute left-0 top-0 overflow-hidden z-0 transition-all duration-150 {isDropdownOpen
					? dropdownPlacement === 'top'
						? `rounded-br-xl ${!hasTitle ? 'rounded-bl-xl' : ''}`
						: `rounded-tr-xl ${!hasTitle ? 'rounded-tl-xl' : ''}`
					: `rounded-r-xl ${!hasTitle ? 'rounded-l-xl' : ''}`}"
			>
				<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
					<div
						class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
							bg-c-primary/10 not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
			<div class="flex-shrink min-w-0 flex items-center">
				{#if nameIcon}
					<svelte:component
						this={nameIcon}
						class="w-5.5 h-5.5 flex-shrink-0 -ml-1 mr-2 text-c-on-bg not-touch:group-hover:text-c-primary"
					/>
				{/if}
				<p
					class="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis text-base font-medium relative transition
					max-w-full z-0 text-c-on-bg not-touch:group-hover:text-c-primary"
				>
					{name}
				</p>
			</div>
			<div
				class="-mr-1 flex-shrink-0 w-5 h-5 transition {isDropdownOpen ? 'rotate-180' : 'rotate-0'}"
			>
				<IconChevronDown
					class="relative w-full h-full transition text-c-on-bg/50 not-touch:group-hover:text-c-primary"
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
				class="w-full flex flex-col overflow-hidden bg-c-bg-secondary shadow-xl transition-all
					shadow-c-shadow/[var(--o-shadow-strongest)] ring-2 ring-c-bg-tertiary {dropdownPlacement === 'top'
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
					<div
						bind:clientHeight={dropdownHeight}
						class="w-full flex flex-col justify-start relative z-20 overflow-hidden {dropdownClass}"
					>
						<ScrollAreaWithChevron class="w-full flex flex-col">
							{#each items as item, index (item.value)}
								<label
									for={item.label}
									class="touch-manipulation w-full text-left flex items-center justify-start min-w-0 {hasTitle
										? 'px-4'
										: 'px-5'} py-3.5 relative z-0 group
											{index === items.length - 1 ? 'rounded-b-lg' : ''} cursor-pointer"
									aria-label={item.label}
								>
									<div
										class="w-full h-full absolute left-0 top-0 overflow-hidden z-0 {index ===
										items.length - 1
											? 'rounded-b-lg'
											: ''}"
									>
										<div
											class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center"
										>
											<div
												class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
													bg-c-primary/10 not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
											/>
										</div>
									</div>
									<div class="w-full flex items-center gap-3">
										<div class="w-4 h-4 ring-1 ring-c-primary rounded flex-shrink-0 p-0.5">
											<div
												class="w-full h-full transition transform bg-c-primary rounded-sm {values &&
												values.includes(item.value)
													? 'scale-100 opacity-100'
													: 'scale-50 opacity-0'}"
											/>
										</div>
										<p
											class="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis text-base font-medium relative transition
												max-w-full z-0 text-c-on-bg not-touch:group-hover:text-c-primary"
										>
											{item.label}
										</p>
									</div>
									<input
										type="checkbox"
										class="w-0 h-0 overflow-hidden opacity-0 z-0"
										bind:group={values}
										id={item.label}
										name={item.label}
										value={item.value}
									/>
								</label>
							{/each}
						</ScrollAreaWithChevron>
					</div>
				</div>
			</div>
		</div>
	</div>
</TabBarWrapper>
