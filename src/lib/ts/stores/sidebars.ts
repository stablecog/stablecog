import { writable as writableLocal } from 'svelte-local-storage-store';

export const isLeftSidebarHidden = writableLocal<boolean>('isLeftSidebarHidden', false);
export const isRightSidebarHidden = writableLocal<boolean>('isRightSidebarHidden', false);
