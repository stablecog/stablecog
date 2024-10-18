import { locales } from '$i18n/i18n-util';
import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const localeEnum = z.enum(locales as unknown as [Locales, ...Locales[]]).nullable();

export const localeLS = writableLocal({
	key: 'localeLS',
	defaultValue: null,
	schema: localeEnum
});
