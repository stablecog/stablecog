import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	const generationId = url.searchParams.get('generation');
	let outputId = url.searchParams.get('output');
	if (!outputId && generationId) {
		outputId = generationId;
	}
	return {};
};
