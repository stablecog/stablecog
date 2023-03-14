<script lang="ts">
	import IconBlog from '$components/icons/IconBlog.svelte';
	import { socialAppUrls, socialAppUrlsAbsolute, socialUrls } from '$ts/constants/social';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import IconButton from './buttons/IconButton.svelte';
	import IconSocial from './icons/IconSocial.svelte';

	export let size: 'sm' | 'md' | 'lg' = 'sm';
	export let color: 'faded' | 'normal' = 'faded';
	export let withBlog = false;
	export let withEmail = false;
	export let emailFirst = false;
	export let isInline = false;
	export let withAbsoluteUrls = false;
	export { classes as class };
	let classes = '';
</script>

<div class="{!isInline ? 'w-full' : ''} flex flex-wrap justify-center {classes}">
	{#if withBlog}
		<IconButton name="Blog" href={'/blog'}>
			<IconBlog
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
					? 'w-12 h-12'
					: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
			/>
		</IconButton>
	{/if}
	<IconButton
		name="Discord"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.discord : socialAppUrls.discord}
		target="_blank"
	>
		<IconSocial
			type="discord"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
				? 'w-12 h-12'
				: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton
		name="Twitter"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.twitter : socialAppUrls.twitter}
		target="_blank"
	>
		<IconSocial
			type="twitter"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
				? 'w-12 h-12'
				: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton
		name="Instagram"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.instagram : socialAppUrls.instagram}
		target="_blank"
	>
		<IconSocial
			type="instagram"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
				? 'w-12 h-12'
				: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	<IconButton
		name="GitHub"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.github : socialAppUrls.github}
		target="_blank"
	>
		<IconSocial
			type="github"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
				? 'w-12 h-12'
				: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
		/>
	</IconButton>
	{#if withEmail}
		<IconButton
			name="Email"
			href={withAbsoluteUrls ? socialAppUrlsAbsolute.email : socialAppUrls.email}
			target="_blank"
			class={emailFirst ? 'order-first' : ''}
		>
			<IconSocial
				type="email"
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
					? 'w-12 h-12'
					: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/50'} {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
			/>
		</IconButton>
	{/if}
</div>
