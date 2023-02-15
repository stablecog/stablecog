import { apiUrl } from '$ts/constants/main';
import type { TGeneration, TGenerationOutputWithGeneration } from '$ts/stores/generation';

const perPage = 50;
export async function getUserGenerations({
	cursor,
	access_token
}: {
	cursor?: string;
	access_token: string;
}) {
	console.log('getUserGenerations');
	const query = new URLSearchParams();
	query.append('per_page', perPage.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	const url = `${apiUrl.href}v1/user/generation?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	const data: TUserGenerationsPage = await res.json();
	let generationOutputsWithGeneration: TGenerationOutputWithGeneration[] = [];
	for (let i = 0; i < data.generations.length; i++) {
		const generation = data.generations[i];
		if (generation.outputs) {
			for (let j = 0; j < generation.outputs.length; j++) {
				const generationOutput = generation.outputs[j];
				generationOutputsWithGeneration.push({
					...generationOutput,
					generation
				});
			}
		}
	}
	const userGenerationOutputsWithGenerationsPage: TUserGenerationOutputsWithGenerationsPage = {
		generationOutputsWithGeneration,
		total_count: data.total_count,
		next: data.next
	};
	return userGenerationOutputsWithGenerationsPage;
}

export interface TUserGenerationsPage {
	generations: TGeneration[];
	total_count?: number;
	next?: string;
}

export interface TUserGenerationOutputsWithGenerationsPage {
	generationOutputsWithGeneration: TGenerationOutputWithGeneration[];
	total_count?: number;
	next?: string;
}
