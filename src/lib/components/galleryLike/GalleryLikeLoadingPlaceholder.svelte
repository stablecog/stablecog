<script lang="ts">
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import LL from '$i18n/i18n-svelte';

	export let type: 'default' | 'with-loader' = 'default';
	export let cardType: TGenerationImageCardType = 'gallery';
	export let paddingLeft = 0;
	export let paddingRight = 0;
	export let paddingTop = 0;
	export let paddingBottom = 0;
	export { classes as class };
	let classes = '';

	const rowCount = 20;
	const items = Array.from({ length: rowCount }, (_, i) => i);

	const rounding = cardType === 'generate' ? 'rounded-lg' : 'rounded-xl';
</script>

<div
	style="
			padding-left: {paddingLeft}px; 
			padding-right: {paddingRight}px; 
			padding-top: {paddingTop}px; 
			padding-bottom: {paddingBottom}px;
	"
	class="flex w-full flex-1 flex-col items-center justify-center text-center text-c-on-bg/60 {classes}"
>
	{#if type === 'with-loader'}
		<div class="flex flex-col">
			<IconAnimatedSpinner class="h-12 w-12" />
			<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
			<div class="h-[2vh]" />
		</div>
	{:else}
		<div class="flex w-full flex-row">
			<div class="flex flex-1 flex-col">
				{#each items as item, index}
					<div class="w-full p-px">
						<div
							class="w-full {rounding} bg-c-bg-secondary {index % 2 === 0
								? 'pb-[100%]'
								: 'pb-[150%]'}"
						></div>
					</div>
				{/each}
			</div>
			<div class="flex flex-1 flex-col">
				{#each items as item, index}
					<div class="w-full p-px">
						<div
							class="w-full {rounding} bg-c-bg-secondary {index % 2 === 1
								? 'pb-[100%]'
								: 'pb-[150%]'}"
						></div>
					</div>
				{/each}
			</div>
			<div class="hidden flex-1 flex-col {cardType === 'generate' ? 'xl:flex' : 'md:flex'}">
				{#each items as item, index}
					<div class="w-full p-px">
						<div
							class="w-full {rounding} bg-c-bg-secondary {index % 2 === 0
								? 'pb-[100%]'
								: 'pb-[150%]'}"
						></div>
					</div>
				{/each}
			</div>
			{#if cardType !== 'generate'}
				<div class="hidden flex-1 flex-col lg:flex">
					{#each items as item, index}
						<div class="w-full p-px">
							<div
								class="w-full {rounding} bg-c-bg-secondary {index % 2 === 1
									? 'pb-[100%]'
									: 'pb-[150%]'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="hidden flex-1 flex-col xl:flex">
					{#each items as item, index}
						<div class="w-full p-px">
							<div
								class="w-full {rounding} bg-c-bg-secondary {index % 2 === 0
									? 'pb-[100%]'
									: 'pb-[150%]'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="hidden flex-1 flex-col 2xl:flex">
					{#each items as item, index}
						<div class="w-full p-px">
							<div
								class="w-full {rounding} bg-c-bg-secondary {index % 2 === 1
									? 'pb-[100%]'
									: 'pb-[150%]'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="hidden flex-1 flex-col 3xl:flex">
					{#each items as item, index}
						<div class="w-full p-px">
							<div
								class="w-full {rounding} bg-c-bg-secondary {index % 2 === 0
									? 'pb-[100%]'
									: 'pb-[150%]'}"
							></div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
