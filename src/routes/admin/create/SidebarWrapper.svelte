<div
	class="w-full h-full flex flex-col bg-c-bg rounded-3xl border-4 border-c-bg-secondary
  shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] overflow-hidden relative"
>
	<slot />
	<div
		class="w-full h-16 absolute z-10 -bottom-1 left-0 pointer-events-none 
		bg-gradient-to-t from-c-bg to-c-bg/0"
	/>
</div>
