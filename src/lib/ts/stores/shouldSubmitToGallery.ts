import { writable as writableLocal } from '@macfja/svelte-persistent-store';

export const shouldSubmitToGallery = writableLocal<boolean | null>('shouldSubmitToGallery', null);
