<script lang="ts">
	import LinkButton from '$components/buttons/LinkButton.svelte';
	import IconSocial from '$components/icons/IconSocial.svelte';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 pt-6 pb-4.5">
	<LinkButton href="https://github.com/yekta/stablecog" type="sm">
		<IconSocial type="github" class="w-5.5 h-5.5" />
		yekta/stablecog
	</LinkButton>
	<LinkButton href="https://twitter.com/ngyekta" type="sm">
		<IconSocial type="twitter" class="w-5.5 h-5.5" />
		ngyekta
	</LinkButton>
</div>
