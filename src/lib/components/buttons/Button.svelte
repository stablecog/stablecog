<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconAnimatedUploading from '$components/icons/IconAnimatedUploading.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { THrefTarget } from '$ts/types/main';
	import { tick } from 'svelte';
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
	export let animateOnClick = false;
	let classes = '';

	function _onClick() {
		if (animateOnClick) onClicked();
		onClick?.();
	}

	let shouldAnimate = false;
	let animationTimeout: NodeJS.Timeout | undefined = undefined;
	async function onClicked() {
		clearTimeout(animationTimeout);
		if (animateOnClick) {
			shouldAnimate = false;
			await tick();
			setTimeout(() => {
				shouldAnimate = true;
				animationTimeout = setTimeout(() => {
					shouldAnimate = false;
				}, 300);
			});
		}
	}

	let width: number;
	let height: number;

	$: buttonSize = smallestSquareSide(width, height);

	function smallestSquareSide(width: number, height: number): number {
		const diagonal = Math.sqrt(width * width + height * height);
		return diagonal;
	}
</script>

{#if href}
	<a
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:click={_onClick}
		{href}
		{target}
		data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
			? 'hover'
			: 'off'}
		class="touch-manipulation relative flex items-center justify-center text-center font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-4 md:px-5 py-3.5'
			: 'px-6 md:px-8 py-4.5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} {type === 'no-bg-on-bg'
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
			: 'bg-c-primary'} {classes} {shouldAnimate ? 'scale-animation' : ''}"
	>
		<div
			style="width: {buttonSize}px; height: {buttonSize}px;"
			class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center {$isTouchscreen
				? 'hidden'
				: 'flex'}"
		>
			<div
				class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
					{type === 'success'
					? 'bg-c-success-secondary'
					: type === 'danger'
					? 'bg-c-danger-secondary'
					: type === 'no-bg-on-bg'
					? 'bg-c-on-bg/10'
					: 'bg-c-secondary'} {!$isTouchscreen ? 'group-hover:translate-x-0' : ''}"
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
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:click={_onClick}
		disabled={disabled || loading || uploading}
		class="touch-manipulation relative flex items-center justify-center text-center font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-4 md:px-5 py-4'
			: 'px-6 md:px-8 py-4.5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} {type === 'no-bg-on-bg'
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
			: 'bg-c-primary'} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		<div
			style="width: {buttonSize}px; height: {buttonSize}px;"
			class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center {$isTouchscreen
				? 'hidden'
				: 'flex'}"
		>
			<div
				class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
					{type === 'success'
					? 'bg-c-success-secondary'
					: type === 'danger'
					? 'bg-c-danger-secondary'
					: type === 'no-bg-on-bg'
					? 'bg-c-on-bg/10'
					: 'bg-c-secondary'} {!$isTouchscreen ? 'group-enabled:group-hover:translate-x-0' : ''}"
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
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {!loading &&
						uploading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</button>
{/if}

<style>
	.scale-animation {
		animation: scale 0.175s;
	}
	@keyframes scale {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.95);
			animation-timing-function: ease-in-out;
		}
		100% {
			transform: scale(1);
		}
	}
</style>
