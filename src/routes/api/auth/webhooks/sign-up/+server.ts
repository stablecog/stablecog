import type { RequestHandler } from '@sveltejs/kit';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import posthog from 'posthog-js';

export const POST: RequestHandler = async ({ request }) => {
	const body: IBody = await request.json();
	const record = body.record;

	const { data: user, error } = await supabaseAdmin
		.from('user')
		.select('id,email')
		.match({ id: record.id })
		.single();

	if (error || !user) {
		console.log(error);
		return new Response('Error', { status: 500 });
	}

	posthog.identify(user.id, {
		email: user.email
	});

	posthog.capture('Sign Up', {
		distinct_id: user.id,
		'SC - Email': user.email
	});

	return new Response('OK', { status: 200 });
};

interface IBody {
	record: {
		id: string;
		email: string;
	};
}
