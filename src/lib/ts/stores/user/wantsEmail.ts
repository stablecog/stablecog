import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const wantsEmail = writableLocal({
	key: 'wantsEmail',
	defaultValue: null,
	schema: z.boolean().nullable()
});
