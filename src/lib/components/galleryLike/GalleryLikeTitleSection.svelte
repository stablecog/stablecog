<script lang="ts">
	export let title: string;
	export let titleSecondary: string | undefined = undefined;
</script>

<div class="flex w-full max-w-3xl flex-col items-center justify-start px-1 pt-2">
	<div
		class="flex w-full flex-col items-start justify-start gap-4 md:flex-row md:items-center md:justify-between md:gap-5"
	>
		<div class="flex min-w-0 max-w-full flex-shrink items-center gap-2 px-2.5 md:px-2.5 md:py-2.5">
			<p
				class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis
          whitespace-nowrap text-2.5xl font-bold"
			>
				{title}
			</p>
			{#if titleSecondary}
				<p class="text-sm font-semibold text-c-on-bg/50 md:text-base">
					{titleSecondary}
				</p>
			{/if}
		</div>
		<div class="z-50 flex w-full flex-1 items-center justify-end md:w-auto">
			<slot name="view" />
		</div>
	</div>
	<div class="mt-3 flex w-full">
		<slot name="search-and-filter" />
	</div>
</div>
