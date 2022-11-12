<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import IconCancelCircle from '$components/icons/IconCancelCircle.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL from '$i18n/i18n-svelte';

	import { doesContainTarget } from '$ts/helpers/doesContainTarget';
	import { isValue } from '$ts/helpers/isValue';
	import { urlFromImageId } from '$ts/helpers/urlFromImageId';
	import { activeGenerationG } from '$ts/stores/activeGenerationG';
	import type { TGenerationGAdmin } from '$ts/types/main';
	import { quadOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';

	export let generation: TGenerationGAdmin;

	let rightButtonContainer: HTMLDivElement;
	let loaded = false;

	let imgElement: HTMLImageElement | undefined;
	$: [imgElement], onLoad();
	const onLoad = () => {
		if (imgElement && imgElement?.naturalWidth > 0) {
			loaded = true;
			setTimeout(() => {
				generation.isLoadedBefore = true;
			}, 500);
		}
	};

	type TStatus = 'idle' | 'loading' | 'success';

	let deleteStatus: TStatus = 'idle';
	let approveStatus: TStatus = 'idle';

	async function deleteGeneration() {
		if (deleteStatus === 'loading') return;
		deleteStatus = 'loading';
		try {
			const response = await fetch(
				`/admin/api/gallery?id=${generation.id}&image_id=${generation.image_id}`,
				{
					method: 'DELETE'
				}
			);
			if (response.ok) {
				deleteStatus = 'success';
				generation.status = 'deleted';
			} else {
				throw new Error('Failed to delete generation');
			}
		} catch (error) {
			console.log(error);
			deleteStatus = 'idle';
		}
	}

	async function approveGeneration() {
		if (approveStatus === 'loading') return;
		approveStatus = 'loading';
		try {
			const response = await fetch(`/admin/api/gallery?id=${generation.id}&hidden=false`, {
				method: 'PATCH'
			});
			if (response.ok) {
				approveStatus = 'success';
				generation.status = 'approved';
			} else {
				throw new Error('Failed to approve generation');
			}
		} catch (error) {
			console.log(error);
			approveStatus = 'idle';
		}
	}

	let insideId: string | undefined;
</script>

<svelte:window
	on:keypress={(e) => {
		if (
			deleteStatus === 'idle' &&
			approveStatus === 'idle' &&
			insideId !== undefined &&
			insideId === generation.id
		) {
			if (e.key === 'd') {
				deleteGeneration();
			} else if (e.key === 'a') {
				approveGeneration();
			}
		}
	}}
/>
<img
	loading="lazy"
	bind:this={imgElement}
	on:load={onLoad}
	class="w-full h-full absolute left-0 top-0 transition duration-500 {deleteStatus === 'success' ||
	approveStatus === 'success' ||
	generation.status === 'deleted' ||
	generation.status === 'approved'
		? 'opacity-25'
		: loaded || generation.isLoadedBefore
		? 'opacity-100'
		: 'opacity-0'}"
	src={urlFromImageId(generation.image_id)}
	alt={generation.prompt.text}
	width={generation.width}
	height={generation.height}
/>
<div
	on:click={(e) => {
		if (deleteStatus !== 'success' && approveStatus !== 'success' && generation.status === 'idle') {
			if (doesContainTarget(e.target, [rightButtonContainer])) {
				return;
			}
			activeGenerationG.set(generation);
		}
	}}
	on:mouseleave={() => (insideId = undefined)}
	on:mouseenter={() => (insideId = generation.id)}
	class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end overflow-hidden gap-4"
>
	<div class="w-full flex justify-between items-start gap-4">
		{#if deleteStatus !== 'success' && approveStatus !== 'success' && generation.status === 'idle'}
			<div
				transition:fly|local={{ duration: 200, easing: quadOut, opacity: 0, y: -60 }}
				bind:this={rightButtonContainer}
				class="flex-1 flex flex-row items-end justify-start transition transform p-1.5 gap-1.5
				-translate-y-[calc(100%+1rem)] group-focus-within:translate-y-0 group-hover:translate-y-0"
			>
				<Button
					class="flex-1"
					withSpinner={true}
					size="sm"
					type="success"
					padding={false}
					loading={approveStatus === 'loading'}
					onClick={approveGeneration}
				>
					<div class="flex-1 py-3 flex justify-center items-center gap-1.5">
						<IconTickOnly class="w-5 h-5" />
						<p>{$LL.Admin.ApproveButton()}</p>
					</div>
				</Button>
				<Button
					class="flex-1"
					withSpinner={true}
					size="sm"
					type="danger"
					padding={false}
					loading={deleteStatus === 'loading'}
					onClick={deleteGeneration}
				>
					<div class="flex-1 py-3 flex justify-center items-center gap-1.5">
						<IconTrashcan class="w-5 h-5" />
						<p>{$LL.Admin.DeleteButton()}</p>
					</div>
				</Button>
			</div>
		{/if}
	</div>
	<div
		class="w-full max-h-[max(4rem,min(35%,5.3rem))] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0"
	>
		<div
			class="w-full max-h-full overflow-hidden list-fade px-4 py-3 flex flex-col gap-2 cursor-default"
		>
			<p class="w-full font-medium leading-normal transition text-c-on-bg transform">
				{generation.prompt.text}
			</p>
			{#if isValue(generation.negative_prompt)}
				<div class="w-full flex items-start justify-start gap-1.5">
					<IconChatBubbleCancel class="text-c-danger h-4 w-4 mt-0.25" />
					<div class="flex-1 min-w-0">
						<p class="w-full text-c-danger">
							{generation.negative_prompt?.text}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div
		class="w-full h-full absolute left-0 top-0 flex items-center justify-center pointer-events-none"
	>
		{#if deleteStatus === 'success' || generation.status === 'deleted'}
			<div transition:scale|local={{ duration: 200, easing: quadOut, opacity: 0 }}>
				<IconCancelCircle class="w-16 h-16 text-c-danger" />
			</div>
		{:else if approveStatus === 'success' || generation.status === 'approved'}
			<div transition:scale|local={{ duration: 200, easing: quadOut, opacity: 0 }}>
				<IconTick class="w-16 h-16 text-c-success" />
			</div>
		{/if}
	</div>
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.1rem);
	}
</style>
