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
	export let type: 'on-primary' | 'primary' | 'secondary' = 'primary';
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
			class="touch-manipulation group/iconbutton rounded-full {classes}"
			aria-label={name}
		>
			<div class="rounded-full relative z-0 overflow-hidden {noPadding ? '' : 'p-2'}">
				{#if !(withSpinner && loading)}
					<div
						class="w-full h-full ease-out transition transform {type === 'on-primary'
							? 'bg-c-on-primary/15'
							: type === 'secondary'
							? 'bg-c-secondary/25'
							: 'bg-c-primary/25'} 
							absolute left-0 top-0 rounded-full {hoverFrom === 'left' ? '-translate-x-full' : 'translate-x-full'}
							not-touch:group-hover/iconbutton:translate-x-0"
					/>
				{/if}
				<div class="relative">
					<div class="transition {withSpinner && loading ? 'opacity-0 scale-50' : ''}">
						<slot />
					</div>
					{#if withSpinner}
						<div
							class="w-full h-full absolute transform transition pointer-events-none {loading
								? 'opacity-100 scale-100'
								: ''}"
						>
							<IconAnimatedSpinner class="w-full h-full" {loading} />
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
			class="touch-manipulation group/iconbutton rounded-full {classes}"
			aria-label={name}
		>
			<div class="rounded-full relative z-0 overflow-hidden {noPadding ? '' : 'p-2'}">
				{#if !(withSpinner && loading)}
					<div
						class="w-full h-full ease-out transition transform {type === 'on-primary'
							? 'bg-c-on-primary/15'
							: type === 'secondary'
							? 'bg-c-secondary/25'
							: 'bg-c-primary/25'} 
							absolute left-0 top-0 rounded-full {hoverFrom === 'left' ? '-translate-x-full' : 'translate-x-full'}
							not-touch:group-hover/iconbutton:translate-x-0"
					/>
				{/if}
				<div class="relative">
					<div class="transition {withSpinner && loading ? 'opacity-0 scale-50' : ''}">
						<slot />
					</div>
					{#if withSpinner}
						<div
							class="w-full h-full absolute left-0 top-0 transform transition pointer-events-none {loading
								? 'opacity-100 scale-100'
								: 'opacity-0 scale-0'}"
						>
							<IconAnimatedSpinner class="w-full h-full" {loading} />
						</div>
					{/if}
				</div>
			</div>
		</button>
	{/if}
</WithTooltip>
