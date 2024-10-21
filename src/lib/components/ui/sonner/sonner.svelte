<script lang="ts">
	import { themeApp } from '$ts/stores/theme';
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';

	type $$Props = SonnerProps;
</script>

<Sonner
	theme={$themeApp}
	class="toaster group"
	toastOptions={{
		classes: {
			toast:
				'group text-base overflow-hidden text-sm toast group-[.toaster]:bg-c-bg group-[.toaster]:text-c-on-bg rounded-xl border-1.5 group-[.toaster]:border-c-bg-tertiary group-[.toaster]:shadow-xl group-[.toaster]:shadow-c-shadow/[var(--o-shadow-stronger)]',
			description: 'group-[.toast]:text-c-on-bg/75 text-sm',
			actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-c-bg',
			cancelButton: 'group-[.toast]:bg-primary group-[.toast]:text-c-bg',
			warning: 'group-[.toast]:bg-c-bg group-[.toast]:text-c-secondary'
		}
	}}
	{...$$restProps}
/>
