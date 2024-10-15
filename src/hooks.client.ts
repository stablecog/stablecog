import { sentryDsn } from '$ts/constants/sentry';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
	dsn: sentryDsn
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
