<script lang="ts">
	import IconStar from '$components/icons/IconStar.svelte';
	import IconStarOutlined from '$components/icons/IconStarOutlined.svelte';

	export let favorited = false;
	export { classes as class };
	let classes = 'w-7 h-7';
</script>

<div class="{classes} relative">
	<IconStarOutlined class="w-full h-full transform scale-100" />
	<IconStar
		class="w-full h-full absolute left-0 top-0 transform transition text-c-secondary {favorited
			? 'scale-100 opacity-100 duration-400 ease-bounce-out'
			: 'scale-0 opacity-0 duration-250'}"
	/>
</div>
