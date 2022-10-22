<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';

	export let toc: string;
	export { classes as class };
	let classes = 'hidden lg:flex';
</script>

<div class="max-h-[calc(100vh-7rem)] self-stretch flex flex-col sticky top-24 mt-1 px-5 {classes}">
	<div class="h-full absolute right-0 top-0">
		<div class="h-full w-2px bg-c-on-bg/5 rounded-full" />
	</div>
	<div
		class="h-full items-start justify-start flex flex-col 
		self-stretch"
	>
		<div class="pb-3">
			<SocialBar />
		</div>
		<nav class="toc max-h-full overflow-y-auto max-w-[15rem] py-3 px-2 -mt-3 rounded-2xl">
			{@html toc}
		</nav>
	</div>
</div>
