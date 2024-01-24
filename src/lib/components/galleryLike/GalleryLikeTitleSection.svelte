<script lang="ts">
	export let title: string;
	export let titleSecondary: string | undefined = undefined;
</script>

<div class="w-full max-w-3xl flex flex-col items-center justify-start px-1 pt-2">
	<div
		class="w-full flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center justify-start md:justify-between"
	>
		<div class="max-w-full flex flex-shrink min-w-0 gap-2 items-center px-2.5 md:px-2.5 md:py-2.5">
			<p
				class="font-bold text-2.5xl flex-shrink min-w-0
          whitespace-nowrap overflow-hidden overflow-ellipsis"
			>
				{title}
			</p>
			{#if titleSecondary}
				<p class="text-sm md:text-base text-c-on-bg/50 font-semibold">
					{titleSecondary}
				</p>
			{/if}
		</div>
		<div class="w-full md:w-auto flex flex-1 items-center justify-end z-50">
			<slot name="view" />
		</div>
	</div>
	<div class="w-full flex mt-3">
		<slot name="search-and-filter" />
	</div>
</div>
