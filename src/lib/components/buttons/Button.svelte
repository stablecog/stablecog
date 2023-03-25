<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconAnimatedUploading from '$components/icons/IconAnimatedUploading.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { THrefTarget } from '$ts/types/main';
	export let disabled = false;
	export let loading = false;
	export let uploading = false;
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let prefetch: boolean = true;
	export let size: 'md' | 'sm' | 'xs' = 'md';
	export let withSpinner = false;
	export let noPadding = false;
	export let target: THrefTarget = undefined;
	export { classes as class };
	export let type: 'primary' | 'success' | 'danger' | 'no-bg-on-bg' = 'primary';
	export let fadeOnDisabled = false;
	let classes = '';
</script>

{#if href}
	<a
		{href}
		{target}
		data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
			? 'hover'
			: 'off'}
		class="{noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-4 md:px-6 py-4'
			: 'px-6 md:px-8 py-5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} relative flex items-center justify-center text-center font-bold gap-2 
			overflow-hidden z-0 group {type === 'no-bg-on-bg'
			? ''
			: 'shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]'} {type === 'no-bg-on-bg'
			? 'text-c-on-bg/60'
			: 'text-c-on-primary'} {loading
			? type === 'success'
				? 'bg-c-success-secondary'
				: type === 'danger'
				? 'bg-c-danger-secondary'
				: 'bg-c-secondary'
			: type === 'success'
			? 'bg-c-success'
			: type === 'danger'
			? 'bg-c-danger'
			: type === 'no-bg-on-bg'
			? 'bg-c-primary/0'
			: 'bg-c-primary'} {classes}"
	>
		<div
			class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center {$isTouchscreen
				? 'hidden'
				: 'flex'}"
		>
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full 
				{type === 'success'
					? 'bg-c-success-secondary'
					: type === 'danger'
					? 'bg-c-danger-secondary'
					: type === 'no-bg-on-bg'
					? 'bg-c-on-bg/10'
					: 'bg-c-secondary'} {!$isTouchscreen ? 'group-hover:translate-x-[-45%]' : ''}"
			/>
		</div>
		<div class="relative">
			{#if withSpinner}
				<div
					class="transform relative transition {loading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedSpinner class="w-full h-full" {loading} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {uploading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</a>
{:else}
	<button
		on:click={onClick}
		disabled={disabled || loading || uploading}
		class="{noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-6 md:px-8 py-4'
			: 'px-6 md:px-8 py-5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} relative flex items-center justify-center text-center font-bold gap-2 
			overflow-hidden z-0 group {type === 'no-bg-on-bg'
			? ''
			: 'shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]'} {type === 'no-bg-on-bg'
			? 'text-c-on-bg/60'
			: 'text-c-on-primary'} {loading
			? type === 'success'
				? 'bg-c-success-secondary'
				: type === 'danger'
				? 'bg-c-danger-secondary'
				: 'bg-c-secondary'
			: type === 'success'
			? 'bg-c-success'
			: type === 'danger'
			? 'bg-c-danger'
			: type === 'no-bg-on-bg'
			? 'bg-c-primary/0'
			: 'bg-c-primary'} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes}"
	>
		<div
			class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center {$isTouchscreen
				? 'hidden'
				: 'flex'}"
		>
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full 
					{type === 'success'
					? 'bg-c-success-secondary'
					: type === 'danger'
					? 'bg-c-danger-secondary'
					: type === 'no-bg-on-bg'
					? 'bg-c-on-bg/10'
					: 'bg-c-secondary'} {!$isTouchscreen
					? 'group-enabled:group-hover:translate-x-[-45%]'
					: ''}"
			/>
		</div>
		<div class="relative">
			{#if withSpinner}
				<div
					class="transform relative transition {loading || uploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedSpinner class="w-full h-full" {loading} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {uploading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</button>
{/if}
