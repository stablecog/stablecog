<script lang="ts">
	export let name: string;
	export let required: boolean = false;
	export let type: string;
	export let typeModifier: 'array' | 'object' | 'enum' | undefined = undefined;

	const baseTypeNames = ['string', 'number', 'boolean', 'int', 'float'];
</script>

<div id="property-{name}" class="w-full flex flex-col border-b-2 border-c-bg-secondary py-5">
	<div class="w-full flex flex-col">
		<div class="w-full flex flex-wrap items-center justify-between gap-2 font-mono mb-3">
			<p class="text-c-primary font-medium pr-6">
				{name}
				<span class="text-c-on-bg/50 font-base">
					{#if required}
						<span>required</span>
					{/if}
				</span>
			</p>
			<p class="{baseTypeNames.includes(type) ? 'text-c-secondary' : 'text-c-tertiary'} text-sm">
				{#if typeModifier}
					<span class="text-c-on-bg/50"
						>{typeModifier === 'array' ? 'array of' : `(${typeModifier})`}</span
					>
				{/if}
				{type}
			</p>
		</div>
		<div class="w-full text-c-on-bg/75 leading-relaxed">
			<slot />
		</div>
	</div>
</div>
