import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env as envPublic } from '$env/dynamic/public';

export const supabase = createClient(
	envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_URL_QA
		: envPublic.PUBLIC_APP_MODE === 'dev'
		? envPublic.PUBLIC_SUPABASE_URL
		: envPublic.PUBLIC_SUPABASE_URL,
	envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_ANON_KEY_QA
		: envPublic.PUBLIC_APP_MODE === 'dev'
		? envPublic.PUBLIC_SUPABASE_ANON_KEY
		: envPublic.PUBLIC_SUPABASE_ANON_KEY
);
