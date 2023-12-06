import { readTranslationFromDisk } from 'typesafe-i18n/exporter';
import { writeFile } from 'fs/promises';

const sourceFileName = 'index.json';

const exportTranslationsForLocale = async (locale: string) => {
	try {
		const mapping = await readTranslationFromDisk(locale);
		const jsonString = JSON.stringify(mapping.translations, null, 2);
		await writeFile(`./${sourceFileName}`, jsonString);
	} catch (error) {
		console.log(error);
	}
};

exportTranslationsForLocale('en');
