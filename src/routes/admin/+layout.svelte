<script>
	import { invalidate } from '$app/navigation';
	import { supabaseClient } from '$ts/constants/supabaseClient';
	import { onMount } from 'svelte';

	onMount(() => {
		if (supabaseClient) {
			const {
				data: { subscription }
			} = supabaseClient.auth.onAuthStateChange(() => {
				invalidate('supabase:auth');
			});

			return () => {
				subscription.unsubscribe();
			};
		}
	});
</script>

<slot />
