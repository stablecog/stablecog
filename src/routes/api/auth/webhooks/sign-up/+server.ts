import type { RequestHandler } from '@sveltejs/kit';
import Mixpanel from 'mixpanel';
import { PUBLIC_MIXPANEL_ID } from '$env/static/public';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
const mixpanel = Mixpanel.init(PUBLIC_MIXPANEL_ID);

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

	mixpanel.people.set(user.id, {
		$email: user.email
	});

	mixpanel.track('Sign Up', {
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
