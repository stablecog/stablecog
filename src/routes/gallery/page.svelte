<script lang="ts">
	import type { PageServerData } from '../../../.svelte-kit/types/src/routes/gallery/$types';
	import Masonry from '$components/Masonry.svelte';

	export let data: PageServerData;

	const generations = data.generations;
	let lastPage = data.page;
	const imageUrl = 'https://pub-6a0b59853e4a4dcfa459b203f5724709.r2.dev';
</script>

<div class="w-full flex-1 flex flex-col">
	<div class="w-full">
		<Masonry items={generations}>
			{#each generations as item}
				<div
					class="rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
          shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
				>
					<img
						loading="lazy"
						width={item.width}
						height={item.height}
						src="{imageUrl}/{item.image_id}.webp"
						alt={item.id}
					/>
				</div>
			{/each}
		</Masonry>
	</div>
</div>
