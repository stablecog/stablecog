import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const outputId = params.output_id;
	const username = params.username;
	redirect(301, `/${username}/o/${outputId}`);
};
