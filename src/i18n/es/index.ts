import type { Translation } from '../i18n-types';

const es: Translation = {
	Language: 'Idioma',
	Home: {
		GenerateButton: 'Generar',
		PromptInput: {
			Placeholder: 'Retrato de un gato por Van Gogh'
		},
		WidthTabBar: {
			Title: 'Ancho',
			Paragraph: 'El ancho de la imagen.'
		},
		HeightTabBar: {
			Title: 'Alto',
			Paragraph: 'El alto de la imagen.'
		},
		InferenceStepsTabBar: {
			Title: 'Pasos de Inferencia',
			Paragraph: 'Cuántos pasos se tomarán para generar (difundir) la imagen.'
		},
		GuidanceScaleSlider: {
			Title: 'Escala de Orientación',
			Paragraph:
				'Cuán similar será la imagen a su indicación. Valores más altos hacen que la imagen se acerque más a su indicación.'
		},
		NegativePromptInput: {
			Title: 'Indicación Negativa',
			Placeholder: 'Indicación negativa',
			Paragraph:
				'Para remover cosas no deseadas de la imagen. Hace lo contrario de lo que hace la indicación.'
		},
		SeedInput: {
			Title: 'Semilla',
			Placeholder: 'Número de semilla',
			Paragraph:
				'Obtener resultados repetibles. Una semilla combinada con la misma indicación y opciones genera la misma imagen.'
		},
		ModelDropdown: {
			Title: 'Modelo',
			Paragraph: 'El modelo de IA que se utilizará para generar la imagen.'
		},
		SchedulerDropdown: {
			Title: 'Planificador',
			Paragraph:
				'Difunda la imagen de una cierta manera. Puede cambiar drásticamente la imagen generada. Algunos requieren menos pasos para producir buenos resultados.'
		},
		SubmitToGalleryQuestion: {
			Title: '¿Enviar generaciones a la galería?',
			Paragraph: 'Puede cambiar su preferencia desde la configuración más adelante.'
		}
	},
	History: {
		GenerationsTitle: 'Generaciones',
		GenerationsMaxSavedCountWarning: 'Últimas {count} solamente',
		NoGenerationsYet: 'No has generado ninguna imagen todavía.'
	},
	Live: {
		GenerationsTitle: 'Generaciones',
		TotalDurationTitle: 'Duración Total',
		UpscalesTitle: 'Mejoras',
		GenerationTooltip: {
			CountryTitle: 'País',
			Type: {
				Title: 'Tipo',
				Generation: 'Generación',
				Upscale: 'Mejora'
			},
			DimensionsTitle: 'Dimensiones',
			StepsTitle: 'Pasos',
			ScaleTitle: 'Escala',
			DurationTitle: 'Duración',
			Status: {
				Title: 'Estado',
				Started: 'Iniciado',
				Succeeded: 'Exitoso',
				Failed: 'Fallido'
			},
			Server: {
				Title: 'Servidor',
				Default: 'Predeterminado',
				Custom: 'Personalizado'
			},
			UnknownTitle: 'Desconocido',
			OutputsTitle: 'Outputs'
		},
		WaitingTitle: 'Esperando las generaciones',
		DurationStatusUnknown: 'Desconocido'
	},
	Navbar: {
		HomeTab: 'Inicio',
		HistoryTab: 'Historial',
		GalleryTab: 'Galería',
		LiveTab: 'En vivo'
	},
	Settings: {
		Title: 'Configuración',
		SwitchServerButton: 'Cambiar de Servidor',
		SubmitToGalleryToggle: 'Enviar a la Galería',
		AdvancedModeToggle: 'Modo Avanzado',
		AdvancedOptionsDropdown: 'Opciones Avanzadas',
		AdvancedDropdown: 'Avanzado',
		GenerationSettingsButton: 'Configuración de Generación',
		GenerationSettingsTitle: 'Configuración de Generación',
		DarkModeToggle: 'Modo Oscuro'
	},
	GenerationFullscreen: {
		DownloadButton: 'Descargar',
		DoneButtonState: '¡Hecho!',
		CopyPromptButton: 'Copiar Indicación',
		CopyNegativePromptButton: 'Copiar Indicación Negativa',
		CopiedButtonState: '¡Copiado!',
		GenerateSimilarButton: 'Generate Similar',
		RerollButton: 'Generar Aleatorio',
		RegenerateButton: 'Regenerar',
		GenerateButton: 'Generar',
		UpscaleButton: 'Mejorar',
		UpscaleTabBar: {
			UpscaledTitle: 'Mejorada',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Dimensiones'
		},
		Duration: {
			Title: 'Duración'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Establecer Servidor',
		SwitchServerTitle: 'Cambiar de Servidor',
		Paragraph: 'El servidor se utilizará para generar imágenes.',
		SetButton: 'Establecer',
		DefaultButton: 'Predeterminado'
	},
	Blog: {
		Title: 'Entradas del Blog',
		TitleAlt: 'Blog',
		BackToBlogButton: 'Volver al Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Redirigiendo a {name}'
	},
	Shared: {
		StartGeneratingTitle: '¡Comienza a generar hermosas imágenes!',
		StartGeneratingButton: 'Comenzar a Generar',
		JoinUsTitle: 'Únete a Nosotros',
		GoHomeButton: 'Ir a Inicio',
		SwitchToDefaultServerButton: 'Cambiar al Servidor Predeterminado',
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Join us on {name}',
		ShareButton: 'Compartir',
		ShareOnButton: 'Compartir en {name}',
		GoBackButton: 'Go Back',
		YesButton: 'Sí',
		NoButton: 'No',
		EnableButton: 'Habilitar',
		DisableButton: 'Deshabilitar',
		AddButton: 'Añadir',
		CopyLinkButton: 'Copiar Enlace',
		CopyButton: 'Copiar',
		DeleteButton: 'Eliminar',
		LoadingTitle: 'Loading',
		LoadingParagraph: 'Loading...',
		InsufficientCreditsTitle: 'Insufficient credits ({remainingCredits}/{neededCredits})',
		ConfirmButton: 'Confirm',
		ServerUrlInput: {
			Placeholder: 'URL del Servidor'
		},
		EmailInput: {
			Placeholder: 'Correo electrónico'
		},
		PasswordInput: {
			Placeholder: 'Contraseña'
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
				realName: 'Waifu Diffusion v1.4'
			},
			'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
				realName: '22h Diffusion v0.1'
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
		UnknownTitle: 'Desconocido',
		MoreOptionsTitle: 'Más Opciones',
		LessOptionsTitle: 'Menos Opciones',
		TryAgainButton: 'Try Again',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: 'Algo salió mal :(',
		ImageWasNSFW: 'This image was NSFW :(',
		NSFW: 'Contenido inapropiado detectado, intente con otra indicación :(',
		ServerSeemsOffline:
			'El servidor parece estar fuera de línea. Puede que desee refrescar la página o establecer otro servidor desde la configuración.',
		ServerSetNotWorking: 'Este servidor no es compatible o no responde.',
		NotFound: 'No Encontrado',
		SupabaseNotFoundCantListen:
			'Instancia de Supabase no encontrada. Las generaciones no serán rastreadas.',
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
		PageTitleConfirmAlt: 'Check Your Email',
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
		PageParagraph: "We're making some upgrades. We'll be back in a couple of hours."
	}
};
export default es;
