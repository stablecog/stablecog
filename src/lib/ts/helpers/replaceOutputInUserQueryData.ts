import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
import type { TGenerationOutput } from '$ts/stores/user/generation';
import type { QueryClient } from '@tanstack/svelte-query';

export async function replaceOutputInUserQueryData(
	queryClient: QueryClient,
	queryKey: string[],
	outputPartial: Partial<TGenerationOutput>
) {
	await queryClient.cancelQueries({ queryKey: queryKey });
	const data = queryClient.getQueryData(queryKey);
	if (!data) return;
	queryClient.setQueryData(queryKey, (data: any) => ({
		...data,
		pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
			return {
				...page,
				outputs: page.outputs.map((o) =>
					o.id === outputPartial.id ? { ...o, ...outputPartial } : o
				)
			};
		})
	}));
}
