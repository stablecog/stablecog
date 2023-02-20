export type TTaskUCog =
	| 'Real-World Image Super-Resolution-Large'
	| 'Real-World Image Super-Resolution-Medium'
	| 'Grayscale Image Denoising'
	| 'Color Image Denoising'
	| 'JPEG Compression Artifact Reduction';

export type TProcessTypeCog = 'generate' | 'upscale' | 'generate-and-upscale';

export type TSchedulerNameCog =
	| 'K_LMS'
	| 'K_EULER'
	| 'K_EULER_ANCESTRAL'
	| 'PNDM'
	| 'HEUN'
	| 'DPM'
	| 'DPM_SINGLESTEP';

export type TOutputImageExtCog = 'png' | 'jpg';
