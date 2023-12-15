import { createClient } from '@supabase/supabase-js';
import { supabaseUrl } from '$ts/constants/supabase';
import { PUBLIC_APP_MODE } from '$env/static/public';
import { SUPABASE_ADMIN_KEY, SUPABASE_ADMIN_KEY_QA } from '$env/static/private';

export const supabaseAdmin = createClient(
	supabaseUrl,
	(PUBLIC_APP_MODE === 'qa'
		? SUPABASE_ADMIN_KEY_QA
		: PUBLIC_APP_MODE === 'dev'
		? SUPABASE_ADMIN_KEY
		: SUPABASE_ADMIN_KEY) || '',
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
