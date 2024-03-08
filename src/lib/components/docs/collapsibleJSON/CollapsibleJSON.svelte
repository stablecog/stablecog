<script lang="ts">
	import CopyButton from '$components/docs/CopyButton.svelte';
	import CollapsibleJsonInner from '$components/docs/collapsibleJSON/CollapsibleJSONInner.svelte';
	import type { TKeyObject } from '$components/docs/collapsibleJSON/types';
	export let json: any;
	export let title: string;

	export { classes as class };
	let classes = 'mt-5';

	const startsOpenCharacterThreshold = 500;

	const characterCount = JSON.stringify(json).length;

	let keyObject = createKeyObject({
		key: undefined,
		value: json,
		hasNextKey: false,
		startsOpen: true
	});

	function createKeyObject({
		key,
		value,
		isParentArray = false,
		isParentObject = false,
		hasNextKey = true,
		startsOpen = undefined
	}: {
		key: string | undefined;
		value: any;
		isParentArray?: boolean;
		isParentObject?: boolean;
		hasNextKey?: boolean;
		startsOpen?: boolean;
	}): TKeyObject {
		const isArray = Array.isArray(value);
		const isObject = typeof value === 'object';
		let children: TKeyObject[] | undefined = undefined;
		if (isArray) {
			children = value.map((item: any, index: number) =>
				createKeyObject({
					key: undefined,
					value: item,
					isParentArray: true,
					hasNextKey: index < value.length - 1
				})
			);
		} else if (isObject) {
			children = Object.keys(value).map((key: string, index: number) =>
				createKeyObject({
					key,
					value: value[key],
					hasNextKey: index < Object.keys(value).length - 1,
					isParentObject: true
				})
			);
		}
		return {
			key,
			value: value,
			children: children,
			isNumber: typeof value === 'number',
			isBoolean: typeof value === 'boolean',
			isString: typeof value === 'string',
			isObject,
			isArray,
			hasNextKey,
			isOpen: startsOpen !== undefined ? startsOpen : characterCount < startsOpenCharacterThreshold,
			isParentArray,
			isParentObject
		};
	}

	let isCopied = false;
	let isCopiedTimeout: NodeJS.Timeout;
	let isCopiedTimeoutDuration = 1500;

	function onCopied() {
		isCopied = true;
		clearTimeout(isCopiedTimeout);
		isCopiedTimeout = setTimeout(() => {
			isCopied = false;
		}, isCopiedTimeoutDuration);
	}
</script>

<div class="flex w-full flex-col font-mono {classes}">
	<div
		class="relative z-10 flex w-full items-center justify-start rounded-t-[0.6rem] bg-c-bg ring-2 ring-c-bg-tertiary"
	>
		<div class="min-w-0 flex-1 flex-row overflow-auto px-3 py-3">
			<p class="whitespace-nowrap">
				{title}
			</p>
		</div>
		<CopyButton {onCopied} bind:isCopied textToCopy={JSON.stringify(json, null, 2)} />
	</div>
	<div
		class="flex w-full justify-start rounded-b-[0.6rem] bg-c-bg-secondary ring-2 ring-c-bg-tertiary"
	>
		<div class="flex flex-col items-start overflow-auto py-1.5 pl-1 pr-4 md:py-3 md:pl-2 md:pr-5">
			<CollapsibleJsonInner {keyObject} />
		</div>
	</div>
</div>
