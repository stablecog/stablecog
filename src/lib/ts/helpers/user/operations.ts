export function operationTypeToLocaleString(type: TOperationType, $LL: TranslationFunctions) {
	switch (type) {
		case 'upscale':
			return $LL.Account.Usage.UsageType.Upscale();
		case 'voiceover':
			return $LL.Account.Usage.UsageType.Voiceover();
		default:
			return $LL.Account.Usage.UsageType.Generation();
	}
}

export function operationSourceToLocaleString(source: TOperationSource, $LL: TranslationFunctions) {
	switch (source) {
		case 'api':
			return $LL.Account.Usage.SourceType.API();
		case 'discord':
			return $LL.Account.Usage.SourceType.DiscordBot();
		default:
			return $LL.Account.Usage.SourceType.WebApp();
	}
}

export type TOperationType = 'generate' | 'upscale' | 'voiceover';
export type TOperationSource = 'api' | 'web-ui' | 'discord';
