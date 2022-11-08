import type { BaseTranslation } from '../i18n-types';

const en: BaseTranslation = {
	Home: {
		GenerateButton: 'Generate',
		PromptInput: {
			Placeholder: 'Portrait of a cat by Van Gogh'
		},
		WidthTabBar: {
			Title: 'Width',
			Paragraph: 'The width of the image.'
		},
		HeightTabBar: {
			Title: 'Height',
			Paragraph: 'The height of the image.'
		},
		InferenceStepsTabBar: {
			Title: 'Inference Steps',
			Paragraph: 'How many steps will be taken to generate (diffuse) the image.'
		},
		GuidanceScaleSlider: {
			Title: 'Guidance Scale',
			Paragraph:
				'How similar the image will be to your prompt. Higher values make the image closer to your prompt.'
		},
		NegativePromptInput: {
			Title: 'Negative Prompt',
			Placeholder: 'Negative prompt',
			Paragraph:
				'To remove unwanted things from the image. It does the opposite of what the prompt does.'
		},
		SeedInput: {
			Title: 'Seed',
			Placeholder: 'Seed number',
			Paragraph:
				'Get repeatable results. A seed combined with the same prompt and options generates the same image.'
		}
	},
	History: {
		GenerationsTitle: 'Generations',
		GenerationsWarning: 'Last {count:number} only.',
		NoGenerations: "You didn't generate any images yet."
	},
	Live: {
		GenerationsTitle: 'Generations',
		TotalDurationTitle: 'Total Duration',
		UpscalesTitle: 'Upscales',
		Tooltip: {
			Country: {
				Title: 'Country',
				Unknown: 'Unknown'
			},
			TypeTitle: 'Type',
			DimensionsTitle: 'Dimensions',
			StepsTitle: 'Steps',
			DurationTitle: 'Duration',
			Status: {
				Title: 'Status',
				Started: 'Started',
				Succeeded: 'Succeeded',
				Failed: 'Failed'
			},
			Server: {
				Title: 'Server'
			}
		},
		WaitingTitle: 'Waiting for generations'
	},
	Navbar: {
		HomeTab: 'Home',
		HistoryTab: 'History',
		GalleryTab: 'Gallery',
		LiveTab: 'Live'
	},
	Settings: {
		Title: 'Settings',
		SwitchServerButton: 'Switch Server',
		SubmitToGalleryToggle: 'Submit to Gallery',
		AdvancedModeToggle: 'Advanced Mode',
		DarkModeToggle: 'Dark Mode'
	},
	GenerationFullscreen: {
		DownloadButton: 'Download',
		CopyPromptButton: 'Copy Prompt',
		CopyNegativePromptButton: 'Copy Negative Prompt',
		RerollButton: 'Reroll',
		RegenerateButton: 'Regenerate',
		GenerateButton: 'Generate',
		UpscaleButton: 'Upscale',
		UpscaleTabBar: {
			UpscaledTitle: 'Upscaled',
			OriginalTitle: 'Normal'
		},
		Dimensions: {
			Title: 'Dimensions'
		},
		Duration: {
			Title: 'Duration'
		}
	},
	Blog: {
		Title: 'Blog Posts',
		BackToBlogButton: 'Back to Blog',
		JoinUsTitle: 'Join Us'
	},
	Redirect: {
		RedirectingToTitle: 'Redirecting to {name:string}'
	},
	Shared: {
		StartGeneratingTitle: 'Start generating beautiful images!',
		StartGeneratingButton: 'Start Generating'
	}
};

export default en;
