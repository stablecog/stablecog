import NsfwWarningToast from '$components/toast/NsfwWarningToast.svelte';
import { toast } from 'svelte-sonner';

export function toastNSFWPromptWarning(id: string) {
	toast.custom(NsfwWarningToast, {
		id,
		position: 'top-right',
		duration: 15000,
		component: NsfwWarningToast,
		componentProps: {
			id
		}
	});
}
