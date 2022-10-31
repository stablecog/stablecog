<script>
	import { supabase } from '$ts/constants/supabase';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (supabase) {
			const {
				data: { subscription }
			} = supabase.auth.onAuthStateChange(() => {
				invalidate('supabase:auth');
			});

			return () => {
				subscription.unsubscribe();
			};
		}
	});
</script>

<slot />
