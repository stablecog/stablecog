import { createClient } from '@supabase/supabase-js';
import { env as envPublic } from '$env/dynamic/public';
import { env as envPrivate } from '$env/dynamic/private';

export const supabaseAdmin = createClient(
	envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_URL_QA
		: envPublic.PUBLIC_APP_MODE === 'dev'
		? envPublic.PUBLIC_SUPABASE_URL
		: envPublic.PUBLIC_SUPABASE_URL,
	envPublic.PUBLIC_APP_MODE === 'qa'
		? envPrivate.SUPABASE_ADMIN_KEY_QA
		: envPrivate.PUBLIC_APP_MODE === 'dev'
		? envPrivate.SUPABASE_ADMIN_KEY
		: envPrivate.SUPABASE_ADMIN_KEY
);
