<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconAnimatedUploading from '$components/icons/IconAnimatedUploading.svelte';
	import IconHourglassAnimated from '$components/icons/IconHourglassAnimated.svelte';
	import type { THrefTarget } from '$ts/types/main';
	import { tick } from 'svelte';
	import { copy } from 'svelte-copy';
	export let disabled = false;
	export let loading = false;
	export let waiting = false;
	export let uploading = false;
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let prefetch: boolean = true;
	export let size: 'md' | 'sm' | 'xs' = 'md';
	export let withSpinner = false;
	export let noPadding = false;
	export let noBorder = false;
	export let target: THrefTarget = undefined;
	export { classes as class };
	export let type: 'primary' | 'success' | 'danger' | 'no-bg-on-bg' | 'bg-secondary' = 'primary';
	export let fadeOnDisabled = false;
	export let animateOnClick = false;
	export let buttonType: 'submit' | 'button' | 'reset' | null | undefined = undefined;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let iconAlignment: 'left' | 'right' = 'left';
	export let label: string | undefined = undefined;
	export let noRounding = false;
	export let blurOnClick = false;
	export let trigger: any | undefined = undefined;
	export let stringToCopy: string | undefined = undefined;
	export let noHoverEffect = false;
	let classes = '';

	let element: HTMLElement;

	function _onClick() {
		if (animateOnClick) onClicked();
		onClick?.();
		if (blurOnClick) {
			element.blur();
		}
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

	$: loadingOrWaitingOrUploading = loading || waiting || uploading;
</script>

{#if href}
	<a
		bind:clientWidth={width}
		bind:clientHeight={height}
		bind:this={element}
		on:click={_onClick}
		aria-label={label}
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
			? 'text-sm'
			: size === 'sm'
			? 'text-sm'
			: 'text-base'} {noRounding
			? ''
			: size === 'xs'
			? 'rounded-lg2'
			: size === 'sm'
			? 'rounded-lg2'
			: 'rounded-xl'} {type === 'no-bg-on-bg'
			? ''
			: 'shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]'} {type === 'no-bg-on-bg'
			? 'text-c-on-bg/60'
			: type === 'bg-secondary'
			? 'text-c-on-bg'
			: 'text-c-on-primary'} {loading
			? type === 'success'
				? 'bg-c-success-secondary'
				: type === 'danger'
				? 'bg-c-danger-secondary'
				: type === 'bg-secondary'
				? 'bg-c-bg-tertiary'
				: 'bg-c-secondary'
			: type === 'success'
			? 'bg-c-success'
			: type === 'danger'
			? 'bg-c-danger'
			: type === 'bg-secondary'
			? 'bg-c-bg-secondary'
			: type === 'no-bg-on-bg'
			? 'bg-c-primary/0'
			: 'bg-c-primary'} {type === 'bg-secondary'
			? 'border-2 border-c-bg-tertiary'
			: ''} {classes} {shouldAnimate ? 'scale-animation' : ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center
				hidden not-touch:flex"
			>
				<div
					class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
					{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
						? 'bg-c-danger-secondary'
						: type === 'bg-secondary'
						? 'bg-c-bg-tertiary'
						: type === 'no-bg-on-bg'
						? 'bg-c-on-bg/10'
						: 'bg-c-secondary'} not-touch:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="flex items-center justify-center relative gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="transform relative transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="w-full h-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="w-full h-full" loading={waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
		</div>
	</a>
{:else if trigger}
	<button
		{...$trigger}
		use:trigger
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:click={_onClick}
		bind:this={element}
		aria-label={label}
		disabled={disabled || loadingOrWaitingOrUploading}
		type={buttonType}
		class="touch-manipulation relative flex items-center justify-center text-center font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-4 md:px-5 py-4'
			: 'px-6 md:px-8 py-4.5'} {size === 'xs'
			? 'text-sm'
			: size === 'sm'
			? 'text-sm'
			: 'text-base'} {noRounding
			? ''
			: size === 'xs'
			? 'rounded-lg2'
			: size === 'sm'
			? 'rounded-lg2'
			: 'rounded-xl'} {type === 'no-bg-on-bg'
			? ''
			: 'shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]'} {type === 'no-bg-on-bg'
			? 'text-c-on-bg/60'
			: type === 'bg-secondary'
			? 'text-c-on-bg'
			: 'text-c-on-primary'} {loading
			? type === 'success'
				? 'bg-c-success-secondary'
				: type === 'danger'
				? 'bg-c-danger-secondary'
				: type === 'bg-secondary'
				? 'bg-c-bg-tertiary'
				: 'bg-c-secondary'
			: type === 'success'
			? 'bg-c-success'
			: type === 'danger'
			? 'bg-c-danger'
			: type === 'bg-secondary'
			? 'bg-c-bg-secondary'
			: type === 'no-bg-on-bg'
			? 'bg-c-primary/0'
			: 'bg-c-primary'} {type === 'bg-secondary'
			? 'border-2 border-c-bg-tertiary'
			: ''} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center
				hidden not-touch:flex"
			>
				<div
					class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
				{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
						? 'bg-c-danger-secondary'
						: type === 'bg-secondary'
						? 'bg-c-bg-tertiary'
						: type === 'no-bg-on-bg'
						? 'bg-c-on-bg/10'
						: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="flex items-center justify-center relative gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="transform relative transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="w-full h-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="w-full h-full" loading={waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {!loading &&
						uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
		</div>
	</button>
{:else if stringToCopy}
	<button
		use:copy={stringToCopy}
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:click={_onClick}
		bind:this={element}
		aria-label={label}
		disabled={disabled || loadingOrWaitingOrUploading}
		type={buttonType}
		class="touch-manipulation relative flex items-center justify-center text-center font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-4 md:px-5 py-4'
			: 'px-6 md:px-8 py-4.5'} {size === 'xs'
			? 'text-sm'
			: size === 'sm'
			? 'text-sm'
			: 'text-base'} {noRounding
			? ''
			: size === 'xs'
			? 'rounded-lg2'
			: size === 'sm'
			? 'rounded-lg2'
			: 'rounded-xl'} {type === 'no-bg-on-bg'
			? ''
			: 'shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]'} {type === 'no-bg-on-bg'
			? 'text-c-on-bg/60'
			: type === 'bg-secondary'
			? 'text-c-on-bg'
			: 'text-c-on-primary'} {loading
			? type === 'success'
				? 'bg-c-success-secondary'
				: type === 'danger'
				? 'bg-c-danger-secondary'
				: type === 'bg-secondary'
				? 'bg-c-bg-secondary'
				: 'bg-c-secondary'
			: type === 'success'
			? 'bg-c-success'
			: type === 'danger'
			? 'bg-c-danger'
			: type === 'bg-secondary'
			? 'bg-c-bg-secondary'
			: type === 'no-bg-on-bg'
			? 'bg-c-primary/0'
			: 'bg-c-primary'} {type === 'bg-secondary' && !noBorder
			? 'border-2 border-c-bg-tertiary'
			: ''} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center
				hidden not-touch:flex"
			>
				<div
					class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
				{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
						? 'bg-c-danger-secondary'
						: type === 'bg-secondary'
						? 'bg-c-bg-tertiary'
						: type === 'no-bg-on-bg'
						? 'bg-c-on-bg/10'
						: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="flex items-center justify-center relative gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="transform relative transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="w-full h-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="w-full h-full" loading={waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {!loading &&
						uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
		</div>
	</button>
{:else}
	<button
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:click={_onClick}
		bind:this={element}
		aria-label={label}
		disabled={disabled || loadingOrWaitingOrUploading}
		type={buttonType}
		class="touch-manipulation relative flex items-center justify-center text-center font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4.5 py-3'
			: size === 'sm'
			? 'px-4 md:px-5 py-4'
			: 'px-6 md:px-8 py-4.5'} {size === 'xs'
			? 'text-sm'
			: size === 'sm'
			? 'text-sm'
			: 'text-base'} {noRounding
			? ''
			: size === 'xs'
			? 'rounded-lg2'
			: size === 'sm'
			? 'rounded-lg2'
			: 'rounded-xl'} {type === 'no-bg-on-bg'
			? ''
			: 'shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]'} {type === 'no-bg-on-bg'
			? 'text-c-on-bg/60'
			: type === 'bg-secondary'
			? 'text-c-on-bg'
			: 'text-c-on-primary'} {loading
			? type === 'success'
				? 'bg-c-success-secondary'
				: type === 'danger'
				? 'bg-c-danger-secondary'
				: type === 'bg-secondary'
				? 'bg-c-bg-tertiary'
				: 'bg-c-secondary'
			: type === 'success'
			? 'bg-c-success'
			: type === 'danger'
			? 'bg-c-danger'
			: type === 'bg-secondary'
			? 'bg-c-bg-secondary'
			: type === 'no-bg-on-bg'
			? 'bg-c-primary/0'
			: 'bg-c-primary'} {type === 'bg-secondary' && !noBorder
			? 'border-2 border-c-bg-tertiary'
			: ''} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center
				hidden not-touch:flex"
			>
				<div
					class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
				{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
						? 'bg-c-danger-secondary'
						: type === 'bg-secondary'
						? 'bg-c-bg-tertiary'
						: type === 'no-bg-on-bg'
						? 'bg-c-on-bg/10'
						: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="flex items-center justify-center relative gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="transform relative transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="w-full h-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="w-full h-full" loading={waiting} />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {!loading &&
						uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="w-full h-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} class="w-6 h-6 -m-1 flex-shrink-0" />
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
