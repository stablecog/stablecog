<script lang="ts">
	import { socialAppUrls } from '$ts/constants/social';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import IconButton from './buttons/IconButton.svelte';
	import IconSocial from './icons/IconSocial.svelte';

	export let size: 'sm' | 'md' = 'sm';
	export let color: 'faded' | 'normal' = 'faded';
</script>

<div class="w-full flex flex-wrap justify-center">
	<IconButton name="Discord" href={socialAppUrls.discord} target="_blank">
		<IconSocial
			type="discord"
			class="{size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton name="Twitter" href={socialAppUrls.twitter} target="_blank">
		<IconSocial
			type="twitter"
			class="{size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton name="Instagram" href={socialAppUrls.instagram} target="_blank">
		<IconSocial
			type="instagram"
			class="{size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton name="ProductHunt" href={socialAppUrls.producthunt} target="_blank">
		<IconSocial
			type="producthunt"
			class="{size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton name="GitHub" href={socialAppUrls.github} target="_blank">
		<IconSocial
			type="github"
			class="{size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg/75'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
</div>
