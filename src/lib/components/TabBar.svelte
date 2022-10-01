<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TTab } from '$ts/types/main';

	export let tabs: TTab[];
	export let name: string;
	export let title: string;
	export let value: string;
	export let hideSelected = false;
	export { classes as class };
	let classes = '';
</script>

<div
	class="w-full text-sm flex items-stretch bg-c-bg shadow-lg ring-2 ring-c-bg-secondary shadow-c-shadow/[var(--o-shadow-normal)]  rounded-xl overflow-hidden z-0 transition relative {classes}"
>
	<p class="pl-5 pr-4 py-2 text-base flex items-center text-c-on-bg/30">{title}</p>
	<div class="w-2px mx-1 self-stretch">
		<div class="w-full h-full bg-c-bg-secondary" />
	</div>
	<div class="flex-1 min-w-0 flex relative z-0 overflow-hidden rounded-lg">
		<div
			style="width: {(1 / tabs.length) * 100}%; transform: translateX({hideSelected
				? -100
				: tabs.map((t) => t.value).indexOf(value) * 100}%)"
			class="h-full absolute left-0 top-0 p-1 transition"
		>
			<div
				class="w-full h-full bg-c-bg-secondary rounded-lg shadow-md shadow-c-shadow/[var(--o-shadow-normal)] "
			/>
		</div>
		{#each tabs as tab}
			<label
				class="flex-1 min-w-0 px-2 py-4 relative text-center group overflow-hidden cursor-pointer"
			>
				<div class="w-full h-full absolute left-0 top-0 rounded-lg p-1">
					<div class="w-full h-full overflow-hidden rounded-lg">
						<div
							class="w-full h-full origin-left rounded-lg transition transform translate-y-full 
              bg-c-bg-secondary {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
						/>
					</div>
				</div>
				<input
					class="w-0 h-0 hidden"
					bind:group={value}
					id="{name}-{tab.value}"
					type="radio"
					{name}
					value={tab.value}
				/>
				<p
					class="flex-1 font-medium relative transition overflow-hidden overflow-ellipsis max-w-full z-0 {value ===
						tab.value && !hideSelected
						? 'text-c-on-bg/75'
						: 'text-c-on-bg/30'}"
				>
					{tab.label}
				</p>
			</label>
		{/each}
	</div>
</div>
