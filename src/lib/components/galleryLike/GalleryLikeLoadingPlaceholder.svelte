<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import LL from '$i18n/i18n-svelte';

	export let type: 'default' | 'with-loader' = 'default';

	const rowCount = 10;
	const items = Array.from({ length: rowCount }, (_, i) => i);
</script>

<div class="flex w-full flex-1 flex-col items-center justify-center text-center text-c-on-bg/60">
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
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 0
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
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 1
								? 'pb-[100%]'
								: 'pb-[150%]'}"
						></div>
					</div>
				{/each}
			</div>
			<div class="hidden flex-1 flex-col md:flex">
				{#each items as item, index}
					<div class="w-full p-px">
						<div
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 0
								? 'pb-[100%]'
								: 'pb-[150%]'}"
						></div>
					</div>
				{/each}
			</div>
			<div class="hidden flex-1 flex-col lg:flex">
				{#each items as item, index}
					<div class="w-full p-px">
						<div
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 1
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
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 0
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
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 1
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
							class="w-full rounded-xl bg-c-bg-secondary {index % 2 === 0
								? 'pb-[100%]'
								: 'pb-[150%]'}"
						></div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
