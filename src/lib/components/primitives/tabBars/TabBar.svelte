<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import type { TTab } from '$ts/types/main';

	type T = $$Generic;
	export let tabs: TTab<T>[];
	export let name: string;
	export let value: T;
	export let hideSelected = false;
	export { classes as class };
	export let hasTitle = false;
	export let dontScale = false;
	export let disabled = false;
	export let isValid: (v: T) => boolean = () => true;
	export let outline: 'primary' | 'bg-secondary' = 'bg-secondary';
	export let size: 'xs' | 'sm' | 'md' = 'md';
	export let vertical: boolean = false;
	export let iconSet: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let fontWeight: 500 | 600 = 500;

	let classes = '';

	$: selectedIndex = tabs.map((t) => t.value).indexOf(value);
</script>

<TabBarWrapper {outline} class={classes} {dontScale}>
	{#if hasTitle}
		<div class="relative flex self-stretch text-c-on-bg/50">
			<slot name="title" />
		</div>
		<div class="relative -ml-px mr-px w-2px self-stretch">
			<div
				class="h-full w-full {outline === 'primary' ? 'bg-c-primary/15' : 'bg-c-bg-secondary'}"
			/>
		</div>
	{/if}
	<div class="relative flex min-w-0 flex-1 rounded-r-xl">
		<div class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden rounded-r-xl">
			<div
				style="width: {(1 / tabs.length) * 100}%; transform: translateX({hideSelected
					? -100
					: selectedIndex * 100}%)"
				class="absolute left-0 top-0 h-full py-1 transition {selectedIndex === 0
					? 'pl-1 pr-0.5'
					: selectedIndex === tabs.length - 1
						? 'pl-0.5 pr-1'
						: 'px-0.5'}"
			>
				<div
					class="h-full w-full rounded-lg bg-c-bg-secondary shadow-md shadow-c-shadow/[var(--o-shadow-strong)]"
				/>
			</div>
		</div>
		{#each tabs as tab, index}
			<button
				disabled={disabled || !isValid(tab.value)}
				on:click|preventDefault={(e) => {
					value = tab.value;
					e.currentTarget.blur();
				}}
				class="min-w-0 flex-1 px-1 {vertical
					? 'py-1.5'
					: size === 'xs'
						? 'py-3'
						: size === 'sm'
							? 'py-3.5'
							: 'py-4'} group relative rounded-lg text-center transition"
				type="button"
				aria-label={name}
			>
				<div
					class="absolute left-0 top-0 h-full w-full rounded-lg py-1 {index === 0
						? 'pl-1 pr-0.5'
						: index === tabs.length - 1
							? 'pl-0.5 pr-1'
							: 'px-0.5'}"
				>
					<div class="relative z-0 h-full w-full overflow-hidden rounded-lg">
						<div
							class="h-full w-full origin-left translate-y-full transform rounded-lg bg-c-bg-secondary
									transition {value !== tab.value
								? 'group-enabled:group-focus-visible:translate-y-0'
								: ''} not-touch:group-enabled:group-hover:translate-y-0"
						/>
					</div>
				</div>
				<Morpher morphed={!isValid(tab.value)}>
					<div
						slot="0"
						class="flex flex-1 px-1 {vertical
							? 'flex-col gap-0.5'
							: 'gap-1.5'} items-center justify-center {value === tab.value && !hideSelected
							? 'text-c-on-bg'
							: 'text-c-on-bg/50'} {value === tab.value && !hideSelected
							? 'not-touch:group-hover:text-c-primary'
							: ''}"
					>
						{#if tab.icon}
							<svelte:component
								this={tab.icon}
								class="{dontScale ? 'h-5 w-5' : 'h-5 w-5'} flex-shrink-0"
							/>
						{:else if iconSet}
							<svelte:component this={iconSet} type={tab.value} class="h-4 w-4 flex-shrink-0" />
						{/if}
						<p
							class="max-w-full flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap {fontWeight ===
							600
								? 'font-semibold'
								: 'font-medium'} relative z-0 transition {vertical ? 'text-xxs' : ''}"
						>
							{tab.label}
						</p>
					</div>
					<p
						slot="1"
						class="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap px-1 {fontWeight ===
						600
							? 'font-semibold'
							: 'font-medium'} relative z-0 max-w-full transition {value === tab.value &&
						!hideSelected
							? 'text-c-on-bg'
							: 'text-c-on-bg/50'} {value === tab.value && !hideSelected
							? 'not-touch:group-hover:text-c-primary'
							: ''}"
					>
						•
					</p>
				</Morpher>
			</button>
		{/each}
	</div>
</TabBarWrapper>
