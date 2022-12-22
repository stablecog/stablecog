import type { BaseTranslation } from '../i18n-types';

const de: BaseTranslation = {
	Language: 'Sprache',
	Home: {
		GenerateButton: 'Generieren',
		PromptInput: {
			Placeholder: 'Porträt einer Katze von Van Gogh'
		},
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
			Title: 'Ähnlichkeit (Guidance Scale)',
			Paragraph:
				'Wie ähnlich das Bild den Eingabewörtern ist. Je höher der Wert ist, umso ähnlicher wird das Bild.'
		},
		NegativePromptInput: {
			Title: 'Wörter ausschließen',
			Placeholder: 'Wörter ausschließen',
			Paragraph: 'Um ungewollte Dinge auszuschließen. Bewirkt das Gegenteil von Eingabewörtern.'
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
		SchedulerDropdown: {
			Title: 'Zeitplaner',
			Paragraph:
				'Diffundiere das Bild auf eine bestimmte Art und Weise. Es kann das generierte Bild drastisch verändern. Einige benötigen weniger Schritte, um gute Ergebnisse zu erzielen.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Generierte Bilder zur Galerie hinzufügen?',
			Paragraph: 'Du kannst deine Einstellungen später ändern.'
		}
	},
	History: {
		GenerationsTitle: 'Generierte Bilder',
		GenerationsMaxSavedCountWarning: 'Nur die letzten {count:number}',
		NoGenerationsYet: 'Du hast noch keine Bilder generiert.'
	},
	Live: {
		GenerationsTitle: 'Generierte Bilder',
		TotalDurationTitle: 'Gesamtlaufzeit',
		UpscalesTitle: 'Hochskalierungen',
		GenerationTooltip: {
			CountryTitle: 'Land',
			Type: {
				Title: 'Typ',
				Generation: 'Generierung',
				Upscale: 'Hochskalierung'
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
			UnknownTitle: 'Unbekannt'
		},
		WaitingTitle: 'Warte auf Generierungen',
		DurationStatusUnknown: 'Unbekannt'
	},
	Navbar: {
		HomeTab: 'Start',
		HistoryTab: 'Verlauf',
		GalleryTab: 'Galerie',
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
	GenerationFullscreen: {
		DownloadButton: 'Download',
		DoneButtonState: 'Fertig!',
		CopyPromptButton: 'Eingabewörter kopieren',
		CopyNegativePromptButton: 'Ausgeschlossene Wörter kopieren',
		CopiedButtonState: 'Kopiert!',
		RerollButton: 'Seed durchmischen',
		RegenerateButton: 'Erneut generieren',
		GenerateButton: 'Generieren',
		UpscaleButton: 'Hochskalieren',
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
		BackToBlogButton: 'Zurück zum Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Weiterleitung zu {name:string}'
	},
	Shared: {
		StartGeneratingTitle: 'Beginne wunderschöne Bilder zu generieren!',
		StartGeneratingButton: 'Beginne zu generieren',
		JoinUsTitle: 'Folge uns',
		GoHomeButton: 'Zurück zur Startseite',
		SwitchToDefaultServerButton: 'Zum Standard-Server wechseln',
		ShareButton: 'Teilen',
		ShareOnButton: 'Auf {name:string} teilen',
		YesButton: 'Ja',
		NoButton: 'Nein',
		EnableButton: 'Aktivieren',
		DisableButton: 'Deaktivieren',
		AddButton: 'Hinzufügen',
		CopyLinkButton: 'Link kopieren',
		CopyButton: 'Kopieren',
		DeleteButton: 'Löschen',
		ServerUrlInput: {
			Placeholder: 'Server-URL'
		},
		LoadingTitle: 'Wird geladen',
		LoadingParagraph: 'Wird geladen...',
		LoginButton: 'Einloggen',
		LogoutButton: 'Logout',
		EmailInput: {
			Placeholder: 'E-Mail'
		},
		PasswordInput: {
			Placeholder: 'Passwort'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stabile Diffusion 1,5',
				simpleName: 'Allgemein'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3D Digital Art'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3D-Comic'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Anime'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Animierter Film'
			},
			'eaa438e1-dbf9-48fd-be71-206f0f257617': {
				realName: 'Redshift Diffusion',
				simpleName: '3D Render'
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
			}
		},
		UnknownTitle: 'Unbekannt',
		MoreOptionsTitle: 'Weitere Optionen',
		LessOptionsTitle: 'Weniger Optionen',
		TryAgainButton: 'Try Again'
	},
	Error: {
		SomethingWentWrong: 'Etwas ist schiefgelaufen :(',
		NSFW: 'NSFW-Inhalt erkannt, versuche andere Eingabewörter :(',
		ServerSeemsOffline:
			'Der Server scheint offline zu sein. Versuche die Seite zu aktualisieren oder wechsle in den Einstellungen zu einem anderen Server.',
		ServerSetNotWorking: 'Dieser Server ist nicht kompatibel oder antwortet nicht.',
		NotFound: 'Nicht gefunden',
		SupabaseNotFoundCantListen: 'Supabase-Instanz nicht gefunden. Kann keine Generierung annehmen.',
		InvalidEmail: 'Enter a valid email.',
		PasswordTooShort: 'Password must be at least 8 characters.',
		SomethingWentWrongTryAgain: 'Something went wrong, try again.'
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Löschen',
		ApproveButton: 'Freigeben',
		NoGenerationsToReview: 'Keine Generierung zu prüfen.',
		ServersButton: 'Server',
		GalleryButton: 'Galerie'
	},
	SignUp: {
		PageTitle: 'Sign Up',
		PageParagraph: 'Sign up to become a pro member. Unlock the full potential of Stablecog.',
		PageTitleConfirm: 'Confirm',
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
	Login: {
		PageTitle: 'Login',
		PageParagraph: 'Start using Stablecog with all features that are available to your account.',
		DontHaveAnAccountTitle: "Don't have an account?",
		SignUpInsteadButton: 'Sign up instead'
	},
	Pro: {
		PageTitle: 'Become a Pro',
		PageParagraph:
			"Unlock all features of Stablecog and support the project. Without the pro members, Stablecog wouldn't be able to stay completely open-source and offer free generations to everyone.",
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Full speed without set limits',
			ImageDimensions: 'Different image dimensions',
			Upscale: 'Upscale images',
			Steps: 'Different inference steps',
			MoreModels: 'More models',
			MoreSchedulers: 'More schedulers',
			SavedToCloud: 'Generations saved to the cloud',
			Upcoming: 'Upcoming features'
		},
		Soon: '(soon)',
		Month: '/month',
		BecomeProButton: 'Become a Pro',
		Success: {
			PageTitle: 'Thanks for becoming a pro!',
			PageParagraph:
				'You now have access to everything Stablecog has to offer. If you have any questions, reach out to us on {platform:string}.'
		},
		Cancel: {
			PageTitle: "You've cancelled",
			PageParagraph:
				"You've cancelled the subscription process. If it was a mistake, you can try again."
		}
	},
	Account: {
		PageTitle: 'Account',
		ManageSubscriptionButton: 'Manage Subscription',
		ManageAccountButton: 'Manage Account',
		MyAccountButton: 'My Account'
	}
};
export default de;
