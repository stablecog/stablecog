<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TTab } from '$ts/types/main';

	type T = $$Generic;
	export let tabs: TTab<T>[];
	export let name: string;
	export let value: T;
	export let badgeAppliedTo: T[] | undefined = undefined;
	export let badgeHref: string | undefined = undefined;
	export let hideSelected = false;
	export { classes as class };
	export let hasTitle = true;
	export let dontScale = false;
	export let disabled = false;
	export let isValid: (v: T) => boolean = () => true;
	export let validityDependsOn: T[] = [];

	let classes = '';

	$: [value, validityDependsOn], enforceValidity();

	function enforceValidity() {
		if (!isValid(value)) {
			const index = tabs.map((t) => t.value).indexOf(value);
			for (let i = index - 1; i >= 0; i--) {
				if (isValid(tabs[i].value)) {
					value = tabs[i].value;
					return;
				}
			}
		}
	}
</script>

<TabBarWrapper class={classes} {dontScale}>
	{#if hasTitle}
		<div class="self-stretch flex text-c-on-bg/30">
			<slot name="title" />
		</div>
	{/if}
	<div class="w-2px mr-px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary" />
	</div>
	<div class="flex-1 min-w-0 flex relative rounded-r-xl">
		<div class="w-full h-full absolute left-0 top-0 overflow-hidden rounded-r-xl z-0">
			<div
				style="width: {(1 / tabs.length) * 100}%; transform: translateX({hideSelected
					? -100
					: tabs.map((t) => t.value).indexOf(value) * 100}%)"
				class="h-full absolute left-0 top-0 p-1 transition"
			>
				<div
					class="w-full h-full bg-c-bg-secondary rounded-lg shadow-md shadow-c-shadow/[var(--o-shadow-strong)]"
				/>
			</div>
		</div>
		{#each tabs as tab}
			{#if badgeAppliedTo?.includes(tab.value)}
				<a
					href={badgeHref}
					target="_blank"
					class="flex-1 min-w-0 px-2 py-4 relative text-center rounded-lg group transition"
					type="button"
					aria-label={name}
				>
					<div class="w-full h-full absolute left-0 top-0 rounded-lg p-1">
						<div class="w-full h-full overflow-hidden relative z-0 rounded-lg">
							<div
								class="w-full h-full origin-left rounded-lg transition transform translate-y-full 
              		bg-c-bg-secondary {value !== tab.value
									? 'group-focus-visible:translate-y-0'
									: ''} {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
							/>
						</div>
					</div>
					<Morpher morphed={!isValid(tab.value)}>
						<p
							slot="item-0"
							class="flex-1 font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 {value ===
								tab.value && !hideSelected
								? 'text-c-on-bg/75'
								: 'text-c-on-bg/30'} {value === tab.value && !hideSelected && !$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							{tab.label}
						</p>
						<p
							slot="item-1"
							class="flex-1 font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 {value ===
								tab.value && !hideSelected
								? 'text-c-on-bg/75'
								: 'text-c-on-bg/30'} {value === tab.value && !hideSelected && !$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							•
						</p>
					</Morpher>
				</a>
			{:else}
				<button
					disabled={disabled || !isValid(tab.value)}
					on:click|preventDefault={(e) => {
						value = tab.value;
						e.currentTarget.blur();
					}}
					class="flex-1 min-w-0 px-2 py-4 relative text-center rounded-lg group transition"
					type="button"
					aria-label={name}
				>
					<div class="w-full h-full absolute left-0 top-0 rounded-lg p-1">
						<div class="w-full h-full overflow-hidden relative z-0 rounded-lg">
							<div
								class="w-full h-full origin-left rounded-lg transition transform translate-y-full 
									bg-c-bg-secondary {value !== tab.value
									? 'group-enabled:group-focus-visible:translate-y-0'
									: ''} {!$isTouchscreen ? 'group-enabled:group-hover:translate-y-0' : ''}"
							/>
						</div>
					</div>
					<Morpher morphed={!isValid(tab.value)}>
						<p
							slot="item-0"
							class="flex-1 font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 {value ===
								tab.value && !hideSelected
								? 'text-c-on-bg/75'
								: 'text-c-on-bg/30'} {value === tab.value && !hideSelected && !$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							{tab.label}
						</p>
						<p
							slot="item-1"
							class="flex-1 font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 {value ===
								tab.value && !hideSelected
								? 'text-c-on-bg/75'
								: 'text-c-on-bg/30'} {value === tab.value && !hideSelected && !$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							•
						</p>
					</Morpher>
				</button>
			{/if}
		{/each}
	</div>
</TabBarWrapper>
