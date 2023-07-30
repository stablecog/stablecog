<script lang="ts">
	import AvatarBeam from './AvatarBeam.svelte';
	export let text: string;
	export { classes as class };
	let classes = 'w-6 h-6';
</script>

<AvatarBeam
	class={classes}
	name={text}
	colors={['#B58CFF', '#F5A46A', '#5DD1CA', '#8BD174', '#EBE78D', '#89A3FF', '#FF99DC']}
/>
