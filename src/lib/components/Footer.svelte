<script lang="ts">
	import LinkButton from '$components/buttons/LinkButton.svelte';
	import IconSocial from '$components/IconSocial.svelte';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 pt-6 pb-4.5">
	<LinkButton href="https://github.com/yekta/stablecog">
		<IconSocial type="github" class="w-6 h-6" />
		yekta
	</LinkButton>
	<LinkButton href="https://twitter.com/ngyekta">
		<IconSocial type="twitter" class="w-6 h-6" />
		ngyekta
	</LinkButton>
</div>
