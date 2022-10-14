<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { theme } from '$ts/stores/theme';
</script>

<div class="w-full justify-center py-2 mr-3 hidden md:flex">
	<div class="flex relative overflow-hidden z-0 rounded-lg p-px group">
		{#if $theme === 'light'}
			<a
				class="transition ring-c-secondary rounded-lg relative z-0 overflow-hidden"
				href="https://www.producthunt.com/posts/stablecog?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-stablecog"
				target="_blank"
				><img
					src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=363351&theme=light"
					alt="Stablecog | Product Hunt"
					style="width: 188px; height: 41px;"
					width="188"
					height="41"
				/></a
			>
		{:else}
			<a
				class="ring-1 transition ring-c-primary rounded-lg relative z-0 overflow-hidden"
				href="https://www.producthunt.com/posts/stablecog?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-stablecog"
				target="_blank"
				><img
					src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=363351&theme=dark"
					alt="Stablecog | Product Hunt"
					style="width: 188px; height: 41px;"
					width="188"
					height="41"
				/></a
			>
		{/if}
		<div class="w-full h-full absolute left-0 top-0 p-0.5 pointer-events-none">
			<div class="w-full h-full relative z-0 overflow-hidden rounded-md">
				<div
					class="w-full h-full origin-left transition transform translate-y-full
            {$theme === 'light'
						? 'bg-c-secondary/25'
						: 'bg-c-primary/30'} rounded-md {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
				/>
			</div>
		</div>
	</div>
</div>
