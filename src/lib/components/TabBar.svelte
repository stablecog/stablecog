<script lang="ts">
	import TabBarWrapper from '$components/TabBarWrapper.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TTab } from '$ts/types/main';

	export let tabs: TTab[];
	export let name: string;
	export let value: string | number;
	export let hideSelected = false;
	export { classes as class };
	let classes = '';
</script>

<TabBarWrapper class={classes}>
	<div class="self-stretch flex text-c-on-bg/30">
		<slot name="title" />
	</div>
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
					class="w-full h-full bg-c-bg-secondary rounded-lg shadow-md shadow-c-shadow/[var(--o-shadow-strong)] "
				/>
			</div>
		</div>
		{#each tabs as tab}
			<button
				on:click|preventDefault={() => (value = tab.value)}
				class="flex-1 min-w-0 px-2 py-4 relative text-center rounded-lg group"
				type="button"
				aria-label={name}
			>
				<div class="w-full h-full absolute left-0 top-0 rounded-lg p-1">
					<div class="w-full h-full overflow-hidden relative z-0 rounded-lg">
						<div
							class="w-full h-full origin-left rounded-lg transition transform translate-y-full 
              bg-c-bg-secondary {value !== tab.value
								? 'group-focus-within:translate-y-0'
								: ''} {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
						/>
					</div>
				</div>
				<p
					class="flex-1 font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 {value ===
						tab.value && !hideSelected
						? 'text-c-on-bg/75'
						: 'text-c-on-bg/30'} {value === tab.value && !hideSelected && !$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{tab.label}
				</p>
			</button>
		{/each}
	</div>
</TabBarWrapper>
