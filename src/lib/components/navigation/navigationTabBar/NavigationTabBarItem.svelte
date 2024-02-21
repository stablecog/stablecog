<script lang="ts">
	import type { TTabBarPlacement } from '$ts/types/main';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import IconNew from '$components/icons/IconNew.svelte';
	import type { TNavbarRouteOption } from '$components/navigation/routes';
	import AnchorOrDiv from '$components/utils/AnchorOrDiv.svelte';
	import type { ReferenceAction } from 'svelte-floating-ui';

	export let clientWidth: number;
	export let element: HTMLAnchorElement | HTMLDivElement;
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
	export let floatingRef: ReferenceAction | undefined = undefined;
</script>

<AnchorOrDiv
	bind:clientWidth
	bind:element
	{ariaLabel}
	dataSveltekitPreloadData
	onClick={onClick ?? undefined}
	{floatingRef}
	class="max-w-full rounded-lg whitespace-nowrap overflow-hidden group self-stretch flex
					items-center justify-center px-5 transition-all relative font-semibold {type === 'bottom'
		? 'pt-4 pb-4.5'
		: 'py-4'} {isSelected
		? 'text-c-on-bg not-touch:hover:text-c-primary'
		: 'text-c-on-bg/75'} relative"
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
					bg-c-bg-secondary {isSelected
					? 'group-focus-within:translate-y-0'
					: ''} not-touch:group-hover:translate-y-0"
			/>
		</div>
	</div>
	<div class="flex-shrink min-w-0 flex justify-center items-center gap-1.5 relative">
		<IconNavbarRoute class="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 transform scale-100" type={icon} />
		<p
			class="hidden {iconOnly
				? ''
				: 'lg:block'} flex-shrink min-w-0 text-center overflow-hidden overflow-ellipsis select-none"
		>
			{label}
		</p>
	</div>
	{#if isNew}
		<div class="absolute right-1.5 top-1.5 2xl:right-2 2xl:top-2">
			<IconNew class="w-5 h-5 transform scale-100 text-c-primary" />
		</div>
	{/if}
</AnchorOrDiv>

{#if hasDropdown}
	<slot name="dropdown" />
{/if}
