// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare module 'dexie' {
	interface Observable<T> {
		subscribe(run: Subscriber<T>): Unsubscriber | Subscription;
	}
}

interface PlausibleObj {
	callback?: function;
	props?: { [key: string]: string };
}

interface Window {
	plausible: (goalName: string, obj?: PlausibleObj) => void;
	umami: (goalName: string) => void;
}
