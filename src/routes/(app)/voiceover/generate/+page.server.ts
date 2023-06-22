import type { TVoiceoverLocale } from '$ts/constants/voiceover/locales.js';
import { voiceoverSpeakersArray } from '$ts/constants/voiceover/models.js';

export async function load(e) {
	const l = e.locals.locale;
	const voiceover_locale: TVoiceoverLocale | undefined = voiceoverSpeakersArray.find(
		(i) => i.locale === l
	)?.locale;
	return {
		voiceover_locale
	};
}
