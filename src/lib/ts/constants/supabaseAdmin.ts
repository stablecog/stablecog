import { createClient } from '@supabase/supabase-js';
import { env as envPublic } from '$env/dynamic/public';
import { env as envPrivate } from '$env/dynamic/private';

export const supabaseAdmin = createClient(
	envPublic.PUBLIC_SUPABASE_URL,
	envPrivate.SUPABASE_ADMIN_KEY
);
