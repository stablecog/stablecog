import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const shouldSubmitToGallery = writableLocal({
	key: 'shouldSubmitToGallery',
	defaultValue: null,
	schema: z.boolean().nullable()
});
