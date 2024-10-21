<script lang="ts">
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import type { THrefTarget } from '$ts/types/main';

	export let onClick: (() => void) | undefined = undefined;
	export let href: string | undefined = undefined;
	export let name: string;
	export let prefetch: boolean = true;
	export let target: THrefTarget = undefined;
	export let noPadding = false;
	export let disabled = false;
	export let type: 'on-primary' | 'bg-tertiary' | 'primary' | 'secondary' = 'primary';
	export let withSpinner = false;
	export let loading = false;
	export let hoverFrom: 'left' | 'right' = 'left';
	export { classes as class };
	export let hasTooltip = false;
	let classes = '';
</script>

<WithTooltip
	title={name}
	let:trigger
	let:triggerStoreValue
	noArrow
	delay={150}
	size="sm"
	gutter={-4}
	isActive={hasTooltip}
	animationDuration={150}
>
	{#if href}
		<a
			use:trigger
			{...triggerStoreValue}
			{href}
			{target}
			data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
				? 'hover'
				: 'off'}
			class="group/iconbutton touch-manipulation rounded-full {classes}"
			aria-label={name}
		>
			<div class="relative z-0 overflow-hidden rounded-full {noPadding ? '' : 'p-2'}">
				{#if !(withSpinner && loading)}
					<div
						class="h-full w-full transform transition ease-out {type === 'on-primary'
							? 'bg-c-on-primary/15'
							: type === 'bg-tertiary'
								? 'bg-c-bg-tertiary'
								: type === 'secondary'
									? 'bg-c-secondary/25'
									: 'bg-c-primary/25'} 
							absolute left-0 top-0 rounded-full {hoverFrom === 'left' ? '-translate-x-full' : 'translate-x-full'}
							not-touch:group-hover/iconbutton:translate-x-0"
					/>
				{/if}
				<div class="relative">
					<div class="transition {withSpinner && loading ? 'scale-50 opacity-0' : ''}">
						<slot />
					</div>
					{#if withSpinner}
						<div
							class="pointer-events-none absolute h-full w-full transform transition {loading
								? 'scale-100 opacity-100'
								: ''}"
						>
							<IconAnimatedSpinner class="h-full w-full" {loading} />
						</div>
					{/if}
				</div>
			</div>
		</a>
	{:else}
		<button
			use:trigger
			{...triggerStoreValue}
			type="button"
			disabled={disabled || loading}
			on:click={onClick}
			class="group/iconbutton touch-manipulation rounded-full {classes}"
			aria-label={name}
		>
			<div class="relative z-0 overflow-hidden rounded-full {noPadding ? '' : 'p-2'}">
				{#if !(withSpinner && loading)}
					<div
						class="h-full w-full transform transition ease-out {type === 'on-primary'
							? 'bg-c-on-primary/15'
							: type === 'bg-tertiary'
								? 'bg-c-bg-tertiary'
								: type === 'secondary'
									? 'bg-c-secondary/25'
									: 'bg-c-primary/25'} 
							absolute left-0 top-0 rounded-full {hoverFrom === 'left' ? '-translate-x-full' : 'translate-x-full'}
							not-touch:group-hover/iconbutton:translate-x-0"
					/>
				{/if}
				<div class="relative">
					<div class="transition {withSpinner && loading ? 'scale-50 opacity-0' : ''}">
						<slot />
					</div>
					{#if withSpinner}
						<div
							class="pointer-events-none absolute left-0 top-0 h-full w-full transform transition {loading
								? 'scale-100 opacity-100'
								: 'scale-0 opacity-0'}"
						>
							<IconAnimatedSpinner class="h-full w-full" {loading} />
						</div>
					{/if}
				</div>
			</div>
		</button>
	{/if}
</WithTooltip>
