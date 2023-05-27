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

<div id="property-{name}" class="w-full flex flex-col border-b-2 border-c-bg-secondary py-5">
	<div class="w-full flex flex-col">
		<div class="w-full flex flex-wrap items-start justify-between gap-2 font-mono mb-3">
			<p class="text-c-primary font-medium pr-6">
				{name}
				<span class="text-c-on-bg/50 font-base">
					{#if required}
						<span>required</span>
					{/if}
				</span>
			</p>
			<p class="{typeColor} text-sm">
				{#if min !== undefined || max !== undefined}
					<span class="text-c-on-bg/50">
						{#if min !== undefined}
							<span class="text-xs mr-[0.5ch]">min</span><span class="text-c-on-bg/75">{min}</span
							>{/if}{#if min !== undefined && max !== undefined}<span class="text-xxs"
								>&nbsp&nbsp</span
							>{/if}{#if max !== undefined}
							<span class="text-xs mr-[0.5ch]">max</span><span class="text-c-on-bg/75">{max}</span>
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
		<div class="w-full text-c-on-bg/75 leading-relaxed">
			<slot />
		</div>
	</div>
</div>
