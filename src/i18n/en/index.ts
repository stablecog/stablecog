import type { BaseTranslation } from '../i18n-types';

const en: BaseTranslation = {
	Language: 'Language',
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
		GenerationsMaxSavedCountWarning: 'Last {count:number} only',
		NoGenerationsYet: "You didn't generate any images yet."
	},
	Live: {
		GenerationsTitle: 'Generations',
		TotalDurationTitle: 'Total Duration',
		UpscalesTitle: 'Upscales',
		GenerationTooltip: {
			CountryTitle: 'Country',
			Type: {
				Title: 'Type',
				Generation: 'Generation',
				Upscale: 'Upscale'
			},
			DimensionsTitle: 'Dimensions',
			StepsTitle: 'Steps',
			ScaleTitle: 'Scale',
			DurationTitle: 'Duration',
			Status: {
				Title: 'Status',
				Started: 'Started',
				Succeeded: 'Succeeded',
				Failed: 'Failed'
			},
			Server: {
				Title: 'Server',
				Default: 'Default',
				Custom: 'Custom'
			},
			UnknownTitle: 'Unknown'
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
		DoneButtonState: 'Done!',
		CopyPromptButton: 'Copy Prompt',
		CopyNegativePromptButton: 'Copy Negative Prompt',
		CopiedButtonState: 'Copied!',
		RerollButton: 'Reroll',
		RegenerateButton: 'Regenerate',
		GenerateButton: 'Generate',
		UpscaleButton: 'Upscale',
		UpscaleTabBar: {
			UpscaledTitle: 'Upscaled',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Dimensions'
		},
		Duration: {
			Title: 'Duration'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Set Server',
		SwitchServerTitle: 'Switch Server',
		Paragraph: 'The server will be used for generating images.',
		SetButton: 'Set',
		DefaultButton: 'Default',
		ServerUrlInput: {
			Placeholder: 'Server URL'
		},
		SwitchToDefaultServerButton: 'Switch to Default Server'
	},
	Blog: {
		Title: 'Blog Posts',
		BackToBlogButton: 'Back to Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Redirecting to {name:string}'
	},
	Shared: {
		StartGeneratingTitle: 'Start generating beautiful images!',
		StartGeneratingButton: 'Start Generating',
		JoinUsTitle: 'Join Us'
	},
	Error: {
		SomethingWentWrong: 'Something went wrong :(',
		NSFW: 'NSFW content detected, try another prompt :(',
		ServerSeemsOffline:
			'The server seems to be offline. You might want to refresh the page or set another server from the settings.',
		ServerSetNotWorking: "This server isn't compatible or not responding."
	}
};

export default en;
