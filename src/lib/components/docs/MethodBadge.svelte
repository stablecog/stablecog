<script lang="ts">
	export let method: string;
	export let size: 'sm' | 'md' = 'md';
	export { classes as class };
	let classes = '';

	function getColorClasses(method: string) {
		switch (method) {
			case 'GET':
				return 'text-c-success ring-c-success/50';
			case 'POST':
				return 'text-c-secondary ring-c-secondary/50';
			case 'DELETE':
				return 'text-c-danger ring-c-danger/50';
			default:
				return 'text-c-secondary ring-c-secondary/50';
		}
	}
</script>

<div class="bg-c-bg {size === 'sm' ? 'rounded' : 'rounded-md'} {classes}">
	<p
		class="block {getColorClasses(method)} font-mono {size === 'sm'
			? 'text-xs rounded px-1.5 py-0.75'
			: 'text-sm rounded-md px-2.5 py-1.5'} ring-1.5 font-semibold"
	>
		{method}
	</p>
</div>
