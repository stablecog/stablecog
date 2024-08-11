import type { Translation } from '../i18n-types';

const de: Translation = {
	Language: 'Sprache',
	Landing: {
		Hero: { Title: 'Create amazing art in seconds with AI.' },
		Describe: {
			Title: 'Describe anything.',
			Paragraph:
				'Anything you like, in thousands of different styles. It’ll be generated by AI in seconds.',
			Prompt: 'majestic cat, psychedelic, violet tones, fantasy landscape'
		},
		InitImage: {
			Title: 'Or start with an image.',
			Paragraph: 'Give an input image, generate new art based on it.',
			Prompt: 'robot alien'
		},
		StartCreating: {
			Title: 'Start creating now!',
			Paragraph:
				'It’s free to try :) Give it a go, we think you’ll like it. Thousands of our users do.'
		},
		TryItNowButton: 'Try It Now',
		StartCreatingButton: 'Start Creating',
		GetStartedButton: 'Get Started'
	},
	Home: {
		GenerateButton: 'Generieren',
		PromptInput: { Title: 'Prompt', Placeholder: 'Porträt einer Katze von Van Gogh' },
		WidthTabBar: {
			Title: 'Breite',
			Paragraph: 'Die Breite des Bildes.'
		},
		HeightTabBar: {
			Title: 'Höhe',
			Paragraph: 'Die Höhe des Bildes.'
		},
		InferenceStepsTabBar: {
			Title: 'Interferenzschritte',
			Paragraph: 'Wie viele Schritte durchlaufen werden, um das Bild zu erzeugen.'
		},
		GuidanceScaleSlider: {
			Error: {
				TooHigh: 'That high of a value might produce poor results.',
				TooLow: 'That low of a value might produce poor results.'
			},
			Title: 'Ähnlichkeit (Guidance Scale)',
			Paragraph:
				'Wie ähnlich das Bild den Eingabewörtern ist. Je höher der Wert ist, umso ähnlicher wird das Bild.'
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
				Anamorphic: 'Anamorphic (2.4:1)',
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
			TitleAlt: 'Image Strength',
			Title: 'Initial Image Strength',
			Paragraph:
				'Controls the influence of the initial image. The bigger the value, the more influence the initial image has.'
		},
		NegativePromptInput: {
			Title: 'Wörter ausschließen',
			Placeholder: 'Wörter ausschließen',
			PlaceholderAlt: 'Enter things to avoid',
			Paragraph: 'Um ungewollte Dinge auszuschließen. Bewirkt das Gegenteil von Eingabewörtern.'
		},
		ImageInput: {
			NotSupported: 'Not supported by the model',
			Paragraph: 'Click or drop your image here',
			Title: 'Upload Image'
		},
		SeedInput: {
			Title: 'Seed',
			Placeholder: 'Seed-Nummer',
			Paragraph:
				'Wiederholbare Ergebnisse. Ein Seed-Nummer kombiniert mit denselben Eingabewörtern und den gleichen Optionen erzeugt das gleiche Bild.'
		},
		ModelDropdown: {
			Title: 'Modell',
			Paragraph: 'Das KI-Modell, das verwendet wird, um das Bild zu generieren.'
		},
		NumOutputsSlider: {
			Title: 'Number of Images',
			Paragraph: 'The number of images that will be generated.'
		},
		ShowOnProfileToggle: {
			Title: 'Show on Profile',
			Paragraph: 'Whether to show the generated images on your profile.'
		},
		SchedulerDropdown: {
			Title: 'Zeitplaner',
			Paragraph:
				'Diffundiere das Bild auf eine bestimmte Art und Weise. Es kann das generierte Bild drastisch verändern. Einige benötigen weniger Schritte, um gute Ergebnisse zu erzielen.'
		},
		ModelTag: 'Model: {modelName}',
		SubmitToGalleryQuestion: {
			Title: 'Generierte Bilder zur Galerie hinzufügen?',
			Paragraph: 'Du kannst deine Einstellungen später ändern.'
		}
	},
	Generate: {
		ShowSettingsButton: 'Show Settings',
		HideSettingsButton: 'Hide Settings',
		QueueTitle: 'Queue',
		SkipTheQueueButton: 'Skip the Queue',
		PositionInQueueTitle: 'Position in queue',
		Grid: {
			NotSignedIn: { Paragraph: 'Sign in to see your generations.' },
			NoGeneration: {
				Paragraph: 'Your generations will appear here.'
			}
		}
	},
	History: {
		GenerationsTitle: 'Generierte Bilder',
		GenerationsMaxSavedCountWarning: 'Nur die letzten {count}',
		DownloadLegacyGenerationsButton: 'Legacy Generierungen herunterladen',
		Views: {
			AllTitle: 'All',
			LikesTitle: 'Likes',
			FavoritesTitle: 'Favorites'
		},
		NoFavoritesYet: "You don't have any favorites yet.",
		NoLikesYet: "You haven't liked anything yet.",
		NoGenerationsYet: 'Du hast noch keine Bilder generiert.'
	},
	Live: {
		GenerationsTitle: 'Generierte Bilder',
		TotalDurationTitle: 'Gesamtlaufzeit',
		UpscalesTitle: 'Hochskalierungen',
		VoiceoversTitle: 'Voiceovers',
		GenerationTooltip: {
			AspectRatioTitle: 'Aspect Ratio',
			CountryTitle: 'Land',
			Type: {
				Title: 'Typ',
				Generation: 'Generierung',
				Upscale: 'Hochskalierung',
				Voiceover: 'Voiceover'
			},
			DimensionsTitle: 'Größe',
			StepsTitle: 'Schritte',
			ScaleTitle: 'Skalierung',
			DurationTitle: 'Laufzeit',
			Status: {
				Title: 'Status',
				Started: 'Gestartet',
				Succeeded: 'Erfolgreich',
				Failed: 'Fehlgeschlagen'
			},
			Server: {
				Title: 'Server',
				Default: 'Standard',
				Custom: 'Benutzerdefiniert'
			},
			OutputsTitle: 'Ausgabe'
		},
		WaitingTitle: 'Warte auf Generierungen',
		DurationStatusUnknown: 'Unbekannt'
	},
	Navbar: {
		HomeTab: 'Start',
		GenerateTab: 'Generate',
		HistoryTab: 'Verlauf',
		GalleryTab: 'Galerie',
		AdminGalleryTab: 'Admin Gallery',
		PricingTab: 'Pricing',
		AccountTab: 'Account',
		VoiceoverTab: 'Voiceover',
		LiveTab: 'Live'
	},
	Settings: {
		Title: 'Einstellungen',
		SwitchServerButton: 'Server wechseln',
		SubmitToGalleryToggle: 'Zur Galerie zufügen',
		AdvancedModeToggle: 'Erweiterter Modus',
		AdvancedOptionsDropdown: 'Erweiterte Einstellungen',
		AdvancedDropdown: 'Erweitert',
		GenerationSettingsButton: 'Generierungseinstellungen',
		GenerationSettingsTitle: 'Generierungseinstellungen',
		DarkModeToggle: 'Dunkel-Modus'
	},
	Inpainting: { OriginalImageTitle: 'Original' },
	GenerationFullscreen: {
		DownloadButton: 'Download',
		DoneButtonState: 'Fertig!',
		CopyPromptButton: 'Eingabewörter kopieren',
		CopyNegativePromptButton: 'Ausgeschlossene Wörter kopieren',
		CopiedButtonState: 'Kopiert!',
		GenerateSimilarButton: 'Ähnliches generieren',
		ExploreSimilarButton: 'Explore Similar',
		ExploreStyleButton: 'Explore Style',
		RerollButton: 'Seed durchmischen',
		RegenerateButton: 'Erneut generieren',
		GenerateButton: 'Generieren',
		EditButton: 'Edit',
		UpscaleButton: 'Hochskalieren',
		SimilarTitle: 'Similar',
		ShowOnProfileButton: 'Show on Profile',
		SubmitToGalleryButton: 'Für die Galerie einreichen',
		SubmittedTitle: 'Eingereicht',
		UpscaleTabBar: {
			UpscaledTitle: 'Hochskaliert',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Größe'
		},
		Duration: {
			Title: 'Laufzeit'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Server festlegen',
		SwitchServerTitle: 'Server wechseln',
		Paragraph: 'Der Server wird für das Generieren von Bildern verwendet.',
		SetButton: 'Speichern',
		DefaultButton: 'Standard'
	},
	Blog: {
		Title: 'Blog-Beiträge',
		TitleAlt: 'Blog',
		ThanksForReading: 'Thanks for reading!',
		ReadMoreTitle: 'Read More',
		BackToBlogButton: 'Zurück zum Blog'
	},
	Redirect: { RedirectingTitle: 'Redirecting', RedirectingToTitle: 'Weiterleitung zu {name}' },
	Shared: {
		StartGeneratingTitle: 'Beginne wunderschöne Bilder zu generieren!',
		StartGeneratingButton: 'Beginne zu generieren',
		JoinUsTitle: 'Folge uns',
		GoHomeButton: 'Zurück zur Startseite',
		SwitchToDefaultServerButton: 'Zum Standard-Server wechseln',
		JoinOnDiscord: 'Auf Discord beitreten',
		JoinUsOnTitle: 'Auf {name} folgen',
		ShareButton: 'Teilen',
		ShareOnButton: 'Auf {name} teilen',
		GoBackButton: 'Zurück',
		UnknownTitle: 'Unbekannt',
		YesButton: 'Ja',
		NoButton: 'Nein',
		EnableButton: 'Aktivieren',
		DoneButton: 'Done',
		ReportButton: 'Report',
		ReportErrorButton: 'Report Error',
		CancelButton: 'Cancel',
		ClearAllButton: 'Clear All',
		DisableButton: 'Deaktivieren',
		DownloadButton: 'Download',
		NewTitle: 'New',
		AddButton: 'Hinzufügen',
		CopyLinkButton: 'Link kopieren',
		CopiedButton: 'Copied!',
		CopyButton: 'Kopieren',
		DeleteButton: 'Löschen',
		LoadingTitle: 'Wird geladen',
		ContinueButton: 'Weiter',
		ReachedTheEndTitle: "You've reached the end.",
		ProfileButton: 'Profile',
		VisitProfileButton: 'Visit Profile',
		YourProfileButton: 'Your Profile',
		LoadingParagraph: 'Wird geladen...',
		InsufficientCreditsTitle: 'Unzureichendes Guthaben ({remainingCredits}/{neededCredits})',
		AllTitle: 'Alle',
		ConfirmButton: 'Bestätigen',
		SimilarToTitle: 'Similar to: {item}',
		ResourcesTitle: 'Resources',
		ResourcesButton: 'Resources',
		On: 'On',
		Off: 'Off',
		FeatureNoLongerAvailableParagraph: 'This feature is no longer available.',
		BetaTitle: 'Beta',
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
			PauseEditingButtonAlt: 'Pause',
			DeselectButton: 'Deselect ({selectedCount})',
			DeleteButton: 'Delete ({selectedCount})',
			FavoriteButton: 'Favorite ({selectedCount})',
			ApproveButton: 'Approve ({selectedCount})',
			RejectButton: 'Reject ({selectedCount})',
			ToApproveButton: 'To Approve ({selectedCount})',
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
			Placeholder: 'Server-URL'
		},
		EmailInput: {
			Placeholder: 'E-Mail'
		},
		PasswordInput: {
			Placeholder: 'Passwort'
		},
		ProFeatures: {
			SubscribeTitle: 'Subscribe!',
			ChangeNumOutputsFeatureParagraph: 'Changing the number of images requires a subscription.',
			ChangeVisibilityFeatureParagraph:
				'Changing the visibility of this generation requires a subscription.'
		},
		ModelTags: {
			GoodAtTitle: 'Good at',
			Tags: {
				General: 'General',
				Realism: 'Realism',
				Anime: 'Anime',
				Render: 'Render',
				Drawing: 'Drawing',
				ThreeDArt: '3D',
				Abstract: 'Abstract'
			}
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stabile Diffusion 1,5'
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
			'0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b': { realName: 'FLUX.1' },
			'22b0857d-7edc-4d00-9cd9-45aa509db093': {
				realName: 'Kandinsky'
			},
			'986d447d-c38b-4218-a2c8-6e0b691f47ec': { realName: 'Stable Diffusion 3' },
			'9fa49c00-109d-430f-9ddd-449f02e2c71a': { realName: 'Kandinsky 2.2' },
			'8002bc51-7260-468f-8840-cf1e6dbe3f8a': { realName: 'SDXL' },
			'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': { realName: 'Waifu Diffusion XL' },
			'4e54440f-ee17-4712-b4b6-0671b94d685d': { realName: 'SSD-1B' },
			'a3636543-91cc-4290-b1a4-9d506457b9be': {
				realName: 'Freedom'
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
			'01e94c28-501d-4c6d-8f00-079f3230bf58': { realName: 'UniPC' },
			'cc1b8dbf-0aec-4e52-8110-8082506fb7ba': { realName: 'DDPM' },
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		AdvancedSettingsButton: 'Advanced Settings',
		MoreOptionsTitle: 'Weitere Optionen',
		LessOptionsTitle: 'Weniger Optionen',
		TryAgainButton: 'Nochmals versuchen',
		RefreshButton: 'Aktualisieren',
		LoadMoreButton: 'Weitere laden',
		BackToProfile: 'Back to Profile',
		BackToGalleryButton: 'Back to Gallery',
		SearchingTitle: 'Suche…',
		NoResultsFoundTitle: 'Keine Ergebnisse gefunden'
	},
	Error: {
		SomethingWentWrong: 'Etwas ist schiefgelaufen :(',
		PromptWasNSFW: 'This prompt might produce sensitive content :(',
		ImageWasNSFW: 'Dieses Bild war NSFW :(',
		NSFW: 'NSFW-Inhalt erkannt, versuche andere Eingabewörter :(',
		ServerSeemsOffline:
			'Der Server scheint offline zu sein. Versuche die Seite zu aktualisieren oder wechsle in den Einstellungen zu einem anderen Server.',
		ServerSetNotWorking: 'Dieser Server ist nicht kompatibel oder antwortet nicht.',
		NotFound: 'Nicht gefunden',
		SupabaseNotFoundCantListen: 'Supabase-Instanz nicht gefunden. Kann keine Generierung annehmen.',
		InvalidEmail: 'Bitte eine gültige E-Mail eingeben.',
		PasswordTooShort: 'Passwort muss mindestens 8 Zeichen lang sein.',
		SomethingWentWrongTryAgain: 'Etwas ist schiefgelaufen. Erneut versuchen.',
		InvalidCredentials: 'Ungültige Anmeldedaten.',
		InvalidCode: 'Ungültiger Code.',
		TryAnotherImage: 'Try another image :(',
		OnceEvery60Seconds: 'Du kannst nur einmal alle 60 Sekunden einen Link anfordern.',
		OAuthFailed: {
			Title: 'Connection Error',
			Paragraph: 'A problem occurred while connecting to the service provider.'
		},
		LinkExpired: {
			TitleAlt: 'The link is expired',
			Title: 'Link abgelaufen',
			Paragraph: 'Der Link kann nur einmal verwendet werden und läuft nach 24 Stunden ab.'
		},
		UpdateAvailable: {
			Title: 'Aktualisierung verfügbar',
			Paragraph: 'Es gibt ein Update! Aktualisiere die Seite, um es zu erhalten.'
		},
		EmailProviderNotAllowed: 'Dieser E-Mail-Anbieter ist nicht zulässig.',
		EmailNotAllowed: "This email isn't allowed.",
		EmailAlreadyInUse: 'Diese E-Mail-Adresse wird bereits verwendet.'
	},
	UpcomingCredits: {
		MorePaidPlanCreditsTooltip: {
			Title: 'More on the way!',
			Paragraph: 'Your credits will refresh:'
		},
		NoUpcomingCreditsTooltip: {
			Title: 'No upcoming credits',
			Paragraph: 'There are no upcoming credits.'
		},
		MoreFreeCreditsTooltip: {
			Title: 'More on the way!',
			Paragraph: "You'll receive more free credits:"
		}
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Löschen',
		ApproveButton: 'Freigeben',
		RejectButton: 'Ablehnen',
		EditButton: 'Bearbeiten',
		EditViewButton: 'Bearbeitungsansicht',
		NormalViewButton: 'Normale Ansicht',
		StopEditButton: 'Bearbeiten beenden',
		NoGenerationsToReview: 'Keine Generierung zu prüfen.',
		ServersButton: 'Server',
		AdminGalleryButton: 'Galerie',
		UsersButton: 'Benutzer',
		AdminTab: 'Admin',
		ServersTab: 'Server',
		AdminGalleryTab: 'Galerie',
		LogsTab: 'Logs',
		UsersTab: 'Benutzer',
		Users: {
			ConfirmAction: {
				ConfirmActionReferenceText: 'I confirm the action',
				ConfirmActionParagraph: 'Type "{confirmActionText}" to confirm.',
				ConfirmActionInput: { Placeholder: 'Confirm' }
			},
			DeleteDataButton: 'Delete Data',
			DataDeletedAtTitle: 'Data Deleted',
			WillBeDeletedTitle: 'Will Be Deleted',
			BannedAtTitle: 'Banned',
			BannedTitle: 'Banned',
			UnbanUserButton: 'Unban User',
			BanDomainButton: 'Ban Domain',
			UnbanDomainButton: 'Unban Domain',
			BanUserButton: 'Ban User',
			GiftCreditsButton: 'Gift Credits'
		},
		Gallery: {
			TotalTitle: 'Gesamt',
			ApprovedTitle: 'Freigegeben',
			DeletedTitle: 'Gelöscht',
			StatusDropdown: {
				All: 'Alle',
				ManuallySubmitted: 'Manually Submitted',
				SubmittedBest: 'Submitted (Best)',
				Submitted: 'Eingereicht',
				Approved: 'Genehmigt',
				Rejected: 'Abgelehnt',
				Deleted: 'Gelöscht',
				WaitingForApproval: 'Waiting for Approval',
				Private: 'Privat'
			},
			NoGenerationsToReview: 'Keine Generierungen zu prüfen'
		}
	},
	SignUp: {
		PageTitle: 'Registrieren',
		PageParagraph:
			'Treten Sie Stablecog bei, um Pro Mitglied zu werden und sein volles Potenzial freizuschalten.',
		PageTitleConfirm: 'Bestätigen',
		PageTitleConfirmAlt: 'Überprüfe Deinen E-Mail-Posteingang',
		PageParagraphConfirm:
			'Wir haben dir einen 6-stelligen Code per E-Mail zugeschickt. Gib ihn unten ein, um dein Konto zu bestätigen.',
		SignUpButton: 'Registrieren',
		AllTitle: 'Alle',
		ConfirmButton: 'Bestätigen',
		AlreadyHaveAnAccountTitle: 'Hast Du bereits ein Konto?',
		LoginInsteadButton: 'Stattdessen anmelden',
		WantsEmailCheckbox: {
			Paragraph: 'Get product updates, deals and news.',
			NoSpamParagraph: 'No spam, we promise.'
		},
		SixDigitCodeInput: {
			Placeholder: '6-stelliger Code'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Jetzt loslegen',
		GetStartedButton: 'Jetzt loslegen',
		PageTitle: 'Einloggen',
		PageParagraph: 'Benutze Stablecog mit allen Funktionen, die Deinem Konto zur Verfügung stehen.',
		PageParagraphV2: 'Start creating amazing art in seconds for free, no credit card required.',
		PageTitleCreateAccountOrSignIn: 'Registrieren oder einloggen',
		PageParagraphCreateAccountOrSignIn:
			'Benutze Stablecog mit allen Funktionen, die Deinem Konto zur Verfügung stehen.',
		PageTitleSentLink: 'Überprüfe Deinen E-Mail-Posteingang',
		PageParagraphSentLink:
			'Wir haben Dir einen Login-Link per E-Mail zugeschickt. Falls Du ihn nicht siehst, überprüfe Deinen Spam-Ordner.',
		ContinueButton: 'Weiter',
		ContinueWithProviderButton: 'Weiter mit {provider}',
		SignInWithProviderButton: 'Einloggen mit {provider}',
		OrContinueWithEmailTitle: 'Oder weiter mit E-Mail',
		DontHaveAnAccountTitle: 'Du hast noch kein Konto?',
		SignUpInsteadButton: 'Stattdessen registrieren',
		SignInButton: 'Einloggen',
		EnterCodeManuallyButton: 'Enter code manually',
		SignOutButton: 'Ausloggen'
	},
	ChangeUsername: {
		ChangeUsernameTitle: 'Change Username',
		ChangeUsernameButton: 'Change Username',
		PickUsernameTitle: 'Pick a username',
		UsernameInput: { Title: 'Username' },
		Error: {
			MinimumCharacters: 'Must be at least {count} characters.',
			MaximumCharacters: 'Must be at most {count} characters.',
			InvalidCharacters: 'Can only contain letters, numbers, and dashes.',
			NotAvailable: "This username isn't available."
		}
	},
	Account: {
		PageTitle: 'Benutzerkonto',
		ManageSubscriptionButton: 'Abonnements verwalten',
		ComparePlansButton: 'Abonnements vergleichen',
		ManageAccountButton: 'Benutzerkonto verwalten',
		AccountButton: 'Account',
		MyAccountButton: 'Mein Benutzerkonto',
		SubscriptionPlanTitle: 'Abonnement',
		RemainingImagesTitle: 'Verbleibende Bilder',
		UpcomingCreditsTitle: 'Upcoming Credits',
		RemainingCreditsTitle: 'Verbleibendes Guthaben',
		RemainingTitle: 'Verbleibend',
		SubscriptionStatusTitle: 'Subscription Status',
		SubscriptionRenewalTitle: 'Subscription Renewal',
		SubscriptionCancellationTitle: 'Subscription Cancellation',
		ManageSubscriptionTitle: 'Manage Subscription',
		ManageTitle: 'Manage',
		Apps: {
			Authorize: {
				PageTitle: 'Authorize {platform}',
				PageTitleFallback: 'Authorize App',
				PageParagraph: 'Click the button below to authorize {platform}.',
				PageSuccessTitle: 'Authorized!',
				PageSuccessParagraph: 'You can return back to {platform} now.',

				SignInTitle: 'Authorize {platform}',
				SignInParagraph: 'Create an account or sign in to authorize {platform}.',
				AuthorizeButton: 'Authorize',
				Error: {
					NoValidAppIdParagraph:
						"This link doesn't contain a valid app ID. Please request a new link.",
					NoValidCodeParagraph: "This link doesn't contain a valid code. Please request a new link."
				}
			},
			NoAppsYet: "You haven't connected any apps yet.",
			PageTitle: 'Applications',
			PageParagraph:
				"The applications that you've connected to your Stablecog account are listed below.",
			KeyTable: {
				ConnectedAtTitle: 'Connected'
			},
			AppModal: {
				Delete: {
					Title: 'Revoke Access',
					Paragraph:
						"This app's access to your Stablecog account will be revoked immediately. Once the access is revoked, the requests coming from this app will be rejected.",
					RevokeAccessButton: 'Revoke Access'
				}
			}
		},
		Subscription: {
			Status: { ActiveTitle: 'Active', CancellingTitle: 'Cancelling', CancelledTitle: 'Cancelled' },
			UpdateSubscriptionTitle: 'Abonnement erneuern',
			ChangePlanTitle: 'Abonnement ändern',
			CurrentPlanTitle: 'Aktuelles Abonnement',
			NewPlanTitle: 'Neues Abonnement',
			Downgrade: {
				DowngradingToTitle: 'Downgrade auf',
				Explanation: 'Dein bestehendes Guthaben bleibt erhalten.'
			},
			Upgrade: {
				UpgadingToTitle: 'Upgraden auf',
				Explanation: 'Dein bestehendes Guthaben bleibt erhalten.'
			},
			Failed: {
				PageTitle: 'Update fehlgeschlagen',
				PageParagraph:
					'Beim Ändern des Abonnements ist etwas schiefgelaufen. Bitte versuche es erneut.'
			},
			Succeeded: {
				PageTitle: 'Abonnement geändert',
				PageParagraph: 'Dein Abonnement wurde erfolgreich geändert.'
			}
		},
		Tabs: {
			Account: 'Account',
			Usage: 'Usage',
			APIKeys: 'API Keys',
			ConnectedApplications: 'Applications'
		},
		Meta: {
			AccountCreationTitle: 'Creation',
			LastSignInTitle: 'Last Sign-in',
			LastSeenTitle: 'Last Seen'
		},
		ChangeEmail: {
			PageTitle: 'E-Mail-Adresse ändern',
			PageParagraph: 'Gib eine E-Mail-Adresse für dein Benutzerkonto ein.',
			ChangeEmailButton: 'E-Mail-Adresse ändern',
			NewEmailInput: {
				Placeholder: 'Neue E-Mail-Adresse'
			},
			PageTitleSentLink: 'Überprüfe Deinen E-Mail-Posteingang',
			PageParagraphSentLink:
				'Wir haben Links zu beiden Adressen gesendet. Bestätige sie beide, um die E-Mail-Adresse Deines Kontos zu ändern.',
			PageTitleConfirmOtherEmail: 'Andere E-Mail bestätigen',
			PageParagraphConfirmOtherEmail:
				'Wir haben auch einen Link an Ihre andere E-Mail-Adresse gesendet. Bestätige sie, damit Du den Vorgang ebenfalls abschließen kannst.'
		},
		Usage: {
			PageTitle: 'Usage',
			PageParagraph: 'You can see your recent usage below.',
			RecentUsageTitle: 'Recent Usage',
			UsageTable: {
				ID: 'ID',
				Type: 'Type',
				Duration: 'Duration',
				Source: 'Source',
				RunTime: 'Run Time',
				Cost: 'Cost',
				Operation: 'Operation',
				Process: 'Process',
				Platform: 'Platform'
			},
			UsageType: {
				Voiceover: 'Voiceover',
				Generate: 'Generate',
				Generation: 'Generation',
				Upscale: 'Upscale'
			},
			SourceType: {
				Web: 'Web',
				WebApp: 'Web App',
				DiscordBot: 'Discord Bot',
				API: 'API'
			},
			NoUsageYet: "You don't have any usage yet."
		},
		APIKeys: {
			PageTitle: 'API Keys',
			PageParagraph:
				'Your secret API keys are listed below. They are only shown once when you first generate them. Make sure to save them somewhere safe.',
			NoKeysYet: "You don't have any API keys yet.",
			CreateAPIKeyButton: 'Create API Key',
			CreateNewKeyButton: 'Create New Key',
			DeleteKeyButton: 'Delete Key',
			KeyTable: {
				NameTitle: 'Name',
				KeyTitle: 'Key',
				CreatedAtTitle: 'Created',
				UsageTitle: 'Usage',
				LastUsedTitle: 'Last Used',
				LastUsedNeverDescription: 'Never'
			},
			KeyModal: {
				Create: {
					Title: 'Create New Key',
					Paragraph:
						'You can optionally give this key a name. This name can be used for identifying the key.',
					Input: {
						Title: 'Name',
						TitleAlt: 'Name (optional)'
					},
					CreateKeyButton: 'Create Key'
				},
				Created: {
					Title: 'New Key',
					Paragraph:
						"Please save this secret key somewhere safe. For security reasons, you won't be able to view it again.",
					Input: {
						Title: 'Secret Key'
					}
				},
				Delete: {
					Title: 'Revoke Key',
					Paragraph:
						"This key will disabled immediately. Requests made using this key will be rejected. Once revoked, you won't be able to view this key again.",
					RevokeKeyButton: 'Revoke Key'
				}
			}
		}
	},
	FeaturedOn: {
		PageTitle: 'Wir sind gefeaturt auf'
	},
	Gallery: {
		PageTitle: 'Galerie',
		PageParagraph: 'Schau Dir an, was andere mit Stablecog erstellt haben.',
		SearchInput: {
			Title: 'Suche'
		},
		BackToProfile: 'Back to Profile',
		BackToGalleryButton: 'Back to Gallery',
		SearchingTitle: 'Suchen...',
		Sort: {
			Title: 'Sort',
			Options: { New: 'New', Top: 'Top', Trending: 'Trending' }
		},
		SearchResultsTitle: 'Search Results',
		UsernameFilterInput: {
			Title: 'Username Search',
			Placeholder: 'Filter by username',
			Tag: 'Username: {username}'
		},
		NoMatchingGenerationTitle: 'Nichts Passendes gefunden'
	},
	Pricing: {
		PlansTitle: 'Abonnements',
		PlansParagraph: 'Wähle ein Abonnement, das für dich geeignet ist.',
		CreditPacksTitle: 'Guthaben-Pakete',
		CreditPacksParagraph: 'Brauchst Du mehr? Du kannst jederzeit zusätzliches Guthaben erwerben.',
		SubscribeButton: 'Abonnieren',
		SubscribedButton: 'Abonniert',
		UpgradeButton: 'Upgraden',
		DowngradeButton: 'Downgraden',
		PurchaseButton: 'Kostenpflichtig Kaufen',
		BuyCreditsButton: 'Guthaben kaufen',
		MonthlyTitle: 'Monatlich',
		YearlyTitle: 'Jährlich',
		SlashMonth: '/ Monat',
		GenerationsSubtitle: 'generations',
		GenerationsPerDaySubtitle: 'generations per day',
		GenerationsPerMonthSubtitle: 'generations per month',
		ImagesSubtitle: 'images',
		ImagesPerDaySubtitle: 'images per day',
		ImagesPerMonthSubtitle: 'images per month',
		Plans: {
			FreeTitle: 'Gratis',
			StarterTitle: 'Starter',
			ProTitle: 'Pro',
			UltimateTitle: 'Ultimate'
		},
		CreditPacks: {
			MediumTitle: 'Mittleres Paket',
			LargeTitle: 'Großes Paket',
			MegaTitle: 'Mega Package'
		},
		Features: {
			DailyCredits: '{count} credits per day.',
			DailyImages: '{count} images per day.',
			PersonalUseOnly: 'Personal use only.',
			MonthlyCredits: '{count} credits per month.',
			MonthlyImages: '{count} Bilder pro Monat.',
			MonthlyGenerations: '{count} Generierungen pro Monat.',
			NoParallelGenerations: 'No parallel generations.',
			ParallelGenerations: '{count} parallel generations.',
			Images: '%{count} Bilder.',
			Generations: '{count} Generierungen.',
			NeverExpires: 'Läuft nie ab.',
			GenerationQueuePriority: 'Generation priority.',
			NoGenerationQueuePriority: 'No generation priority.',
			OptionalCreditTopUps: 'Optional credit top-ups.',
			NoOptionalCreditTopUps: 'No credit top-ups.',
			CommercialUse: 'Kommerzielle Nutzung.',
			SlowGeneration: 'Slow generation',
			FastGeneration: 'Fast generation',
			ImagesArePublic: 'Bilder sind öffentlich.',
			MaxOneImagePerGeneration: 'Max. 1 image per generation.',
			MaxImagesPerGeneration: 'Max. {count} images per generation.',
			ImagesArePrivate: 'Bilder sind privat.'
		},
		Badges: {
			Recommended: 'Empfohlen',
			MostPopular: 'Am beliebtesten',
			BestValue: 'Bestes Preis-Leistungs-Verhältnis'
		},
		FreeForeverTitle: 'Free Forever!',
		Discounts: {
			FirstMonth30OffParagraph: 'First month is 30% off!',
			FirstMonth50OffParagraph: 'First month is 50% off!'
		},
		Purchase: {
			Succeeded: {
				PageTitle: 'Es kann los gehen!',
				PageParagraph:
					'Vielen Dank für Deinen Einkauf. Wenn Du Fragen hast, zögere nicht, uns auf {platform} zu kontaktieren.'
			},
			Cancelled: {
				PageTitle: 'Kauf abgebrochen',
				PageParagraph:
					'Du hast den Kaufvorgang abgebrochen. Wenn es ein Fehler war, kannst Du es erneut versuchen.'
			}
		}
	},
	FAQ: {
		Title: 'FAQ',
		TitleAlt: 'Frequently Asked Questions',
		Questions: {
			CommercialUse: {
				Question: 'Can I use the images commercially?',
				Answer:
					'If you create an image while you are subscribed to a plan (Starter, Pro or Ultimate), you can use that image commercially even if you cancel your plan afterwards at some point. If you are on the free plan, the images you create are for personal use only.'
			},
			MoreCredits: {
				Question: 'Can I buy more credits?',
				Answer:
					'Yes, you can buy more credits anytime as long as you have an active subscription. You can visit the account or the pricing page to buy more credits.'
			},
			CreditRollOver: {
				Question: 'Do credits roll over to the next month?',
				Answer:
					'No, credits do not roll over to the next month. Your credits will reset every month on your billing date.'
			},
			PlanUpgradeOrDowngrade: {
				Question: 'Can I upgrade or downgrade my plan?',
				Answer:
					"Yes, you can upgrade or downgrade your plan anytime. If you upgrade your plan, you'll keep the remaining credits from your previous plan too until they expire. The upgraded plan will be charged immediately, and fully."
			},
			PlanCancellation: {
				Question: 'Can I cancel my plan anytime?',
				Answer:
					'Yes, you can cancel your plan anytime and billing will stop at the end of that billing cycle. You will also keep your credits until the billing cycle ends.'
			},
			MoreQuestions: {
				Question: 'Where can I ask more questions?',
				Answer:
					'You can join our {Discord} to ask us anything. We are happy to help. You can also reach out via {Twitter} or {email}.',
				Parts: {
					Discord: 'Discord community',
					Email: 'email',
					Twitter: 'Twitter'
				}
			}
		}
	},
	LowOnCreditsCard: {
		Title: 'Du hast wenig Guthaben ({remainingCredits})',
		FreeWithMoreOnTheWay: {
			Paragraph:
				"Get more now by subscribing to a plan or participating in our events. You'll receive more free credits soon:"
		},
		FreeParagraph:
			'Täglich gewähren wir allen aktiven Nutzern kostenloses Guthaben. Du kannst mehr erhalten, indem Du ein Abonnement buchst oder an unseren Veranstaltungen teilnimmst.',
		HighestPlanParagraph: 'Du kannst ein Guthabenpaket kaufen.',
		OtherPlansParagraph:
			'Du kannst auf ein höheres Abonnement upgraden oder ein Guthaben-Paket kaufen.'
	},
	Contact: {
		PageTitle: 'Contact',
		PageParagraph:
			"If you have any inquiries or a questions, don't hesitate to reach out to us using the links below. We'll answer as soon as possible."
	},
	Support: {
		PageTitle: 'Support',
		PageParagraph:
			"If you have any questions, please reach out to us using the links below and we'll answer them as soon as possible."
	},

	Guide: {
		PageTitle: 'Guide',
		GuideButton: 'Guide',
		PreviousTitle: 'Previous',
		EndpointsTitle: 'Endpoints',
		EndpointTitle: 'Endpoint',
		NextTitle: 'Next',
		ChaptersTitle: 'Chapters',
		ChapterTitle: 'Chapter'
	},
	Try: { PageTitle: 'Try' },
	Legal: {
		PageTitle: 'Legal',
		PageParagraph: 'Our terms and policies are listed below.',
		TermsOfServiceTitle: 'Terms of Service',
		PrivacyPolicyTitle: 'Privacy Policy',
		RefundPolicyTitle: 'Refund Policy',
		AcceptedPoliciesParagraph: `By using our service, you agree to our {termsOfService} and {privacyPolicy}.`,
		ContentPolicyTitle: 'Content Policy'
	},
	Documentation: {
		PageTitle: 'Documentation',
		PageTitleAlt: 'API Reference',
		APIReferenceButton: 'API Reference',
		DocumentationButton: 'Documentation',
		DevelopersTitle: 'Developers',
		ForDevelopersTitle: 'For Developers'
	},
	Platform: {
		X: 'X',
		Discord: 'Discord',
		Email: 'Email',
		Twitter: 'Twitter',
		Instagram: 'Instagram',
		YouTube: 'YouTube',
		LinkedIn: 'LinkedIn',
		Reddit: 'Reddit',
		GitHub: 'GitHub',
		Telegram: 'Telegram',
		Facebook: 'Facebook',
		ProductHunt: 'Product Hunt',
		Stablecog: 'Stablecog',
		Raycast: 'Raycast'
	},
	Voiceover: {
		ModelOptions: { '0f442a3e-cf53-490b-b4a9-b0dda63e9523': { Name: 'Bark' } },
		SpeakerOptions: {
			'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff': {
				Name: 'Paul'
			},
			'39f7fc5d-9031-4932-a4d5-b196bb06e203': {
				Name: 'Jony'
			},
			'0140c5dc-af12-4643-bfec-650d3cd03c56': { Name: 'Bryan' },
			'4a19f17c-eedc-4cf8-a45d-1f9d69547125': { Name: 'Rachel' },
			'2e4e9572-2ea6-48a3-b134-381c68c9d516': { Name: 'Ella' },
			'2364bfb5-cdce-4a30-b979-a12f9f49cd39': { Name: 'Alice' },
			'91bf1331-a234-4478-a2a5-4dba4ac647fc': { Name: 'Olivia' },
			'3aebf12b-a7b8-41cf-9411-5808a231138e': { Name: 'Daniel' },
			'b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0': { Name: 'Thomas' },
			'aad61bf9-0710-40f6-8050-8c412852f717': { Name: 'Henry' },
			'37c069ec-f124-4be8-9d4c-e74157738877': { Name: 'Liam' },
			'38f9bd69-fa4c-4e53-b398-9a0f5865e927': { Name: 'Dan' },
			'5bd0610f-f073-487e-a74c-2a89105ce282': { Name: 'Gamze' },
			'7c3f8e30-9957-4d5e-a70e-c8269ff5f550': { Name: 'Mert' },
			'0188871e-c4d1-4ad9-ab3d-ec958c443822': { Name: 'Halit' },
			'4802af70-6d40-429d-8b9d-8df591e30743': { Name: 'Leyla' },
			'e10d4dac-7c39-4e96-9622-6d4e46fc384b': { Name: 'Murat' },
			'9354180b-9735-412c-947f-9d15af6edfe0': { Name: 'Mia' },
			'bcb7ac57-fd61-4630-82f0-ae3f836bb7c2': { Name: 'Eizo' },
			'b7542bad-e5fc-4c02-89ce-0ec22f6deceb': { Name: 'Ai' },
			'2cdb9e2c-42c1-49d0-959b-43d4bfc1828f': { Name: 'Shinya' },
			'37bb1326-d83e-425a-b21a-1a03ffea4d05': { Name: 'Emi' },
			'1eca6e55-53fb-4d70-995f-7e4da9266574': { Name: 'Emika' },
			'4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f': { Name: 'Adriana' },
			'9206e75b-2b28-47f0-899e-76ab476e1c3f': { Name: 'Jorge' },
			'573c37c7-f741-4d36-80dc-f126131c6343': { Name: 'Carmen' },
			'b06d6333-1e35-45a6-b18b-3187d34cc387': { Name: 'Pedro' },
			'90ba9324-476b-48ae-b88e-aed1975a51fd': { Name: 'David' },
			'babbbc15-5040-4e97-a89f-8309b13d7785': { Name: 'Annika' },
			'cafafcaa-45bf-45e0-901c-8ca63575ad2a': { Name: 'Leonie' },
			'31d7c264-b674-422b-9b8f-13195c3289b6': { Name: 'Fritz' },
			'b349543b-c727-4934-9f4f-249aa2a6b184': { Name: 'Wilhelm' },
			'c4796108-0e8a-4a7a-9a8a-bb66ff21e215': { Name: 'Hans' },
			'83c0ee48-c8ef-4a4c-bca8-9dae843d25da': { Name: 'Boris' },
			'947786c1-810d-44ce-808f-cdcf732d97fd': { Name: 'Alisa' },
			'2885a060-badc-4896-a4fa-f3656a58bb82': { Name: 'Ivan' },
			'92929922-0608-4b62-8a0d-f9d87a4ca2f5': { Name: 'Oleg' },
			'cb8a2dc4-fce9-4f17-b977-050aa78d8101': { Name: 'Xin' },
			'5001a3c9-557c-4775-ad6f-b71c47c3b4f1': { Name: 'Ming' },
			'd45f479f-42e5-4f15-b1a0-c9feabcdb3aa': { Name: 'Hu' },
			'56714211-532c-479b-ac8f-f2449af2310a': { Name: 'Shuang' },
			'052b721a-da7e-4614-b352-826411c262e2': { Name: 'Wan' }
		},
		List: {
			NotSignedIn: { Paragraph: 'Sign in to see your voiceovers.' },
			NoVoiceovers: { Paragraph: 'Your voiceovers will appear here.' }
		},
		Generate: {
			SpeakerParagraph: '{speakerName} will be speaking in {languageName}.',
			VoiceoverParagraph: 'The voiceover will appear here.'
		},
		PromptBar: {
			GenerateButton: 'Generate',
			CreditCost: '{creditCost} credit(s)',
			PromptInput: {
				Placeholder: 'Technology is a bridge between imagination and reality.'
			}
		},
		Settings: {
			Speaker: {
				Title: 'Speaker',
				Paragraph: 'The speaker for the voiceover.'
			},
			Language: {
				Title: 'Language',
				Paragraph: 'The language for the voiceover.'
			},
			VoiceStability: {
				Title: 'Voice Stability',
				Paragraph:
					'The stability level of the voice. Higher values make the voice more stable, lower values make it more variable.',
				Slider: {
					MoreStable: 'More stable',
					MoreVariable: 'More variable'
				}
			},
			DenoiseAudio: {
				Title: 'Denoise',
				Paragraph: 'Remove background noise from the audio.'
			},
			RemoveSilence: {
				Title: 'Remove Silence',
				Paragraph: 'Remove silent parts from the audio.'
			}
		},
		PlayButton: 'Play',
		PauseButton: 'Pause',
		MuteButton: 'Mute',
		UnmuteButton: 'Unmute'
	},
	Resources: { PageTitle: 'Resources' },
	Connect: {
		PageTitle: 'Connect',
		PageParagraph:
			'Click the button below to connect your {platform} account to your Stablecog account.',
		PageSuccessTitle: 'Connected!',
		ConnectButton: 'Connect',
		ReturnBackToParagraph: 'You can return back to {platform} now.',
		NoPlatformTokenParagraph:
			"This link doesn't contain a {platform} token. Please request a new link.",
		NoPlatformIDParagraph: "This link doesn't contain a {platform} ID. Please request a new link.",
		NoPlatformUsernameParagraph:
			"This link doesn't contain a {platform} username. Please request a new link.",
		ConnectToTitle: 'Connect to {platform}',
		ConnectToParagraph:
			'Create an account or sign in to connect your {platform} account to your Stablecog account.',
		Error: {
			InvalidToken: 'The token is invalid. Please request a new link via {platform}.',
			AlreadyLinked: 'Your account already has a {platform} account associated with it.'
		}
	},
	ShareCard: {
		Title: 'Share',
		Message: 'Check out this generation on Stablecog!',
		MessageUsersOwn: 'Check out my generation on Stablecog!'
	},
	UnderDevelopment: {
		PageTitle: 'Wir sind bald wieder da!',
		PageParagraph: 'Wir upgraden unsere Systeme. Wir sind in ein paar Stunden wieder da.'
	}
};
export default de;
