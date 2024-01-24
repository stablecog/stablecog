<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import type { TKeyObject } from '$components/docs/collapsibleJSON/types';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let keyObject: TKeyObject;
	export let level = 0;

	let isInitialClick = true;

	function onButtonClicked() {
		if (keyObject.isOpen) {
			keyObject.isOpen = false;
		} else {
			keyObject.isOpen = true;
			if (isInitialClick) {
				openAll(keyObject, level);
			}
		}
		isInitialClick = false;
	}

	function openAll(obj: TKeyObject, level: number) {
		obj.isOpen = true;
		if (obj.children && level < 2) {
			obj.children.forEach((child) => {
				child.isOpen = true;
				if (child.children) {
					openAll(child, level + 1);
				}
			});
		}
	}
</script>

<div class="flex flex-col leading-loose">
	<div class="flex flex-col">
		<div class="flex items-center">
			<button
				aria-label="Toggle Code Block"
				disabled={keyObject.children === undefined}
				class="h-8 w-8 mr-1 group relative flex items-center justify-center {keyObject.children ===
				undefined
					? 'opacity-0'
					: ''}"
				on:click={onButtonClicked}
			>
				<ButtonHoverEffect
					size="sm"
					noPadding
					color="on-bg"
					hoverFrom={keyObject.isOpen ? 'bottom' : 'top'}
				/>
				<IconChevronDown
					class="w-4.5 h-4.5 transition text-c-on-bg/50 not-touch:group-hover:text-c-on-bg transform {keyObject.isOpen
						? 'rotate-0'
						: '-rotate-90'}"
				/>
			</button>
			<p style="padding-left: {level * 2}ch" class="whitespace-nowrap">
				{#if !keyObject.isParentArray && keyObject.key !== undefined}
					<span class="text-c-tertiary">"{keyObject.key}"</span>:
				{/if}{keyObject.isArray
					? '['
					: keyObject.isObject
					? '{'
					: ''}{#if keyObject.children !== undefined && !keyObject.isOpen}<span
						class="text-c-on-bg/50">···</span
					>{keyObject.children !== undefined && !keyObject.isOpen
						? keyObject.isArray
							? ']'
							: keyObject.isObject
							? '}'
							: ''
						: ''}{keyObject.children !== undefined &&
					!keyObject.isOpen &&
					keyObject.hasNextKey &&
					(keyObject.isArray || keyObject.isObject)
						? ','
						: ''}
				{/if}{#if keyObject.children === undefined}<span
						class={keyObject.isNumber || keyObject.isBoolean
							? 'text-c-primary'
							: keyObject.isString
							? 'text-c-success'
							: 'text-c-on-bg'}
						>{#if keyObject.children === undefined}
							{keyObject.isString ? '"' : ''}{keyObject.value}{keyObject.isString
								? '"'
								: ''}{#if keyObject.hasNextKey}<span class="text-c-on-bg">,</span>
							{/if}
						{/if}</span
					>
				{/if}
			</p>
		</div>
		{#if keyObject.children && keyObject.isOpen}
			{#each keyObject.children as child}
				<svelte:self keyObject={child} level={level + 1} isParentOpen={keyObject.isOpen} />
			{/each}
		{/if}
		{#if keyObject.isOpen || keyObject.children !== undefined}
			<div style="padding-left: {level * 2}ch">
				<p class="ml-9">
					{keyObject.isOpen
						? keyObject.isArray
							? ']'
							: keyObject.isObject
							? '}'
							: ''
						: ''}{keyObject.children !== undefined && keyObject.hasNextKey && keyObject.isOpen
						? ','
						: ''}
				</p>
			</div>
		{/if}
	</div>
</div>
