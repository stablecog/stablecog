<script lang="ts">
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { copy } from 'svelte-copy';

	export let prompt: string;
	export let width: number;
	export let height: number;
	export let seed: number;
	export let src: string;
	export let guidanceScale: number;
	export let inferenceSteps: number;

	let seedCopied = false;
	let seedCopiedTimeout: NodeJS.Timeout;
	let seedButton: HTMLButtonElement;

	const onSeedCopy = () => {
		seedCopied = true;
		seedButton.blur();
		clearTimeout(seedCopiedTimeout);
		seedCopiedTimeout = setTimeout(() => {
			seedCopied = false;
		}, 2000);
	};
</script>

<img class="w-full h-full absolute left-0 top-0" {src} alt={prompt} {width} {height} />
<div
	class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end gap-5 overflow-auto"
>
	<div class="w-full flex justify-between">
		{#if $advancedMode}
			<div
				class="flex-1 min-w-0 overflow-hidden flex flex-col items-start justify-start gap-1 transition transform 
				-translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 p-2"
			>
				<button
					bind:this={seedButton}
					use:copy={seed.toString()}
					on:svelte-copy={onSeedCopy}
					class="max-w-full flex items-center text-c-on-bg text-xs gap-1.5 rounded-lg bg-c-bg 
					px-2 py-2 overflow-hidden relative group-2"
				>
					<IconSeed class="w-3.5 h-3.5 relative" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis relative">
						{seed}
					</p>
					<div
						class="w-full h-full absolute left-0 top-0 pointer-events-none flex items-center 
						justify-center transition rounded-lg {seedCopied
							? 'bg-c-success'
							: 'bg-c-bg'} opacity-0 -translate-x-[20%] group-2-hover:translate-x-0 group-2-hover:opacity-100"
					>
						<div class="w-5 h-5 relative">
							<IconCopy
								class="{seedCopied
									? 'scale-0 opacity-0'
									: 'scale-100 opacity-100'} transform w-full h-full absolute left-0 top-0 transition text-c-on-bg"
							/>
							<IconTick
								class="{!seedCopied
									? 'scale-0 opacity-0'
									: 'scale-125 opacity-100'} transform w-full h-full absolute left-0 top-0 transition text-c-on-primary"
							/>
						</div>
					</div>
				</button>
				<div class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg px-2 py-2">
					<IconScale class="w-3.5 h-3.5" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
						{guidanceScale}
					</p>
				</div>
				<div class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg px-2 py-2">
					<IconSteps class="w-3.5 h-3.5" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
						{inferenceSteps}
					</p>
				</div>
			</div>
		{:else}
			<div class="flex-1" />
		{/if}
		<div
			class="flex flex-col items-end justify-start transition transform 
			translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0"
		>
			<DownloadGenerationButton
				class="p-2"
				url={src}
				{prompt}
				{seed}
				{guidanceScale}
				{inferenceSteps}
			/>
			<CopyButton class="p-2 -mt-2" stringToCopy={prompt} />
		</div>
	</div>
	<div
		class="w-full max-h-[35%] min-h-[3.2rem] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0"
	>
		<div class="w-full max-h-full overflow-auto list-fade">
			<p class="w-full font-medium leading-normal transition text-c-on-bg px-5 py-4 transform">
				{prompt}
			</p>
		</div>
	</div>
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.25rem);
	}
</style>
