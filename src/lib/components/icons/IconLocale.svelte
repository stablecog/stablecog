<script lang="ts">
	export let locale: Locales;
	export { classes as class };
	let classes = 'w-6 h-6';
</script>

{#if locale === 'en'}
	<svg class={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<path fill="#012169" d="M0 0h512v512H0z" />
		<path
			fill="#FFF"
			d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
		/>
		<path
			fill="#C8102E"
			d="m184 324 11 34L42 512H0v-3l184-185zm124-12 54 8 150 147v45L308 312zM512 0 320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"
		/>
		<path fill="#FFF" d="M176 0v512h160V0H176zM0 176v160h512V176H0z" />
		<path fill="#C8102E" d="M0 208v96h512v-96H0zM208 0v512h96V0h-96z" />
	</svg>
{:else if locale === 'tr'}
	<svg class={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<g fill-rule="evenodd">
			<path fill="#e30a17" d="M0 0h512v512H0z" />
			<path
				fill="#fff"
				d="M348.8 264c0 70.6-58.3 127.9-130.1 127.9s-130.1-57.3-130.1-128 58.2-127.8 130-127.8S348.9 193.3 348.9 264z"
			/>
			<path
				fill="#e30a17"
				d="M355.3 264c0 56.5-46.6 102.3-104.1 102.3s-104-45.8-104-102.3 46.5-102.3 104-102.3 104 45.8 104 102.3z"
			/>
			<path
				fill="#fff"
				d="m374.1 204.2-1 47.3-44.2 12 43.5 15.5-1 43.3 28.3-33.8 42.9 14.8-24.8-36.3 30.2-36.1-46.4 12.8-27.5-39.5z"
			/>
		</g>
	</svg>
{:else if locale === 'de'}
	<svg class={classes} xmlns="http://www.w3.org/2000/svg" id="flag-icons-de" viewBox="0 0 512 512">
		<path fill="#ffce00" d="M0 341.3h512V512H0z" />
		<path d="M0 0h512v170.7H0z" />
		<path fill="#d00" d="M0 170.7h512v170.6H0z" />
	</svg>
{:else if locale === 'ru'}
	<svg class={classes} xmlns="http://www.w3.org/2000/svg" id="flag-icons-ru" viewBox="0 0 512 512">
		<g fill-rule="evenodd" stroke-width="1pt">
			<path fill="#fff" d="M0 0h512v512H0z" />
			<path fill="#0039a6" d="M0 170.7h512V512H0z" />
			<path fill="#d52b1e" d="M0 341.3h512V512H0z" />
		</g>
	</svg>
{:else if locale === 'es'}
	<svg
		class={classes}
		width="512"
		height="512"
		viewBox="0 0 512 512"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M0 0H512V512H0V0Z" fill="#AA151B" />
		<path d="M0 128H512V384H0V128Z" fill="#F1BF00" />
	</svg>
{:else if locale === 'hi'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		id="flag-icons-in"
		viewBox="0 0 512 512"
	>
		<path fill="#f93" d="M0 0h512v170.7H0z" />
		<path fill="#fff" d="M0 170.7h512v170.6H0z" />
		<path fill="#128807" d="M0 341.3h512V512H0z" />
		<g transform="translate(256 256) scale(3.41333)">
			<circle r="20" fill="#008" />
			<circle r="17.5" fill="#fff" />
			<circle r="3.5" fill="#008" />
			<g id="d">
				<g id="c">
					<g id="b">
						<g id="a" fill="#008">
							<circle r=".9" transform="rotate(7.5 -8.8 133.5)" />
							<path d="M0 17.5.6 7 0 2l-.6 5L0 17.5z" />
						</g>
						<use xlink:href="#a" width="100%" height="100%" transform="rotate(15)" />
					</g>
					<use xlink:href="#b" width="100%" height="100%" transform="rotate(30)" />
				</g>
				<use xlink:href="#c" width="100%" height="100%" transform="rotate(60)" />
			</g>
			<use xlink:href="#d" width="100%" height="100%" transform="rotate(120)" />
			<use xlink:href="#d" width="100%" height="100%" transform="rotate(-120)" />
		</g>
	</svg>
{:else if locale === 'fr'}
	<svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-fr" viewBox="0 0 512 512">
		<path fill="#fff" d="M0 0h512v512H0z" />
		<path fill="#002654" d="M0 0h170.7v512H0z" />
		<path fill="#ce1126" d="M341.3 0H512v512H341.3z" />
	</svg>
{/if}
