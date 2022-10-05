import { createClient } from '@supabase/supabase-js';
import { env as envPublic } from '$env/dynamic/public';
import { env as envPrivate } from '$env/dynamic/private';

export const supabaseAdmin =
	envPublic.PUBLIC_SUPABASE_URL && envPrivate.SUPABASE_ADMIN_KEY
		? createClient(envPublic.PUBLIC_SUPABASE_URL, envPrivate.SUPABASE_ADMIN_KEY)
		: undefined;
