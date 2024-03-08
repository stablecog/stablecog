<script lang="ts">
	export let name: string;
	export let required: boolean = false;
	export let type: string;
	export let typeModifier: 'array' | 'object' | 'enum' | undefined = undefined;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;

	const baseTypeNames = ['string', 'number', 'boolean', 'int', 'float'];
	const typeColor = baseTypeNames.includes(type) ? 'text-c-secondary' : 'text-c-tertiary';
</script>

<div id="property-{name}" class="flex w-full flex-col border-b-2 border-c-bg-secondary pb-5.5 pt-5">
	<div class="flex w-full flex-col">
		<div class="mb-3 flex w-full flex-wrap items-start justify-between gap-2 font-mono">
			<p class="pr-6 font-medium text-c-primary">
				{name}
				<span class="font-base text-c-on-bg/50">
					{#if required}
						<span>required</span>
					{/if}
				</span>
			</p>
			<p class="{typeColor} text-sm">
				{#if min !== undefined || max !== undefined}
					<span class="text-c-on-bg/50">
						{#if min !== undefined}
							<span class="mr-[0.5ch] text-xs">min</span><span class="text-c-on-bg/75">{min}</span
							>{/if}{#if min !== undefined && max !== undefined}<span class="text-xxs"
								>&nbsp&nbsp</span
							>{/if}{#if max !== undefined}<span class="mr-[0.5ch] text-xs">max</span><span
								class="text-c-on-bg/75">{max}</span
							>
						{/if}<span class="text-c-on-bg/25">{' | '}</span>
					</span>
				{/if}
				{#if typeModifier}
					<span class="text-c-on-bg/50">
						{typeModifier === 'array' ? 'array of' : `(${typeModifier})`}
					</span>
				{/if}
				{type}
			</p>
		</div>
		<div class="w-full leading-relaxed text-c-on-bg/75">
			<slot />
		</div>
	</div>
</div>
