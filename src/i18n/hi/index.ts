import type { Translation } from '../i18n-types';

const hi: Translation = {
	Language: 'भाषा',
	Home: {
		GenerateButton: 'बनाए',
		PromptInput: {
			Placeholder: 'वैन गो द्वारा एक बिल्ली का चित्र'
		},
		WidthTabBar: {
			Title: 'चौड़ाई',
			Paragraph: 'चित्र की चौड़ाई।'
		},
		HeightTabBar: {
			Title: 'ऊंचाई',
			Paragraph: 'चित्र की ऊँचाई।'
		},
		InferenceStepsTabBar: {
			Title: 'अनुमानित कदम',
			Paragraph: 'चित्र को बनाने (बिखराव) करने के लिए कितने कदम लगेंगे।'
		},
		GuidanceScaleSlider: {
			Title: 'मार्गदर्शन पैमाना',
			Paragraph:
				'चित्र आपके संकेत से कितना मिलता-जुलता होगा। उच्च मान चित्र को आपके संकेत के करीब बनाता हैं।'
		},
		AspectRatioDropdown: {
			Title: 'Aspect Ratio',
			Paragraph: 'Aspect ratio of the image.',
			Options: {
				Square: 'Square (1:1)',
				Portrait: 'Portrait (2:3)',
				Landscape: 'Landscape (3:2)',
				Mobile: 'Mobile (9:16)',
				Desktop: 'Desktop (16:9)',
				Squarish: 'Squarish (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: 'Aspect Ratio',
			Paragraph: 'Aspect ratio of the image.'
		},
		InitialImageTabBar: {
			Title: 'Initial Image',
			Paragraph: 'The generation will be created based on this image.'
		},
		InitialImageStrengthTabBar: {
			Title: 'Initial Image Strength',
			Paragraph:
				'Controls the influence of the initial image. The bigger the value, the more influence the initial image has.'
		},
		NegativePromptInput: {
			Title: 'नकारात्मक संकेत',
			Placeholder: 'नकारात्मक संकेत',
			PlaceholderAlt: 'Enter things to avoid',
			Paragraph: 'चित्र से अनचहित चीजों को हटाने के लिए। यह संकेत के विपरीत करता है।'
		},
		ImageInput: { Title: 'Upload Image' },
		SeedInput: {
			Title: 'सीड',
			Placeholder: 'सीड संख्या',
			Paragraph:
				'दोहराने योग्य परिणाम प्राप्त करें। एक ही संकेत विकल्पों के साथ संयुक्त एक सीड एक ही छवि उत्पन्न करता है।'
		},
		ModelDropdown: {
			Title: 'मॉडल',
			Paragraph: 'चित्र उत्पन्न करने के लिए उपयोग किया जाने वाला AI मॉडल।'
		},
		NumOutputsSlider: {
			Title: 'Number of Images',
			Paragraph: 'The number of images that will be generated.'
		},
		SchedulerDropdown: {
			Title: 'अनुसूचक',
			Paragraph:
				'चित्र को एक निश्चित तरीके से डिफ्यूज करें। यह उत्पन्न चित्र को काफी हद तक बदल सकता है। कुछ को अच्छे परिणाम देने के लिए कम चरणों की आवश्यकता होती है।'
		},
		SubmitToGalleryQuestion: {
			Title: 'बनावट को गैलरी में दर्ज करे?',
			Paragraph: 'आप बाद में सेटिंग्स से अपनी प्राथमिकताएं बदल सकते हैं।'
		}
	},
	History: {
		GenerationsTitle: 'बनावटे',
		GenerationsMaxSavedCountWarning: 'आखरी {count} ही',
		DownloadLegacyGenerationsButton: 'Download Legacy Generations',
		NoFavoritesYet: "You don't have any favorites yet.",
		Views: {
			AllTitle: 'All',
			FavoritesTitle: 'Favorites'
		},
		NoGenerationsYet: 'आपने अभी तक कोई चित्र नहीं बनाया है।'
	},
	Live: {
		GenerationsTitle: 'बनावटे',
		TotalDurationTitle: 'कुल अवधि',
		UpscalesTitle: 'निखार',
		GenerationTooltip: {
			AspectRatioTitle: 'Aspect Ratio',
			CountryTitle: 'देश',
			Type: {
				Title: 'प्रकार',
				Generation: 'बनावत',
				Upscale: 'निखार'
			},
			DimensionsTitle: 'माप',
			StepsTitle: 'कदम',
			ScaleTitle: 'पैमाना',
			DurationTitle: 'अवधि',
			Status: {
				Title: 'स्थिति',
				Started: 'शुरू हो गया',
				Succeeded: 'सफल हो गया',
				Failed: 'असफल हो गया'
			},
			Server: {
				Title: 'सर्वर',
				Default: 'डिफ़ॉल्ट',
				Custom: 'कस्टम'
			},
			UnknownTitle: 'अनजान',
			OutputsTitle: 'Outputs'
		},
		WaitingTitle: 'बनावटो का इंतजार किया जा रहा है',
		DurationStatusUnknown: 'अनजान'
	},
	Navbar: {
		HomeTab: 'होम',
		HistoryTab: 'इतिहास',
		GalleryTab: 'गैलरी',
		LiveTab: 'लाइव'
	},
	Settings: {
		Title: 'सेटिंग्स',
		SwitchServerButton: 'सर्वर बदले',
		SubmitToGalleryToggle: 'गैलरी में दर्ज करें',
		AdvancedModeToggle: 'एडवांस सेटिंग',
		AdvancedOptionsDropdown: 'उन्नत विकल्प',
		AdvancedDropdown: 'उन्नत',
		GenerationSettingsButton: 'बनावट सेटिंग्स',
		GenerationSettingsTitle: 'बनावट सेटिंग्स',
		DarkModeToggle: 'डार्क मोड'
	},
	GenerationFullscreen: {
		DownloadButton: 'डाउनलोड',
		DoneButtonState: 'हो गया!',
		CopyPromptButton: 'संकेत कॉपी करें',
		CopyNegativePromptButton: 'नकारात्मक संकेत कॉपी करें',
		CopiedButtonState: 'कॉपी हो गया!',
		GenerateSimilarButton: 'Generate Similar',
		RerollButton: 'नया बनाए',
		RegenerateButton: 'दोबारा बनाए',
		GenerateButton: 'बनाए',
		UpscaleButton: 'निखारे',
		SubmitToGalleryButton: 'Submit to Gallery',
		SubmittedTitle: 'Submitted',
		UpscaleTabBar: {
			UpscaledTitle: 'निखरित',
			OriginalTitle: 'असल'
		},
		Dimensions: {
			Title: 'माप'
		},
		Duration: {
			Title: 'अवधि'
		}
	},
	SetServerModal: {
		SetServerTitle: 'सर्वर चुने',
		SwitchServerTitle: 'सर्वर बदले',
		Paragraph: 'चित्रों को बनाने के लिए सर्वर का इस्तेमाल किया जाएगा।',
		SetButton: 'चुने',
		DefaultButton: 'डिफॉल्ट'
	},
	Blog: {
		Title: 'ब्लॉग पोस्ट',
		TitleAlt: 'ब्लॉग',
		BackToBlogButton: 'ब्लॉग पर वापिस'
	},
	Redirect: {
		RedirectingToTitle: '{name} पर लेजाया जा रहा है'
	},
	Shared: {
		StartGeneratingTitle: 'सुंदर चित्र बनने शुरू हो गए है!',
		StartGeneratingButton: 'बनाना शुरु करे',
		JoinUsTitle: 'हमसे जुड़े',
		GoHomeButton: 'होम जाए',
		SwitchToDefaultServerButton: 'डिफॉल्ट सर्वर पर वापसी करे',
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Join us on {name}',
		ShareButton: 'शेयर',
		ShareOnButton: '{name} पर शेयर करे',
		GoBackButton: 'Go Back',
		YesButton: 'हां',
		NoButton: 'नही',
		EnableButton: 'चालू करे',
		ClearAllButton: 'Clear All',
		DisableButton: 'बंद करे',
		AddButton: 'जोड़े',
		CopyLinkButton: 'लिंक कॉपी करे',
		CopyButton: 'कॉपी',
		DeleteButton: 'हटाए',
		LoadingTitle: 'लोड हो रहा है',
		ContinueButton: 'Continue',
		LoadingParagraph: 'लोड हो रहा है...',
		InsufficientCreditsTitle: 'Insufficient credits ({remainingCredits}/{neededCredits})',
		AllTitle: 'All',
		ConfirmButton: 'Confirm',
		ConfirmQuestionMarkButton: 'Confirm?',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Credit Type',
				RemainingCreditsTitle: 'Remaining',
				ExpiryTitle: 'Expiry',
				LastReplenish: 'Last Replenish'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Pause Editing',
			DeselectButton: 'Deselect ({selectedCount})',
			DeleteButton: 'Delete ({selectedCount})',
			FavoriteButton: 'Favorite ({selectedCount})',
			ApproveButton: 'Approve ({selectedCount})',
			RejectButton: 'Reject ({selectedCount})',
			UnfavoriteButton: 'Unfavorite ({selectedCount})',
			ConfirmationModal: {
				CancelButton: 'Cancel',
				Deselect: {
					Title: 'Deselect {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to deselect {selectedCount} item(s)?',
					ConfirmButton: 'Deselect'
				},
				Delete: {
					Title: 'Delete {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to delete {selectedCount} item(s)?',
					ConfirmButton: 'Delete'
				},
				Favorite: {
					Title: 'Favorite {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to favorite {selectedCount} item(s)?',
					ConfirmButton: 'Favorite'
				},
				Unfavorite: {
					Title: 'Unfavorite {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to unfavorite {selectedCount} item(s)?',
					ConfirmButton: 'Unfavorite'
				}
			}
		},
		ServerUrlInput: {
			Placeholder: 'सर्वर URL'
		},
		EmailInput: {
			Placeholder: 'ईमेल'
		},
		PasswordInput: {
			Placeholder: 'पासवर्ड'
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
			},
			'22b0857d-7edc-4d00-9cd9-45aa509db093': {
				realName: 'Kandinsky'
			}
		},
		SchedulerOptions: {
			'55027f8b-f046-4e71-bc51-53d5448661e0': {
				realName: 'LMS '
			},
			'6fb13b76-9900-4fa4-abf8-8f843e034a7f': {
				realName: 'यूलर'
			},
			'af2679a4-dbbb-4950-8c06-c3bb15416ef6': {
				realName: 'युलर ए.'
			},
			'9d175114-9a26-4371-861c-729ba9ecb4da': {
				realName: 'DPM Multistep'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			},
			'82cf78dd-6afb-48cc-aca6-14224cca6950': {
				realName: 'DDIM'
			},
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		UnknownTitle: 'अनजान',
		AdvancedSettingsButton: 'Advanced Settings',
		MoreOptionsTitle: 'अधिक विकल्प',
		LessOptionsTitle: 'कम विकल्प',
		TryAgainButton: 'Try Again',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: 'कुछ गलत हो गया :(',
		ImageWasNSFW: 'This image was NSFW :(',
		NSFW: 'अश्लील सामग्री पता चला, कोई और संकेत का प्रयास करें :(',
		ServerSeemsOffline:
			'सर्वर ऑफ़लाइन लगता है। हो सकता है कि आप पेज को रीफ्रेश करना चाहें या सेटिंग से कोई अन्य सर्वर सेट करना चाहें।',
		ServerSetNotWorking: 'यह सर्वर अनुकूल नहीं है या काम नहीं कर रहा है।',
		NotFound: 'नही मिला',
		SupabaseNotFoundCantListen: 'सुपरबेस उदाहरण नहीं मिला। बनावट नहीं हो सकती।',
		InvalidEmail: 'Enter a valid email.',
		PasswordTooShort: 'Password must be at least 8 characters.',
		SomethingWentWrongTryAgain: 'Something went wrong, try again.',
		InvalidCredentials: 'Invalid credentials.',
		InvalidCode: 'Invalid code.',
		TryAnotherImage: 'Try another image :(',
		OnceEvery60Seconds: 'You can only request a link once every 60 seconds.',
		LinkExpired: {
			Title: 'Link Expired',
			Paragraph: 'The link can only be used once and expires after 24 hours.'
		},
		UpdateAvailable: {
			Title: 'Update Available',
			Paragraph: 'There is an update! Refresh the page to get it.'
		},
		EmailProviderNotAllowed: "This email provider isn't allowed.",
		EmailAlreadyInUse: 'This email is already in use.'
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
		Users: {
			GiftCreditsButton: 'Gift Credits'
		},
		Gallery: {
			TotalTitle: 'Total',
			ApprovedTitle: 'Approved',
			DeletedTitle: 'Deleted',
			StatusDropdown: {
				All: 'All',
				ManuallySubmitted: 'Manually Submitted',
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
		PageParagraph: 'Join Synthica to become a pro member and unlock its full potential.',
		PageTitleConfirm: 'Confirm',
		PageTitleConfirmAlt: 'Check Your Email',
		PageParagraphConfirm:
			"We've emailed you a 6-digit code. Enter it below to confirm your account.",
		SignUpButton: 'Sign Up',
		AllTitle: 'All',
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
		PageParagraph: 'Start using Synthica with all features that are available to your account.',
		PageParagraphV2: 'Start creating amazing art in seconds for free, no credit card required.',
		PageTitleCreateAccountOrSignIn: 'Create an account or sign in',
		PageParagraphCreateAccountOrSignIn:
			'Start using Synthica with all features that are available to your account.',
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
			"Unlock all features of Synthica and support the project. Without the pro members, Synthica wouldn't be able to stay completely open-source and offer free generations to everyone.",
		PageTitleAlreadyPro: 'Already a Pro!',
		PageParagraphAlreadyPro:
			'You are already a pro member. Thank you for supporting the project! Go ahead and enjoy Synthica, and consider sharing it with your friends.',
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
				'You now have access to everything Synthica has to offer. If you have any questions, reach out to us on {platform}.'
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
		},
		Meta: {
			AccountCreationTitle: 'Creation',
			LastSignInTitle: 'Last Sign-in',
			LastSeenTitle: 'Last Seen'
		},
		ChangeEmail: {
			PageTitle: 'Change Email',
			PageParagraph: 'Enter a new email address for your account.',
			ChangeEmailButton: 'Change Email',
			NewEmailInput: {
				Placeholder: 'New Email'
			},
			PageTitleSentLink: 'Check your email',
			PageParagraphSentLink:
				"We've sent links to both addresses. Confirm both to change your account's email address.",
			PageTitleConfirmOtherEmail: 'Confirm Other Email',
			PageParagraphConfirmOtherEmail:
				"We've also sent a link to your other email address. Confirm that one as well to complete the process."
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
		PageParagraph: 'Check out what others have created with Synthica.',
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
			LargeTitle: 'Large Pack',
			MegaTitle: 'Mega Pack'
		},
		Features: {
			MonthlyCredits: '{count} credits per month.',
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
	Support: {
		PageTitle: 'Support',
		PageParagraph:
			"If you have any questions, please reach out to us using the links below and we'll answer them as soon as possible."
	},
	Legal: {
		TermsOfServiceTitle: 'Terms of Service',
		PrivacyPolicyTitle: 'Privacy Policy',
		RefundPolicyTitle: 'Refund Policy',
		ContentPolicyTitle: 'Content Policy'
	},
	UnderDevelopment: {
		PageTitle: "We'll be back soon!",
		PageParagraph: "We're upgrading our systems. We'll be back in a couple of hours."
	}
};
export default hi;
