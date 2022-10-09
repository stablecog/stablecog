<script lang="ts">
	import IconSocial from '$components/IconSocial.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
</script>

<div class="w-full flex justify-center items-center px-8 py-6">
	<p class="text-c-on-bg/25 target leading-[1.75] pointer-events-none text-right">
		Made by <a
			class="text-c-on-bg/40 px-5 py-3 -mx-5 rounded-lg font-semibold transition pointer-events-auto {!$isTouchscreen
				? 'hover:text-c-primary hover:underline'
				: ''}"
			target="blank"
			href="https://twitter.com/ngyekta">@ngyekta</a
		>
	</p>
	<div class="self-stretch py-3 pointer-events-none">
		<div class="mx-5 w-2px rounded-full bg-c-on-bg/15 h-full" />
	</div>

	<a
		class="text-c-on-bg/40 px-5 py-3 leading-[1.75] -mx-5 rounded-lg font-semibold transition pointer-events-auto flex items-center gap-2 {!$isTouchscreen
			? 'hover:text-c-primary hover:underline'
			: ''}"
		target="blank"
		href="https://github.com/yekta/stablecog"
	>
		<IconSocial type="github" class="w-6 h-6" />
		GitHub
	</a>
</div>
