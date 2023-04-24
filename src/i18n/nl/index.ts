import type { Translation } from '../i18n-types';

const nl: Translation = {
	Language: 'Taal',
	Home: {
		GenerateButton: 'Genereren',
		PromptInput: {
			Placeholder: 'Portret van een kat door Van Gogh'
		},
		WidthTabBar: {
			Title: 'Breedte',
			Paragraph: 'De breedte van de afbeelding.'
		},
		HeightTabBar: {
			Title: 'Hoogte',
			Paragraph: 'De hoogte van de afbeelding.'
		},
		InferenceStepsTabBar: {
			Title: 'Inferentie stappen',
			Paragraph: 'De te nemen stappen om een afbeelding te genereren (diffuseren).'
		},
		GuidanceScaleSlider: {
			Title: 'Oriëntatie Schaal',
			Paragraph:
				'In welke mate je afbeelding gelijk is aan je prompt. Hogere waarden laten je afbeelding meer lijken op je prompt.'
		},
		AspectRatioDropdown: {
			Title: 'Beeldverhouding',
			Paragraph: 'Beeldverhouding van de afbeelding.',
			Options: {
				Square: 'Vierkant (1:1)',
				Portrait: 'Staand (2:3)',
				Landscape: 'Liggend (3:2)',
				Mobile: 'Mobiel (9:16)',
				Desktop: 'Desktop (16:9)',
				Squarish: 'Vierkantachtig (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: 'Beeldverhouding',
			Paragraph: 'Beeldverhouding van de afbeelding.'
		},
		InitialImageTabBar: {
			Title: 'Initiële afbeelding',
			Paragraph: 'Het genereren zal worden uitgevoerd op basis van deze afbeelding.'
		},
		InitialImageStrengthTabBar: {
			Title: 'Sterkte initiële afbeelding',
			Paragraph:
				'Bepaalt de invloed van de initiële afbeelding. Hoe groter de waarde, hoe meer invloed de initiële afbeelding heeft.'
		},
		NegativePromptInput: {
			Title: 'Negatieve Prompt',
			Placeholder: 'Negatieve prompt',
			PlaceholderAlt: 'Voer dingen in om te vermijden',
			Paragraph:
				'Om ongewenste dingen uit de afbeelding te verwijderen. Doet het tegenovergestelde van wat de prompt doet.'
		},
		ImageInput: {
			Title: 'Upload Afbeelding'
		},
		SeedInput: {
			Title: 'Seed',
			Placeholder: 'Seed nummer',
			Paragraph:
				'Krijg herhaalbare resultaten. Een seed gecombineerd met dezelfde prompt en opties genereert dezelfde afbeelding.'
		},
		ModelDropdown: {
			Title: 'Model',
			Paragraph: 'Het AI-model dat gebruikt zal worden om een afbeelding te creëren.'
		},
		NumOutputsSlider: {
			Title: 'Aantal Afbeeldingen',
			Paragraph: 'Het aantal afbeeldingen dat zal worden gegenereerd.'
		},
		SchedulerDropdown: {
			Title: 'Planner',
			Paragraph:
				'Diffusie van de afbeelding op een bepaalde manier. Het kan de gegenereerde afbeelding drastisch wijzigen. Sommigen vereisen minder stappen om goede resultaten te produceren.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Stuur creaties naar de galerij?',
			Paragraph: 'Je kan later je voorkeur via de instellingen wijzigen.'
		}
	},
	History: {
		GenerationsTitle: 'Creaties',
		GenerationsMaxSavedCountWarning: 'Alleen de laatste {count}',
		DownloadLegacyGenerationsButton: 'Download Oudere Creaties',
		NoFavoritesYet: 'Je hebt nog geen favorieten.',
		Views: {
			AllTitle: 'Alles',
			FavoritesTitle: 'Favorieten'
		},
		NoGenerationsYet: 'Je hebt nog geen afbeeldingen aangemaakt.'
	},
	Live: {
		GenerationsTitle: 'Creaties',
		TotalDurationTitle: 'Totale Tijdsduur',
		UpscalesTitle: 'Opschalingen',
		GenerationTooltip: {
			AspectRatioTitle: 'Beeldverhouding',
			CountryTitle: 'Land',
			Type: {
				Title: 'Type',
				Generation: 'Genereren',
				Upscale: 'Opschaling'
			},
			DimensionsTitle: 'Afmetingen',
			StepsTitle: 'Stappen',
			ScaleTitle: 'Schaal',
			DurationTitle: 'Tijdsduur',
			Status: {
				Title: 'Status',
				Started: 'Gestart',
				Succeeded: 'Geslaagd',
				Failed: 'Mislukt'
			},
			Server: {
				Title: 'Server',
				Default: 'Standaard',
				Custom: 'Aangepast'
			},
			UnknownTitle: 'Onbekend',
			OutputsTitle: 'Outputs'
		},
		WaitingTitle: 'Wachten op creaties',
		DurationStatusUnknown: 'Onbekend'
	},
	Navbar: {
		HomeTab: 'Home',
		HistoryTab: 'Historie',
		GalleryTab: 'Galerij',
		LiveTab: 'Live'
	},
	Settings: {
		Title: 'Instellingen',
		SwitchServerButton: 'Server wisselen',
		SubmitToGalleryToggle: 'Naar galerij versturen',
		AdvancedModeToggle: 'Geavanceerde modus',
		AdvancedOptionsDropdown: 'Geavanceerde opties',
		AdvancedDropdown: 'Geavanceerd',
		GenerationSettingsButton: 'Settings voor Genereren',
		GenerationSettingsTitle: 'Settings voor Genereren',
		DarkModeToggle: 'Donkere Modus'
	},
	GenerationFullscreen: {
		DownloadButton: 'Download',
		DoneButtonState: 'Gereed!',
		CopyPromptButton: 'Prompt kopiëren',
		CopyNegativePromptButton: 'Negatieve prompt kopiëren',
		CopiedButtonState: 'Gekopieerd!',
		GenerateSimilarButton: 'Vergelijkbaar genereren',
		RerollButton: 'Nieuwe seed',
		RegenerateButton: 'Opnieuw genereren',
		GenerateButton: 'Genereren',
		UpscaleButton: 'Opschalen',
		SubmitToGalleryButton: 'Naar galerij versturen',
		SubmittedTitle: 'Verstuurd',
		UpscaleTabBar: {
			UpscaledTitle: 'Opgeschaald',
			OriginalTitle: 'Origineel'
		},
		Dimensions: {
			Title: 'Afmetingen'
		},
		Duration: {
			Title: 'Tijdsduur'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Server instellen',
		SwitchServerTitle: 'Server wisselen',
		Paragraph: 'De server zal worden gebruikt voor het genereren van afbeeldingen.',
		SetButton: 'Stel in',
		DefaultButton: 'Standaard'
	},
	Blog: {
		Title: 'Blogberichten',
		TitleAlt: 'Blog',
		BackToBlogButton: 'Terug naar Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Doorverwijzen naar {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Start met het genereren van mooie afbeeldingen!',
		StartGeneratingButton: 'Begin met genereren',
		JoinUsTitle: 'Word lid',
		GoHomeButton: 'Ga naar Home',
		SwitchToDefaultServerButton: 'Overschakelen naar standaard server',
		JoinOnDiscord: 'Praat mee op Discord',
		JoinUsOnTitle: 'Volg ons op {name}',
		ShareButton: 'Delen',
		ShareOnButton: 'Delen op {name}',
		GoBackButton: 'Terug',
		YesButton: 'Ja',
		NoButton: 'Nee',
		EnableButton: 'Activeren',
		ClearAllButton: 'Alles wissen',
		DisableButton: 'Uitschakelen',
		AddButton: 'Voeg toe',
		CopyLinkButton: 'Link kopiëren',
		CopyButton: 'Kopiëren',
		DeleteButton: 'Verwijderen',
		LoadingTitle: 'Laden',
		ContinueButton: 'Verder',
		LoadingParagraph: 'Laden...',
		InsufficientCreditsTitle: 'Onvoldoende credits ({remainingCredits}/{neededCredits})',
		AllTitle: 'Alles',
		ConfirmButton: 'Bevestigen',
		ConfirmQuestionMarkButton: 'Bevestigen?',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Type Credit',
				RemainingCreditsTitle: 'Resterend',
				ExpiryTitle: 'Vervaldatum',
				LastReplenish: 'Laatste Aanvulling'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Bewerken pauzeren',
			DeselectButton: '({selectedCount}) deselecteren',
			DeleteButton: '({selectedCount}) verwijderen',
			FavoriteButton: '({selectedCount}) aan favorieten toevoegen',
			ApproveButton: '({selectedCount}) goedkeuren',
			RejectButton: '({selectedCount}) afwijzen',
			UnfavoriteButton: '({selectedCount}) uit favorieten verwijderen',
			ConfirmationModal: {
				CancelButton: 'Annuleren',
				Deselect: {
					Title: '{selectedCount} item(s) deselecteren?',
					Paragraph: 'Weet u zeker dat u {selectedCount} geselecteerde item(s) wilt verwijderen?',
					ConfirmButton: 'Deselecteren'
				},
				Delete: {
					Title: 'Verwijder {selectedCount} item(s)?',
					Paragraph: 'Weet je zeker dat je {selectedCount} geselecteerde item(s) wilt verwijderen?',
					ConfirmButton: 'Verwijderen'
				},
				Favorite: {
					Title: '{selectedCount} item(s) aan favorieten toevoegen?',
					Paragraph:
						'Weet je zeker dat je {selectedCount} geselecteerde item(s) aan favorieten wil toevoegen?',
					ConfirmButton: 'Toevoegen aan favorieten'
				},
				Unfavorite: {
					Title: '{selectedCount} item(s) uit favorieten verwijderen?',
					Paragraph: 'Weet je zeker dat je {selectedCount} item(s) uit favorieten wil verwijderen?',
					ConfirmButton: 'Verwijderen uit favorieten'
				}
			}
		},
		ServerUrlInput: {
			Placeholder: 'Server URL'
		},
		EmailInput: {
			Placeholder: 'E-mailadres'
		},
		PasswordInput: {
			Placeholder: 'Wachtwoord'
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
		UnknownTitle: 'Onbekend',
		AdvancedSettingsButton: 'Geavanceerde instellingen',
		MoreOptionsTitle: 'Meer opties',
		LessOptionsTitle: 'Minder opties',
		TryAgainButton: 'Opnieuw proberen',
		RefreshButton: 'Vernieuwen',
		LoadMoreButton: 'Laad meer',
		SearchingTitle: 'Bezig met zoeken',
		NoResultsFoundTitle: 'Geen resultaten gevonden'
	},
	Error: {
		SomethingWentWrong: 'Er is iets mis gegaan :(',
		ImageWasNSFW: 'Deze afbeelding was NSFW :(',
		NSFW: 'NSFW inhoud gedetecteerd, probeer een andere prompt :(',
		ServerSeemsOffline:
			'De server lijkt offline. Probeer de pagina te verversen of kies een andere server vanuit de instellingen.',
		ServerSetNotWorking: 'Deze server is niet compatibel of reageert niet.',
		NotFound: 'Niet Gevonden',
		SupabaseNotFoundCantListen:
			'Kan geen generaties bijhouden vanwege een onbekende Supabase instantie.',
		InvalidEmail: 'Voer een geldig e-mailadres in.',
		PasswordTooShort: 'Wachtwoord moet ten minste 8 tekens bevatten.',
		SomethingWentWrongTryAgain: 'Er is iets mis gegaan. Probeer het opnieuw.',
		InvalidCredentials: 'Ongeldige inloggegevens.',
		InvalidCode: 'Ongeldige code.',
		TryAnotherImage: 'Probeer een andere afbeelding :(',
		OnceEvery60Seconds: 'Je kunt slechts een keer per 60 seconden een link aanvragen.',
		LinkExpired: {
			Title: 'Link is niet meer geldig',
			Paragraph: 'De link kan slechts één keer gebruikt worden en vervalt na 24 uur.'
		},
		UpdateAvailable: {
			Title: 'Update Beschikbaar',
			Paragraph: 'Er is een update! Vernieuw de pagina om deze te krijgen.'
		},
		EmailProviderNotAllowed: 'Deze e-mailprovider is niet toegestaan.',
		EmailAlreadyInUse: 'Dit e-mailadres is al in gebruik.'
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Verwijderen',
		ApproveButton: 'Goedkeuren',
		RejectButton: 'Afwijzen',
		EditButton: 'Bewerken',
		EditViewButton: 'Weergave bewerken',
		NormalViewButton: 'Normale weergave',
		StopEditButton: 'Stop met bewerken',
		NoGenerationsToReview: 'Geen creaties om te evalueren.',
		ServersButton: 'Servers',
		AdminGalleryButton: 'Galerij',
		UsersButton: 'Gebruikers',
		AdminTab: 'Admin',
		ServersTab: 'Servers',
		AdminGalleryTab: 'Galerij',
		UsersTab: 'Gebruikers',
		Users: {
			ConfirmAction: {
				ConfirmActionReferenceText: 'I confirm the action',
				ConfirmActionParagraph: 'Type "{confirmActionText}" to confirm.',
				ConfirmActionInput: { Placeholder: 'Confirm' }
			},
			DataDeletedAtTitle: 'Data Deleted',
			WillBeDeletedTitle: 'Will Be Deleted',
			BannedAtTitle: 'Banned',
			BannedTitle: 'Banned',
			UnbanUserButton: 'Unban User',
			BanUserButton: 'Ban User',
			GiftCreditsButton: 'Cadeau Credits'
		},
		Gallery: {
			TotalTitle: 'Totaal',
			ApprovedTitle: 'Goedgekeurd',
			DeletedTitle: 'Verwijderd',
			StatusDropdown: {
				All: 'Alles',
				ManuallySubmitted: 'Handmatig verzonden',
				Submitted: 'Verzonden',
				Approved: 'Goedgekeurd',
				Rejected: 'Geweigerd',
				Deleted: 'Verwijderd',
				Private: 'Afgeschermd'
			},
			NoGenerationsToReview: 'Geen generaties om te beoordelen'
		}
	},
	SignUp: {
		PageTitle: 'Aanmelden',
		PageParagraph:
			'Sluit je aan bij Stablecog om pro lid te worden en alle mogelijkheden te ontgrendelen.',
		PageTitleConfirm: 'Bevestigen',
		PageTitleConfirmAlt: 'Check je e-mail',
		PageParagraphConfirm:
			'We hebben een 6-cijferige code naar je e-mailadres gestuurd. Voer deze hieronder in om uw account te bevestigen.',
		SignUpButton: 'Registreren',
		AllTitle: 'Alles',
		ConfirmButton: 'Bevestigen',
		AlreadyHaveAnAccountTitle: 'Heb je al een account?',
		LoginInsteadButton: 'Log dan in',
		SixDigitCodeInput: {
			Placeholder: '6-Cijferige Code'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Aan de slag',
		GetStartedButton: 'Aan de slag',
		PageTitle: 'Inloggen',
		PageParagraph: 'Begin met Stablecog met alle functies die beschikbaar zijn op je account.',
		PageParagraphV2:
			'Begin binnen enkele seconden geweldige kunst te maken. Creditcard niet nodig.',
		PageTitleCreateAccountOrSignIn: 'Maak een account aan of log in',
		PageParagraphCreateAccountOrSignIn:
			'Begin met Stablecog met alle functies die beschikbaar zijn op je account.',
		PageTitleSentLink: 'Check je e-mail',
		PageParagraphSentLink:
			"We hebben je een aanmeldlink gestuurd. Als je 'm niet ziet, controleer dan je spamfolder.",
		ContinueButton: 'Verder',
		ContinueWithProviderButton: 'Ga verder met {provider}',
		SignInWithProviderButton: 'Inloggen met {provider}',
		OrContinueWithEmailTitle: 'Of ga verder met e-mail',
		DontHaveAnAccountTitle: 'Heb je nog geen account?',
		SignUpInsteadButton: 'Meld je dan aan',
		SignInButton: 'Inloggen',
		SignOutButton: 'Uitloggen'
	},
	Pro: {
		PageTitle: 'Word een Pro',
		PageParagraph:
			'Ontgrendel alle functies van Stablecog en ondersteun het project. Zonder de pro-leden kan Stablecog niet volledig open source blijven en iedereen gratis kunnen laten genereren.',
		PageTitleAlreadyPro: 'Je bent al een Pro!',
		PageParagraphAlreadyPro:
			'Je bent al een pro lid. Bedankt voor het steunen van het project! Geniet van Stablecog, en overweeg het te delen met je vrienden.',
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Volledige snelheid zonder ingestelde limieten',
			ImageDimensions: 'Verschillende afbeeldingsafmetingen',
			Upscale: 'Afbeeldingen opschalen',
			Steps: 'Verschillende inferentie stappen',
			MoreModels: 'Meer modellen',
			MoreSchedulers: 'Meer planners',
			SavedToCloud: 'Creaties opgeslagen in de cloud',
			Upcoming: 'Aankomende features',
			CommercialUse: 'Commercieel gebruik'
		},
		Soon: '(binnenkort)',
		Month: '/maand',
		BecomeProButton: 'Word Pro',
		Success: {
			PageTitle: 'Je bent een Pro!',
			PageParagraph:
				'Je hebt nu toegang tot alles wat Stablecog te bieden heeft. Als je vragen hebt, neem dan contact met ons op via {platform}.'
		},
		Cancel: {
			PageTitle: 'Je hebt geannuleerd',
			PageParagraph:
				'Je hebt het abonnementproces geannuleerd. Als dit een vergissing was, probeer het dan opnieuw.'
		},
		Reason: {
			ParagraphWidth: 'Die afbeeldingsbreedte is niet beschikbaar op het gratis abonnement.',
			ParagraphHeight: 'Die afbeeldingshoogte is niet beschikbaar op het gratis abonnement.',
			ParagraphDimensions: 'Deze afbeeldingsafmetingen zijn niet beschikbaar op het gratis plan.',
			ParagraphUpscale: 'Opschaalfunctie is niet beschikbaar op het gratis abonnement.',
			ParagraphInferenceSteps:
				'Die instelling voor inferentie stappen is niet beschikbaar op het gratis abonnement.',
			ParagraphModel: 'Dat AI-model is niet beschikbaar op het gratis abonnement.',
			ParagraphScheduler: 'Die planner is niet beschikbaar op het gratis abonnement.',
			ParagraphWidthGeneration:
				'Die creatie is gemaakt met een afbeeldingsbreedte die niet beschikbaar is op het gratis abonnement.',
			ParagraphHeightGeneration:
				'Die creatie is gemaakt met een afbeeldingshoogte die niet beschikbaar is op het gratis abonnement.',
			ParagraphDimensionsGeneration:
				'Die creatie is gemaakt met afbeeldingsdimensies die niet beschikbaar zijn op het gratis abonnement.',
			ParagraphInferenceStepsGeneration:
				'Die creatie is gemaakt met een inferentie instelling die niet beschikbaar is op het gratis plan.',
			ParagraphModelGeneration:
				'Die creatie is gemaakt met een AI-model dat niet beschikbaar is op het gratis abonnement.',
			ParagraphSchedulerGeneration:
				'Die creatie is gemaakt met een planner die niet beschikbaar is op het gratis abonnement.'
		},
		Tier: {
			Title: {
				Free: 'Gratis',
				Pro: 'Pro'
			},
			Badge: {
				Free: 'GRATIS',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Account',
		ManageSubscriptionButton: 'Abonnement beheren',
		ComparePlansButton: 'Abonnementen vergelijken',
		ManageAccountButton: 'Account beheren',
		MyAccountButton: 'Mijn account',
		SubscriptionPlanTitle: 'Abonnement',
		RemainingImagesTitle: 'Resterende afbeeldingen',
		RemainingCreditsTitle: 'Resterende credits',
		RemainingTitle: 'Resterend',
		Subscription: {
			UpdateSubscriptionTitle: 'Abonnement bijwerken',
			ChangePlanTitle: 'Abonnement wijzigen',
			CurrentPlanTitle: 'Huidige abonnement',
			NewPlanTitle: 'Nieuw abonnement',
			Downgrade: {
				DowngradingToTitle: 'Downgraden naar',
				Explanation: 'Je bestaande credits blijven bestaan.'
			},
			Upgrade: {
				UpgadingToTitle: 'Upgraden naar',
				Explanation: 'Je bestaande credits blijven bestaan.'
			},
			Failed: {
				PageTitle: 'Bijwerken mislukt',
				PageParagraph:
					'Er is iets misgegaan tijdens het wijzigen van je abonnement. Probeer het opnieuw.'
			},
			Succeeded: {
				PageTitle: 'Abonnement gewijzigd',
				PageParagraph: 'Je abonnement is succesvol gewijzigd.'
			}
		},
		Meta: {
			AccountCreationTitle: 'Aanmaak',
			LastSignInTitle: 'Laatste aanmelding',
			LastSeenTitle: 'Laatst bekeken'
		},
		ChangeEmail: {
			PageTitle: 'E-mailadres wijzigen',
			PageParagraph: 'Voer een nieuw e-mailadres in voor je account.',
			ChangeEmailButton: 'E-mailadres wijzigen',
			NewEmailInput: {
				Placeholder: 'Nieuw e-mailadres'
			},
			PageTitleSentLink: 'Check je e-mail',
			PageParagraphSentLink:
				'We hebben links naar beide adressen gestuurd. Bevestig beide om het e-mailadres van je account te wijzigen.',
			PageTitleConfirmOtherEmail: 'Bevestig ander e-mailadres',
			PageParagraphConfirmOtherEmail:
				'We hebben ook een link naar je andere e-mailadres gestuurd. Bevestig deze ook om het proces te voltooien.'
		}
	},
	ForgotPassword: {
		PageTitle: 'Wachtwoord Resetten',
		PageParagraph:
			'We sturen een 6-cijferige code naar je e-mailadres om je wachtwoord te kunnen resetten.',
		SendResetCodeButton: 'Verstuur code',
		PageTitleConfirmCode: 'Bevestigen',
		PageTitleConfirmCodeAlt: 'Check je e-mail',
		PageParagraphConfirmCode:
			'We hebben je een 6-cijferige code gestuurd. Voer deze hieronder in om verder te gaan.',
		ConfirmCodeButton: 'Bevestigen',
		PageTitleNewPassword: 'Nieuw Wachtwoord',
		PageParagraphNewPassword: 'Voer een nieuw wachtwoord in voor je account.',
		NewPasswordInput: {
			Placeholder: 'Nieuw Wachtwoord'
		},
		SetNewPasswordButton: 'Nieuw wachtwoord instellen',
		PageTitleSuccess: 'Gereed!',
		PageParagraphSuccess: 'Je wachtwoord reset is geslaagd.',
		ForgotPasswordButton: 'Wachtwoord vergeten?'
	},
	FeaturedOn: {
		PageTitle: 'We Zijn Uitgelicht Op'
	},
	Gallery: {
		PageTitle: 'Galerij',
		PageParagraph: 'Bekijk wat anderen met Stablecog hebben gecreëerd.',
		SearchInput: {
			Title: 'Zoeken'
		},
		SearchingTitle: 'Bezig met zoeken',
		NoMatchingGenerationTitle: 'Geen overeenkomstige creatie gevonden'
	},
	Pricing: {
		PlansTitle: 'Abonnementen',
		PlansParagraph: 'Kies een abonnement dat bij je past.',
		CreditPacksTitle: 'Credit Bundels',
		CreditPacksParagraph: 'Heb je meer nodig? Je kunt op elk moment extra credits kopen.',
		SubscribeButton: 'Abonneren',
		SubscribedButton: 'Geabonneerd',
		UpgradeButton: 'Upgraden',
		DowngradeButton: 'Downgraden',
		PurchaseButton: 'Kopen',
		BuyCreditsButton: 'Credits kopen',
		MonthlyTitle: 'Per maand',
		YearlyTitle: 'Op jaarbasis',
		SlashMonth: '/maand',
		Plans: {
			FreeTitle: 'Gratis',
			StarterTitle: 'Beginner',
			ProTitle: 'Pro',
			UltimateTitle: 'Ultiem'
		},
		CreditPacks: {
			MediumTitle: 'Medium Bundel',
			LargeTitle: 'Grote Bundel',
			MegaTitle: 'Mega Bundel'
		},
		Features: {
			MonthlyCredits: '{count} credits per maand.',
			MonthlyImages: '{count} afbeeldingen per maand.',
			MonthlyGenerations: '{count} creaties per maand.',
			Images: '{count} afbeeldingen.',
			Generations: '{count} creaties.',
			NeverExpires: 'Verloopt nooit.',
			CommercialUse: 'Commercieel gebruik.',
			ImagesArePublic: 'Afbeeldingen zijn openbaar.',
			ImagesArePrivate: 'Afbeeldingen zijn privé.'
		},
		Badges: {
			Recommended: 'Aanbevolen',
			MostPopular: 'Populairst',
			BestValue: 'Meeste voordeel'
		},
		Purchase: {
			Succeeded: {
				PageTitle: 'Je bent helemaal klaar!',
				PageParagraph:
					'Bedankt voor je aankoop. Als je vragen hebt, neem dan gerust contact met ons op via {platform}.'
			},
			Cancelled: {
				PageTitle: 'Aankoop geannuleerd',
				PageParagraph:
					'Je hebt het aankoopproces geannuleerd. Als dit per vergissing was, probeer het dan opnieuw.'
			}
		}
	},
	LowOnCreditsCard: {
		Title: 'Je hebt nog maar weinig credits over ({remainingCredits})',
		FreeParagraph:
			'We geven alle actieve gebruikers dagelijks gratis credits. Je kunt er meer krijgen door een abonnement aan te schaffen of door deel te nemen aan onze evenementen.',
		HighestPlanParagraph: 'Je kunt een creditbundel kopen.',
		OtherPlansParagraph: 'Je kunt upgraden naar een hoger abonnement of een creditbundel kopen.'
	},
	Support: {
		PageTitle: 'Ondersteuning',
		PageParagraph:
			'Als je vragen hebt, neem dan contact met ons op via onderstaande links en we zullen ze zo snel mogelijk beantwoorden.'
	},
	Guide: {
		PageTitle: 'Handleiding',
		GuideButton: 'Handleiding',
		PreviousTitle: 'Terug',
		NextTitle: 'Verder',
		ChaptersTitle: 'Hoofdstukken',
		ChapterTitle: 'Hoofdstuk'
	},
	Legal: {
		TermsOfServiceTitle: 'Gebruiksvoorwaarden',
		PrivacyPolicyTitle: 'Privacybeleid',
		RefundPolicyTitle: 'Restitutiebeleid',
		ContentPolicyTitle: 'Inhoudsbeleid'
	},
	UnderDevelopment: {
		PageTitle: 'We zijn snel weer terug!',
		PageParagraph: 'We zijn onze systemen aan het upgraden. Over een paar uur zijn we weer terug.'
	}
};
export default nl;
