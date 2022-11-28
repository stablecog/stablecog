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
		},
		ModelDropdown: {
			Title: 'Model',
			Paragraph: 'The AI Model that will be used to generate the image.'
		},
		SchedulerDropdown: {
			Title: 'Scheduler',
			Paragraph:
				'Diffuse the image in a certain way. It can drastically change the generated image. Some require less steps to produce good results.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Submit generations to the gallery?',
			Paragraph: 'You can change your preference from the settings later.'
		}
	},
	History: {
		GenerationsTitle: 'Generations',
		GenerationsMaxSavedCountWarning: 'Last {count:number} only',
		NoGenerationsYet: "You haven't generated any images yet."
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
		WaitingTitle: 'Waiting for generations',
		DurationStatusUnknown: 'Unknown'
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
		AdvancedOptionsDropdown: 'Advanced Options',
		AdvancedDropdown: 'Advanced',
		GenerationSettingsButton: 'Generation Settings',
		GenerationSettingsTitle: 'Generation Settings',
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
		DefaultButton: 'Default'
	},
	Blog: {
		Title: 'Blog Posts',
		TitleAlt: 'Blog',
		BackToBlogButton: 'Back to Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Redirecting to {name:string}'
	},
	Shared: {
		StartGeneratingTitle: 'Start generating beautiful images!',
		StartGeneratingButton: 'Start Generating',
		JoinUsTitle: 'Join Us',
		GoHomeButton: 'Go Home',
		SwitchToDefaultServerButton: 'Switch to Default Server',
		ShareButton: 'Share',
		ShareOnButton: 'Share on {name:string}',
		YesButton: 'Yes',
		NoButton: 'No',
		EnableButton: 'Enable',
		DisableButton: 'Disable',
		AddButton: 'Add',
		CopyLinkButton: 'Copy Link',
		CopyButton: 'Copy',
		DeleteButton: 'Delete',
		ServerUrlInput: {
			Placeholder: 'Server URL'
		},
		LoadingTitle: 'Loading',
		LoadingParagraph: 'Loading...',
		LoginButton: 'Login',
		LogoutButton: 'Logout',
		EmailInput: {
			Placeholder: 'Email'
		},
		PasswordInput: {
			Placeholder: 'Password'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: 'General'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3D Digital Art'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3D Comic'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': { realName: 'Ghibli Diffusion', simpleName: 'Anime' },
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Animated Movie'
			}
		},
		UnknownTitle: 'Unknown'
	},
	Error: {
		SomethingWentWrong: 'Something went wrong :(',
		NSFW: 'NSFW content detected, try another prompt :(',
		ServerSeemsOffline:
			'The server seems offline. You might want to refresh the page or set another server from the settings.',
		ServerSetNotWorking: "This server isn't compatible or not responding.",
		NotFound: 'Not Found',
		SupabaseNotFoundCantListen: "Supabase instance not found. Can't listen for generations."
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Delete',
		ApproveButton: 'Approve',
		NoGenerationsToReview: 'No generations to review.',
		ServersButton: 'Servers',
		GalleryButton: 'Gallery'
	}
};

export default en;
