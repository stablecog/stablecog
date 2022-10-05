import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ADMIN_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

export const supabaseAdmin =
	PUBLIC_SUPABASE_URL && SUPABASE_ADMIN_KEY
		? createClient(PUBLIC_SUPABASE_URL, SUPABASE_ADMIN_KEY)
		: undefined;
