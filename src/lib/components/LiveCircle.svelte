<div
	in:elementreceive|local={{ key: generation.id }}
	out:elementsend|local={{ key: generation.id }}
	animate:flip={{ duration: 300, easing: quadOut }}
	class="flex items-center justify-center relative overflow-hidden z-0 rounded-full -m-1.5"
>
	<div class="p-7 relative overflow-hidden z-0 rounded-full">
		{#if generation.status === 'started'}
			<div
				transition:scale|local={{ duration: 300, easing: quadOut }}
				class="absolute w-full h-full left-0 top-0 origin-center"
			>
				<div class="w-full h-full">
					<div
						class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
					/>
				</div>
			</div>
		{/if}
		<div class="w-10 h-10 relative">
			{#if generation.status === 'started'}
				<div
					transition:scale|local={{ duration: 300, easing: quadOut }}
					class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
				/>
			{/if}
			<div
				class="w-full h-full rounded-full transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {generation.status ===
				'succeeded'
					? 'bg-c-success'
					: generation.status === 'failed'
					? 'bg-c-danger'
					: 'bg-c-primary'}"
			>
				{#if generation.country_code}
					<p class="text-center text-xs font-bold text-c-on-primary/50">
						{generation.country_code}
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
