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
	class="max-w-full rounded-lg whitespace-nowrap overflow-hidden group self-stretch flex
					items-center justify-center px-5 transition-all relative font-semibold {type === 'bottom'
		? 'pt-4 pb-4.5'
		: 'py-4'} relative group/navbar-tab-item"
	href={hasDropdown ? undefined : href}
>
	<div
		class="w-full h-full absolute left-0 top-0 rounded-lg {type === 'bottom'
			? 'px-1.5 pt-1.5 pb-2'
			: index === 0
				? 'py-1 pl-1 pr-0.5'
				: index === length - 1
					? 'py-1 pr-1 pl-0.5'
					: 'py-1 px-0.5'}"
	>
		<div class="w-full h-full overflow-hidden relative z-0 rounded-lg">
			<div
				class="w-full h-full origin-left rounded-lg transition transform translate-y-full
					bg-c-bg-secondary {isSelected ? 'group-focus-within:translate-y-0' : ''} group-hover:translate-y-0"
			/>
		</div>
	</div>
	<div class="flex-shrink min-w-0 flex justify-center items-center gap-1.5 relative">
		<div class="w-6 h-6 flex-shrink-0 relative">
			<IconNavbarRoute
				class="w-full h-full transition {isSelected
					? 'group-hover:text-c-primary text-c-on-bg'
					: 'text-c-on-bg/75'} {hasDropdown
					? isDropdownOpen
						? 'opacity-0 translate-y-2'
						: 'group-hover/navbar-tab-item:opacity-0 group-hover:translate-y-2'
					: ''}"
				type={icon}
			/>
			<IconChevronDown
				class="w-full h-full absolute left-0 top-0 transition {isSelected
					? 'group-hover:text-c-primary text-c-on-bg'
					: 'text-c-on-bg/75'} {hasDropdown
					? isDropdownOpen
						? 'opacity-100 rotate-180'
						: 'opacity-0 -translate-y-2 group-hover/navbar-tab-item:opacity-100 group-hover:translate-y-0'
					: 'hidden'}"
			></IconChevronDown>
		</div>
		<p
			class="hidden {iconOnly
				? ''
				: 'lg:block'} flex-shrink min-w-0 text-center overflow-hidden overflow-ellipsis select-none transition {isSelected
				? 'group-hover:text-c-primary text-c-on-bg'
				: 'text-c-on-bg/75'}"
		>
			{label}
		</p>
	</div>
	{#if isNew}
		<div class="absolute right-1.5 top-1.5 2xl:right-2 2xl:top-2">
			<IconNew class="w-5 h-5 transform scale-100 text-c-primary" />
		</div>
	{/if}
</AnchorOrButton>

{#if hasDropdown}
	<slot name="dropdown" />
{/if}
