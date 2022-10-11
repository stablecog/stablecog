<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	export let href: string;
	export let target = '_blank';
</script>

<a
	class="text-c-on-bg/40 px-4 py-3.5 -mt-1 leading-[1.75] rounded-xl font-semibold transition pointer-events-auto flex items-center gap-1.5 group relative {!$isTouchscreen
		? 'hover:text-c-primary'
		: ''}"
	{target}
	{href}
>
	<div class="w-full h-full absolute left-0 top-0 p-0.5">
		<div class="w-full h-full rounded-xl z-0 overflow-hidden">
			<div
				class="w-full h-full origin-left rounded-xl transition transform translate-y-full
					bg-c-primary/25 {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
			/>
		</div>
	</div>
	<slot />
</a>
