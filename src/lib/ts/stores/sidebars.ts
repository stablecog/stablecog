import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const isLeftSidebarHidden = writableLocal<boolean>('isLeftSidebarHidden', false);
export const isLeftSidebarHiddenApp = writable(false);
export const isRightSidebarHidden = writableLocal<boolean>('isRightSidebarHidden', false);
