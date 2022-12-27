<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let type: 'text' | 'email' | 'password' | 'number' = 'text';
	export let value: string;
	export let title: string;
	export let disabled = false;
	export { classes as class };
	export let hasIcon = false;
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
			class="peer flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative {hasIcon
				? 'pl-12 pr-5'
				: 'px-5'} pt-7 pb-3 rounded-xl transition 
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
			class="peer flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative {hasIcon
				? 'pl-12 pr-5'
				: 'px-5'} pt-7 pb-3 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/40 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
		/>
	{:else if type === 'number'}
		<input
			bind:value
			{disabled}
			type="number"
			name={title}
			id={title}
			placeholder=" "
			class="peer flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative {hasIcon
				? 'pl-12 pr-5'
				: 'px-5'} pt-7 pb-3 rounded-xl transition 
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
			class="peer flex-1 overflow-hidden overflow-ellipsis bg-c-bg-tertiary relative {hasIcon
				? 'pl-12 pr-5'
				: 'px-5'} pt-7 pb-3 rounded-xl transition 
      shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] focus:ring-2 focus:ring-c-primary/40 ring-0 ring-c-primary/20 
      placeholder:text-c-on-bg/30 {!$isTouchscreen ? 'enabled:hover:ring-2' : ''} {!$isTouchscreen
				? 'enabled:group-hover:ring-2'
				: ''}"
		/>
	{/if}
	<label
		class="{hasIcon ? 'pl-12 pr-5' : 'px-5'} input-label absolute transition-all duration-150
		text-c-on-bg/75 peer-placeholder-shown:text-c-on-bg/50 peer-focus:text-c-on-bg/75
		transform top-4 -translate-y-1/2 pointer-events-none text-xs peer-placeholder-shown:text-base peer-focus:text-xs
		peer-placeholder-shown:top-1/2 peer-focus:top-4"
		for={title}
	>
		{title}
	</label>
	<div
		class="absolute left-4 top-1/2 transform transition -translate-y-1/2 w-5 h-5 icon text-c-on-bg/75
		peer-placeholder-shown:text-c-on-bg/50 peer-focus:text-c-on-bg/75 pointer-events-none"
	>
		<slot name="icon" />
	</div>
</div>
