export type TTaskUCog =
	| 'Real-World Image Super-Resolution-Large'
	| 'Real-World Image Super-Resolution-Medium'
	| 'Grayscale Image Denoising'
	| 'Color Image Denoising'
	| 'JPEG Compression Artifact Reduction';

export type TProcessTypeCog = 'generate' | 'upscale' | 'generate-and-upscale';

export type TOutputImageExtCog = 'png' | 'jpg';
