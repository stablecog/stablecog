export function operationTypeToLocaleString(type: TOperationType, $LL: TranslationFunctions) {
	switch (type) {
		case 'upscale':
			return $LL.Account.Usage.UsageType.Upscale();
		default:
			return $LL.Account.Usage.UsageType.Generate();
	}
}

export function operationSourceToLocaleString(source: TOperationSource, $LL: TranslationFunctions) {
	switch (source) {
		case 'api':
			return $LL.Account.Usage.SourceType.API();
		default:
			return $LL.Account.Usage.SourceType.WebApp();
	}
}

export type TOperationType = 'generate' | 'upscale';
export type TOperationSource = 'api' | 'web-ui';
