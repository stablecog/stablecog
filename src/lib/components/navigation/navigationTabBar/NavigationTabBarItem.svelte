<script lang="ts">
	import type { TTabBarPlacement } from '$ts/types/main';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import IconNew from '$components/icons/IconNew.svelte';
	import type { TNavbarRouteOption } from '$components/navigation/routes';
	import AnchorOrButton from '$components/utils/AnchorOrButton.svelte';
	import type { ReferenceAction } from 'svelte-floating-ui';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let clientWidth: number;
	export let element: HTMLAnchorElement | HTMLButtonElement;
	export let ariaLabel: string;
	export let type: TTabBarPlacement = 'normal';
	export let isSelected: boolean;
	export let href: string;
	export let onClick: (() => void) | undefined = undefined;
	export let icon: TNavbarRouteOption;
	export let iconOnly = false;
	export let label: string;
	export let isNew = false;
	export let index: number;
	export let length: number;
	export let hasDropdown = false;
	export let isDropdownOpen = false;
	export let floatingRef: ReferenceAction | undefined = undefined;
</script>

<AnchorOrButton
	bind:clientWidth
	bind:element
	{ariaLabel}
	dataSveltekitPreloadData
	onClick={onClick ?? undefined}
	{floatingRef}
	class="group relative flex max-w-full items-center justify-center self-stretch
					overflow-hidden whitespace-nowrap rounded-lg px-5 font-semibold transition-all {type === 'bottom'
		? 'pb-4.5 pt-4'
		: 'py-4'} group/navbar-tab-item relative"
	href={hasDropdown ? undefined : href}
>
	<div
		class="absolute left-0 top-0 h-full w-full rounded-lg {type === 'bottom'
			? 'px-1.5 pb-2 pt-1.5'
			: index === 0
				? 'py-1 pl-1 pr-0.5'
				: index === length - 1
					? 'py-1 pl-0.5 pr-1'
					: 'px-0.5 py-1'}"
	>
		<div class="relative z-0 h-full w-full overflow-hidden rounded-lg">
			<div
				class="h-full w-full origin-left transform rounded-lg transition {hasDropdown
					? '-translate-y-full'
					: 'translate-y-full'}
					bg-c-bg-secondary {isSelected ? 'group-focus-within:translate-y-0' : ''} group-hover:translate-y-0"
			/>
		</div>
	</div>
	<div class="relative flex min-w-0 flex-shrink items-center justify-center gap-1.5">
		<div class="relative -m-0.5 h-6 w-6 flex-shrink-0 lg:my-0 lg:-ml-0.5 lg:mr-0 lg:h-5 lg:w-5">
			<IconNavbarRoute
				class="h-full w-full transition {isSelected
					? 'text-c-on-bg group-hover:text-c-primary'
					: 'text-c-on-bg/75'} {hasDropdown
					? isDropdownOpen
						? 'translate-y-2 opacity-0'
						: 'group-hover:translate-y-2 group-hover/navbar-tab-item:opacity-0'
					: ''}"
				type={icon}
			/>
			<IconChevronDown
				strokeWidth={2}
				class="absolute left-0 top-0 h-full w-full transition {isSelected
					? 'text-c-on-bg group-hover:text-c-primary'
					: 'text-c-on-bg/75'} {hasDropdown
					? isDropdownOpen
						? 'rotate-180 opacity-100'
						: '-translate-y-2 opacity-0 group-hover:translate-y-0 group-hover/navbar-tab-item:opacity-100'
					: 'hidden'}"
			></IconChevronDown>
		</div>
		<p
			class="hidden {iconOnly
				? ''
				: 'lg:block'} min-w-0 flex-shrink select-none overflow-hidden overflow-ellipsis text-center transition {isSelected
				? 'text-c-on-bg group-hover:text-c-primary'
				: 'text-c-on-bg/75'}"
		>
			{label}
		</p>
	</div>
	{#if isNew}
		<div class="absolute right-1.5 top-1.5 2xl:right-2 2xl:top-2">
			<IconNew class="h-5 w-5 scale-100 transform text-c-primary" />
		</div>
	{/if}
</AnchorOrButton>

{#if hasDropdown}
	<slot name="dropdown" />
{/if}
