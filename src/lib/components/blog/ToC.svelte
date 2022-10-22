<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';

	export let toc: string;
	export { classes as class };
	let classes = 'hidden lg:flex';
</script>

<div
	class="max-h-[calc(100vh-6rem)] items-center justify-start flex flex-col 
	self-stretch pr-10 sticky top-20 mt-1 py-4 {classes}"
>
	<div class="w-full pb-3">
		<SocialBar />
	</div>
	<nav
		class="toc max-h-full overflow-y-auto max-w-[17rem] px-5 py-3 rounded-2xl border-2 border-c-bg-secondary"
	>
		{@html toc}
	</nav>
</div>
