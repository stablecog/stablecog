import winston, { createLogger, format } from 'winston';
import LokiTransport from 'winston-loki';
import { env as envPublic } from '$env/dynamic/public';
import { env as envPrivate } from '$env/dynamic/private';
import { browser } from '$app/environment';
import { setLogger } from '$ts/constants/loggerBrowser';

export const isNode = envPublic.PUBLIC_IS_NODE === 'true';

if (isNode && envPrivate.LOKI_URL && envPrivate.LOKI_PASSWORD && !browser) {
	const basicAuth = `${envPrivate.LOKI_USERNAME}:${envPrivate.LOKI_PASSWORD}`;
	const customFormat = format.printf(({ level, message, label, timestamp }) => {
		return `[${level.toUpperCase().slice(0, 4)}] ${message}`;
	});
	setLogger(
		createLogger({
			transports: [
				new winston.transports.Console({
					format: customFormat
				}),
				new LokiTransport({
					host: envPrivate.LOKI_URL,
					basicAuth,
					json: true,
					format: customFormat,
					replaceTimestamp: true,
					labels: { logger: 'root', application: 'sc-web' },
					batching: true,
					interval: 3
				})
			]
		})
	);
} else {
	setLogger({
		info: console.info,
		error: console.error,
		warn: console.warn
	});
}
