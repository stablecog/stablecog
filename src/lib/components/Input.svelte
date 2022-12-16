<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let type: 'text' | 'email' | 'password' = 'text';
	export let value: string;
	export let placeholder: string;
	export let disabled = false;
	export { classes as class };
	let classes = '';
</script>

{#if type === 'email'}
	<input
		bind:value
		{disabled}
		type="email"
		{placeholder}
		class="flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative px-5 md:px-6 py-5 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
			? 'enabled:group-hover:ring-2'
			: ''} {classes}"
	/>
{:else if type === 'password'}
	<input
		bind:value
		{disabled}
		type="password"
		{placeholder}
		class="flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative px-5 md:px-6 py-5 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
			? 'enabled:group-hover:ring-2'
			: ''} {classes}"
	/>
{:else}
	<input
		bind:value
		{disabled}
		type="text"
		{placeholder}
		class="flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative px-5 md:px-6 py-5 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
			? 'enabled:group-hover:ring-2'
			: ''} {classes}"
	/>
{/if}
