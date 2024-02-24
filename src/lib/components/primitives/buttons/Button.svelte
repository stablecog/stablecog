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
	export let type:
		| 'primary'
		| 'primary-alt'
		| 'success'
		| 'danger'
		| 'no-bg-on-bg'
		| 'on-bg'
		| 'bg-secondary' = 'primary';
	export let fadeOnDisabled = false;
	export let animateOnClick = false;
	export let buttonType: 'submit' | 'button' | 'reset' | null | undefined = undefined;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let iconProps: any | undefined = {};
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
		class="group relative z-0 flex touch-manipulation items-center justify-center gap-2
			overflow-hidden text-center font-bold {noPadding
			? 'p-0'
			: size === 'xs'
				? 'px-4.5 py-3'
				: size === 'sm'
					? 'px-4 py-3.5 md:px-5'
					: 'px-6 py-4.5 md:px-8'} {size === 'xs'
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
				: type === 'primary-alt'
					? 'text-c-primary'
					: type === 'on-bg'
						? 'text-c-bg'
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
						: type === 'primary-alt'
							? 'bg-c-bg-tertiary'
							: type === 'on-bg'
								? 'bg-c-on-bg'
								: type === 'no-bg-on-bg'
									? 'bg-c-primary/0'
									: 'bg-c-primary'} {type === 'bg-secondary'
			? 'ring-2 ring-c-bg-tertiary'
			: ''} {classes} {shouldAnimate ? 'scale-animation' : ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center
				justify-center not-touch:flex"
			>
				<div
					class="absolute left-0 h-full w-full -translate-x-full transform rounded-full transition
					{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
							? 'bg-c-danger-secondary'
							: type === 'bg-secondary'
								? 'bg-c-bg-tertiary'
								: type === 'no-bg-on-bg'
									? 'bg-c-on-bg/10'
									: type === 'primary-alt'
										? 'bg-c-primary/15'
										: 'bg-c-secondary'} not-touch:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="relative flex items-center justify-center gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="relative transform transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="h-full w-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="h-full w-full" loading={waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="h-full w-full" loading={uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
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
		class="group relative z-0 flex touch-manipulation items-center justify-center gap-2
			overflow-hidden text-center font-bold {noPadding
			? 'p-0'
			: size === 'xs'
				? 'px-4.5 py-3'
				: size === 'sm'
					? 'px-4 py-4 md:px-5'
					: 'px-6 py-4.5 md:px-8'} {size === 'xs'
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
				: type === 'primary-alt'
					? 'text-c-primary'
					: type === 'on-bg'
						? 'text-c-bg'
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
						: type === 'primary-alt'
							? 'bg-c-bg-tertiary'
							: type === 'on-bg'
								? 'bg-c-on-bg'
								: type === 'no-bg-on-bg'
									? 'bg-c-primary/0'
									: 'bg-c-primary'} {type === 'bg-secondary'
			? 'ring-2 ring-c-bg-tertiary'
			: ''} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center
				justify-center not-touch:flex"
			>
				<div
					class="absolute left-0 h-full w-full -translate-x-full transform rounded-full transition
				{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
							? 'bg-c-danger-secondary'
							: type === 'bg-secondary'
								? 'bg-c-bg-tertiary'
								: type === 'no-bg-on-bg'
									? 'bg-c-on-bg/10'
									: type === 'primary-alt'
										? 'bg-c-primary/15'
										: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="relative flex items-center justify-center gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="relative transform transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="h-full w-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="h-full w-full" loading={waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {!loading &&
						uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="h-full w-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
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
		class="group relative z-0 flex touch-manipulation items-center justify-center gap-2
			overflow-hidden text-center font-bold {noPadding
			? 'p-0'
			: size === 'xs'
				? 'px-4.5 py-3'
				: size === 'sm'
					? 'px-4 py-4 md:px-5'
					: 'px-6 py-4.5 md:px-8'} {size === 'xs'
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
				: type === 'primary-alt'
					? 'text-c-primary'
					: type === 'on-bg'
						? 'text-c-bg'
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
						: type === 'primary-alt'
							? 'bg-c-bg-tertiary'
							: type === 'on-bg'
								? 'bg-c-on-bg'
								: type === 'no-bg-on-bg'
									? 'bg-c-primary/0'
									: 'bg-c-primary'} {type === 'bg-secondary' && !noBorder
			? 'ring-2 ring-c-bg-tertiary'
			: ''} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center
				justify-center not-touch:flex"
			>
				<div
					class="absolute left-0 h-full w-full -translate-x-full transform rounded-full transition
				{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
							? 'bg-c-danger-secondary'
							: type === 'bg-secondary'
								? 'bg-c-bg-tertiary'
								: type === 'no-bg-on-bg'
									? 'bg-c-on-bg/10'
									: type === 'primary-alt'
										? 'bg-c-primary/15'
										: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="relative flex items-center justify-center gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="relative transform transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="h-full w-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="h-full w-full" loading={waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {!loading &&
						uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="h-full w-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
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
		class="group relative z-0 flex touch-manipulation items-center justify-center gap-2
			overflow-hidden text-center font-bold {noPadding
			? 'p-0'
			: size === 'xs'
				? 'px-4.5 py-3'
				: size === 'sm'
					? 'px-4 py-4 md:px-5'
					: 'px-6 py-4.5 md:px-8'} {size === 'xs'
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
				: type === 'primary-alt'
					? 'text-c-primary'
					: type === 'on-bg'
						? 'text-c-bg'
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
						: type === 'primary-alt'
							? 'bg-c-bg-tertiary'
							: type === 'on-bg'
								? 'bg-c-on-bg'
								: type === 'no-bg-on-bg'
									? 'bg-c-primary/0'
									: 'bg-c-primary'} {type === 'bg-secondary' && !noBorder
			? 'ring-2 ring-c-bg-tertiary'
			: ''} {fadeOnDisabled && disabled ? 'opacity-75' : ''} {classes} {shouldAnimate
			? 'scale-animation'
			: ''}"
	>
		{#if !noHoverEffect}
			<div
				style="width: {buttonSize}px; height: {buttonSize}px;"
				class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center
				justify-center not-touch:flex"
			>
				<div
					class="absolute left-0 h-full w-full -translate-x-full transform rounded-full transition
				{type === 'success'
						? 'bg-c-success-secondary'
						: type === 'danger'
							? 'bg-c-danger-secondary'
							: type === 'bg-secondary'
								? 'bg-c-bg-tertiary'
								: type === 'no-bg-on-bg'
									? 'bg-c-on-bg/10'
									: type === 'primary-alt'
										? 'bg-c-primary/15'
										: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
				/>
			</div>
		{/if}
		<div class="relative flex items-center justify-center gap-3">
			{#if icon && iconAlignment === 'left'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
			{/if}
			{#if withSpinner}
				<div
					class="relative transform transition {loadingOrWaitingOrUploading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<slot />
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading && !waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedSpinner class="h-full w-full" loading={loading && !waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {waiting
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconHourglassAnimated class="h-full w-full" loading={waiting} />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {!loading &&
						uploading
							? 'scale-100 opacity-100'
							: 'scale-0 opacity-0'}"
					>
						<IconAnimatedUploading class="h-full w-full" loading={!loading && uploading} />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
			{#if icon && iconAlignment === 'right'}
				<svelte:component this={icon} {...iconProps} class="-m-1 h-6 w-6 flex-shrink-0" />
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
