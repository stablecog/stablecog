<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { autoresize } from '$ts/actions/textarea/autoresize';
	import { expandCollapse } from '$ts/animation/transitions';
	import { maxPromptLength } from '$ts/constants/main';
	import { promptInputValue } from '$ts/stores/generationSettings';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TStatus } from '$ts/types/main';

	export let estimatedDuration = 5;
	export let loadingOrSubmitting = false;
	export let isCheckComplete = true;
	export let sinceSec = 0;
	export { classes as class };
	export let status: TStatus;
	export let onSubmit: () => void;
	let classes = '';

	$: placeholder = $LL.Home.PromptInput.Placeholder();
	let promptInputElement: HTMLTextAreaElement;

	$: showClearPromptInputButton =
		$promptInputValue !== undefined && $promptInputValue !== '' && !loadingOrSubmitting;

	const clearPrompt = () => {
		promptInputValue.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	};
</script>

<div class="w-full flex flex-col md:flex-row gap-3 items-center">
	<div class="w-full flex relative group">
		<textarea
			use:autoresize={{ maxRows: 3, placeholder }}
			bind:this={promptInputElement}
			bind:value={$promptInputValue}
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					onSubmit();
				}
			}}
			on:input={() => {
				if (
					$promptInputValue !== undefined &&
					$promptInputValue !== null &&
					$promptInputValue.length > maxPromptLength
				) {
					promptInputValue.set($promptInputValue.slice(0, maxPromptLength));
				}
			}}
			disabled={loadingOrSubmitting || !isCheckComplete}
			{placeholder}
			rows="1"
			type="text"
			style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
			class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
        scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
        focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
				? 'enabled:hover:ring-2'
				: ''} {classes} {loadingOrSubmitting
				? 'text-c-secondary/75'
				: 'text-c-on-bg'} {!$isTouchscreen && !loadingOrSubmitting
				? 'group-hover:ring-2'
				: ''} {loadingOrSubmitting ? 'overflow-hidden' : ''}"
		/>
		{#if loadingOrSubmitting}
			<div
				class="w-full h-full flex items-end absolute left-0 top-0 overflow-hidden z-0 rounded-xl pointer-events-none"
			>
				<div
					transition:expandCollapse|local={{ transformOrigin: 'bottom' }}
					class="w-full h-6 absolute left-0 bottom-0 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0"
				/>
			</div>
		{/if}
		<div
			class="w-full h-full rounded-xl overflow-hidden z-0 absolute left-0 top-0 pointer-events-none"
		>
			<div
				style="transition-duration: {status === 'loading'
					? estimatedDuration
					: status === 'success' || status === 'error'
					? 0.5
					: 0}s"
				class="w-full h-full ease-image-generation transition bg-c-secondary/10 
        absolute left-0 top-0 rounded-xl {status === 'loading'
					? 'translate-x-0'
					: status === 'success' || status === 'error'
					? 'translate-x-full'
					: '-translate-x-full'}"
			/>
		</div>
		<ClearButton show={showClearPromptInputButton} onClick={clearPrompt} />
	</div>
	<Button
		disabled={loadingOrSubmitting || !isCheckComplete}
		loading={loadingOrSubmitting}
		onClick={onSubmit}
		class="w-full md:w-auto md:min-w-[9.5rem]"
	>
		<p class={loadingOrSubmitting ? 'opacity-0' : 'opacity-100'}>{$LL.Home.GenerateButton()}</p>
		<p
			class="{loadingOrSubmitting
				? 'opacity-100'
				: 'opacity-0'} absolute left-0 top-0 w-full h-full flex items-center justify-center"
		>
			{sinceSec.toLocaleString($locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
		</p>
	</Button>
</div>
