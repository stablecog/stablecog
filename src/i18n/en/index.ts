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
		GenerationsMaxSavedCountWarning: 'Last {count} only',
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
			UnknownTitle: 'Unknown',
			OutputsTitle: 'Outputs'
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
		GenerateSimilarButton: 'Generate Similar',
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
		RedirectingToTitle: 'Redirecting to {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Start generating beautiful images!',
		StartGeneratingButton: 'Start Generating',
		JoinUsTitle: 'Join Us',
		GoHomeButton: 'Go Home',
		SwitchToDefaultServerButton: 'Switch to Default Server',
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Join us on {name}',
		ShareButton: 'Share',
		ShareOnButton: 'Share on {name}',
		GoBackButton: 'Go Back',
		YesButton: 'Yes',
		NoButton: 'No',
		EnableButton: 'Enable',
		DisableButton: 'Disable',
		AddButton: 'Add',
		CopyLinkButton: 'Copy Link',
		CopyButton: 'Copy',
		DeleteButton: 'Delete',
		LoadingTitle: 'Loading',
		LoadingParagraph: 'Loading...',
		InsufficientCreditsTitle: 'Insufficient credits ({remainingCredits}/{neededCredits})',
		ConfirmButton: 'Confirm',
		ServerUrlInput: {
			Placeholder: 'Server URL'
		},
		EmailInput: {
			Placeholder: 'Email'
		},
		PasswordInput: {
			Placeholder: 'Password'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion'
			},
			'eaa438e1-dbf9-48fd-be71-206f0f257617': {
				realName: 'Redshift Diffusion'
			},
			'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': {
				realName: 'Waifu Diffusion'
			},
			'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
				realName: '22h Diffusion'
			},
			'b6c1372f-31a7-457c-907c-d292a6ffef97': {
				realName: 'Luna Diffusion'
			}
		},
		SchedulerOptions: {
			'55027f8b-f046-4e71-bc51-53d5448661e0': {
				realName: 'LMS'
			},
			'6fb13b76-9900-4fa4-abf8-8f843e034a7f': {
				realName: 'Euler'
			},
			'af2679a4-dbbb-4950-8c06-c3bb15416ef6': {
				realName: 'Euler A.'
			},
			'9d175114-9a26-4371-861c-729ba9ecb4da': {
				realName: 'DPM Multistep'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			}
		},
		UnknownTitle: 'Unknown',
		MoreOptionsTitle: 'More Options',
		LessOptionsTitle: 'Less Options',
		TryAgainButton: 'Try Again',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: 'Something went wrong :(',
		ImageWasNSFW: 'This image was NSFW :(',
		NSFW: 'NSFW content detected, try another prompt :(',
		ServerSeemsOffline:
			'The server seems offline. You might want to refresh the page or set another server from the settings.',
		ServerSetNotWorking: "This server isn't compatible or not responding.",
		NotFound: 'Not Found',
		SupabaseNotFoundCantListen: "Supabase instance not found. Can't listen for generations.",
		InvalidEmail: 'Enter a valid email.',
		PasswordTooShort: 'Password must be at least 8 characters.',
		SomethingWentWrongTryAgain: 'Something went wrong, try again.',
		InvalidCredentials: 'Invalid credentials.',
		InvalidCode: 'Invalid code.',
		OnceEvery60Seconds: 'You can only request a link once every 60 seconds.',
		LinkExpired: {
			Title: 'Link Expired',
			Paragraph: 'The link can only be used once and expires after 24 hours.'
		},
		UpdateAvailable: {
			Title: 'Update Available',
			Paragraph: 'There is an update! Refresh the page to get it.'
		},
		EmailProviderNotAllowed: "This email provider isn't allowed."
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Delete',
		ApproveButton: 'Approve',
		RejectButton: 'Reject',
		EditButton: 'Edit',
		EditViewButton: 'Edit View',
		NormalViewButton: 'Normal View',
		StopEditButton: 'Stop Editing',
		NoGenerationsToReview: 'No generations to review.',
		ServersButton: 'Servers',
		AdminGalleryButton: 'Gallery',
		UsersButton: 'Users',
		AdminTab: 'Admin',
		ServersTab: 'Servers',
		AdminGalleryTab: 'Gallery',
		UsersTab: 'Users',
		Gallery: {
			TotalTitle: 'Total',
			ApprovedTitle: 'Approved',
			DeletedTitle: 'Deleted',
			StatusDropdown: {
				All: 'All',
				Submitted: 'Submitted',
				Approved: 'Approved',
				Rejected: 'Rejected',
				Deleted: 'Deleted',
				Private: 'Private'
			},
			NoGenerationsToReview: 'No generations to review'
		}
	},
	SignUp: {
		PageTitle: 'Sign Up',
		PageParagraph: 'Join Stablecog to become a pro member and unlock its full potential.',
		PageTitleConfirm: 'Confirm',
		PageTitleConfirmAlt: 'Check your email',
		PageParagraphConfirm:
			"We've emailed you a 6-digit code. Enter it below to confirm your account.",
		SignUpButton: 'Sign Up',
		ConfirmButton: 'Confirm',
		AlreadyHaveAnAccountTitle: 'Already have an account?',
		LoginInsteadButton: 'Login instead',
		SixDigitCodeInput: {
			Placeholder: '6-Digit Code'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Get Started',
		GetStartedButton: 'Get Started',
		PageTitle: 'Sign In',
		PageParagraph: 'Start using Stablecog with all features that are available to your account.',
		PageTitleCreateAccountOrSignIn: 'Create an account or sign in',
		PageParagraphCreateAccountOrSignIn:
			'Start using Stablecog with all features that are available to your account.',
		PageTitleSentLink: 'Check your email',
		PageParagraphSentLink:
			"We've emailed you a sign-in link. If you don't see it, check your spam folder.",
		ContinueButton: 'Continue',
		ContinueWithProviderButton: 'Continue with {provider}',
		SignInWithProviderButton: 'Sign in with {provider}',
		OrContinueWithEmailTitle: 'Or continue with email',
		DontHaveAnAccountTitle: "Don't have an account?",
		SignUpInsteadButton: 'Sign up instead',
		SignInButton: 'Sign In',
		SignOutButton: 'Sign Out'
	},
	Pro: {
		PageTitle: 'Become a Pro',
		PageParagraph:
			"Unlock all features of Stablecog and support the project. Without the pro members, Stablecog wouldn't be able to stay completely open-source and offer free generations to everyone.",
		PageTitleAlreadyPro: 'Already a Pro!',
		PageParagraphAlreadyPro:
			'You are already a pro member. Thank you for supporting the project! Go ahead and enjoy Stablecog, and consider sharing it with your friends.',
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Full speed without set limits',
			ImageDimensions: 'Different image dimensions',
			Upscale: 'Upscale images',
			Steps: 'Different inference steps',
			MoreModels: 'More models',
			MoreSchedulers: 'More schedulers',
			SavedToCloud: 'Generations saved to the cloud',
			Upcoming: 'Upcoming features',
			CommercialUse: 'Commercial Use'
		},
		Soon: '(soon)',
		Month: '/month',
		BecomeProButton: 'Become a Pro',
		Success: {
			PageTitle: "You're a Pro!",
			PageParagraph:
				'You now have access to everything Stablecog has to offer. If you have any questions, reach out to us on {platform}.'
		},
		Cancel: {
			PageTitle: "You've cancelled",
			PageParagraph:
				"You've cancelled the subscription process. If it was a mistake, you can try again."
		},
		Reason: {
			ParagraphWidth: "That image width isn't available on the free plan.",
			ParagraphHeight: "That image height isn't available on the free plan.",
			ParagraphDimensions: "Those image dimensions aren't available on the free plan.",
			ParagraphUpscale: "Upscale feature isn't available on the free plan.",
			ParagraphInferenceSteps: "That inference steps setting isn't available on the free plan.",
			ParagraphModel: "That AI model isn't available on the free plan.",
			ParagraphScheduler: "That scheduler isn't available on the free plan.",
			ParagraphWidthGeneration:
				"That generation was created using an image width that isn't available on the free plan.",
			ParagraphHeightGeneration:
				"That generation was created using an image height that isn't available on the free plan.",
			ParagraphDimensionsGeneration:
				"That generation was created using image dimensions that aren't available on the free plan.",
			ParagraphInferenceStepsGeneration:
				"That generation was created using an inference steps setting that isn't available on the free plan.",
			ParagraphModelGeneration:
				"That generation was created using an AI model that isn't available on the free plan.",
			ParagraphSchedulerGeneration:
				"That generation was created using a scheduler that isn't available on the free plan."
		},
		Tier: {
			Title: {
				Free: 'Free',
				Pro: 'Pro'
			},
			Badge: {
				Free: 'FREE',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Account',
		ManageSubscriptionButton: 'Manage Subscription',
		ComparePlansButton: 'Compare Plans',
		ManageAccountButton: 'Manage Account',
		MyAccountButton: 'My Account',
		SubscriptionPlanTitle: 'Plan',
		RemainingImagesTitle: 'Remaining Images',
		RemainingCreditsTitle: 'Remaining Credits',
		RemainingTitle: 'Remaining',
		Subscription: {
			UpdateSubscriptionTitle: 'Update Subscription',
			ChangePlanTitle: 'Change Plan',
			CurrentPlanTitle: 'Current Plan',
			NewPlanTitle: 'New plan',
			Downgrade: {
				DowngradingToTitle: 'Downgrading to',
				Explanation: 'Your existing credits will remain.'
			},
			Upgrade: {
				UpgadingToTitle: 'Upgrading to',
				Explanation: 'Your existing credits will remain.'
			},
			Failed: {
				PageTitle: 'Failed to update',
				PageParagraph: 'Something went wrong while changing your plan. Please try again.'
			},
			Succeeded: {
				PageTitle: 'Changed plan',
				PageParagraph: 'Your plan has been changed successfully.'
			}
		}
	},
	ForgotPassword: {
		PageTitle: 'Reset Password',
		PageParagraph: 'We will send a 6-digit code to your email for resetting your password.',
		SendResetCodeButton: 'Send Code',
		PageTitleConfirmCode: 'Confirm',
		PageTitleConfirmCodeAlt: 'Check Your Email',
		PageParagraphConfirmCode: "We've emailed you a 6-digit code. Enter it below to continue.",
		ConfirmCodeButton: 'Confirm',
		PageTitleNewPassword: 'New Password',
		PageParagraphNewPassword: 'Enter a new password for your account.',
		NewPasswordInput: {
			Placeholder: 'New Password'
		},
		SetNewPasswordButton: 'Set New Password',
		PageTitleSuccess: 'Done!',
		PageParagraphSuccess: 'Your password has been successfully reset.',
		ForgotPasswordButton: 'Forgot Password?'
	},
	FeaturedOn: {
		PageTitle: 'We Are Featured On'
	},
	Gallery: {
		PageTitle: 'Gallery',
		PageParagraph: 'Check out what others have created with Stablecog.',
		SearchInput: {
			Title: 'Search'
		},
		SearchingTitle: 'Searching',
		NoMatchingGenerationTitle: 'No matching generation'
	},
	Pricing: {
		PlansTitle: 'Plans',
		PlansParagraph: 'Choose a plan that works for you.',
		CreditPacksTitle: 'Credit Packs',
		CreditPacksParagraph: 'Need more? You can purchase additional credits anytime.',
		SubscribeButton: 'Subscribe',
		SubscribedButton: 'Subscribed',
		UpgradeButton: 'Upgrade',
		DowngradeButton: 'Downgrade',
		PurchaseButton: 'Purchase',
		BuyCreditsButton: 'Buy Credits',
		MonthlyTitle: 'Monthly',
		YearlyTitle: 'Yearly',
		SlashMonth: '/month',
		Plans: {
			FreeTitle: 'Free',
			StarterTitle: 'Starter',
			ProTitle: 'Pro',
			UltimateTitle: 'Ultimate'
		},
		CreditPacks: {
			MediumTitle: 'Medium Pack',
			LargeTitle: 'Large Pack'
		},
		Features: {
			MonthlyImages: '{count} images per month.',
			MonthlyGenerations: '{count} generations per month.',
			Images: '{count} images.',
			Generations: '{count} generations.',
			NeverExpires: 'Never expires.',
			CommercialUse: 'Commercial use.',
			ImagesArePublic: 'Images are public.',
			ImagesArePrivate: 'Images are private.'
		},
		Badges: {
			Recommended: 'Recommended',
			MostPopular: 'Most Popular',
			BestValue: 'Best Value'
		},
		Purchase: {
			Succeeded: {
				PageTitle: "You're all set!",
				PageParagraph:
					'Thank you for your purchase. If you have any questions, feel free to reach out to us on {platform}.'
			},
			Cancelled: {
				PageTitle: 'Purchase Cancelled',
				PageParagraph:
					'You have cancelled the purchase process. If it was a mistake, you can try again.'
			}
		}
	},
	LowOnCreditsCard: {
		Title: "You're low on credits ({remainingCredits})",
		FreeParagraph:
			'We give all active users free credits daily. You can get more by subscribing to a plan or by participating in our events.',
		HighestPlanParagraph: 'You can buy a credit pack.',
		OtherPlansParagraph: 'You can upgrade to a higher plan or buy a credit pack.'
	},
	UnderDevelopment: {
		PageTitle: "We'll be back soon!",
		PageParagraph: "We're upgrading our systems. We'll be back in a couple of hours."
	}
};

export default en;
