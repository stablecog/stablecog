<script lang="ts">
	import IconBlog from '$components/icons/IconBlog.svelte';
	import IconGuide from '$components/icons/IconGuide.svelte';
	import { socialAppUrls, socialAppUrlsAbsolute } from '$ts/constants/social';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import IconSc from '$components/icons/IconSc.svelte';

	export let size: 'sm' | 'md' | 'lg' = 'sm';
	export let color: 'faded' | 'normal' = 'faded';
	export let noBlog = false;
	export let noEmail = false;
	export let noGuide = false;
	export let noProductHunt = false;
	export let noGithub = false;
	export let emailFirst = false;
	export let isInline = false;
	export let withAbsoluteUrls = false;
	export { classes as class };
	let classes = '';
</script>

<div class="{!isInline ? 'w-full' : ''} flex flex-wrap justify-center {classes}">
	{#if !noGuide}
		<IconButton name="Blog" href={'/guide'} target="_blank">
			<IconGuide
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
						? 'w-12 h-12'
						: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
			/>
		</IconButton>
	{/if}
	{#if !noBlog}
		<IconButton name="Blog" href={'/blog'} target="_blank">
			<IconBlog
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
						? 'w-12 h-12'
						: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
			/>
		</IconButton>
	{/if}
	<IconButton
		name="Discord"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.discord : socialAppUrls.discord}
		target="_blank"
	>
		<IconSc
			type="discord"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
					? 'w-12 h-12'
					: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
		/>
	</IconButton>
	<IconButton
		name="Twitter"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.twitter : socialAppUrls.twitter}
		target="_blank"
	>
		<IconSc
			type="twitter"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
					? 'w-12 h-12'
					: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
		/>
	</IconButton>
	<IconButton
		name="Instagram"
		href={withAbsoluteUrls ? socialAppUrlsAbsolute.instagram : socialAppUrls.instagram}
		target="_blank"
	>
		<IconSc
			type="instagram"
			class="{size === 'sm'
				? 'w-8 h-8'
				: size === 'lg'
					? 'w-12 h-12'
					: 'w-10 h-10'} transition {color === 'normal'
				? 'text-c-on-bg'
				: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
		/>
	</IconButton>
	{#if !noEmail}
		<IconButton
			name="Email"
			href={withAbsoluteUrls ? socialAppUrlsAbsolute.email : socialAppUrls.email}
			target="_blank"
			class={emailFirst ? 'order-first' : ''}
		>
			<IconSc
				type="email"
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
						? 'w-12 h-12'
						: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
			/>
		</IconButton>
	{/if}
	{#if !noProductHunt}
		<IconButton
			name="Product Hunt"
			href={withAbsoluteUrls ? socialAppUrlsAbsolute.producthunt : socialAppUrls.producthunt}
			target="_blank"
		>
			<IconSc
				type="producthunt"
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
						? 'w-12 h-12'
						: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
			/>
		</IconButton>
	{/if}
	{#if !noGithub}
		<IconButton
			name="GitHub"
			href={withAbsoluteUrls ? socialAppUrlsAbsolute.github : socialAppUrls.github}
			target="_blank"
		>
			<IconSc
				type="github"
				class="{size === 'sm'
					? 'w-8 h-8'
					: size === 'lg'
						? 'w-12 h-12'
						: 'w-10 h-10'} transition {color === 'normal'
					? 'text-c-on-bg'
					: 'text-c-on-bg/60'} not-touch:group-hover/iconbutton:text-c-primary"
			/>
		</IconButton>
	{/if}
</div>
