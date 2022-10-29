/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

worker.addEventListener('install', () => {
	// Skip over the "waiting" lifecycle state, to ensure that our
	// new service worker is activated immediately, even if there's
	// another tab open controlled by our older service worker code.
	worker.skipWaiting();
});

worker.addEventListener('activate', () => {
	// Optional: Get a list of all the current open windows/tabs under
	// our service worker's control, and force them to reload.
	// This can "unbreak" any open windows/tabs as soon as the new
	// service worker activates, rather than users having to manually reload.
	worker.clients
		.matchAll({
			type: 'window'
		})
		.then((windowClients: any) => {
			windowClients.forEach((windowClient: any) => {
				windowClient.navigate(windowClient.url);
			});
		});
});
