import { LOKI_BASIC_AUTH_TOKEN } from '$env/static/private';

export const load = async () => {
	return {
		lokiBasicAuthToken: LOKI_BASIC_AUTH_TOKEN
	};
};
