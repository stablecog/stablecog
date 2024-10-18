import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const lastClosedNotification = writableLocal<string | null>({
	key: 'lastClosedNotification',
	defaultValue: null,
	schema: z.string().nullable()
});
