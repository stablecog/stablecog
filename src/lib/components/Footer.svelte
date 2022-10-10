<script lang="ts">
	import IconSocial from '$components/IconSocial.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 pt-7 pb-4">
	<a
		class="text-c-on-bg/40 px-5 py-4.5 -mt-3 leading-[1.75] rounded-xl font-semibold transition pointer-events-auto flex items-center gap-2 group relative {!$isTouchscreen
			? 'hover:text-c-primary'
			: ''}"
		target="blank"
		href="https://github.com/yekta/stablecog"
	>
		<div class="w-full h-full absolute left-0 top-0 p-1.5">
			<div class="w-full h-full rounded-xl z-0 overflow-hidden">
				<div
					class="w-full h-full origin-left rounded-xl transition transform translate-y-full
				bg-c-primary/25 {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
				/>
			</div>
		</div>
		<IconSocial type="github" class="w-6 h-6" />
		yekta
	</a>
	<a
		class="text-c-on-bg/40 px-5 py-4.5 -mt-3 leading-[1.75] rounded-xl font-semibold transition pointer-events-auto flex items-center gap-2 group relative {!$isTouchscreen
			? 'hover:text-c-primary'
			: ''}"
		target="blank"
		href="https://twitter.com/ngyekta"
	>
		<div class="w-full h-full absolute left-0 top-0 p-1.5">
			<div class="w-full h-full rounded-xl z-0 overflow-hidden">
				<div
					class="w-full h-full origin-left rounded-xl transition transform translate-y-full
					bg-c-primary/25 {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
				/>
			</div>
		</div>
		<IconSocial type="twitter" class="w-6 h-6" />
		ngyekta
	</a>
</div>
