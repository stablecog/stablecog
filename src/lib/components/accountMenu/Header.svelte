<script lang="ts">
	import IconBack from '$components/icons/IconBack.svelte';

	export let onBackButtonClicked: (() => void) | undefined = undefined;
	export let title: string;
	export let content: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let href: string | undefined = undefined;
	export let closeMenu: () => void;
</script>

<div class="z-10 flex w-full border-b-2 border-c-bg-tertiary">
	{#if href}
		<a
			{href}
			on:click={closeMenu}
			data-sveltekit-preload-data="hover"
			class="group relative z-20 flex h-full w-full items-center self-stretch bg-c-bg-secondary text-left transition-all"
		>
			<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center p-1">
				<div class="h-full w-full overflow-hidden rounded-lg">
					<div
						class="aspect-square h-full w-full origin-left -translate-x-full transform rounded-lg bg-c-primary/10 opacity-0
					transition not-touch:group-hover:translate-x-0 not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
			{#if content}
				<svelte:component this={content} />
			{:else}
				<div
					class="transform transition-all {onBackButtonClicked !== undefined
						? '-ml-1 mr-2 h-6 w-6 opacity-100'
						: 'mx-0 h-0 w-0 p-0 opacity-0'} {onBackButtonClicked !== undefined
						? 'not-touch:group-hover:-translate-x-1'
						: ''}"
				>
					<IconBack class="h-full w-full transition not-touch:group-hover:text-c-primary" />
				</div>
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis py-4 text-xl font-bold transition {onBackButtonClicked !==
					undefined
						? 'not-touch:group-hover:text-c-primary'
						: ''}"
				>
					{title}
				</p>
			{/if}
		</a>
	{:else}
		<button
			class="group relative z-20 flex h-full w-full items-center self-stretch bg-c-bg-secondary px-6 text-left transition-all"
			aria-label="Back"
			on:click={() => (onBackButtonClicked ? onBackButtonClicked() : null)}
			disabled={!onBackButtonClicked}
		>
			<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center p-1">
				<div class="h-full w-full overflow-hidden rounded-lg">
					<div
						class="aspect-square h-full w-full origin-left -translate-x-full transform rounded-lg bg-c-primary/10 opacity-0
						transition {onBackButtonClicked !== undefined
							? 'not-touch:group-enabled:group-hover:translate-x-0 not-touch:group-enabled:group-hover:opacity-100'
							: ''}"
					/>
				</div>
			</div>
			{#if content}
				<svelte:component this={content} />
			{:else}
				<div
					class="transform transition-all {onBackButtonClicked !== undefined
						? '-ml-1 mr-2 h-6 w-6 opacity-100'
						: 'mx-0 h-0 w-0 p-0 opacity-0'} {onBackButtonClicked !== undefined
						? 'not-touch:group-hover:-translate-x-1'
						: ''}"
				>
					<IconBack class="h-full w-full transition not-touch:group-hover:text-c-primary" />
				</div>
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis py-4 text-xl font-bold transition {onBackButtonClicked !==
					undefined
						? 'not-touch:group-hover:text-c-primary'
						: ''}"
				>
					{title}
				</p>
			{/if}
		</button>
	{/if}
</div>
