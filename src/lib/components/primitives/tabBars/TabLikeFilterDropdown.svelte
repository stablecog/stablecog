<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import ScrollAreaWithChevron from '$components/utils/ScrollAreaWithChevron.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main';
	import { onMount } from 'svelte';

	type T = $$Generic;
	export let values: T[];
	export let items: TTab<T>[];
	export let name: string;
	export let nameIcon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let nameTagline: string | undefined = undefined;
	export let nameTaglineClass =
		'font-normal text-c-on-bg/60 transition not-touch:group-hover:text-c-primary';
	export let hasTitle = false;
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
		<div class="flex self-stretch text-c-on-bg/50">
			<slot name="title" />
		</div>
	{/if}
	<div
		use:clickoutside={{ callback: () => (isDropdownOpen = false) }}
		class="{hasTitle ? 'ml-px' : ''} relative flex min-w-0 flex-1 flex-col rounded-r-xl {!hasTitle
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
			class="flex min-w-0 flex-1 touch-manipulation items-center justify-between text-left ring-2 {hasTitle
				? 'px-4'
				: 'px-5'} group relative
				z-30 gap-2 py-3.5 transition-all duration-150 {isDropdownOpen
				? dropdownPlacement === 'top'
					? `rounded-br-xl ${!hasTitle ? 'rounded-bl-xl' : ''} bg-c-bg-secondary ring-c-bg-tertiary`
					: `rounded-tr-xl ${!hasTitle ? 'rounded-tl-xl' : ''} bg-c-bg-secondary ring-c-bg-tertiary`
				: `rounded-r-xl ${!hasTitle ? 'rounded-l-xl' : ''} bg-c-bg ring-c-bg-secondary`}"
			type="button"
			aria-label={name}
		>
			<div
				class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden transition-all duration-150 {isDropdownOpen
					? dropdownPlacement === 'top'
						? `rounded-br-xl ${!hasTitle ? 'rounded-bl-xl' : ''}`
						: `rounded-tr-xl ${!hasTitle ? 'rounded-tl-xl' : ''}`
					: `rounded-r-xl ${!hasTitle ? 'rounded-l-xl' : ''}`}"
			>
				<div class="absolute left-0 top-0 flex h-full w-[200%] items-center justify-center">
					<div
						class="aspect-square w-full origin-left -translate-x-full transform rounded-full bg-c-primary/10 opacity-0
							transition not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
			<div class="flex min-w-0 flex-shrink items-center">
				{#if nameIcon}
					<svelte:component
						this={nameIcon}
						class="-ml-1 mr-2 h-5.5 w-5.5 flex-shrink-0 text-c-on-bg transition not-touch:group-hover:text-c-primary"
					/>
				{/if}
				<p
					class="relative z-0 max-w-full flex-shrink select-none overflow-hidden overflow-ellipsis whitespace-nowrap
					text-base font-medium text-c-on-bg transition not-touch:group-hover:text-c-primary"
				>
					{name}
					{#if nameTagline}
						<span class={nameTaglineClass}>
							{nameTagline}
						</span>
					{/if}
				</p>
			</div>
			<div
				class="-mr-1 h-5 w-5 flex-shrink-0 transition {isDropdownOpen ? 'rotate-180' : 'rotate-0'}"
			>
				<IconChevronDown
					class="relative h-full w-full text-c-on-bg/50 transition not-touch:group-hover:text-c-primary"
				/>
			</div>
		</button>
		<div
			style="transform: translateY({dropdownPlacement === 'top'
				? `${-dropdownHeight}px`
				: `${buttonHeight}px`}); height: {dropdownHeight}px;"
			class="pointer-events-none absolute left-0 top-0 flex w-full flex-col {dropdownPlacement ===
			'top'
				? 'justify-end'
				: 'justify-start'}"
		>
			<div
				style="height: {isDropdownOpen ? dropdownHeight : '0'}px"
				class="flex w-full flex-col overflow-hidden bg-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-strongest)]
					ring-2 ring-c-bg-tertiary transition-all {dropdownPlacement === 'top'
					? 'origin-bottom justify-end rounded-t-xl'
					: 'origin-top justify-start rounded-b-xl'} {isDropdownOpen
					? 'pointer-events-auto opacity-100'
					: 'pointer-events-none opacity-0'}"
			>
				<div
					style="max-height: {dropdownMaxHeight}px;"
					bind:clientHeight={dropdownHeight}
					class="relative z-20 flex w-full flex-col justify-start {dropdownClass}"
				>
					<div
						bind:clientHeight={dropdownHeight}
						class="relative z-20 flex w-full flex-col justify-start overflow-hidden {dropdownClass}"
					>
						<ScrollAreaWithChevron class="flex w-full flex-col">
							{#each items as item, index (item.value)}
								<label
									for={item.label}
									class="flex w-full min-w-0 touch-manipulation items-center justify-start text-left {hasTitle
										? 'px-4'
										: 'px-5'} group relative z-0 py-3.5
											{index === items.length - 1 ? 'rounded-b-lg' : ''} cursor-pointer"
									aria-label={item.label}
								>
									<div
										class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden {index ===
										items.length - 1
											? 'rounded-b-lg'
											: ''}"
									>
										<div
											class="absolute left-0 top-0 flex h-full w-[200%] items-center justify-center"
										>
											<div
												class="aspect-square w-full origin-left -translate-x-full transform rounded-full bg-c-primary/10 opacity-0
													transition not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
											/>
										</div>
									</div>
									<div class="flex w-full items-center gap-3">
										<div
											class="relative z-0 h-4 w-4 flex-shrink-0 overflow-hidden rounded ring-1.5 ring-c-primary
											transition {values && values.includes(item.value) ? 'bg-c-primary' : ''}"
										>
											<div
												class="h-full w-full transform rounded bg-c-primary ring-c-primary transition
												{values && values.includes(item.value)
													? 'scale-100 opacity-100 ring-1.5'
													: 'scale-25 opacity-0 ring-0'} p-0.25"
											>
												<IconTickOnly class="h-full w-full text-c-on-primary" />
											</div>
										</div>
										<p
											class="relative z-0 max-w-full flex-shrink select-none overflow-hidden overflow-ellipsis whitespace-nowrap
												text-base font-medium text-c-on-bg transition not-touch:group-hover:text-c-primary"
										>
											{item.label}
										</p>
									</div>
									<input
										type="checkbox"
										class="z-0 h-0 w-0 overflow-hidden opacity-0"
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
