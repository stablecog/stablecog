import { createClient } from '@supabase/supabase-js';
import { env as envPublic } from '$env/dynamic/public';
import { env as envPrivate } from '$env/dynamic/private';
import { supabaseUrl } from '$ts/constants/supabase';

export const supabaseAdmin = createClient(
	supabaseUrl,
	(envPublic.PUBLIC_APP_MODE === 'qa'
		? envPrivate.SUPABASE_ADMIN_KEY_QA
		: envPrivate.PUBLIC_APP_MODE === 'dev'
		? envPrivate.SUPABASE_ADMIN_KEY
		: envPrivate.SUPABASE_ADMIN_KEY) || '',
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
