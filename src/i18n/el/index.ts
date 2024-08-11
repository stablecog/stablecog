import type { Translation } from '../i18n-types';

const es: Translation = {
	Language: 'Γλώσσα',
	Landing: {
		Hero: {
			Title: 'Δημιουργήστε καταπληκτική τέχνη σε δευτερόλεπτα με AI.'
		},
		Describe: {
			Title: 'Περιγράψτε οτιδήποτε.',
			Paragraph:
				'Ό, τι σας αρέσει, σε χιλιάδες διαφορετικά στυλ. Θα δημιουργηθεί από AI σε δευτερόλεπτα.',
			Prompt: 'μαγευτική γάτα, ψυχεδελικό στυλ, βιολετί αποχρώσεις, φαντασία τοπίο'
		},
		InitImage: {
			Title: 'Ή ξεκινήστε με μια εικόνα.',
			Paragraph: 'Δώστε μια εικόνα εισαγωγής, δημιουργήστε νέα τέχνη βασισμένη σε αυτήν.',
			Prompt: 'εξωγήινο ρομπότ'
		},
		StartCreating: {
			Title: 'Ξεκινήστε να δημιουργείτε τώρα!',
			Paragraph:
				'Είναι δωρεάν να δοκιμάσετε :) Κάντε μια δοκιμή, νομίζουμε ότι θα σας αρέσει. Χιλιάδες χρήστες μας κάνουν.'
		},
		TryItNowButton: 'Δοκιμάστε το τώρα',
		StartCreatingButton: 'Αρχίστε να δημιουργείτε',
		GetStartedButton: 'Ας ξεκινήσουμε'
	},
	Home: {
		GenerateButton: 'Δημιουργία',
		PromptInput: {
			Title: 'Περιγραφή',
			Placeholder: 'Πορτρέτο μιας γάτας από τον Βαν Γκονγκ'
		},
		WidthTabBar: {
			Title: 'Πλάτος',
			Paragraph: 'Το πλάτος της εικόνας.'
		},
		HeightTabBar: {
			Title: 'Ύψος',
			Paragraph: 'Το ύψος της εικόνας.'
		},
		InferenceStepsTabBar: {
			Title: 'Βήματα Εισαγωγής',
			Paragraph: 'Πόσα βήματα θα χρειαστούν για τη δημιουργία (διάχυση) της εικόνας.'
		},
		GuidanceScaleSlider: {
			Error: {
				TooHigh: 'That high of a value might produce poor results.',
				TooLow: 'That low of a value might produce poor results.'
			},
			Title: 'Κλίμακα βαρύτητας',
			Paragraph:
				'Πόσο παρόμοια θα είναι η εικόνα με την περιγραφή σας. Υψηλότερες τιμές κάνουν την εικόνα κοντινότερη στην περιγραφή.'
		},
		AspectRatioDropdown: {
			Title: 'Αναλογία διαστάσεων',
			Paragraph: 'Αναλογία διαστάσεων εικόνας.',
			Options: {
				Square: 'Τετράγωνο (1:1)',
				Portrait: 'Κατακόρυφη (2:3)',
				Landscape: 'Οριζόντια (3:2)',
				Mobile: 'Κινητό (9:16)',
				Desktop: 'Υπολογιστής (16:9)',
				Anamorphic: 'Αναμορφική (2.4:1)',
				Squarish: 'Ορθογώνιο (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: 'Αναλογία διαστάσεων',
			Paragraph: 'Αναλογία διαστάσεων εικόνας.'
		},
		InitialImageTabBar: {
			Title: 'Αρχική Εικόνα',
			Paragraph: 'Η τελική σύνθεση θα δημιουργηθεί με βάση αυτή την εικόνα.'
		},
		InitialImageStrengthTabBar: {
			TitleAlt: 'Ισχύς Εικόνας',
			Title: 'Αρχική Ισχύς Εικόνας',
			Paragraph:
				'Ελέγχει την επίδραση της αρχικής εικόνας. Όσο μεγαλύτερη είναι η τιμή, τόσο μεγαλύτερη επιρροή έχει η αρχική εικόνα.'
		},
		NegativePromptInput: {
			Title: 'Αρνητική περιγραφή',
			Placeholder: 'Αρνητική περιγραφή',
			PlaceholderAlt: 'Εισαγάγετε πράγματα προς αποφυγή',
			Paragraph:
				'Για να αφαιρέσετε τα ανεπιθύμητα αποτελέσματα από την εικόνα. Κάνει το αντίθετο από αυτό που κάνει η περιγραφή.'
		},
		ImageInput: {
			NotSupported: 'Not supported by the model',
			Paragraph: 'Κάντε κλικ ή αποθέστε την εικόνα σας εδώ',
			Title: 'Μεταφόρτωση εικόνας'
		},
		SeedInput: {
			Title: 'Κωδικός εικόνας',
			Placeholder: 'Κωδικός αριθμός εικόνας',
			Paragraph:
				'Για επαναλαμβανόμενα αποτελέσματα. Ίδιος κωδικός εικόνας, σε συνδυασμό με την ίδια περιγραφή και ρυθμίσεις, δημιουργεί την ίδια εικόνα.'
		},
		ModelDropdown: {
			Title: 'Μοντέλο',
			Paragraph: 'Το μοντέλο AI που θα χρησιμοποιηθεί για τη δημιουργία της εικόνας.'
		},
		NumOutputsSlider: {
			Title: 'Αριθμός εικόνων',
			Paragraph: 'Ο αριθμός των εικόνων που θα παραχθούν.'
		},
		ShowOnProfileToggle: {
			Title: 'Show on Profile',
			Paragraph: 'Whether to show the generated images on your profile.'
		},
		SchedulerDropdown: {
			Title: 'Προγραμματισμός',
			Paragraph:
				'Δημιουργήστε την εικόνα με συγκεκριμένο τρόπο. Μπορεί να αλλάξει δραστικά την τελική εικόνα. Μερικές απαιτούν λιγότερα βήματα για να παράξουν καλά αποτελέσματα.'
		},
		ModelTag: 'Model: {modelName}',
		SubmitToGalleryQuestion: {
			Title: 'Υποβολή των παραγώγων στη συλλογή;',
			Paragraph: 'Μπορείτε να αλλάξετε την προτίμησή σας στις ρυθμίσεις αργότερα.'
		}
	},
	Generate: {
		ShowSettingsButton: 'Εμφάνιση ρυθμίσεων',
		HideSettingsButton: 'Απόκρυψη ρυθμίσεων',
		QueueTitle: 'Queue',
		SkipTheQueueButton: 'Skip the Queue',
		PositionInQueueTitle: 'Position in queue',
		Grid: {
			NotSignedIn: {
				Paragraph: 'Συνδεθείτε για να δείτε τις δημιουργίες σας.'
			},
			NoGeneration: {
				Paragraph: 'Οι δημιουργίες σας θα εμφανιστούν εδώ.'
			}
		}
	},
	History: {
		GenerationsTitle: 'Παράγωγες εικόνες',
		GenerationsMaxSavedCountWarning: 'Μόνο οι τελευταίες {count}',
		DownloadLegacyGenerationsButton: 'Λήψη εικόνων παλαιού τύπου',
		Views: {
			AllTitle: 'Όλα',
			LikesTitle: 'Likes',
			FavoritesTitle: 'Αγαπημένα'
		},
		NoFavoritesYet: 'Δεν έχετε αγαπημένα ακόμα.',
		NoLikesYet: "You haven't liked anything yet.",
		NoGenerationsYet: 'Δεν έχετε δημιουργήσει εικόνες ακόμα.'
	},
	Live: {
		GenerationsTitle: 'Παράγωγα',
		TotalDurationTitle: 'Συνολική Διάρκεια',
		UpscalesTitle: 'Αναβαθμίσεις',
		VoiceoversTitle: 'Φωνητική κάλυψη',
		GenerationTooltip: {
			AspectRatioTitle: 'Αναλογία διαστάσεων',
			CountryTitle: 'Χώρα',
			Type: {
				Title: 'Τύπος',
				Generation: 'Παράγωγη εικόνα',
				Upscale: 'Αναβάθμιση',
				Voiceover: 'Φωνητική κάλυψη'
			},
			DimensionsTitle: 'Διαστάσεις',
			StepsTitle: 'Βήματα',
			ScaleTitle: 'Κλίμακα',
			DurationTitle: 'Διάρκεια',
			Status: {
				Title: 'Κατάσταση',
				Started: 'Άρχισε',
				Succeeded: 'Πέτυχε',
				Failed: 'Απέτυχε'
			},
			Server: {
				Title: 'Διακομιστής',
				Default: 'Προεπιλογή',
				Custom: 'Προσαρμοσμένο'
			},
			OutputsTitle: 'Αποδόσεις'
		},
		WaitingTitle: 'Αναμονή για παράγωγες εικόνες',
		DurationStatusUnknown: 'Άγνωστο'
	},
	Navbar: {
		HomeTab: 'Αρχική',
		GenerateTab: 'Δημιουργία',
		HistoryTab: 'Ιστορικό',
		GalleryTab: 'Συλλογή',
		AdminGalleryTab: 'Συλλογή Διαχειριστή',
		PricingTab: 'Τιμές',
		AccountTab: 'Λογαριασμός',
		VoiceoverTab: 'Φωνητική κάλυψη',
		LiveTab: 'Ζωντανά'
	},
	Settings: {
		Title: 'Ρυθμίσεις',
		SwitchServerButton: 'Εναλλαγή Διακομιστή',
		SubmitToGalleryToggle: 'Αποθήκευση στη Συλλογή',
		AdvancedModeToggle: 'Λειτουργία για Προχωρημένους',
		AdvancedOptionsDropdown: 'Επιλογές για προχωρημένους',
		AdvancedDropdown: 'Για προχωρημένους',
		GenerationSettingsButton: 'Ρυθμίσεις Δημιουργιας',
		GenerationSettingsTitle: 'Ρυθμίσεις Δημιουργίας',
		DarkModeToggle: 'Σκούρo Φόντο'
	},
	Inpainting: { OriginalImageTitle: 'Original' },
	GenerationFullscreen: {
		DownloadButton: 'Λήψη',
		DoneButtonState: 'Ολοκληρώθηκε!',
		CopyPromptButton: 'Αντιγραφή Περιγραφής',
		CopyNegativePromptButton: 'Αντιγραφή Αρνητικής Περιγραφής',
		CopiedButtonState: 'Αντιγράφηκε!',
		GenerateSimilarButton: 'Δημιουργία Παρόμοιου',
		ExploreSimilarButton: 'Εξερευνήστε Παρόμοια',
		ExploreStyleButton: 'Εξερεύνηση Στυλ',
		RerollButton: 'Αναδημιουργία',
		RegenerateButton: 'Αναπαραγωγή',
		GenerateButton: 'Δημιουργία',
		EditButton: 'Edit',
		UpscaleButton: 'Αύξηση ανάλυσης',
		SimilarTitle: 'Παρόμοια',
		ShowOnProfileButton: 'Show on Profile',
		SubmitToGalleryButton: 'Αποθήκευση στη Συλλογή',
		SubmittedTitle: 'Υποβλήθηκε',
		UpscaleTabBar: {
			UpscaledTitle: 'Αναβαθμισμένη',
			OriginalTitle: 'Αρχική'
		},
		Dimensions: {
			Title: 'Διαστάσεις'
		},
		Duration: {
			Title: 'Διάρκεια'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Ορισμός Διακομιστή',
		SwitchServerTitle: 'Εναλλαγή Διακομιστή',
		Paragraph: 'Ο διακομιστής θα χρησιμοποιηθεί για τη δημιουργία εικόνων.',
		SetButton: 'Ορισμός',
		DefaultButton: 'Προεπιλογή'
	},
	Blog: {
		Title: 'Δημοσιεύσεις Ιστολογίου',
		TitleAlt: 'Ιστολόγιο',
		ThanksForReading: 'Thanks for reading!',
		ReadMoreTitle: 'Read More',
		BackToBlogButton: 'Επιστροφή στο Ιστολόγιο'
	},
	Redirect: { RedirectingTitle: 'Redirecting', RedirectingToTitle: 'Ανακατεύθυνση σε {name}' },
	Shared: {
		StartGeneratingTitle: 'Αρχίστε να δημιουργείτε όμορφες εικόνες!',
		StartGeneratingButton: 'Έναρξη Δημιουργίας',
		JoinUsTitle: 'Γίνετε μέλος',
		GoHomeButton: 'Πίσω Στην Αρχική',
		SwitchToDefaultServerButton: 'Εναλλαγή σε προεπιλεγμένο διακομιστή',
		JoinOnDiscord: 'Βρείτε μας στο Discord',
		JoinUsOnTitle: 'Συνδεθείτε μαζί μας στο {name}',
		ShareButton: 'Κοινοποίηση',
		ShareOnButton: 'Κοινοποίηση σε {name}',
		GoBackButton: 'Επιστροφή',
		UnknownTitle: 'Άγνωστο',
		YesButton: 'Ναι',
		NoButton: 'Όχι',
		EnableButton: 'Ενεργοποίηση',
		DoneButton: 'Τέλος',
		ReportButton: 'Report',
		ReportErrorButton: 'Report Error',
		CancelButton: 'Ακύρωση',
		ClearAllButton: 'Εκκαθάριση όλων',
		DisableButton: 'Απενεργοποίηση',
		DownloadButton: 'Λήψη',
		NewTitle: 'New',
		AddButton: 'Προσθήκη',
		CopyLinkButton: 'Αντιγραφή Συνδέσμου',
		CopiedButton: 'Copied!',
		CopyButton: 'Αντιγραφή',
		DeleteButton: 'Διαγραφή',
		LoadingTitle: 'Μεταφόρτωση',
		ContinueButton: 'Συνέχεια',
		ReachedTheEndTitle: "You've reached the end.",
		ProfileButton: 'Profile',
		VisitProfileButton: 'Visit Profile',
		YourProfileButton: 'Your Profile',
		LoadingParagraph: 'Μεταφόρτωση...',
		InsufficientCreditsTitle: 'Ανεπαρκείς μονάδες ({remainingCredits}/{neededCredits})',
		AllTitle: 'Όλα',
		ConfirmButton: 'Επιβεβαίωση',
		SimilarToTitle: 'Παρόμοια με: {item}',
		ResourcesTitle: 'Πόροι',
		ResourcesButton: 'Πόροι',
		On: 'Ενεργό',
		Off: 'Ανενεργό',
		FeatureNoLongerAvailableParagraph: 'This feature is no longer available.',
		BetaTitle: 'Δοκιμαστική Έκδοση',
		ConfirmQuestionMarkButton: 'Επιβεβαίωση;',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Τύπος μονάδων',
				RemainingCreditsTitle: 'Υπόλοιπο',
				ExpiryTitle: 'Λήξη',
				LastReplenish: 'Τελευταία Ανανέωση'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Παύση Επεξεργασίας',
			PauseEditingButtonAlt: 'Pause',
			DeselectButton: 'Αποεπιλογή ({selectedCount})',
			DeleteButton: 'Διαγραφή ({selectedCount})',
			FavoriteButton: 'Αγαπημένα ({selectedCount})',
			ApproveButton: 'Έγκριση ({selectedCount})',
			RejectButton: 'Απόρριψη ({selectedCount})',
			ToApproveButton: 'To Approve ({selectedCount})',
			UnfavoriteButton: 'Διαγραφή από τα αγαπημένα ({selectedCount})',
			ConfirmationModal: {
				CancelButton: 'Ακύρωση',
				Deselect: {
					Title: 'Κατάργηση επιλογής {selectedCount} στοιχείου(-ων);',
					Paragraph:
						'Είστε βέβαιοι ότι θέλετε να καταργήσετε την επιλογή {selectedCount} στοιχείου (-ων);',
					ConfirmButton: 'Κατάργηση επιλογής'
				},
				Delete: {
					Title: 'Διαγραφή {selectedCount} στοιχείου(-ων);',
					Paragraph: 'Είστε βέβαιοι ότι θέλετε να διαγράψετε {selectedCount} στοιχείο(-α);',
					ConfirmButton: 'Διαγραφή'
				},
				Favorite: {
					Title: 'Προσθήκη {selectedCount} στοιχείου(-ων) στα Αγαπημένα;',
					Paragraph: 'Είστε βέβαιοι ότι θέλετε το/τα {selectedCount} στοιχείο(-α) στα Αγαπημένα;',
					ConfirmButton: 'Προσθήκη στα Αγαπημένα'
				},
				Unfavorite: {
					Title: 'Αφαίρεση {selectedCount} στοιχείου(-ων) από τα Αγαπημένα;',
					Paragraph:
						'Είστε βέβαιοι ότι θέλετε να αφαιρέσετε {selectedCount} στοιχείο(-α) στα Αγαπημένα;',
					ConfirmButton: 'Αφαίρεση από αγαπημένα'
				}
			}
		},
		ServerUrlInput: {
			Placeholder: 'Διεύθυνση URL διακομιστή'
		},
		EmailInput: {
			Placeholder: 'Ηλεκτρονικό ταχυδρομείο'
		},
		PasswordInput: {
			Placeholder: 'Κωδικός πρόσβασης'
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
			'0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b': { realName: 'FLUX.1' },
			'22b0857d-7edc-4d00-9cd9-45aa509db093': {
				realName: 'Kandinsky'
			},
			'986d447d-c38b-4218-a2c8-6e0b691f47ec': { realName: 'Stable Diffusion 3' },
			'9fa49c00-109d-430f-9ddd-449f02e2c71a': {
				realName: 'Kandinsky 2.2'
			},
			'8002bc51-7260-468f-8840-cf1e6dbe3f8a': {
				realName: 'SDXL'
			},
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
				realName: 'Euler.'
			},
			'9d175114-9a26-4371-861c-729ba9ecb4da': {
				realName: 'Dpm Multistep'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			},
			'82cf78dd-6afb-48cc-aca6-14224cca6950': {
				realName: 'DDIM'
			},
			'01e94c28-501d-4c6d-8f00-079f3230bf58': {
				realName: 'UniPC'
			},
			'cc1b8dbf-0aec-4e52-8110-8082506fb7ba': {
				realName: 'DDPM'
			},
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		AdvancedSettingsButton: 'Προχωρημένες Ρυθμίσεις',
		MoreOptionsTitle: 'Περισσότερες επιλογές',
		LessOptionsTitle: 'Λιγότερες επιλογές',
		TryAgainButton: 'Προσπαθήστε ξανά',
		RefreshButton: 'Ανανέωση',
		LoadMoreButton: 'Εμφάνιση περισσότερων',
		BackToProfile: 'Back to Profile',
		BackToGalleryButton: 'Πίσω στη Συλλογή',
		SearchingTitle: 'Αναζήτηση',
		NoResultsFoundTitle: 'Δεν βρέθηκαν αποτελέσματα'
	},
	Error: {
		SomethingWentWrong: 'Παρουσιάστηκε κάποιο πρόβλημα :(',
		PromptWasNSFW: 'This prompt might produce sensitive content :(',
		ImageWasNSFW: 'Αυτή η εικόνα ήταν ακατάλληλη :(',
		NSFW: 'Ανιχνεύθηκε ένδειξη ακατάλληλου περιεχομένου, δοκιμάστε μια άλλη περιγραφή :(',
		ServerSeemsOffline:
			'Ο διακομιστής φαίνεται εκτός σύνδεσης. Ίσως θέλετε να ανανεώσετε τη σελίδα ή να ορίσετε άλλο διακομιστή από τις ρυθμίσεις.',
		ServerSetNotWorking: 'Αυτός ο διακομιστής δεν είναι συμβατός ή δεν ανταποκρίνεται.',
		NotFound: 'Δεν Βρέθηκε',
		SupabaseNotFoundCantListen:
			'Η παρουσία Supabase δεν βρέθηκε. Δεν είναι δυνατή η ακρόαση για παραγωγή εικόνων.',
		InvalidEmail: 'Παρακαλούμε εισάγετε μία έγκυρη διεύθυνση ηλεκτρονικού ταχυδρομείου.',
		PasswordTooShort: 'Ο κωδικός πρόσβασής σας πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες.',
		SomethingWentWrongTryAgain: 'Κάτι πήγε στραβά. Παρακαλώ προσπαθήστε ξανά.',
		InvalidCredentials: 'Μη έγκυρα στοιχεία εισόδου.',
		InvalidCode: 'Μη έγκυρος κωδικός.',
		TryAnotherImage: 'Δοκιμάστε μια άλλη εικόνα :(',
		OnceEvery60Seconds: 'Μπορείτε να ζητήσετε σύνδεσμο μόνο μία φορά κάθε 60 δευτερόλεπτα.',
		OAuthFailed: {
			Title: 'Connection Error',
			Paragraph: 'A problem occurred while connecting to the service provider.'
		},
		LinkExpired: {
			TitleAlt: 'The link is expired',
			Title: 'Ο σύνδεσμος έληξε',
			Paragraph: 'Ο σύνδεσμος μπορεί να χρησιμοποιηθεί μόνο μία φορά και λήγει μετά από 24 ώρες.'
		},
		UpdateAvailable: {
			Title: 'Υπάρχει διαθέσιμη ενημέρωση',
			Paragraph: 'Υπάρχει μια ενημέρωση! Ανανεώστε τη σελίδα για να τη λάβετε.'
		},
		EmailProviderNotAllowed: 'Αυτός ο πάροχος ηλεκτρονικού ταχυδρομείου δεν επιτρέπεται.',
		EmailNotAllowed: "This email isn't allowed.",
		EmailAlreadyInUse: 'Αυτός ο λογαριασμός ηλεκτρονικού ταχυδρομείου χρησιμοποιείται ήδη.'
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
		AdminPanelTitle: 'Διαχειριστής',
		DeleteButton: 'Διαγραφή',
		ApproveButton: 'Έγκριση',
		RejectButton: 'Απόρριψη',
		EditButton: 'Επεξεργασία',
		EditViewButton: 'Επεξεργασία προβολής',
		NormalViewButton: 'Κανονική προβολή',
		StopEditButton: 'Διακοπή Επεξεργασίας',
		NoGenerationsToReview: 'Δεν υπάρχουν παράγωγα για αναθεώρηση.',
		ServersButton: 'Διακομιστές',
		AdminGalleryButton: 'Συλλογή Διαχειριστή',
		UsersButton: 'Χρήστες',
		AdminTab: 'Διαχειριστής',
		ServersTab: 'Διακομιστές',
		AdminGalleryTab: 'Συλλογή Διαχειριστή',
		LogsTab: 'Logs',
		UsersTab: 'Χρήστες',
		Users: {
			ConfirmAction: {
				ConfirmActionReferenceText: 'Επιβεβαιώνω την ενέργεια',
				ConfirmActionParagraph: 'Πληκτρολογήστε "{confirmActionText}" για επιβεβαίωση.',
				ConfirmActionInput: {
					Placeholder: 'Επιβεβαίωση'
				}
			},
			DeleteDataButton: 'Delete Data',
			DataDeletedAtTitle: 'Τα Δεδομένα Διαγράφηκαν',
			WillBeDeletedTitle: 'Θα διαγραφεί',
			BannedAtTitle: 'Αποκλεισμένοι',
			BannedTitle: 'Αποκλεισμένοι',
			UnbanUserButton: 'Κατάργηση Αποκλεισμού Χρήστη',
			BanDomainButton: 'Ban Domain',
			UnbanDomainButton: 'Unban Domain',
			BanUserButton: 'Αποκλεισμός Χρήστη',
			GiftCreditsButton: 'Δωρεάν μονάδες'
		},
		Gallery: {
			TotalTitle: 'Σύνολο',
			ApprovedTitle: 'Εγκρίθηκε',
			DeletedTitle: 'Διαγραφή',
			StatusDropdown: {
				All: 'Όλα',
				ManuallySubmitted: 'Χειροκίνητη Υποβολή',
				SubmittedBest: 'Submitted (Best)',
				Submitted: 'Υποβολή',
				Approved: 'Έγκριση',
				Rejected: 'Απόρριψη',
				Deleted: 'Διαγραφή',
				WaitingForApproval: 'Waiting for Approval',
				Private: 'Ιδιωτικό'
			},
			NoGenerationsToReview: 'Δεν υπάρχουν παράγωγα για αναθεώρηση'
		}
	},
	SignUp: {
		PageTitle: 'Εγγραφή',
		PageParagraph:
			'Εγγραφείτε στο Stablecog ως μέλος επί πληρωμή και ξεκλειδώστε τις πλήρεις δυνατότητές του.',
		PageTitleConfirm: 'Επιβεβαίωση',
		PageTitleConfirmAlt: 'Ελέγξτε το ηλεκτρονικό ταχυδρομείο σας',
		PageParagraphConfirm:
			'Σας στείλαμε έναν 6-ψήφιο κωδικό. Εισάγετέ τον παρακάτω για να επιβεβαιώσετε τον λογαριασμό σας.',
		SignUpButton: 'Εγγραφή',
		AllTitle: 'Όλα',
		ConfirmButton: 'Επιβεβαίωση',
		AlreadyHaveAnAccountTitle: 'Έχετε ήδη λογαριασμό;',
		LoginInsteadButton: 'Αλλιώς, συνδεθείτε',
		WantsEmailCheckbox: {
			Paragraph: 'Λάβετε ενημερώσεις, προσφορές ή ειδήσεις.',
			NoSpamParagraph: 'Χωρίς spam, υποσχόμαστε.'
		},
		SixDigitCodeInput: {
			Placeholder: '6ψήφιος κωδικός'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Ας ξεκινήσουμε',
		GetStartedButton: 'Ας ξεκινήσουμε',
		PageTitle: 'Είσοδος',
		PageParagraph:
			'Ξεκινήστε να χρησιμοποιείτε το Stablecog με όλες τις διαθέσιμες δυνατότητες για το λογαριασμό σας.',
		PageParagraphV2:
			'Αρχίστε να δημιουργείτε καταπληκτική τέχνη σε δευτερόλεπτα δωρεάν, δεν απαιτείται πιστωτική κάρτα.',
		PageTitleCreateAccountOrSignIn: 'Δημιουργία λογαριασμού ή είσοδος',
		PageParagraphCreateAccountOrSignIn:
			'Ξεκινήστε να χρησιμοποιείτε το Stablecog με όλες τις διαθέσιμες δυνατότητες για το λογαριασμό σας.',
		PageTitleSentLink: 'Ελέγξτε το ηλεκτρονικό ταχυδρομείο σας',
		PageParagraphSentLink:
			'Σας στείλαμε μήνυμα ηλεκτρονικού ταχυδρομείου με έναν σύνδεσμο εισόδου. Αν δεν το βλέπετε, ελέγξτε τον φάκελο ανεπιθύμητης αλληλογραφίας.',
		ContinueButton: 'Συνέχεια',
		ContinueWithProviderButton: 'Συνέχεια με {provider}',
		SignInWithProviderButton: 'Είσοδος με {provider}',
		OrContinueWithEmailTitle: 'Ή συνεχίστε μέσω ηλεκτρονικού ταχυδρομείου',
		DontHaveAnAccountTitle: 'Δεν έχετε λογαριασμό;',
		SignUpInsteadButton: 'Ή εγγραφείτε',
		SignInButton: 'Είσοδος',
		EnterCodeManuallyButton: 'Εισαγωγή κωδικού μη αυτόματα',
		SignOutButton: 'Αποσύνδεση'
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
		PageTitle: 'Λογαριασμός',
		ManageSubscriptionButton: 'Διαχείριση συνδρομής',
		ComparePlansButton: 'Σύγκριση Πλάνων',
		ManageAccountButton: 'Διαχείριση λογαριασμού',
		AccountButton: 'Λογαριασμός',
		MyAccountButton: 'Ο Λογαριασμός μου',
		SubscriptionPlanTitle: 'Πλάνο',
		RemainingImagesTitle: 'Υπολειπόμενες Εικόνες',
		UpcomingCreditsTitle: 'Upcoming Credits',
		RemainingCreditsTitle: 'Υπόλοιπες Μονάδες',
		RemainingTitle: 'Υπόλοιπο',
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
			UpdateSubscriptionTitle: 'Ενημέρωση Συνδρομής',
			ChangePlanTitle: 'Αλλαγή Πλάνου',
			CurrentPlanTitle: 'Τρέχον Πλάνο',
			NewPlanTitle: 'Νέο πλάνο',
			Downgrade: {
				DowngradingToTitle: 'Υποβάθμιση σε',
				Explanation: 'Οι υπάρχουσες μονάδες σας θα παραμείνουν.'
			},
			Upgrade: {
				UpgadingToTitle: 'Αναβάθμιση σε',
				Explanation: 'Οι υπάρχουσες μονάδες σας θα παραμείνουν.'
			},
			Failed: {
				PageTitle: 'Αποτυχία ενημέρωσης',
				PageParagraph: 'Παρουσιάστηκε σφάλμα κατά την αλλαγή πλάνου. Παρακαλώ προσπαθήστε ξανά.'
			},
			Succeeded: {
				PageTitle: 'Αλλαγή Πλάνου',
				PageParagraph: 'Το πλάνο σας έχει αλλάξει με επιτυχία.'
			}
		},
		Tabs: {
			Account: 'Λογαριασμός',
			Usage: 'Χρήση',
			APIKeys: 'Κλειδάριθμοι API',
			ConnectedApplications: 'Applications'
		},
		Meta: {
			AccountCreationTitle: 'Δημιουργία',
			LastSignInTitle: 'Τελευταία Σύνδεση',
			LastSeenTitle: 'Τελευταία εμφάνιση'
		},
		ChangeEmail: {
			PageTitle: 'Αλλαγή διεύθυνσης ηλεκτρονικού ταχυδρομείου',
			PageParagraph: 'Εισάγετε μια νέα διεύθυνση ηλεκτρονικού ταχυδρομείου για το λογαριασμό σας.',
			ChangeEmailButton: 'Αλλαγή διεύθυνσης ηλεκτρονικού ταχυδρομείου',
			NewEmailInput: {
				Placeholder: 'Νέα διεύθυνση ηλεκτρονικού ταχυδρομείου'
			},
			PageTitleSentLink: 'Ελέγξτε το ηλεκτρονικό ταχυδρομείο σας',
			PageParagraphSentLink:
				'Έχουμε στείλει συνδέσμους και στις δύο διευθύνσεις. Επιβεβαιώστε και τα δύο για να αλλάξετε τη διεύθυνση ηλεκτρονικού ταχυδρομείου του λογαριασμού σας.',
			PageTitleConfirmOtherEmail: 'Επιβεβαίωση άλλης διεύθυνσης ηλεκτρονικού ταχυδρομείου',
			PageParagraphConfirmOtherEmail:
				'Έχουμε επίσης στείλει ένα σύνδεσμο στην άλλη διεύθυνση ηλεκτρονικού ταχυδρομείου σας. Επιβεβαιώστε και αυτό, για να ολοκληρώσετε τη διαδικασία.'
		},
		Usage: {
			PageTitle: 'Χρήση',
			PageParagraph: 'Μπορείτε να δείτε την πρόσφατη χρήση σας παρακάτω.',
			RecentUsageTitle: 'Πρόσφατη Χρήση',
			UsageTable: {
				ID: 'Αναγνωριστικό (ID)',
				Type: 'Τύπος',
				Duration: 'Διάρκεια',
				Source: 'Προέλευση',
				RunTime: 'Χρόνος εκτέλεσης',
				Cost: 'Κόστος',
				Operation: 'Λειτουργία',
				Process: 'Διαδικασία',
				Platform: 'Πλατφόρμα'
			},
			UsageType: {
				Voiceover: 'Voiceover',
				Generate: 'Δημιουργία',
				Generation: 'Παράγωγη εικόνα',
				Upscale: 'Αύξηση ανάλυσης'
			},
			SourceType: {
				Web: 'Ιστός',
				WebApp: 'Εφαρμογή Ιστού',
				DiscordBot: 'Discord Bot',
				API: 'ΔΠΕ (API)'
			},
			NoUsageYet: 'Δεν έχετε καμία χρήση ακόμα.'
		},
		APIKeys: {
			PageTitle: 'Κλειδάριθμοι ΔΠΕ (API)',
			PageParagraph:
				'Τα μυστικά κλειδιά ΔΠΕ (API) παρατίθενται παρακάτω. Εμφανίζονται μόνο μία φορά, την πρώτη, όταν τα δημιουργείτε. Βεβαιωθείτε ότι τα αποθηκεύετε κάπου με ασφάλεια.',
			NoKeysYet: 'Δεν έχετε κανέναν κλειδάριθμο ΔΠΕ (API) ακόμα.',
			CreateAPIKeyButton: 'Δημιουργία κλειδαρίθμου ΔΠΕ (API)',
			CreateNewKeyButton: 'Δημιουργία νέου κλειδαρίθμου',
			DeleteKeyButton: 'Διαγραφή κλειδαρίθμου',
			KeyTable: {
				NameTitle: 'Ονομα',
				KeyTitle: 'Κλειδάριθμος',
				CreatedAtTitle: 'Δημιουργημένο',
				UsageTitle: 'Χρήση',
				LastUsedTitle: 'Χρησιμοποιήθηκε τελευταία',
				LastUsedNeverDescription: 'Ποτέ'
			},
			KeyModal: {
				Create: {
					Title: 'Δημιουργία νέου κλειδαρίθμου',
					Paragraph:
						'Προαιρετικά μπορείτε να δώσετε σε αυτόν τον κλειδάριθμο ένα όνομα. Αυτό το όνομα μπορεί να χρησιμοποιηθεί για την αναγνώριση του κλειδαρίθμου.',
					Input: {
						Title: 'Ονομα',
						TitleAlt: 'Όνομα (προαιρετικό)'
					},
					CreateKeyButton: 'Δημιουργία κλειδαρίθμου'
				},
				Created: {
					Title: 'Νέος Κλειδάριθμος',
					Paragraph:
						'Παρακαλείστε να αποθηκεύσετε αυτόν τον μυστικό κλειδάριθμο σε ασφαλές μέρος. Για λόγους ασφαλείας, δεν θα μπορείτε να το δείτε ξανά.',
					Input: {
						Title: 'Μυστικός Κλειδάριθμος'
					}
				},
				Delete: {
					Title: 'Ανάκληση Κλειδαρίθμου',
					Paragraph:
						'Αυτός ο κλειδάριθμος θα απενεργοποιηθεί αμέσως. Αιτήσεις που έγιναν χρησιμοποιώντας τον, θα απορριφθούν. Μόλις ανακληθεί, δεν θα μπορείτε να τον δείτε ξανά.',
					RevokeKeyButton: 'Ανάκληση Κλειδαρίθμου'
				}
			}
		}
	},
	FeaturedOn: {
		PageTitle: 'Συγκαταλεγόμαστε στα Προτεινόμενα του'
	},
	Gallery: {
		PageTitle: 'Συλλογή',
		PageParagraph: 'Δείτε τι έχουν δημιουργήσει άλλοι με την Stablecog.',
		SearchInput: {
			Title: 'Αναζήτηση'
		},
		BackToProfile: 'Back to Profile',
		BackToGalleryButton: 'Πίσω στη Συλλογή',
		SearchingTitle: 'Αναζήτηση',
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
		NoMatchingGenerationTitle: 'Δεν υπάρχει αντίστοιχο παράγωγο'
	},
	Pricing: {
		PlansTitle: 'Πλάνα',
		PlansParagraph: 'Επιλέξτε ένα πρόγραμμα που σας ταιριάζει.',
		CreditPacksTitle: 'Πακέτα μονάδων',
		CreditPacksParagraph:
			'Χρειάζεστε περισσότερες; Μπορείτε να αγοράσετε επιπλέον μονάδες ανά πάσα στιγμή.',
		SubscribeButton: 'Εγγραφή',
		SubscribedButton: 'Εγγραφήκατε',
		UpgradeButton: 'Αναβάθμιση',
		DowngradeButton: 'Υποβάθμιση',
		PurchaseButton: 'Αγορά',
		BuyCreditsButton: 'Αγορά μονάδων',
		MonthlyTitle: 'Μηνιαία',
		YearlyTitle: 'Ετήσια',
		SlashMonth: '/μήνα',
		GenerationsSubtitle: 'generations',
		GenerationsPerDaySubtitle: 'generations per day',
		GenerationsPerMonthSubtitle: 'generations per month',
		ImagesSubtitle: 'images',
		ImagesPerDaySubtitle: 'images per day',
		ImagesPerMonthSubtitle: 'images per month',
		Plans: {
			FreeTitle: 'Δωρεάν',
			StarterTitle: 'Πλάνο εκκίνησης',
			ProTitle: 'Μέλος επί πληρωμή',
			UltimateTitle: 'Πλάνο απόλυτων δυνατοτήτων'
		},
		CreditPacks: {
			MediumTitle: 'Μεσαίο Πακέτο',
			LargeTitle: 'Μεγάλο Πακέτο',
			MegaTitle: 'Αυξημένο Πακέτο'
		},
		Features: {
			DailyCredits: '{count} credits per day.',
			DailyImages: '{count} images per day.',
			PersonalUseOnly: 'Personal use only.',
			MonthlyCredits: '{count} μονάδες το μήνα.',
			MonthlyImages: '{count} μονάδες το μήνα.',
			MonthlyGenerations: '{count} δημιουργίες το μήνα.',
			NoParallelGenerations: 'No parallel generations.',
			ParallelGenerations: '{count} παράλληλες δημιουργίες.',
			Images: '{count} εικόνες.',
			Generations: '{count} δημιουργίες.',
			NeverExpires: 'Χωρίς Λήξη.',
			GenerationQueuePriority: 'Generation priority.',
			NoGenerationQueuePriority: 'No generation priority.',
			OptionalCreditTopUps: 'Optional credit top-ups.',
			NoOptionalCreditTopUps: 'No credit top-ups.',
			CommercialUse: 'Εμπορική χρήση.',
			SlowGeneration: 'Slow generation',
			FastGeneration: 'Fast generation',
			ImagesArePublic: 'Οι εικόνες είναι δημόσιες.',
			MaxOneImagePerGeneration: 'Max. 1 image per generation.',
			MaxImagesPerGeneration: 'Max. {count} images per generation.',
			ImagesArePrivate: 'Οι εικόνες είναι ιδιωτικές.'
		},
		Badges: {
			Recommended: 'Προτείνεται',
			MostPopular: 'Τα πιο δημοφιλή',
			BestValue: 'Βέλτιστη προσφορά'
		},
		FreeForeverTitle: 'Free Forever!',
		Discounts: {
			FirstMonth30OffParagraph: 'First month is 30% off!',
			FirstMonth50OffParagraph: 'First month is 50% off!'
		},
		Purchase: {
			Succeeded: {
				PageTitle: 'Είστε έτοιμοι!',
				PageParagraph:
					'Σας ευχαριστούμε για την αγορά σας. Αν έχετε οποιεσδήποτε ερωτήσεις, μπορείτε να επικοινωνήσετε μαζί μας στο {platform}.'
			},
			Cancelled: {
				PageTitle: 'Ακύρωση αγοράς',
				PageParagraph:
					'Έχετε ακυρώσει τη διαδικασία αγοράς. Αν επρόκειτο για λάθος, μπορείτε να δοκιμάσετε ξανά.'
			}
		}
	},
	FAQ: {
		Title: 'Συχνές ερωτήσεις',
		TitleAlt: 'Συχνές ερωτήσεις',
		Questions: {
			CommercialUse: {
				Question: 'Μπορώ να χρησιμοποιήσω τις εικόνες εμπορικά;',
				Answer:
					'Αν δημιουργήσετε μια εικόνα ενώ είστε εγγεγραμμένοι σε ένα πλάνο (Starter, Pro ή Ultimate), μπορείτε να χρησιμοποιήσετε αυτή την εικόνα εμπορικά, ακόμη και αν ακυρώσετε το πλάνο σας κάποια στιγμή στη συνέχεια. Αν είστε στο δωρεάν πλάνο, οι εικόνες που δημιουργείτε είναι μόνο για προσωπική χρήση.'
			},
			MoreCredits: {
				Question: 'Μπορώ να αγοράσω περισσότερες πιστωτικές μονάδες;',
				Answer:
					"Ναι, μπορείτε να αγοράσετε περισσότερες πιστωτικές μονάδες οποτεδήποτε εφ 'όσον έχετε μια ενεργή συνδρομή. Μπορείτε να επισκεφθείτε το λογαριασμό ή τη σελίδα τιμολόγησης για να αγοράσετε περισσότερες μονάδες."
			},
			CreditRollOver: {
				Question: 'Οι πιστωτικές μονάδες μεταφέρονται στον επόμενο μήνα;',
				Answer:
					'Όχι, οι πιστωτικές μονάδες δεν μεταφέρονται στον επόμενο μήνα. Οι μονάδες σας θα επαναφέρονται στον αρχικό τους αριθμό κάθε μήνα την ημερομηνία χρέωσής σας.'
			},
			PlanUpgradeOrDowngrade: {
				Question: 'Μπορώ να αναβαθμίσω ή να υποβαθμίσω το πρόγραμμά μου;',
				Answer:
					'Ναι, μπορείτε να αναβαθμίσετε ή να υποβαθμίσετε το πρόγραμμά σας οποιαδήποτε στιγμή. Αν αναβαθμίσετε το πρόγραμμά σας, θα κρατήσετε και τις υπόλοιπες πιστωτικές μονάδες από το προηγούμενο πρόγραμμα μέχρι να λήξουν. Το αναβαθμισμένο πρόγραμμα θα χρεωθεί άμεσα και πλήρως.'
			},
			PlanCancellation: {
				Question: 'Μπορώ να ακυρώσω το πρόγραμμά μου οποτεδήποτε;',
				Answer:
					'Ναι, μπορείτε να ακυρώσετε το πρόγραμμά σας ανά πάσα στιγμή και η χρέωση θα σταματήσει στο τέλος του συγκεκριμένου κύκλου χρέωσης. Θα κρατήσετε επίσης τις πιστωτικές μονάδες σας μέχρι να ολοκληρωθεί ο κύκλος χρέωσης.'
			},
			MoreQuestions: {
				Question: 'Πού μπορώ να κάνω περισσότερες ερωτήσεις;',
				Answer:
					'Μπορείτε να ενταχθείτε στο {Discord} να μας ζητήσετε οτιδήποτε. Θα χαρούμε να βοηθήσουμε. Μπορείτε επίσης να επικοινωνήσετε μέσω {Twitter} ή {email}.',
				Parts: {
					Discord: 'Discord',
					Email: 'ηλεκτρονικό ταχυδρομείο',
					Twitter: 'Twitter'
				}
			}
		}
	},
	LowOnCreditsCard: {
		Title: 'Έχετε λίγες μονάδες ({remainingCredits})',
		FreeWithMoreOnTheWay: {
			Paragraph:
				"Get more now by subscribing to a plan or participating in our events. You'll receive more free credits soon:"
		},
		FreeParagraph:
			'Δίνουμε σε όλους τους ενεργούς χρήστες δωρεάν μονάδες καθημερινά. Μπορείτε να πάρετε περισσότερες, αν εγγραφείτε σε ένα πλάνο ή συμμετέχετε στις εκδηλώσεις μας.',
		HighestPlanParagraph: 'Μπορείτε να αγοράσετε ένα πακέτο μονάδων.',
		OtherPlansParagraph:
			'Μπορείτε να αναβαθμίσετε σε ένα υψηλότερο πλάνο ή να αγοράσετε ένα πακέτο μονάδων.'
	},
	Contact: {
		PageTitle: 'Contact',
		PageParagraph:
			"If you have any inquiries or a questions, don't hesitate to reach out to us using the links below. We'll answer as soon as possible."
	},
	Support: {
		PageTitle: 'Υποστήριξη',
		PageParagraph:
			'Αν έχετε οποιεσδήποτε ερωτήσεις, παρακαλούμε επικοινωνήστε μαζί μας χρησιμοποιώντας τους παρακάτω συνδέσμους και θα απαντήσουμε το συντομότερο δυνατό.'
	},
	Guide: {
		PageTitle: 'Οδηγός',
		GuideButton: 'Οδηγός',
		PreviousTitle: 'Προηγούμενο',
		EndpointsTitle: 'Τελικά σημεία',
		EndpointTitle: 'Τελικό σημείο',
		NextTitle: 'Επόμενο',
		ChaptersTitle: 'Κεφάλαια',
		ChapterTitle: 'Κεφάλαιο'
	},
	Try: {
		PageTitle: 'Δοκιμή'
	},
	Legal: {
		PageTitle: 'Legal',
		PageParagraph: 'Our terms and policies are listed below.',
		TermsOfServiceTitle: 'Όροι χρήσης',
		PrivacyPolicyTitle: 'Πολιτική Απορρήτου',
		RefundPolicyTitle: 'Πολιτικές επιστροφής χρημάτων',
		AcceptedPoliciesParagraph: `By using our service, you agree to our {termsOfService} and {privacyPolicy}.`,
		ContentPolicyTitle: 'Πολιτική Περιεχομένου'
	},
	Documentation: {
		PageTitle: 'Τεκμηρίωση',
		PageTitleAlt: 'Παραπομπές API',
		APIReferenceButton: 'Παραπομπές API',
		DocumentationButton: 'Τεκμηρίωση',
		DevelopersTitle: 'Developers',
		ForDevelopersTitle: 'Για προγραμματιστές'
	},
	Platform: {
		X: 'X',
		Discord: 'Discord',
		Email: 'Ηλεκτρονικό ταχυδρομείο',
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
		ModelOptions: {
			'0f442a3e-cf53-490b-b4a9-b0dda63e9523': {
				Name: 'Bark'
			}
		},
		SpeakerOptions: {
			'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff': {
				Name: 'Πωλ'
			},
			'39f7fc5d-9031-4932-a4d5-b196bb06e203': {
				Name: 'Τζόνι'
			},
			'0140c5dc-af12-4643-bfec-650d3cd03c56': {
				Name: 'Μπράιαν'
			},
			'4a19f17c-eedc-4cf8-a45d-1f9d69547125': {
				Name: 'Ραχήλ'
			},
			'2e4e9572-2ea6-48a3-b134-381c68c9d516': {
				Name: "'Ελλα"
			},
			'2364bfb5-cdce-4a30-b979-a12f9f49cd39': {
				Name: 'Αλίκη'
			},
			'91bf1331-a234-4478-a2a5-4dba4ac647fc': {
				Name: 'Ολίβια'
			},
			'3aebf12b-a7b8-41cf-9411-5808a231138e': {
				Name: 'Δανιήλ'
			},
			'b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0': {
				Name: 'Θωμάς'
			},
			'aad61bf9-0710-40f6-8050-8c412852f717': {
				Name: 'Ερρίκος'
			},
			'37c069ec-f124-4be8-9d4c-e74157738877': {
				Name: 'Λίαμ'
			},
			'38f9bd69-fa4c-4e53-b398-9a0f5865e927': {
				Name: 'Νταν'
			},
			'5bd0610f-f073-487e-a74c-2a89105ce282': {
				Name: 'Γκάμζι'
			},
			'7c3f8e30-9957-4d5e-a70e-c8269ff5f550': {
				Name: 'Μερτ'
			},
			'0188871e-c4d1-4ad9-ab3d-ec958c443822': {
				Name: 'Χαλίτ'
			},
			'4802af70-6d40-429d-8b9d-8df591e30743': {
				Name: 'Λέιλα'
			},
			'e10d4dac-7c39-4e96-9622-6d4e46fc384b': {
				Name: 'Μουράτ'
			},
			'9354180b-9735-412c-947f-9d15af6edfe0': {
				Name: 'Μία'
			},
			'bcb7ac57-fd61-4630-82f0-ae3f836bb7c2': {
				Name: 'Ήζο'
			},
			'b7542bad-e5fc-4c02-89ce-0ec22f6deceb': {
				Name: 'Άι'
			},
			'2cdb9e2c-42c1-49d0-959b-43d4bfc1828f': {
				Name: 'Σίνια'
			},
			'37bb1326-d83e-425a-b21a-1a03ffea4d05': {
				Name: 'Έμι'
			},
			'1eca6e55-53fb-4d70-995f-7e4da9266574': {
				Name: 'Εμίκα'
			},
			'4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f': {
				Name: 'Αντριάνα'
			},
			'9206e75b-2b28-47f0-899e-76ab476e1c3f': {
				Name: 'Χόρχε'
			},
			'573c37c7-f741-4d36-80dc-f126131c6343': {
				Name: 'Κάρμεν'
			},
			'b06d6333-1e35-45a6-b18b-3187d34cc387': {
				Name: 'Πέντρο'
			},
			'90ba9324-476b-48ae-b88e-aed1975a51fd': {
				Name: 'Δαβίδ'
			},
			'babbbc15-5040-4e97-a89f-8309b13d7785': {
				Name: 'Αννίκα'
			},
			'cafafcaa-45bf-45e0-901c-8ca63575ad2a': {
				Name: 'Λεονί'
			},
			'31d7c264-b674-422b-9b8f-13195c3289b6': {
				Name: 'Φριτζ'
			},
			'b349543b-c727-4934-9f4f-249aa2a6b184': {
				Name: 'Βίλχελμ'
			},
			'c4796108-0e8a-4a7a-9a8a-bb66ff21e215': {
				Name: 'Χανς'
			},
			'83c0ee48-c8ef-4a4c-bca8-9dae843d25da': {
				Name: 'Μπόρις'
			},
			'947786c1-810d-44ce-808f-cdcf732d97fd': {
				Name: 'Αλίσα'
			},
			'2885a060-badc-4896-a4fa-f3656a58bb82': {
				Name: 'Ιβάν'
			},
			'92929922-0608-4b62-8a0d-f9d87a4ca2f5': {
				Name: 'Όλεγκ'
			},
			'cb8a2dc4-fce9-4f17-b977-050aa78d8101': {
				Name: 'Ζιν'
			},
			'5001a3c9-557c-4775-ad6f-b71c47c3b4f1': {
				Name: 'Μινγκ'
			},
			'd45f479f-42e5-4f15-b1a0-c9feabcdb3aa': {
				Name: 'Χου'
			},
			'56714211-532c-479b-ac8f-f2449af2310a': {
				Name: 'Σουάνγκ'
			},
			'052b721a-da7e-4614-b352-826411c262e2': {
				Name: 'Γουάν'
			}
		},
		List: {
			NotSignedIn: {
				Paragraph: 'Συνδεθείτε για να δείτε τις φωνητικές καλύψεις σας.'
			},
			NoVoiceovers: {
				Paragraph: 'Οι φωνητικές καλύψεις σας θα εμφανιστούν εδώ.'
			}
		},
		Generate: {
			SpeakerParagraph: '{speakerName} θα μιλήσει στα {languageName}.',
			VoiceoverParagraph: 'Η φωνητική κάλυψή σας θα εμφανιστεί εδώ.'
		},
		PromptBar: {
			GenerateButton: 'Δημιουργία',
			CreditCost: '{creditCost} πιστωτικές μονάδες',
			PromptInput: {
				Placeholder: 'Η τεχνολογία είναι μια γέφυρα μεταξύ φαντασίας και πραγματικότητας.'
			}
		},
		Settings: {
			Speaker: {
				Title: 'Ομιλητής',
				Paragraph: 'Ο ομιλητής για την φωνητική κάλυψη.'
			},
			Language: {
				Title: 'Γλώσσα',
				Paragraph: 'Η γλώσσα για την φωνητική κάλυψη.'
			},
			VoiceStability: {
				Title: 'Σταθερότητα Φωνής',
				Paragraph:
					'Το επίπεδο σταθερότητας της φωνής. Υψηλότερες τιμές καθιστούν τη φωνή πιο σταθερή, χαμηλότερες τιμές την καθιστούν πιο μεταβλητή.',
				Slider: {
					MoreStable: 'Πιο σταθερή',
					MoreVariable: 'Περισσότερο μεταβλητή'
				}
			},
			DenoiseAudio: {
				Title: 'Αφαίρεση θορύβου',
				Paragraph: 'Αφαιρέστε το θόρυβο βάθους από την ηχογράφηση.'
			},
			RemoveSilence: {
				Title: 'Αφαίρεση Σιωπής',
				Paragraph: 'Αφαιρέστε τα σιωπηλά τμήματα από την ηχογράφηση.'
			}
		},
		PlayButton: 'Αναπαραγωγή',
		PauseButton: 'Παύση',
		MuteButton: 'Σίγαση',
		UnmuteButton: 'Κατάργηση Σίγασης'
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
		PageTitle: 'Θα επιστρέψουμε σύντομα!',
		PageParagraph: 'Αναβαθμίζουμε τα συστήματά μας. Θα επιστρέψουμε σε μια-δυο ώρες.'
	}
};

export default es;
