<script lang="ts">
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconWarning from '$components/icons/IconWarning.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import LL from '$i18n/i18n-svelte';
	import { toast } from 'svelte-sonner';

	export let id: string;
</script>

<div class="font-main flex w-full flex-col gap-1 px-5 pb-4 pt-3.5 text-sm">
	<div class="flex items-center justify-start gap-1.5 text-lg font-bold text-c-secondary">
		<IconWarning class="flex size-4.5 shrink-0 items-center justify-center" />
		<h3 class="min-w-0 flex-shrink pr-8 text-base">
			{$LL.Error.WarningTitle()}
		</h3>
	</div>
	<p class="text-sm text-c-on-bg/75">
		{$LL.Error.NSFWPromptParagraph()}
	</p>
	<IconButton
		type="bg-tertiary"
		class="absolute right-0.5 top-0.5"
		name="Close"
		onClick={() => toast.dismiss(id)}
	>
		<IconCancel
			class="relative z-10 size-5 text-c-on-bg/50 transition group-hover/iconbutton:text-c-on-bg/75"
		/>
	</IconButton>
</div>
