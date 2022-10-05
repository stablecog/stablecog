<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
</script>

<div class="w-full flex justify-center px-5 py-7">
	<p class="text-c-on-bg/25 target text-center leading-loose pointer-events-none">
		Made by <a
			class="text-c-on-bg/40 px-5 py-3 -mx-5 rounded-lg font-semibold transition pointer-events-auto {!$isTouchscreen
				? 'hover:text-c-primary hover:underline'
				: ''}"
			target="blank"
			href="https://twitter.com/ngyekta">@ngyekta</a
		>.
		<!-- <span class="hidden md:inline-block mx-1ch">|</span>
		<br class="block md:hidden" />
		GitHub:
		<a
			class="text-c-on-bg/40 px-5 py-3 -mx-5 rounded-lg font-semibold transition pointer-events-auto {!$isTouchscreen
				? 'hover:text-c-primary hover:underline'
				: ''}"
			target="blank"
			href="https://github.com/yekta/stablecog"
		>
			Stablecog
		</a> -->
	</p>
</div>
