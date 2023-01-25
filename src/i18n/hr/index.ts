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
			UnknownTitle: 'Nepoznato'
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
		RerollButton: 'Obnovi',
		RegenerateButton: 'Regeneriraj',
		GenerateButton: 'Generiraj',
		UpscaleButton: 'Uvećaj',
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
		LoadingParagraph: 'Učitavanje...',
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
				realName: 'Stable Diffusion 1.5',
				simpleName: 'Općenito'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3D digitalna umjetnost'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3D strip'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Anime 2'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Animirani film'
			},
			'eaa438e1-dbf9-48fd-be71-206f0f257617': {
				realName: 'Redshift Diffusion',
				simpleName: '3D obrada'
			},
			'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': {
				realName: 'Waifu Diffusion v1.4',
				simpleName: 'Anime'
			},
			'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
				realName: '22h Diffusion v0.1',
				simpleName: 'Umjetničko'
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
			'efee957a-dea5-48b2-a66a-1990dc2265c5': {
				realName: 'Heun'
			},
			'9d175114-9a26-4371-861c-729ba9ecb4da': {
				realName: 'DPM'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			}
		},
		UnknownTitle: 'Nepoznato',
		MoreOptionsTitle: 'Više opcija',
		LessOptionsTitle: 'Manje opcija',
		TryAgainButton: 'Pokušaj ponovno',
		RefreshButton: 'Refresh'
	},
	Error: {
		SomethingWentWrong: 'Dogodila se greška :(',
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
		NewVersionAvailable: 'There is a new version! Refresh the page to get it.'
	},
	Admin: {
		AdminPanelTitle: 'Administrator',
		DeleteButton: 'Izbriši',
		ApproveButton: 'Odobri',
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
			DeletedTitle: 'Izbrisano'
		}
	},
	SignUp: {
		PageTitle: 'Registriraj se',
		PageParagraph: 'Postani Stablecog pro korisnik i otključaj sve opcije.',
		PageTitleConfirm: 'Potvrdi',
		PageTitleConfirmAlt: 'Provjeri svoj e-mail',
		PageParagraphConfirm: 'Poslali smo ti 6-znamenkasti kod. Unesi ispod za potvrdu svog računa.',
		SignUpButton: 'Registriraj se',
		ConfirmButton: 'Potvrdi',
		AlreadyHaveAnAccountTitle: 'Već imaš račun?',
		LoginInsteadButton: 'Ulogiraj se',
		SixDigitCodeInput: {
			Placeholder: '6-znamenkasti kod'
		}
	},
	SignIn: {
		PageTitle: 'Prijavi se',
		PageParagraph: 'Počni koristiti Stablecog sa svim opcijama dostupnim na tvom računu.',
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
		ManageAccountButton: 'Upravljanje računom',
		MyAccountButton: 'Moj račun',
		SubscriptionPlanTitle: 'Plan'
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
	}
};
export default hr;
