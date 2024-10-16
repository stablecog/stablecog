import { similarCount } from '$routes/(app)/gallery/o/[output_id]/constants';
import { getApiUrl } from '$ts/constants/main';
import { getGalleryFullOutputs } from '$ts/queries/galleryLike/galleryOutputs';
import type {
	TGalleryFullOutputsPage,
	TGalleryFullOutputsPageShallow
} from '$ts/queries/galleryLike/types';
import type { TGenerationFullOutput } from '$ts/stores/user/generation';
import { error } from '@sveltejs/kit';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { isUUID } from '$ts/helpers/uuid';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
	session: Session | null | undefined;
}

export const load: PageLoad = async ({ params, parent, fetch }) => {
	const outputId = params.output_id;
	if (!isUUID(outputId)) {
		error(404, 'Output not found');
	}
	let generationFullOutput: TGenerationFullOutput | undefined = undefined;
	let similarGenerationFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	const { session, queryClient } = (await parent()) as TParent;
	let headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (session?.access_token) {
		headers = {
			...headers,
			Authorization: `Bearer ${session.access_token}`
		};
	}
	try {
		const [generationFullOutputsRes, similarGenerationFullOutputsRes] = await Promise.all([
			fetch(`${getApiUrl().origin}/v1/gallery?output_id=${outputId}`, {
				headers
			}),
			getGalleryFullOutputs({
				custom_fetch: fetch,
				search: outputId,
				per_page: similarCount + 1,
				accessToken: session?.access_token
			})
		]);
		if (!generationFullOutputsRes.ok) {
			error(404, 'Response for generation not ok');
		}
		const data: TGalleryFullOutputsPageShallow = await generationFullOutputsRes.json();
		if (!data.outputs || !data.outputs[0]) {
			error(404, 'No output found');
		}

		generationFullOutput = {
			...data.outputs[0],
			generation: {
				...data.outputs[0].generation,
				outputs: []
			}
		};

		similarGenerationFullOutputs = similarGenerationFullOutputsRes.outputs
			.filter((o) => o.id !== generationFullOutput?.id)
			.slice(0, similarCount);

		const page: TGalleryFullOutputsPage = {
			outputs: similarGenerationFullOutputs,
			next: undefined,
			total: similarGenerationFullOutputsRes.total
		};

		queryClient.setQueryData(['gallery_similar_outputs_short', outputId], page);

		return {
			generationFullOutput,
			similarGenerationFullOutputs
		};
	} catch (err) {
		if (String(err).includes('404')) {
			error(404, 'Output not found');
		} else {
			error(500, 'Something went wrong');
		}
	}
};
