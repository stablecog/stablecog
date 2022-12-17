<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let type: 'text' | 'email' | 'password' = 'text';
	export let value: string;
	export let title: string;
	export let disabled = false;
	export { classes as class };
	let classes = '';
</script>

<div class="flex-1 flex flex-row relative {classes}">
	{#if type === 'email'}
		<input
			bind:value
			{disabled}
			type="email"
			name={title}
			id={title}
			placeholder=" "
			class="flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative px-5 pt-7 pb-3 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/40 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''} "
		/>
	{:else if type === 'password'}
		<input
			bind:value
			{disabled}
			type="password"
			name={title}
			id={title}
			placeholder=" "
			class="flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative px-5 pt-7 pb-3 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/40 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
		/>
	{:else}
		<input
			bind:value
			{disabled}
			type="text"
			name={title}
			id={title}
			placeholder=" "
			class="flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative px-5 pt-7 pb-3 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/40 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
		/>
	{/if}
	<label class="input-label transition-all duration-150" for={title}>{title}</label>
</div>

<style>
	.input-label {
		font-size: 1rem;
		position: absolute;
		top: 50%;
		left: 1.25rem;
		transform: translateY(-50%);
		color: rgb(var(--c-on-bg) / 0.5);
		pointer-events: none;
	}
	input:focus + .input-label,
	input:not(:placeholder-shown) + .input-label {
		font-size: 0.75rem;
		top: 1.1rem;
	}
	input:not(:placeholder-shown) + .input-label {
		color: rgb(var(--c-on-bg) / 0.75);
	}
	input:focus + .input-label {
		color: rgb(var(--c-primary));
	}
</style>
