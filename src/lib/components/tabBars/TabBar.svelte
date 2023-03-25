<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TTab } from '$ts/types/main';

	type T = $$Generic;
	export let tabs: TTab<T>[];
	export let name: string;
	export let value: T;
	export let hideSelected = false;
	export { classes as class };
	export let hasTitle = true;
	export let dontScale = false;
	export let disabled = false;
	export let isValid: (v: T) => boolean = () => true;
	export let outline: 'primary' | 'bg-secondary' = 'bg-secondary';
	export let size: 'sm' | 'md' = 'md';
	export let vertical: boolean = false;
	export let iconSet: ConstructorOfATypedSvelteComponent | undefined = undefined;

	let classes = '';
</script>

<TabBarWrapper {outline} class={classes} {dontScale}>
	{#if hasTitle}
		<div class="self-stretch flex text-c-on-bg/40 relative">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch relative">
			<div
				class="w-full h-full {outline === 'primary' ? 'bg-c-primary/15' : 'bg-c-bg-secondary'}"
			/>
		</div>
	{/if}
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
			<button
				disabled={disabled || !isValid(tab.value)}
				on:click|preventDefault={(e) => {
					value = tab.value;
					e.currentTarget.blur();
				}}
				class="flex-1 min-w-0 px-1 {vertical
					? 'py-1.5'
					: size === 'sm'
					? 'py-3.5'
					: 'py-4'} relative text-center rounded-lg group transition"
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
					<div
						slot="0"
						class="flex-1 px-1 flex {vertical
							? 'flex-col gap-0.5'
							: 'gap-1.5'} justify-center items-center {value === tab.value && !hideSelected
							? 'text-c-on-bg'
							: 'text-c-on-bg/50'} {value === tab.value && !hideSelected && !$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					>
						{#if tab.icon}
							<svelte:component
								this={tab.icon}
								class="{dontScale ? 'w-5 h-5' : 'w-4 h-4 md:w-5 md:h-5'} flex-shrink-0"
							/>
						{:else if iconSet}
							<svelte:component this={iconSet} type={tab.value} class="w-4 h-4 flex-shrink-0" />
						{/if}
						<p
							class="flex-shrink overflow-hidden overflow-ellipsis max-w-full whitespace-nowrap font-medium relative transition z-0 {vertical
								? 'text-xxs'
								: ''}"
						>
							{tab.label}
						</p>
					</div>
					<p
						slot="1"
						class="flex-1 px-1 overflow-hidden overflow-ellipsis whitespace-nowrap font-medium relative transition max-w-full z-0 {value ===
							tab.value && !hideSelected
							? 'text-c-on-bg'
							: 'text-c-on-bg/50'} {value === tab.value && !hideSelected && !$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					>
						•
					</p>
				</Morpher>
			</button>
		{/each}
	</div>
</TabBarWrapper>
