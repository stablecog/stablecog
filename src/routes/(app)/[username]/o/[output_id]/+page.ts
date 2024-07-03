import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import type { TGenerationFullOutput, TGenerationOutput } from '$ts/stores/user/generation';
import { error, redirect } from '@sveltejs/kit';
import { similarCount } from '$routes/(app)/gallery/o/[output_id]/constants';
import type { PageLoad } from './$types';
import type { QueryClient } from '@tanstack/svelte-query';
import type { TUserProfileFullOutputsPage } from '$ts/queries/galleryLike/types';
import { getUserProfileFullOutputs } from '$ts/queries/galleryLike/userProfileOutputs';
import type { Session } from '@supabase/supabase-js';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
	session: Session | null | undefined;
}

export const load: PageLoad = async ({ params, parent }) => {
	const { queryClient, session } = (await parent()) as TParent;
	const outputId = params.output_id;
	const username = params.username;
	let generationFullOutput: TGenerationFullOutput | undefined = undefined;
	let similarGenerationFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	let headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (session?.access_token) {
		headers = {
			...headers,
			Authorization: `Bearer ${session.access_token}`
		};
	}
	const [generationFullOutputRes, similarGenerationFullOutputsRes] = await Promise.all([
		fetch(`${apiUrl.origin}/v1/profile/${username}/outputs?output_id=${outputId}`, {
			headers
		}),
		getUserProfileFullOutputs({
			search: outputId,
			per_page: similarCount + 1,
			username,
			access_token: session?.access_token
		})
	]);
	if (!generationFullOutputRes.ok) {
		error(404, 'Response for generation not ok');
	}
	const data: TUserProfileFullOutputsPage = await generationFullOutputRes.json();
	if (!data.outputs || !data.outputs[0]) {
		error(404, 'No output found');
	}
	generationFullOutput = data.outputs[0];

	similarGenerationFullOutputs = similarGenerationFullOutputsRes.outputs
		.filter((o) => o.id !== generationFullOutput?.id)
		.slice(0, similarCount);

	const page: TUserProfileFullOutputsPage = {
		outputs: similarGenerationFullOutputs,
		next: undefined,
		metadata: data.metadata
	};

	if (username !== data.metadata.username)
		redirect(302, `/${data.metadata.username}/o/${outputId}`);

	queryClient.setQueryData(['user_profile_similar_outputs_short', outputId], page);

	return {
		generationFullOutput,
		similarGenerationFullOutputs,
		username: data.metadata.username
	};
};
