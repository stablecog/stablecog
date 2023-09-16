import { supabaseAdmin } from '$ts/constants/supabaseAdmin';

export const load = async () => {
	const { data, error } = await supabaseAdmin
		.from('generation_outputs')
		.select('*, generations!inner(*, prompts!inner(*), negative_prompts!inner(*))')
		.order('created_at', { ascending: false })
		.eq('generations.user_id', '7df13cbf-f5bc-434e-a015-39f578a64fa1')
		.limit(1000);
	return {
		generationOutputs: data
	};
};
