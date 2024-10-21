<script lang="ts">
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconInfoSolid from '$components/icons/IconInfoSolid.svelte';
	import IconWarning from '$components/icons/IconWarning.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import { toast } from 'svelte-sonner';

	export let id: string;
	export let variant: 'error' | 'warning' | 'default' = 'default';
	export let title: string;
	export let description: string | undefined = undefined;
</script>

<div class="font-main flex w-full flex-col gap-1 px-5 pb-4 pt-3.5">
	<div
		class="flex items-center justify-start gap-1.5 {variant === 'warning'
			? 'text-c-secondary'
			: variant === 'error'
				? 'text-c-danger'
				: 'text-c-primary'}"
	>
		{#if variant === 'warning'}
			<IconWarning class="flex size-4.5 shrink-0 items-center justify-center" />
		{:else if variant === 'error'}
			<IconWarning class="flex size-4.5 shrink-0 items-center justify-center" />
		{:else}
			<IconInfoSolid class="flex size-4.5 shrink-0 items-center justify-center" />
		{/if}
		<h3 class="min-w-0 flex-shrink pr-8 text-base font-semibold">
			{title}
		</h3>
	</div>
	<p class="text-sm text-c-on-bg/75">
		{description}
	</p>
	<IconButton
		type="bg-tertiary"
		class="absolute right-0.5 top-0.5"
		name="Close Toast"
		onClick={() => toast.dismiss(id)}
	>
		<IconCancel
			class="relative z-10 size-5 text-c-on-bg/40 transition group-hover/iconbutton:text-c-on-bg/75"
		/>
	</IconButton>
</div>
