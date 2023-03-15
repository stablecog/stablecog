<script lang="ts">
	import IconStar from '$components/icons/IconStar.svelte';
	import IconStarOutlined from '$components/icons/IconStarOutlined.svelte';

	export let favorited = false;
	export { classes as class };
	let classes = 'w-7 h-7';
</script>

<div class="{classes} text-c-secondary relative">
	<IconStarOutlined class="w-full h-full" />
	<IconStar
		class="w-full h-full absolute left-0 top-0 transform transition duration-400 {favorited
			? 'scale-110 opacity-100 ease-bounce-out'
			: 'scale-0 opacity-0'}"
	/>
</div>
