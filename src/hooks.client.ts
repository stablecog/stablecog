import { sentryDsn } from '$ts/constants/sentry';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
	dsn: sentryDsn
});

export const handleError = handleErrorWithSentry();
