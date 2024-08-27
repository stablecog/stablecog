import winston, { createLogger, format } from 'winston';
import LokiTransport from 'winston-loki';
import { env } from '$env/dynamic/private';

export const isNode = process.env.IS_NODE === 'true';

let logger:
	| winston.Logger
	| {
			info: typeof console.info;
			error: typeof console.error;
			warn: typeof console.warn;
	  };

if (env.IS_NODE && env.LOKI_URL && env.LOKI_PASSWORD) {
	const basicAuth = `${env.LOKI_USERNAME}:${env.LOKI_PASSWORD}`;
	const customFormat = format.printf(({ level, message, label, timestamp }) => {
		return `[${level.toUpperCase()}] ${message}`;
	});
	logger = createLogger({
		transports: [
			new winston.transports.Console({
				format: customFormat
			}),
			new LokiTransport({
				host: env.LOKI_URL,
				basicAuth,
				json: true,
				format: customFormat,
				replaceTimestamp: true,
				labels: { logger: 'root', application: 'sc-web' },
				batching: true,
				interval: 3
			})
		]
	});
} else {
	logger = {
		info: console.info,
		error: console.error,
		warn: console.warn
	};
}

export { logger };
