<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	export let stretchFirst = false;
	export let gridGap = '0.5em';
	export let colWidth = 'minmax(Min(18em, 100%), 1fr)';
	export let items: any[] = [];
	let grids: any[] = [];
	let masonryElement: HTMLDivElement;

	export const refreshLayout = async () => {
		grids.forEach(async (grid) => {
			/* get the post relayout number of columns */
			let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;

			grid.items.forEach((c: any) => {
				let new_h = c.getBoundingClientRect().height;

				if (new_h !== +c.dataset.h) {
					c.dataset.h = new_h;
					grid.mod++;
				}
			});

			/* if the number of columns has changed */
			if (grid.ncol !== ncol || grid.mod) {
				/* update number of columns */
				grid.ncol = ncol;
				/* revert to initial positioning, no margin */
				grid.items.forEach((c: any) => c.style.removeProperty('margin-top'));
				/* if we have more than one column */
				if (grid.ncol > 1) {
					grid.items.slice(ncol).forEach((c: any, i: any) => {
						let prev_fin =
								grid.items[i].getBoundingClientRect().bottom /* bottom edge of item above */,
							curr_ini = c.getBoundingClientRect().top; /* top edge of current item */

						c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
					});
				}

				grid.mod = 0;
			}
		});
	};

	const calcGrid = async (_masonryArr: any[]) => {
		await tick();
		if (_masonryArr.length && getComputedStyle(_masonryArr[0]).gridTemplateRows !== 'masonry') {
			grids = _masonryArr.map((grid) => {
				return {
					_el: grid,
					gap: parseFloat(getComputedStyle(grid).gridRowGap),
					items: [...grid.childNodes].filter(
						(c) => c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1
					),
					ncol: 0,
					mod: 0
				};
			});
			refreshLayout(); /* initial load */
		}
	};

	let _window: Window;
	onMount(() => {
		_window = window;
		_window.addEventListener('resize', refreshLayout, false); /* on resize */
	});
	onDestroy(() => {
		if (_window) {
			_window.removeEventListener('resize', refreshLayout, false); /* on resize */
		}
	});

	$: if (masonryElement) {
		calcGrid([masonryElement]);
	}

	$: if (items) {
		// update if items are changed
		masonryElement = masonryElement; // refresh masonryElement
	}
</script>

<div
	bind:this={masonryElement}
	class={`__grid--masonry ${stretchFirst ? '__stretch-first' : ''}`}
	style={`--grid-gap: ${gridGap}; --col-width: ${colWidth};`}
>
	<slot />
</div>

<!-- 
  $w: var(--col-width); // minmax(Min(20em, 100%), 1fr);
  $s: var(--grid-gap); // .5em;
 -->
<style>
	:global(.__grid--masonry) {
		display: grid;
		grid-template-columns: repeat(auto-fit, var(--col-width));
		grid-template-rows: masonry;
		justify-content: center;
		grid-gap: var(--grid-gap);
		padding: var(--grid-gap);
	}
	:global(.__grid--masonry > *) {
		align-self: start;
	}
	:global(.__grid--masonry.__stretch-first > *:first-child) {
		grid-column: 1/ -1;
	}
</style>
