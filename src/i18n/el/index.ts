import type { Translation } from '../i18n-types';

const es: Translation = {
	Language: 'Γλώσσα',
	Home: {
		GenerateButton: 'Δημιουργία',
		PromptInput: {
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
			Title: 'Κλίμακα βαρύτητας περιγραφής',
			Paragraph:
				'Πόσο παρόμοια θα είναι η εικόνα με την περιγραφή σας. Υψηλότερες τιμές κάνουν την εικόνα κοντινότερη στην περιγραφή σας.'
		},
		AspectRatioDropdown: {
			Title: 'Αναλογία διαστάσεων',
			Paragraph: 'Aspect ratio of the image.',
			Options: {
				Square: 'Τετράγωνο (1:1)',
				Portrait: 'Κατακόρυφη (2:3)',
				Landscape: 'Οριζόντια (3:2)',
				Mobile: 'Κινητό (9:16)',
				Desktop: 'Υπολογιστής (16:9)',
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
			Title: 'Αρχική Ισχύς Εικόνας',
			Paragraph:
				'Ελέγχει την επίδραση της αρχικής εικόνας. Όσο μεγαλύτερη είναι η τιμή, τόσο μεγαλύτερη επιρροή έχει η αρχική εικόνα.'
		},
		NegativePromptInput: {
			Title: 'Αρνητική περιγραφή',
			Placeholder: 'Αρνητική περιγραφή',
			PlaceholderAlt: 'Enter things to avoid',
			Paragraph:
				'Για να αφαιρέσετε τα ανεπιθύμητα αποτελέσματα από την εικόνα. Κάνει το αντίθετο από αυτό που κάνει η περιγραφή.'
		},
		ImageInput: {
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
			Title: 'Number of Images',
			Paragraph: 'The number of images that will be generated.'
		},
		SchedulerDropdown: {
			Title: 'Προγραμματισμός',
			Paragraph:
				'Δημιουργήστε την εικόνα με συγκεκριμένο τρόπο. Μπορεί να αλλάξει δραστικά την τελική εικόνα. Μερικές απαιτούν λιγότερα βήματα για να παράξουν καλά αποτελέσματα.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Υποβολή των παραγώγων στη συλλογή;',
			Paragraph: 'Μπορείτε να αλλάξετε την προτίμησή σας στις ρυθμίσεις αργότερα.'
		}
	},
	History: {
		GenerationsTitle: 'Παράγωγες εικόνες',
		GenerationsMaxSavedCountWarning: 'Μόνο οι τελευταίες {count}',
		DownloadLegacyGenerationsButton: 'Λήψη εικόνων παλαιού τύπου',
		NoFavoritesYet: 'Δεν έχετε αγαπημένα ακόμα.',
		Views: {
			AllTitle: 'Όλα',
			FavoritesTitle: 'Αγαπημένα'
		},
		NoGenerationsYet: 'Δεν έχετε δημιουργήσει εικόνες ακόμα.'
	},
	Live: {
		GenerationsTitle: 'Παράγωγα',
		TotalDurationTitle: 'Συνολική Διάρκεια',
		UpscalesTitle: 'Αναβαθμίσεις',
		GenerationTooltip: {
			AspectRatioTitle: 'Αναλογία διαστάσεων',
			CountryTitle: 'Χώρα',
			Type: {
				Title: 'Τύπος',
				Generation: 'Παράγωγη εικόνα',
				Upscale: 'Αναβάθμιση'
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
			UnknownTitle: 'Άγνωστο',
			OutputsTitle: 'Αποδόσεις'
		},
		WaitingTitle: 'Αναμονή για παράγωγες εικόνες',
		DurationStatusUnknown: 'Άγνωστο'
	},
	Navbar: {
		HomeTab: 'Αρχική σελίδα',
		HistoryTab: 'Ιστορικό',
		GalleryTab: 'Συλλογή',
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
		DarkModeToggle: 'Σκούρη Λειτουργία'
	},
	GenerationFullscreen: {
		DownloadButton: 'Λήψη',
		DoneButtonState: 'Ολοκληρώθηκε!',
		CopyPromptButton: 'Αντιγραφή Περιγραφής',
		CopyNegativePromptButton: 'Αντιγραφή Αρνητικής Περιγραφής',
		CopiedButtonState: 'Αντιγράφηκε!',
		GenerateSimilarButton: 'Δημιουργία Παρόμοιου',
		RerollButton: 'Αναδημιουργία',
		RegenerateButton: 'Αναπαραγωγή',
		GenerateButton: 'Δημιουργία',
		UpscaleButton: 'Αύξηση ανάλυσης',
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
		BackToBlogButton: 'Επιστροφή στο Ιστολόγιο'
	},
	Redirect: {
		RedirectingToTitle: 'Ανακατεύθυνση σε {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Αρχίστε να δημιουργείτε όμορφες εικόνες!',
		StartGeneratingButton: 'Έναρξη Δημιουργίας',
		JoinUsTitle: 'Γίνετε μέλος',
		GoHomeButton: 'Μετάβαση Στην Αρχική',
		SwitchToDefaultServerButton: 'Εναλλαγή σε προεπιλεγμένο διακομιστή',
		JoinOnDiscord: 'Βρείτε μας στο Discord',
		JoinUsOnTitle: 'Συνδεθείτε μαζί μας στο {name}',
		ShareButton: 'Κοινοποίηση',
		ShareOnButton: 'Κοινοποίηση σε {name}',
		GoBackButton: 'Επιστροφή',
		YesButton: 'Ναι',
		NoButton: 'Όχι',
		EnableButton: 'Ενεργοποίηση',
		ClearAllButton: 'Clear All',
		DisableButton: 'Απενεργοποίηση',
		AddButton: 'Προσθήκη',
		CopyLinkButton: 'Αντιγραφή Συνδέσμου',
		CopyButton: 'Αντιγραφή',
		DeleteButton: 'Διαγραφή',
		LoadingTitle: 'Μεταφόρτωση',
		ContinueButton: 'Συνέχεια',
		LoadingParagraph: 'Μεταφόρτωση...',
		InsufficientCreditsTitle: 'Ανεπαρκείς μονάδες ({remainingCredits}/{neededCredits})',
		AllTitle: 'Όλα',
		ConfirmButton: 'Επιβεβαίωση',
		ConfirmQuestionMarkButton: 'Επιβεβαίωση;',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Credit Type',
				RemainingCreditsTitle: 'Remaining',
				ExpiryTitle: 'Expiry',
				LastReplenish: 'Last Replenish'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Παύση Επεξεργασίας',
			DeselectButton: 'Αποεπιλογή ({selectedCount})',
			DeleteButton: 'Διαγραφή ({selectedCount})',
			FavoriteButton: 'Αγαπημένα ({selectedCount})',
			ApproveButton: 'Έγκριση ({selectedCount})',
			RejectButton: 'Απόρριψη ({selectedCount})',
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
			Placeholder: 'Κωδικόs πρόσβασης'
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
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		UnknownTitle: 'Άγνωστο',
		AdvancedSettingsButton: 'Advanced Settings',
		MoreOptionsTitle: 'Περισσότερες επιλογές',
		LessOptionsTitle: 'Λιγότερες επιλογές',
		TryAgainButton: 'Προσπαθήστε ξανά',
		RefreshButton: 'Ανανέωση',
		LoadMoreButton: 'Εμφάνιση περισσότερων',
		SearchingTitle: 'Αναζήτηση',
		NoResultsFoundTitle: 'Δεν βρέθηκαν αποτελέσματα'
	},
	Error: {
		SomethingWentWrong: 'Παρουσιάστηκε κάποιο πρόβλημα :(',
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
		LinkExpired: {
			Title: 'Ο σύνδεσμος έληξε',
			Paragraph: 'Ο σύνδεσμος μπορεί να χρησιμοποιηθεί μόνο μία φορά και λήγει μετά από 24 ώρες.'
		},
		UpdateAvailable: {
			Title: 'Υπάρχει διαθέσιμη ενημέρωση',
			Paragraph: 'Υπάρχει μια ενημέρωση! Ανανεώστε τη σελίδα για να τη λάβετε.'
		},
		EmailProviderNotAllowed: 'Αυτός ο πάροχος ηλεκτρονικού ταχυδρομείου δεν επιτρέπεται.',
		EmailAlreadyInUse: 'Αυτός ο λογαριασμός ηλεκτρονικού ταχυδρομείου χρησιμοποιείται ήδη.'
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
		AdminGalleryButton: 'Συλλογή',
		UsersButton: 'Χρήστες',
		AdminTab: 'Διαχειριστής',
		ServersTab: 'Διακομιστές',
		AdminGalleryTab: 'Συλλογή',
		UsersTab: 'Χρήστες',
		Users: {
			GiftCreditsButton: 'Δωρεάν μονάδες'
		},
		Gallery: {
			TotalTitle: 'Σύνολο',
			ApprovedTitle: 'Εγκρίθηκε',
			DeletedTitle: 'Διαγραφή',
			StatusDropdown: {
				All: 'Όλα',
				ManuallySubmitted: 'Χειροκίνητη Υποβολή',
				Submitted: 'Υποβολή',
				Approved: 'Έγκριση',
				Rejected: 'Απόρριψη',
				Deleted: 'Διαγραφή',
				Private: 'Ιδιωτικό'
			},
			NoGenerationsToReview: 'Δεν υπάρχουν παράγωγα για αναθεώρηση'
		}
	},
	SignUp: {
		PageTitle: 'Εγγραφή',
		PageParagraph:
			'Εγγραφείτε στο Synthica ως μέλος επί πληρωμή και ξεκλειδώστε τις πλήρεις δυνατότητές του.',
		PageTitleConfirm: 'Επιβεβαίωση',
		PageTitleConfirmAlt: 'Ελέγξτε το ηλεκτρονικό ταχυδρομείο σας',
		PageParagraphConfirm:
			'Σας στείλαμε έναν 6-ψήφιο κωδικό. Εισάγετέ τον παρακάτω για να επιβεβαιώσετε τον λογαριασμό σας.',
		SignUpButton: 'Εγγραφή',
		AllTitle: 'Όλα',
		ConfirmButton: 'Επιβεβαίωση',
		AlreadyHaveAnAccountTitle: 'Έχετε ήδη λογαριασμό;',
		LoginInsteadButton: 'Αλλιώς, συνδεθείτε',
		SixDigitCodeInput: {
			Placeholder: '6ψήφιος κωδικός'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Ας ξεκινήσουμε',
		GetStartedButton: 'Ας ξεκινήσουμε',
		PageTitle: 'Είσοδος',
		PageParagraph:
			'Ξεκινήστε να χρησιμοποιείτε το Synthica με όλες τις διαθέσιμες δυνατότητες για το λογαριασμό σας.',
		PageParagraphV2:
			'Αρχίστε να δημιουργείτε καταπληκτική τέχνη σε δευτερόλεπτα δωρεάν, δεν απαιτείται πιστωτική κάρτα.',
		PageTitleCreateAccountOrSignIn: 'Δημιουργία λογαριασμού ή είσοδος',
		PageParagraphCreateAccountOrSignIn:
			'Ξεκινήστε να χρησιμοποιείτε το Synthica με όλες τις διαθέσιμες δυνατότητες για το λογαριασμό σας.',
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
		SignOutButton: 'Αποσύνδεση'
	},
	Pro: {
		PageTitle: 'Γίνετε μέλος επί πληρωμή',
		PageParagraph:
			'Ξεκλειδώστε όλα τα χαρακτηριστικά του Synthica και να υποστηρίξετε το έργο. Χωρίς τα επαγγελματικά μέλη, το Synthica δε θα ήταν σε θέση να παραμείνει εντελώς ανοιχτού κώδικα και να προσφέρει δωρεάν γενιές σε όλους.',
		PageTitleAlreadyPro: 'Είστε ήδη μέλος επί πληρωμή!',
		PageParagraphAlreadyPro:
			'Είστε ήδη ένα μέλος επί πληρωμή. Σας ευχαριστούμε για την υποστήριξη του έργου! Προχωρήστε, απολαύστε το Synthica και σκεφτείτε να το μοιραστείτε με τους φίλους σας.',
		ProPlanTitle: 'Μέλος επί πληρωμή',
		Features: {
			FullSpeed: 'Πλήρης ταχύτητα χωρίς προκαθορισμένα όρια',
			ImageDimensions: 'Διαφορετικές διαστάσεις εικόνας',
			Upscale: 'Αναβαθμίστε την ανάλυση των εικόνων',
			Steps: 'Διαφορετικά βήματα παραγωγής εικόνων',
			MoreModels: 'Περισσότερα μοντέλα',
			MoreSchedulers: 'Περισσότερες δυνατότητες προγραμματισμού',
			SavedToCloud: 'Αποθήκευση παραγώγων στο cloud',
			Upcoming: 'Προσεχείς Λειτουργίες',
			CommercialUse: 'Εμπορική χρήση'
		},
		Soon: '(σύντομα)',
		Month: '/μήνα',
		BecomeProButton: 'Γίνετε μέλος επί πληρωμή',
		Success: {
			PageTitle: 'Είστε μέλος επί πληρωμή!',
			PageParagraph:
				'Τώρα έχετε πρόσβαση σε όλα όσα έχει να προσφέρει το Synthica. Αν έχετε οποιεσδήποτε ερωτήσεις, επικοινωνήστε μαζί μας στο {platform}.'
		},
		Cancel: {
			PageTitle: 'Ακυρώσατε',
			PageParagraph:
				'Έχετε ακυρώσει τη διαδικασία αγοράς. Αν επρόκειτο για λάθος, μπορείτε να δοκιμάσετε ξανά.'
		},
		Reason: {
			ParagraphWidth: 'Αυτό το πλάτος εικόνας δεν είναι διαθέσιμο στο δωρεάν πλάνο.',
			ParagraphHeight: 'Αυτό το ύψος εικόνας δεν είναι διαθέσιμο στο δωρεάν πλάνο.',
			ParagraphDimensions: 'Αυτές οι διαστάσεις εικόνας δεν είναι διαθέσιμες στο δωρεάν πλάνο.',
			ParagraphUpscale: 'Η λειτουργία αναβάθμισης ανάλυσης δεν είναι διαθέσιμη στο δωρεάν πλάνο.',
			ParagraphInferenceSteps:
				'Αυτά τα βήματα παραγωγής εικόνας δεν είναι διαθέσιμα στο δωρεάν πλάνο.',
			ParagraphModel: 'Αυτό το μοντέλο τεχνητής νοημοσύνης δεν είναι διαθέσιμο στο δωρεάν πλάνο.',
			ParagraphScheduler: 'Η δυνατότητα προγραμματισμού δεν είναι διαθέσιμη στο δωρεάν πλάνο.',
			ParagraphWidthGeneration:
				'Αυτό το παράγωγο δημιουργήθηκε με τη χρήση ενός πλάτους εικόνας που δεν είναι διαθέσιμο στο δωρεάν πλάνο.',
			ParagraphHeightGeneration:
				'Αυτό το παράγωγο δημιουργήθηκε με τη χρήση ενός ύψους εικόνας που δεν είναι διαθέσιμο στο δωρεάν πλάνο.',
			ParagraphDimensionsGeneration:
				'Αυτό το παράγωγο δημιουργήθηκε χρησιμοποιώντας διαστάσεις εικόνας που δεν είναι διαθέσιμες στο δωρεάν πλάνο.',
			ParagraphInferenceStepsGeneration:
				'Αυτό το παράγωγο δημιουργήθηκε χρησιμοποιώντας μια ρύθμιση για βήματα παραγωγής που δεν είναι διαθέσιμα στο δωρεάν πλάνο.',
			ParagraphModelGeneration:
				'Αυτό το παράγωγο δημιουργήθηκε χρησιμοποιώντας ένα μοντέλο τεχνητής νοημοσύνης που δεν είναι διαθέσιμο στο δωρεάν πλάνο.',
			ParagraphSchedulerGeneration:
				'Αυτό το παράγωγο δημιουργήθηκε χρησιμοποιώντας μια δυνατότητα προγραμματισμού που δεν είναι διαθέσιμη στο δωρεάν πλάνο.'
		},
		Tier: {
			Title: {
				Free: 'Δωρεάν',
				Pro: 'Μέλος επί πληρωμή'
			},
			Badge: {
				Free: 'ΔΩΡΕΑΝ',
				Pro: 'ΜΕΛΟΣ ΕΠΙ ΠΛΗΡΩΜΗ'
			}
		}
	},
	Account: {
		PageTitle: 'Λογαριασμός',
		ManageSubscriptionButton: 'Διαχείριση συνδρομής',
		ComparePlansButton: 'Σύγκριση Πλάνων',
		ManageAccountButton: 'Διαχείριση λογαριασμού',
		MyAccountButton: 'Ο Λογαριασμός μου',
		SubscriptionPlanTitle: 'Πλάνο',
		RemainingImagesTitle: 'Υπόλοιπες Εικόνες',
		RemainingCreditsTitle: 'Υπόλοιπες Μονάδες',
		RemainingTitle: 'Υπόλοιπο',
		Subscription: {
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
		Meta: {
			AccountCreationTitle: 'Creation',
			LastSignInTitle: 'Last Sign-in',
			LastSeenTitle: 'Last Seen'
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
		}
	},
	ForgotPassword: {
		PageTitle: 'Επαναφορά κωδικού πρόσβασης',
		PageParagraph:
			'Θα στείλουμε έναν 6ψήφιο κωδικό στο ηλεκτρονικό ταχυδρομείο σας για την επαναφορά του κωδικού πρόσβασής σας.',
		SendResetCodeButton: 'Αποστολή κωδικού',
		PageTitleConfirmCode: 'Επιβεβαίωση',
		PageTitleConfirmCodeAlt: 'Ελέγξτε το ηλεκτρονικό ταχυδρομείο σας',
		PageParagraphConfirmCode:
			'Σας στείλαμε έναν 6-ψήφιο κωδικό. Εισάγετέ τον παρακάτω για να επιβεβαιώσετε τον λογαριασμό σας.',
		ConfirmCodeButton: 'Επιβεβαίωση',
		PageTitleNewPassword: 'Νέος Κωδικός Πρόσβασης',
		PageParagraphNewPassword: 'Εισάγετε ένα νέο κωδικό πρόσβασης για το λογαριασμό σας.',
		NewPasswordInput: {
			Placeholder: 'Νέος Κωδικός Πρόσβασης'
		},
		SetNewPasswordButton: 'Ορίστε νέο κωδικό',
		PageTitleSuccess: 'Ολοκληρώθηκε!',
		PageParagraphSuccess: 'Έχει γίνει επαναφορά του κωδικού πρόσβασής σας με επιτυχία.',
		ForgotPasswordButton: 'Ξεχάσατε το κωδικό;'
	},
	FeaturedOn: {
		PageTitle: 'Συγκαταλεγόμαστε στα Προτεινόμενα του'
	},
	Gallery: {
		PageTitle: 'Συλλογή',
		PageParagraph: 'Δείτε τι έχουν δημιουργήσει άλλοι με την Synthica.',
		SearchInput: {
			Title: 'Αναζήτηση'
		},
		SearchingTitle: 'Αναζήτηση',
		NoMatchingGenerationTitle: 'Δεν υπάρχει αντίστοιχο παράγωγο'
	},
	Pricing: {
		PlansTitle: 'Πλάνα',
		PlansParagraph: 'Επιλέξτε ένα πλάνο που σας ταιριάζει.',
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
			MonthlyCredits: '{count} μονάδες το μήνα.',
			MonthlyImages: '{count} μονάδες το μήνα.',
			MonthlyGenerations: '{count} δημιουργίες το μήνα.',
			Images: '{count} εικόνες.',
			Generations: '{count} δημιουργίες.',
			NeverExpires: 'Χωρίς Λήξη.',
			CommercialUse: 'Εμπορική χρήση.',
			ImagesArePublic: 'Οι εικόνες είναι δημόσιες.',
			ImagesArePrivate: 'Οι εικόνες είναι ιδιωτικές.'
		},
		Badges: {
			Recommended: 'Προτείνεται',
			MostPopular: 'Τα πιο δημοφιλή',
			BestValue: 'Βέλτιστη προσφορά'
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
	LowOnCreditsCard: {
		Title: 'Έχετε λίγες μονάδες ({remainingCredits})',
		FreeParagraph:
			'Δίνουμε σε όλους τους ενεργούς χρήστες δωρεάν μονάδες καθημερινά. Μπορείτε να πάρετε περισσότερες, αν εγγραφείτε σε ένα πλάνο ή συμμετέχετε στις εκδηλώσεις μας.',
		HighestPlanParagraph: 'Μπορείτε να αγοράσετε ένα πακέτο μονάδων.',
		OtherPlansParagraph:
			'Μπορείτε να αναβαθμίσετε σε ένα υψηλότερο πλάνο ή να αγοράσετε ένα πακέτο μονάδων.'
	},
	Support: {
		PageTitle: 'Υποστήριξη',
		PageParagraph:
			'Αν έχετε οποιεσδήποτε ερωτήσεις, παρακαλούμε επικοινωνήστε μαζί μας χρησιμοποιώντας τους παρακάτω συνδέσμους και θα απαντήσουμε το συντομότερο δυνατό.'
	},
	Guide: {
		PageTitle: 'Guide',
		GuideButton: 'Guide',
		PreviousTitle: 'Previous',
		NextTitle: 'Next',
		ChaptersTitle: 'Chapters',
		ChapterTitle: 'Chapter'
	},
	Legal: {
		TermsOfServiceTitle: 'Όροι χρήσης',
		PrivacyPolicyTitle: 'Πολιτική Απορρήτου',
		RefundPolicyTitle: 'Πολιτικές επιστροφής χρημάτων',
		ContentPolicyTitle: 'Πολιτική Περιεχομένου'
	},
	UnderDevelopment: {
		PageTitle: 'Θα επιστρέψουμε σύντομα!',
		PageParagraph: 'Αναβαθμίζουμε τα συστήματά μας. Θα επιστρέψουμε σε μια-δυο ώρες.'
	}
};
export default es;
