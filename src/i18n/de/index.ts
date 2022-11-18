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
		}
	},
	Error: {
		SomethingWentWrong: 'Etwas ist schiefgelaufen :(',
		NSFW: 'NSFW-Inhalt erkannt, versuche andere Eingabewörter :(',
		ServerSeemsOffline:
			'Der Server scheint offline zu sein. Versuche die Seite zu aktualisieren oder wechsle in den Einstellungen zu einem anderen Server.',
		ServerSetNotWorking: 'Dieser Server ist nicht kompatibel oder antwortet nicht.',
		NotFound: 'Nicht gefunden',
		SupabaseNotFoundCantListen: 'Supabase-Instanz nicht gefunden. Kann keine Generierung annehmen.'
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Löschen',
		ApproveButton: 'Freigeben',
		NoGenerationsToReview: 'Keine Generierung zu prüfen.',
		ServersButton: 'Server',
		GalleryButton: 'Galerie'
	}
};
export default de;
