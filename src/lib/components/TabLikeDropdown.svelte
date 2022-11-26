<script lang="ts">
	import TabBarWrapper from '$components/TabBarWrapper.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import type { TTab } from '$ts/types/main';

	export let items: TTab[];
	export let name: string;
	export let selectedItem = items[0];
	export let value = selectedItem.value;
	export let hasTitle = true;
	export let dontScale = false;
	export let disabled = false;
	export { classes as class };
	let classes = '';

	let isDropdownOpen = false;

	const toggleDropdown = () => (isDropdownOpen = !isDropdownOpen);

	$: value = selectedItem.value;
</script>

<TabBarWrapper class={classes} {dontScale}>
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
			on:click={toggleDropdown}
			class="flex-1 ring-2 ring-c-bg-secondary text-left flex items-center justify-start min-w-0 px-4 py-4 relative 
				group bg-c-bg {isDropdownOpen ? 'z-50 rounded-tr-xl' : 'rounded-r-xl'}"
			type="button"
			aria-label={name}
		>
			<p
				class="w-full text-base font-medium relative transition overflow-hidden overflow-ellipsis 
					max-w-full z-0 text-c-on-bg/75"
			>
				{selectedItem.label}
			</p>
		</button>
		<div class="w-full relative">
			{#if isDropdownOpen}
				<div
					class="w-full flex flex-col absolute top-0 left-0 z-40 bg-c-bg rounded-b-xl shadow-sheet
						shadow-c-shadow/[var(--o-shadow-strongest)] ring-2 ring-c-bg-secondary"
				>
					{#each items.filter((i) => i.value !== value) as item}
						<button
							{disabled}
							on:click={() => {
								selectedItem = item;
								isDropdownOpen = false;
							}}
							class="w-full text-left flex items-center justify-start min-w-0 px-4 py-4 relative rounded-lg group"
							type="button"
							aria-label={item.label}
						>
							<p
								class="w-full text-base font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 text-c-on-bg/75"
							>
								{item.label}
							</p>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</TabBarWrapper>
