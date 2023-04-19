import type { Translation } from '../i18n-types';

const fr: Translation = {
	Language: 'Langue',
	Home: {
		GenerateButton: 'Générer',
		PromptInput: {
			Placeholder: "Portrait d'un chat par Van Gogh"
		},
		WidthTabBar: {
			Title: 'Largeur',
			Paragraph: "La largeur de l'image."
		},
		HeightTabBar: {
			Title: 'Hauteur',
			Paragraph: "La hauteur de l'image."
		},
		InferenceStepsTabBar: {
			Title: "Nombre d'itérations",
			Paragraph: "Le nombre d'itérations utilisé pour générer (diffuser) l'image."
		},
		GuidanceScaleSlider: {
			Title: 'Degré de supervision',
			Paragraph:
				"A quel point l'image doit respecter la description textuelle. Une valeur plus élevée donnera une image plus proche de la description."
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
			Title: 'Description négative',
			Placeholder: 'Description négative',
			PlaceholderAlt: 'Enter things to avoid',
			Paragraph:
				"Supprime ce que vous ne voulez pas voir dans l'image. L'opposé de la description textuelle."
		},
		ImageInput: { Title: 'Upload Image' },
		SeedInput: {
			Title: 'Graine aléatoire (seed)',
			Placeholder: 'Graine aléatoire',
			Paragraph:
				"Permet d'obtenir des résultats reproductibles. Une même graine avec la même description textuelle et les mêmes options génèrent la même image."
		},
		ModelDropdown: {
			Title: 'Modèle',
			Paragraph: "Le modèle IA qui sera utilisé pour générer l'image."
		},
		NumOutputsSlider: {
			Title: 'Number of Images',
			Paragraph: 'The number of images that will be generated.'
		},
		SchedulerDropdown: {
			Title: 'Programmateur',
			Paragraph:
				"Choisit une manière particulière de générer (diffuser) l'image. Cela peut changer radicalement l'image générée. Certaines nécessitent moins d'étapes pour produire de bons résultats."
		},
		SubmitToGalleryQuestion: {
			Title: 'Soumettre les images générées à la galerie ?',
			Paragraph: 'Vous pourrez modifier vos préférences dans les paramètres.'
		}
	},
	History: {
		GenerationsTitle: 'Images générées',
		GenerationsMaxSavedCountWarning: '{count} dernières uniquement',
		DownloadLegacyGenerationsButton: 'Download Legacy Generations',
		NoFavoritesYet: "You don't have any favorites yet.",
		Views: {
			AllTitle: 'All',
			FavoritesTitle: 'Favorites'
		},
		NoGenerationsYet: "Vous n'avez encore généré aucune image."
	},
	Live: {
		GenerationsTitle: 'Images générées',
		TotalDurationTitle: 'Durée totale',
		UpscalesTitle: 'Images upscalées',
		GenerationTooltip: {
			AspectRatioTitle: 'Aspect Ratio',
			CountryTitle: 'Pays',
			Type: {
				Title: 'Type',
				Generation: 'Image générée',
				Upscale: 'Image upscalée'
			},
			DimensionsTitle: 'Dimensions',
			StepsTitle: 'Itérations',
			ScaleTitle: 'Degré',
			DurationTitle: 'Durée',
			Status: {
				Title: 'Statut',
				Started: 'Démarré',
				Succeeded: 'Succès',
				Failed: 'Échec'
			},
			Server: {
				Title: 'Serveur',
				Default: 'Défaut',
				Custom: 'Personnalisé'
			},
			UnknownTitle: 'Inconnu',
			OutputsTitle: 'Outputs'
		},
		WaitingTitle: "En attente de génération d'images",
		DurationStatusUnknown: 'Inconnu'
	},
	Navbar: {
		HomeTab: 'Accueil',
		HistoryTab: 'Historique',
		GalleryTab: 'Galerie',
		LiveTab: 'Live'
	},
	Settings: {
		Title: 'Paramètres',
		SwitchServerButton: 'Changer de serveur',
		SubmitToGalleryToggle: 'Soumettre à la galerie',
		AdvancedModeToggle: 'Mode avancé',
		AdvancedOptionsDropdown: 'Options avancées',
		AdvancedDropdown: 'Avancé',
		GenerationSettingsButton: 'Paramètres de génération',
		GenerationSettingsTitle: 'Paramètres de génération',
		DarkModeToggle: 'Mode sombre'
	},
	GenerationFullscreen: {
		DownloadButton: 'Télécharger',
		DoneButtonState: 'Terminé !',
		CopyPromptButton: 'Copier la description',
		CopyNegativePromptButton: 'Copier la description négative',
		CopiedButtonState: 'Copié !',
		GenerateSimilarButton: 'Generate Similar',
		RerollButton: 'Relancer',
		RegenerateButton: 'Regénérer',
		GenerateButton: 'Générer',
		UpscaleButton: 'Upscaler',
		SubmitToGalleryButton: 'Submit to Gallery',
		SubmittedTitle: 'Submitted',
		UpscaleTabBar: {
			UpscaledTitle: 'Upscalé',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Dimensions'
		},
		Duration: {
			Title: 'Durée'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Définir le serveur',
		SwitchServerTitle: 'Changer de serveur',
		Paragraph: 'Le serveur sera utilisé pour générer des images.',
		SetButton: 'Définir',
		DefaultButton: 'Défaut'
	},
	Redirect: {
		RedirectingToTitle: 'Redirection vers {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Commencez à générer de superbes images !',
		StartGeneratingButton: 'Commencer à générer',
		JoinUsTitle: 'Rejoignez-nous',
		GoHomeButton: "Retour à l'accueil",
		SwitchToDefaultServerButton: 'Basculer vers le serveur par défaut',
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Rejoignez-nous sur {name}',
		ShareButton: 'Partager',
		ShareOnButton: 'Partager sur {name}',
		GoBackButton: 'Go Back',
		YesButton: 'Oui',
		NoButton: 'Non',
		EnableButton: 'Activer',
		ClearAllButton: 'Clear All',
		DisableButton: 'Désactiver',
		AddButton: 'Ajouter',
		CopyLinkButton: 'Copier le lien',
		CopyButton: 'Copier',
		DeleteButton: 'Supprimer',
		LoadingTitle: 'Chargement en cours',
		ContinueButton: 'Continue',
		LoadingParagraph: 'Chargement en cours...',
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
			Placeholder: 'URL du serveur'
		},
		EmailInput: {
			Placeholder: 'Email'
		},
		PasswordInput: {
			Placeholder: 'Mot de passe'
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
			},
			'82cf78dd-6afb-48cc-aca6-14224cca6950': {
				realName: 'DDIM'
			},
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		UnknownTitle: 'Inconnu',
		AdvancedSettingsButton: 'Advanced Settings',
		MoreOptionsTitle: "Plus D'Options",
		LessOptionsTitle: "Moins D'Options",
		TryAgainButton: 'Réessayer',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: "Une erreur s'est produite :(",
		ImageWasNSFW: 'This image was NSFW :(',
		NSFW: 'Contenu NSFW détecté, essayez une autre requête :(',
		ServerSeemsOffline:
			'Le serveur semble hors ligne. Vous pouvez rafraîchir la page ou définir un autre serveur à partir des paramètres.',
		ServerSetNotWorking: "Ce serveur n'est pas compatible ou ne répond pas.",
		NotFound: 'Introuvable',
		SupabaseNotFoundCantListen:
			"Instance Supabase introuvable. Impossible d'écouter le flux d'images générées.",
		InvalidEmail: 'Veuillez saisir un email valide.',
		PasswordTooShort: 'Le mot de passe doit comporter au moins 8 caractères.',
		SomethingWentWrongTryAgain: "Une erreur s'est produite, veuillez réessayer.",
		InvalidCredentials: 'Identifiants incorrects.',
		InvalidCode: 'Code non valide.',
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
		AdminPanelTitle: 'Administration',
		DeleteButton: 'Supprimer',
		ApproveButton: 'Approuver',
		RejectButton: 'Reject',
		EditButton: 'Edit',
		EditViewButton: 'Edit View',
		NormalViewButton: 'Normal View',
		StopEditButton: 'Stop Editing',
		NoGenerationsToReview: 'Aucune image à approuver.',
		ServersButton: 'Serveurs',
		AdminGalleryButton: 'Galerie',
		UsersButton: 'Utilisateurs',
		AdminTab: 'Administration',
		ServersTab: 'Serveurs',
		AdminGalleryTab: 'Galerie',
		UsersTab: 'Utilisateurs',
		Users: {
			GiftCreditsButton: 'Gift Credits'
		},
		Gallery: {
			TotalTitle: 'Total',
			ApprovedTitle: 'Approuvé',
			DeletedTitle: 'Supprimé',
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
		PageTitle: 'Créer un compte',
		PageParagraph:
			'Inscrivez-vous et devenez membre pro de Synthica pour libérer son plein potentiel.',
		PageTitleConfirm: 'Confirmer',
		PageTitleConfirmAlt: 'Vérifiez vos emails',
		PageParagraphConfirm:
			'Nous vous avons envoyé un code à 6 chiffres. Saisissez-le ci-dessous pour confirmer votre compte.',
		SignUpButton: 'Créer un compte',
		AllTitle: 'All',
		ConfirmButton: 'Confirmer',
		AlreadyHaveAnAccountTitle: 'Vous avez déjà un compte ?',
		LoginInsteadButton: 'Se connecter',
		SixDigitCodeInput: {
			Placeholder: 'Code à 6 chiffres'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Get Started',
		GetStartedButton: 'Get Started',
		PageTitle: 'Se connecter',
		PageParagraph:
			'Commencez à utiliser Synthica avec toutes les fonctionnalités disponibles sur votre compte.',
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
		DontHaveAnAccountTitle: "Vous n'avez pas de compte ?",
		SignUpInsteadButton: 'Créer un compte',
		SignInButton: 'Se connecter',
		SignOutButton: 'Se déconnecter'
	},
	Pro: {
		PageTitle: 'Devenez un Pro',
		PageParagraph:
			'Débloquez toutes les fonctionnalités de Synthica et soutenez le projet. Grâce aux membres pro, Synthica peut rester complètement open-source et générer des images gratuitement et pour tous.',
		PageTitleAlreadyPro: 'Vous êtes déjà Pro !',
		PageParagraphAlreadyPro:
			'Vous êtes déjà un membre pro. Merci de soutenir le projet ! Profitez bien de Synthica, et parlez-en autour de vous.',
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Pleine vitesse sans limite',
			ImageDimensions: "Plus de tailles d'image",
			Upscale: 'Accès à la fonction Upscale',
			Steps: "Plus d'itérations",
			MoreModels: 'Plus de modèles',
			MoreSchedulers: 'Plus de planificateurs',
			SavedToCloud: 'Enregistrement des images générées sur le cloud',
			Upcoming: 'Fonctionnalités à venir',
			CommercialUse: 'Utilisation commerciale'
		},
		Soon: '(bientôt)',
		Month: '/mois',
		BecomeProButton: 'Devenez un Pro',
		Success: {
			PageTitle: 'Vous êtes un Pro !',
			PageParagraph:
				'Vous avez maintenant accès à tout ce que Synthica a à offrir. Si vous avez des questions, contactez-nous sur {platform}.'
		},
		Cancel: {
			PageTitle: 'Vous avez annulé',
			PageParagraph:
				"Vous avez annulé le processus d'abonnement. Si c'était une erreur, vous pouvez réessayer."
		},
		Reason: {
			ParagraphWidth: "Cette largeur d'image est réservée aux membres pro.",
			ParagraphHeight: "Cette hauteur d'image est réservée aux membres pro.",
			ParagraphDimensions:
				"Cette taille d'image (hauteur et largeur) est réservée aux membres pro.",
			ParagraphUpscale: 'La fonction Upscale est réservée aux membres pro.',
			ParagraphInferenceSteps: "Ce réglage du nombre d'itérations est réservé aux membres pro.",
			ParagraphModel: 'Ce modèle IA est réservé aux membres pro.',
			ParagraphScheduler: 'Ce planificateur est réservé aux membres pro.',
			ParagraphWidthGeneration:
				'Cette image a été générée avec une taille (largeur) réservée aux membres pro.',
			ParagraphHeightGeneration:
				'Cette image a été générée avec une taille (hauteur) réservée aux membres pro.',
			ParagraphDimensionsGeneration:
				'Cette image a été générée avec une taille (hauteur et largeur) réservée aux membres pro.',
			ParagraphInferenceStepsGeneration:
				"Cette image a été générée avec un paramètre de nombre d'itérations réservé aux membres pro.",
			ParagraphModelGeneration:
				'Cette image a été générée avec un modèle IA réservé aux membres pro.',
			ParagraphSchedulerGeneration:
				'Cette image a été générée avec un planificateur réservé aux membres pro.'
		},
		Tier: {
			Title: {
				Free: 'Gratuit',
				Pro: 'Pro'
			},
			Badge: {
				Free: 'GRATUIT',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Compte',
		ManageSubscriptionButton: 'Gérer votre abonnement',
		ComparePlansButton: 'Compare Plans',
		ManageAccountButton: 'Gérer votre compte',
		MyAccountButton: 'Mon compte',
		SubscriptionPlanTitle: 'Abonnement',
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
		PageTitle: 'Réinitialiser le mot de passe',
		PageParagraph:
			'Nous allons vous envoyer un code à 6 chiffres par email pour réinitialiser votre mot de passe.',
		SendResetCodeButton: 'Envoyer le code',
		PageTitleConfirmCode: 'Confirmer',
		PageTitleConfirmCodeAlt: 'Vérifiez vos emails',
		PageParagraphConfirmCode:
			'Nous vous avons envoyé un code à 6 chiffres. Saisissez-le ci-dessous pour continuer.',
		ConfirmCodeButton: 'Confirmer',
		PageTitleNewPassword: 'Nouveau mot de passe',
		PageParagraphNewPassword: 'Saisissez un nouveau mot de passe pour votre compte.',
		NewPasswordInput: {
			Placeholder: 'Nouveau mot de passe'
		},
		SetNewPasswordButton: 'Définir un nouveau mot de passe',
		PageTitleSuccess: 'Terminé !',
		PageParagraphSuccess: 'Votre mot de passe a été réinitialisé avec succès.',
		ForgotPasswordButton: 'Mot de passe oublié ?'
	},
	FeaturedOn: {
		PageTitle: 'Nous sommes mis en avant sur'
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
export default fr;
