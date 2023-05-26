<script lang="ts">
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
</script>

<div class="w-full flex flex-col font-mono {classes}">
	<div
		class="w-full flex justify-start items-center bg-c-bg rounded-t-[0.6rem] ring-2 ring-c-bg-tertiary"
	>
		<div class="flex flex-row overflow-auto px-3 pt-3 pb-4">
			<p class="whitespace-nowrap">
				{title}
			</p>
		</div>
	</div>
	<div
		class="w-full flex justify-start bg-c-bg-secondary rounded-b-[0.6rem] ring-2 ring-c-bg-tertiary"
	>
		<div class="flex flex-col items-start overflow-auto pl-2 pr-5 py-3">
			<CollapsibleJsonInner {keyObject} />
		</div>
	</div>
</div>
