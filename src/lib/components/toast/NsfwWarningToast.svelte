<script lang="ts">
	import Toast from '$components/toast/Toast.svelte';
	import LL from '$i18n/i18n-svelte';

	export let id: string;
</script>

<Toast
	{id}
	variant="warning"
	title={$LL.Error.WarningTitle()}
	description={$LL.Error.NSFWPromptParagraph()}
/>
