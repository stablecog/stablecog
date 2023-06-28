import { writable } from 'svelte/store';

export const signInCardStatus = writable<TSignInCardState>('idle');
export const signInCardCodeSignInStatus = writable<TSignInCardCodeSignInState>('idle');

export type TSignInCardState = 'idle' | 'loading' | 'error' | 'sent-otp';
export type TSignInCardCodeSignInState = 'idle' | 'entering' | 'loading' | 'error' | 'success';
