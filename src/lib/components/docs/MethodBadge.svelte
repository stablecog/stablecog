<script lang="ts">
	export let method: string;
	export { classes as class };
	let classes = '';

	function getColorClasses(method: string) {
		switch (method) {
			case 'GET':
				return 'bg-c-success/15 text-c-success';
			case 'POST':
				return 'bg-c-primary/15 text-c-primary';
			default:
				return 'bg-c-primary/15 text-c-primary';
		}
	}
</script>

<p
	class="{getColorClasses(
		method
	)} font-mono text-sm rounded-md px-2.5 py-1.5 font-semibold {classes}"
>
	{method}
</p>
