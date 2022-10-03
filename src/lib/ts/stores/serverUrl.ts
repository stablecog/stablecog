import { writable as writableLocal } from 'svelte-local-storage-store';

const defaultServerUrl = 'http://peepeepoopoohootdetector3000.com:5000';
export let serverUrl = writableLocal<string>('serverUrl', defaultServerUrl);
