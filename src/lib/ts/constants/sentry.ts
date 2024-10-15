import { env as envPublic } from '$env/dynamic/public';

export const sentryDsn = envPublic.PUBLIC_SENTRY_DSN;
