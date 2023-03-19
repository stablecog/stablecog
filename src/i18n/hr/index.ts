import type { Translation } from '../i18n-types';

const hr: Translation = {
	Language: 'Jezik',
	Home: {
		GenerateButton: 'Generiraj',
		PromptInput: {
			Placeholder: 'Portret mačke Van Gogh-a'
		},
		WidthTabBar: {
			Title: 'Širina',
			Paragraph: 'Širina slike.'
		},
		HeightTabBar: {
			Title: 'Visina',
			Paragraph: 'Visina slike.'
		},
		InferenceStepsTabBar: {
			Title: 'Koraci izvođenja',
			Paragraph: 'Koliko će koraka biti obavljeno da se generira (proširi) slika.'
		},
		GuidanceScaleSlider: {
			Title: 'Ljestvica izvođenja',
			Paragraph:
				'Koliko će slika biti slična tvom opisu. Veća vrijednost će stvoriti sliku sličniju tvom opisu.'
		},
		NegativePromptInput: {
			Title: 'Negativan opis',
			Placeholder: 'Negativan opis',
			Paragraph: 'Služi za uklanjanje neželjenih stvari sa slike. Ima suprotno djelovanje od opisa.'
		},
		SeedInput: {
			Title: 'Sjeme',
			Placeholder: 'Broj sjemena',
			Paragraph:
				'Dobivaš ponovljiv rezultat. Sjeme kombinirano sa istim opisom i opcijama generira istu sliku.'
		},
		ModelDropdown: {
			Title: 'Model',
			Paragraph: 'AI model koji će se koristiti za generiranje slike.'
		},
		SchedulerDropdown: {
			Title: 'Planer',
			Paragraph:
				'Proširuje sliku na određeni način. Može drastično promijeniti generiranu sliku. Neki zahtijevaju manje koraka da stvore dobar rezultat.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Slanje generacija u galeriju?',
			Paragraph: 'Možeš promijeniti preference u postavkama kasnije.'
		}
	},
	History: {
		GenerationsTitle: 'Generacije',
		GenerationsMaxSavedCountWarning: 'Samo {count} posljednjih',
		DownloadLegacyGenerationsButton: 'Download Legacy Generations',
		NoFavoritesYet: "You don't have any favorites yet.",
		Views: {
			AllTitle: 'All',
			FavoritesTitle: 'Favorites'
		},
		NoGenerationsYet: 'Još nisi generirao niti jednu sliku.'
	},
	Live: {
		GenerationsTitle: 'Generacije',
		TotalDurationTitle: 'Ukupno trajanje',
		UpscalesTitle: 'Uvećavanja',
		GenerationTooltip: {
			CountryTitle: 'Država',
			Type: {
				Title: 'Tip',
				Generation: 'Generiranje',
				Upscale: 'Uvećavanje'
			},
			DimensionsTitle: 'Dimenzije',
			StepsTitle: 'Koraci',
			ScaleTitle: 'Ljestvica',
			DurationTitle: 'Trajanje',
			Status: {
				Title: 'Status',
				Started: 'Započeto',
				Succeeded: 'Uspijelo',
				Failed: 'Neuspijelo'
			},
			Server: {
				Title: 'Server',
				Default: 'Zadani',
				Custom: 'Prilagođeni'
			},
			UnknownTitle: 'Nepoznato',
			OutputsTitle: 'Outputs'
		},
		WaitingTitle: 'Čekanje generacija',
		DurationStatusUnknown: 'Nepoznato'
	},
	Navbar: {
		HomeTab: 'Početna',
		HistoryTab: 'Povijest',
		GalleryTab: 'Galerija',
		LiveTab: 'Uživo'
	},
	Settings: {
		Title: 'Postavke',
		SwitchServerButton: 'Promijeni server',
		SubmitToGalleryToggle: 'Slanje u galeriju',
		AdvancedModeToggle: 'Napredni način',
		AdvancedOptionsDropdown: 'Napredne mogućnosti',
		AdvancedDropdown: 'Napredno',
		GenerationSettingsButton: 'Postavke generiranja',
		GenerationSettingsTitle: 'Postavke generiranja',
		DarkModeToggle: 'Tamni način rada'
	},
	GenerationFullscreen: {
		DownloadButton: 'Preuzmi',
		DoneButtonState: 'Gotovo!',
		CopyPromptButton: 'Kopiraj opis',
		CopyNegativePromptButton: 'Kopiraj negativni opis',
		CopiedButtonState: 'Kopirano!',
		GenerateSimilarButton: 'Generate Similar',
		RerollButton: 'Obnovi',
		RegenerateButton: 'Regeneriraj',
		GenerateButton: 'Generiraj',
		UpscaleButton: 'Uvećaj',
		SubmitToGalleryButton: 'Submit to Gallery',
		SubmittedTitle: 'Submitted',
		UpscaleTabBar: {
			UpscaledTitle: 'Uvećano',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Dimenzije'
		},
		Duration: {
			Title: 'Trajanje'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Postavi server',
		SwitchServerTitle: 'Promijeni server',
		Paragraph: 'Server će se koristiti za generiranje slika.',
		SetButton: 'Postavi',
		DefaultButton: 'Zadano'
	},
	Blog: {
		Title: 'Blog objave',
		TitleAlt: 'Blog',
		BackToBlogButton: 'Povratak na blog'
	},
	Redirect: {
		RedirectingToTitle: 'Preusmjeravanje na {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Počni generirati predivne slike!',
		StartGeneratingButton: 'Počni generirati',
		JoinUsTitle: 'Pridruži nam se',
		GoHomeButton: 'Idite na početnu stranicu',
		SwitchToDefaultServerButton: 'Prebaci na zadani server',
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Pridruži nam se na {name}',
		ShareButton: 'Podijeli',
		ShareOnButton: 'Podijeli na {name}',
		GoBackButton: 'Idi natrag',
		YesButton: 'Da',
		NoButton: 'Ne',
		EnableButton: 'Omogući',
		DisableButton: 'Onemogući',
		AddButton: 'Dodaj',
		CopyLinkButton: 'Kopiraj Link',
		CopyButton: 'Kopiraj',
		DeleteButton: 'Obriši',
		LoadingTitle: 'Učitavanje',
		ContinueButton: 'Continue',
		LoadingParagraph: 'Učitavanje...',
		InsufficientCreditsTitle: 'Insufficient credits ({remainingCredits}/{neededCredits})',
		AllTitle: 'All',
		ConfirmButton: 'Confirm',
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
			Placeholder: 'URL servera'
		},
		EmailInput: {
			Placeholder: 'E-mail'
		},
		PasswordInput: {
			Placeholder: 'Lozinka'
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
		UnknownTitle: 'Nepoznato',
		MoreOptionsTitle: 'Više opcija',
		LessOptionsTitle: 'Manje opcija',
		TryAgainButton: 'Pokušaj ponovno',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: 'Dogodila se greška :(',
		ImageWasNSFW: 'This image was NSFW :(',
		NSFW: 'Otkriven NSFW sadržaj, pokušaj sa drugim opisom :(',
		ServerSeemsOffline:
			'Server je isključen. Pokušaj osvježiti stranicu ili postavi drugi server u postavkama.',
		ServerSetNotWorking: 'Ovaj server nije kompatibilan ili ne reagira.',
		NotFound: 'Nije pronađeno',
		SupabaseNotFoundCantListen: 'Supabase primjer nije pronađen. Obrada generacija nije moguće.',
		InvalidEmail: 'Unesi ispravan e-mail.',
		PasswordTooShort: 'Lozinka treba imati bar 8 znakova.',
		SomethingWentWrongTryAgain: 'Nešto je pošlo naopako. Pokušaj ponovo.',
		InvalidCredentials: 'Netočni podaci.',
		InvalidCode: 'Nevažeći kod.',
		OnceEvery60Seconds: 'Možeš zatražiti link samo svakih 60 sekundi.',
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
		AdminPanelTitle: 'Administrator',
		DeleteButton: 'Izbriši',
		ApproveButton: 'Odobri',
		RejectButton: 'Reject',
		EditButton: 'Edit',
		EditViewButton: 'Edit View',
		NormalViewButton: 'Normal View',
		StopEditButton: 'Stop Editing',
		NoGenerationsToReview: 'Nema generacija za pregled.',
		ServersButton: 'Serveri',
		AdminGalleryButton: 'Galerija',
		UsersButton: 'Korisnici',
		AdminTab: 'Administrator',
		ServersTab: 'Serveri',
		AdminGalleryTab: 'Galerija',
		UsersTab: 'Korisnici',
		Gallery: {
			TotalTitle: 'Ukupno',
			ApprovedTitle: 'Odobreno',
			DeletedTitle: 'Izbrisano',
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
		PageTitle: 'Registriraj se',
		PageParagraph: 'Postani Stablecog pro korisnik i otključaj sve opcije.',
		PageTitleConfirm: 'Potvrdi',
		PageTitleConfirmAlt: 'Provjeri svoj e-mail',
		PageParagraphConfirm: 'Poslali smo ti 6-znamenkasti kod. Unesi ispod za potvrdu svog računa.',
		SignUpButton: 'Registriraj se',
		AllTitle: 'All',
		ConfirmButton: 'Potvrdi',
		AlreadyHaveAnAccountTitle: 'Već imaš račun?',
		LoginInsteadButton: 'Ulogiraj se',
		SixDigitCodeInput: {
			Placeholder: '6-znamenkasti kod'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Get Started',
		GetStartedButton: 'Get Started',
		PageTitle: 'Prijavi se',
		PageParagraph: 'Počni koristiti Stablecog sa svim opcijama dostupnim na tvom računu.',
		PageParagraphV2: 'Start creating amazing art in seconds for free, no credit card required.',
		PageTitleCreateAccountOrSignIn: 'Stvori račun ili se prijavi',
		PageParagraphCreateAccountOrSignIn:
			'Počni koristiti Stablecog sa svim opcijama dostupnim na tvom računu.',
		PageTitleSentLink: 'Provjeri svoj e-mail',
		PageParagraphSentLink:
			'Poslali smo ti link za prijavu. Ako nije u pristigloj pošti, provjeri spam folder.',
		ContinueButton: 'Nastavi',
		ContinueWithProviderButton: 'Nastavi sa {provider}',
		SignInWithProviderButton: 'Prijavi se sa {provider}',
		OrContinueWithEmailTitle: 'Ili nastavi sa e-mailom',
		DontHaveAnAccountTitle: 'Nemaš račun?',
		SignUpInsteadButton: 'Umjesto toga, registriraj se',
		SignInButton: 'Prijavi se',
		SignOutButton: 'Odjavi se'
	},
	Pro: {
		PageTitle: 'Postani Pro',
		PageParagraph:
			'Otključaj sve opcije Stablecog-a i podrži naš projekt. Bez Pro članova, Stablecog ne bi mogao ostati potpuno open-source i omogućavati besplatno generiranje svima.',
		PageTitleAlreadyPro: 'Već si Pro!',
		PageParagraphAlreadyPro:
			'Ti si već Pro član. Hvala ti što podržavaš projekt. Nastavi uživati u Stablecog-u i preporuči nas svojim prijateljima.',
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Puna brzina bez ograničenja',
			ImageDimensions: 'Različite dimenzije slike',
			Upscale: 'Uvećavanje slike',
			Steps: 'Različiti koraci izvođenja',
			MoreModels: 'Više modela',
			MoreSchedulers: 'Više planera',
			SavedToCloud: 'Generacije spremljene na cloud-u',
			Upcoming: 'Nadolazeće opcije',
			CommercialUse: 'Komercijalno korištenje'
		},
		Soon: '(uskoro)',
		Month: '/mjesec',
		BecomeProButton: 'Postani Pro',
		Success: {
			PageTitle: 'Ti si Pro!',
			PageParagraph:
				'Sada imaš pristup svemu što Stablecog ima za ponuditi. Za sva pitanja obrati nam se na {platform}.'
		},
		Cancel: {
			PageTitle: 'Otkazao si',
			PageParagraph: 'Otkazao si proces pretplate. Ako je ovo greška, pokušaj ponovno.'
		},
		Reason: {
			ParagraphWidth: 'Ta širina slike nije dostupna u besplatnoj verziji.',
			ParagraphHeight: 'Ta visina slike nije dostupna u besplatnoj verziji.',
			ParagraphDimensions: 'Te dimenzije slike nisu dostupne u besplatnoj verziji.',
			ParagraphUpscale: 'Opcija uvećavanja nije dostupna u besplatnoj verziji.',
			ParagraphInferenceSteps: 'Podešavanje koraka izvođenja nije dostupno u besplatnoj verziji.',
			ParagraphModel: 'Taj AI model nije dostupan u besplatnoj verziji.',
			ParagraphScheduler: 'Taj planer nije dostupan u besplatnoj verziji.',
			ParagraphWidthGeneration:
				'Ta generacija je stvorena sa širinom slike koja nije dostupna u besplatnoj verziji.',
			ParagraphHeightGeneration:
				'Ta generacija je stvorena sa visinom slike koja nije dostupna u besplatnoj verziji.',
			ParagraphDimensionsGeneration:
				'Ta generacija je stvorena sa dimenzijama slike koje nisu dostupne u besplatnoj verziji.',
			ParagraphInferenceStepsGeneration:
				'Ta generacija je stvorena sa postavkama koraka izvođenja koje nisu dostupne u besplatnoj verziji.',
			ParagraphModelGeneration:
				'Ta generacija je stvorena sa AI modelom koji nije dostupan u besplatnoj verziji.',
			ParagraphSchedulerGeneration:
				'Ta generacija je stvorena sa planerom koji nije dostupan u besplatnoj verziji.'
		},
		Tier: {
			Title: {
				Free: 'Besplatno',
				Pro: 'Pro'
			},
			Badge: {
				Free: 'BESPLATNO',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Račun',
		ManageSubscriptionButton: 'Upravljanje pretplatom',
		ComparePlansButton: 'Compare Plans',
		ManageAccountButton: 'Upravljanje računom',
		MyAccountButton: 'Moj račun',
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
		PageTitle: 'Resetiraj lozinku',
		PageParagraph: 'Poslat ćemo 6-znamenkasti kod za resetiranje lozinke na tvoj e-mail.',
		SendResetCodeButton: 'Pošalji kod',
		PageTitleConfirmCode: 'Potvrdi',
		PageTitleConfirmCodeAlt: 'Provjeri svoj e-mail',
		PageParagraphConfirmCode: 'Poslali smo ti 6-znamenkasti kod. Za nastavak unesi kod ispod.',
		ConfirmCodeButton: 'Potvrdi',
		PageTitleNewPassword: 'Nova lozinka',
		PageParagraphNewPassword: 'Unesi novu lozinku za svoj račun.',
		NewPasswordInput: {
			Placeholder: 'Nova lozinka'
		},
		SetNewPasswordButton: 'Postavi novu lozinku',
		PageTitleSuccess: 'Gotovo!',
		PageParagraphSuccess: 'Tvoja lozinka je uspješno resetirana.',
		ForgotPasswordButton: 'Zaboravio si lozinku?'
	},
	FeaturedOn: {
		PageTitle: 'Nalazimo se na'
	},
	Gallery: {
		PageTitle: 'Galerija',
		PageParagraph: 'Pogledaj što su drugi stvorili sa Stablecog-om.',
		SearchInput: {
			Title: 'Pretraži'
		},
		SearchingTitle: 'Pretraživanje',
		NoMatchingGenerationTitle: 'Nema tražene generacije'
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
export default hr;
