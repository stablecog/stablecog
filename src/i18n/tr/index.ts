import type { Translation } from '../i18n-types';

const tr: Translation = {
	Language: 'Dil',
	Landing: {
		Hero: {
			Title: 'AI ile saniyeler içinde müthiş fotoğraflar üret.'
		},
		Describe: {
			Title: 'İsteğini betimle.',
			Paragraph:
				'Herhangi bir konuda, binlerce farklı tarzda. AI istediğini saniyeler içinde üretecek.',
			Prompt: 'majestik kedi, psikedelik, mor tonlar, fantazi manzara'
		},
		InitImage: {
			Title: 'Veya bir fotoğraf ile başla.',
			Paragraph: 'Bir fotoğraf yükle, onun üzerinden yeni fotoğraflar üret.',
			Prompt: 'robot uzaylı'
		},
		StartCreating: {
			Title: 'Üretmeye hemen başla!',
			Paragraph:
				'Denemesi ücretsiz :) Binlerce kullanıcımız gibi senin de beğeneceğini düşünüyoruz.'
		},
		TryItNowButton: 'Şimdi Dene',
		StartCreatingButton: 'Üretmeye Başla',
		GetStartedButton: 'Başla'
	},
	Home: {
		GenerateButton: 'Üret',
		PromptInput: {
			Title: 'Komut',
			Placeholder: 'Kedi portesi, Van Gogh tarzında'
		},
		WidthTabBar: {
			Title: 'Genişlik',
			Paragraph: 'Fotoğrafın genişliği.'
		},
		HeightTabBar: {
			Title: 'Yükseklik',
			Paragraph: 'Fotoğrafın yüksekliği.'
		},
		InferenceStepsTabBar: {
			Title: 'Tahmin Adımları',
			Paragraph: 'Fotoğrafı üretmek için kaç tahmin adımı kullanılacağı.'
		},
		GuidanceScaleSlider: {
			Title: 'Benzeme Ölçeği',
			Paragraph:
				'Fotoğrafın komutuna ne derecede benzeyeceğinin ölçüsü. Yüksek sayılar fotoğrafı komutuna daha çok benzetir.'
		},
		AspectRatioDropdown: {
			Title: 'Oran',
			Paragraph: 'Fotoğrafın oranı.',
			Options: {
				Square: 'Kare (1:1)',
				Portrait: 'Dikey (2:3)',
				Landscape: 'Yatay (3:2)',
				Mobile: 'Mobil (9:16)',
				Desktop: 'Masaüstü (16:9)',
				Anamorphic: 'Anamorfik (2.4:1)',
				Squarish: 'Karemsi (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: 'Oran',
			Paragraph: 'Fotoğrafın oranı.'
		},
		InitialImageTabBar: {
			Title: 'Baz Fotoğraf',
			Paragraph: 'Üretim bu fotoğrafı baz alarak yapılacak.'
		},
		InitialImageStrengthTabBar: {
			TitleAlt: 'Fotoğraf Gücü',
			Title: 'Baz Fotoğraf Gücü',
			Paragraph:
				'Baz fotoğrafın üretimi ne kadar etkileyeceğinin ölçüsü. Değer ne kadar büyükse baz fotoğrafın etkisi o kadar yüksek olur.'
		},
		NegativePromptInput: {
			Title: 'Negatif Komut',
			Placeholder: 'Negatif komut',
			PlaceholderAlt: 'Kaçınmak istediğin şeyleri gir',
			Paragraph:
				'İstemediğin şeyleri üretilecek fotoğraftan çıkartmak için. Komutun yaptığının tam tersini yapar.'
		},
		ImageInput: {
			Paragraph: 'Tıkla veya fotoğrafı buraya bırak',
			Title: 'Fotoğraf Yükle'
		},
		SeedInput: {
			Title: 'Tohum',
			Placeholder: 'Tohum numarası',
			Paragraph:
				'Tekrarlanabilir sonuçlar almak için. Spesifik bir tohum diğer ayarlar sabitken aynı fotoğrafı üretir.'
		},
		ModelDropdown: {
			Title: 'Model',
			Paragraph: 'Fotoğrafı üretecek olan yapay zeka modeli.'
		},
		NumOutputsSlider: {
			Title: 'Fotoğraf Sayısı',
			Paragraph: 'Üretilecek fotoğraf sayısı.'
		},
		ShowOnProfileToggle: {
			Title: 'Show on Profile',
			Paragraph: 'Whether to show the generated images on your profile.'
		},
		SchedulerDropdown: {
			Title: 'Planlayıcı',
			Paragraph:
				'Üretim sürecininin planını değiştirir. Üretilecek fotoğrafı ciddi şekilde farklılaştırabilir. Bazı planlayıcılar düzgün sonuç vermek için daha az tahmin adımına ihtiyaç duyar.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Üretimler galeriye gönderilsin mi?',
			Paragraph: 'Tercihini daha sonra ayarlardan değiştirebilirsin.'
		}
	},
	Generate: {
		ShowSettingsButton: 'Ayarları Göster',
		HideSettingsButton: 'Ayarları Gizle',
		Grid: {
			NotSignedIn: {
				Paragraph: 'Üretimlerini görmek için giriş yap.'
			},
			NoGeneration: {
				Paragraph: 'Üretimlerin burada görünecek.'
			}
		}
	},
	History: {
		GenerationsTitle: 'Üretimler',
		GenerationsMaxSavedCountWarning: 'Sadece son {count}',
		DownloadLegacyGenerationsButton: 'Eski Üretimleri İndir',
		NoFavoritesYet: 'Henüz favorin yok.',
		Views: {
			AllTitle: 'Hepsi',
			FavoritesTitle: 'Favoriler'
		},
		NoGenerationsYet: 'Henüz fotoğraf üretmedin.'
	},
	Live: {
		GenerationsTitle: 'Üretimler',
		TotalDurationTitle: 'Toplam Süre',
		UpscalesTitle: 'Büyütmeler',
		VoiceoversTitle: 'Seslendirmeler',
		GenerationTooltip: {
			AspectRatioTitle: 'Oran',
			CountryTitle: 'Ülke',
			Type: {
				Title: 'Tip',
				Generation: 'Üretim',
				Upscale: 'Büyütme',
				Voiceover: 'Seslendirme'
			},
			DimensionsTitle: 'Ölçüler',
			StepsTitle: 'Adım Sayısı',
			ScaleTitle: 'Çarpan',
			DurationTitle: 'Süre',
			Status: {
				Title: 'Durum',
				Started: 'Başladı',
				Succeeded: 'Başarılı',
				Failed: 'Başarısız'
			},
			Server: {
				Title: 'Sunucu',
				Default: 'Varsayılan',
				Custom: 'Özel'
			},
			UnknownTitle: 'Bilinmeyen',
			OutputsTitle: 'Çıktı Sayısı'
		},
		WaitingTitle: 'Üretimler bekleniyor',
		DurationStatusUnknown: 'Bilinmeyen'
	},
	Navbar: {
		HomeTab: 'Ev',
		GenerateTab: 'Üret',
		HistoryTab: 'Tarihçe',
		GalleryTab: 'Galeri',
		AdminGalleryTab: 'Admin Galerisi',
		PricingTab: 'Fiyatlar',
		AccountTab: 'Üyelik',
		VoiceoverTab: 'Seslendirme',
		LiveTab: 'Canlı'
	},
	Settings: {
		Title: 'Ayarlar',
		SwitchServerButton: 'Sunucu Değiştir',
		SubmitToGalleryToggle: 'Galeriye Gönder',
		AdvancedModeToggle: 'Gelişmiş Mod',
		AdvancedOptionsDropdown: 'Ekstra Seçenekler',
		AdvancedDropdown: 'Ekstra',
		GenerationSettingsButton: 'Üretim Ayarları',
		GenerationSettingsTitle: 'Üretim Ayarları',
		DarkModeToggle: 'Karanlık Mod'
	},
	GenerationFullscreen: {
		DownloadButton: 'İndir',
		DoneButtonState: 'Bitti!',
		CopyPromptButton: 'Komutu Kopyala',
		CopyNegativePromptButton: 'Negatif Komutu Kopyala',
		CopiedButtonState: 'Kopyalandı!',
		GenerateSimilarButton: 'Benzerini Üret',
		ExploreSimilarButton: 'Benzerlerini Ara',
		ExploreStyleButton: 'Tarzı Ara',
		RerollButton: 'Rastgele Üret',
		RegenerateButton: 'Tekrar Üret',
		GenerateButton: 'Üret',
		UpscaleButton: 'Büyüt',
		SimilarTitle: 'Benzer',
		ShowOnProfileButton: 'Show on Profile',
		SubmitToGalleryButton: 'Galeriye Gönder',
		SubmittedTitle: 'Gönderildi',
		UpscaleTabBar: {
			UpscaledTitle: 'Büyütülmüş',
			OriginalTitle: 'Orijinal'
		},
		Dimensions: {
			Title: 'Ölçüler'
		},
		Duration: {
			Title: 'Süre'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Sunucu Seç',
		SwitchServerTitle: 'Sunucu Değiştir',
		Paragraph: 'Bu sunucu fotoğraf üretimlerini yapacak.',
		SetButton: 'Tamam',
		DefaultButton: 'Varsayılan'
	},
	Blog: {
		Title: 'Blog Yazıları',
		TitleAlt: 'Blog',
		ThanksForReading: 'Okuduğun için teşekkürler!',
		BackToBlogButton: 'Bloğa Dön'
	},
	Redirect: {
		RedirectingToTitle: 'Yönlendiriliyor: {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Süper fotoğraflar üretmeye hemen başla!',
		StartGeneratingButton: 'Üretmeye Başla',
		JoinUsTitle: 'Bize Katıl',
		GoHomeButton: 'Eve Dön',
		SwitchToDefaultServerButton: 'Varsayılan Sunucuya Geç',
		JoinOnDiscord: "Discord'a Katıl",
		JoinUsOnTitle: 'Bize katıl: {name}',
		ShareButton: 'Paylaş',
		ShareOnButton: 'Paylaş: {name}',
		GoBackButton: 'Geri Dön',
		YesButton: 'Evet',
		NoButton: 'Hayır',
		EnableButton: 'Aktifleştir',
		DoneButton: 'Tamam',
		CancelButton: 'Vazgeç',
		ClearAllButton: 'Hepsini Temizle',
		DisableButton: 'Durdur',
		DownloadButton: 'İndir',
		AddButton: 'Ekle',
		CopyLinkButton: 'Linki Kopyala',
		CopyButton: 'Kopyala',
		DeleteButton: 'Sil',
		LoadingTitle: 'Yükleniyor',
		ContinueButton: 'Devam Et',
		ProfileButton: 'Profile',
		VisitProfileButton: 'Visit Profile',
		YourProfileButton: 'Your Profile',
		LoadingParagraph: 'Yükleniyor...',
		InsufficientCreditsTitle: 'Yetersiz kredi ({remainingCredits}/{neededCredits})',
		AllTitle: 'Hepsi',
		ConfirmButton: 'Onayla',
		SimilarToTitle: 'Şuna benzer: {item}',
		ResourcesTitle: 'Kaynaklar',
		ResourcesButton: 'Kaynaklar',
		On: 'Açık',
		Off: 'Kapalı',
		BetaTitle: 'Beta',
		ConfirmQuestionMarkButton: 'Onayla?',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Kredi Tipi',
				RemainingCreditsTitle: 'Kalan',
				ExpiryTitle: 'Son Kullanma',
				LastReplenish: 'Son Yenileme'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Düzenlemeyi Bitir',
			DeselectButton: 'Seçimi Kaldır ({selectedCount})',
			DeleteButton: 'Sil ({selectedCount})',
			FavoriteButton: 'Favorile ({selectedCount})',
			ApproveButton: 'Onayla ({selectedCount})',
			RejectButton: 'Reddet ({selectedCount})',
			UnfavoriteButton: 'Favoriyi Kaldır ({selectedCount})',
			ConfirmationModal: {
				CancelButton: 'Vazgeç',
				Deselect: {
					Title: '{selectedCount} adet seçimi kaldır?',
					Paragraph: '{selectedCount} adet seçimi kaldırmak istediğini emin misin?',
					ConfirmButton: 'Seçimi Kaldır'
				},
				Delete: {
					Title: '{selectedCount} öğeyi sil?',
					Paragraph: '{selectedCount} öğeyi silmek istedine emin misin?',
					ConfirmButton: 'Sil'
				},
				Favorite: {
					Title: '{selectedCount} öğeyi favorile?',
					Paragraph: '{selectedCount} adet öğeyi favorilemek istediğine emin misin?',
					ConfirmButton: 'Favorile'
				},
				Unfavorite: {
					Title: '{selectedCount} öğeyi favoriden çıkar?',
					Paragraph: '{selectedCount} öğeyi favoriden çıkarmak istediğine emin misin?',
					ConfirmButton: 'Favoriden Çıkar'
				}
			}
		},
		ServerUrlInput: {
			Placeholder: 'Sunucu adresi'
		},
		EmailInput: {
			Placeholder: 'E-posta'
		},
		PasswordInput: {
			Placeholder: 'Şifre'
		},
		ProFeatures: {
			SubscribeTitle: 'Subscribe!',
			ChangeVisibilityFeatureParagraph:
				'Changing the visibility of this generation requires a subscription.'
		},
		ModelTags: {
			GoodAtTitle: 'Şunlarda iyi',
			Tags: {
				General: 'Genel',
				Realism: 'Realizm',
				Anime: 'Anime',
				Render: 'Render',
				Drawing: 'Çizim',
				ThreeDArt: '3B',
				Abstract: 'Soyut'
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
			'22b0857d-7edc-4d00-9cd9-45aa509db093': {
				realName: 'Kandinsky'
			},
			'9fa49c00-109d-430f-9ddd-449f02e2c71a': {
				realName: 'Kandinsky 2.2'
			},
			'8002bc51-7260-468f-8840-cf1e6dbe3f8a': {
				realName: 'SDXL'
			},
			'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': { realName: 'Waifu Diffusion XL' },
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
		UnknownTitle: 'Bilinmeyen',
		AdvancedSettingsButton: 'Gelişmiş Ayarlar',
		MoreOptionsTitle: 'Daha Fazla Seçenek',
		LessOptionsTitle: 'Daha Az Seçenek',
		TryAgainButton: 'Yeniden Dene',
		RefreshButton: 'Yenile',
		LoadMoreButton: 'Daha Fazla',
		BackToProfile: 'Back to Profile',
		BackToGalleryButton: 'Galeriye Dön',
		SearchingTitle: 'Aranıyor',
		NoResultsFoundTitle: 'Sonuç bulunamadı'
	},
	Error: {
		SomethingWentWrong: 'Bir şeyler ters gitti :(',
		PromptWasNSFW: 'Bu komut problemli içerik üretebilir :(',
		ImageWasNSFW: 'Bu fotoğraf müstehcendi :(',
		NSFW: 'Müstehcen içerik, başka bir komut dene :(',
		ServerSeemsOffline:
			'Sunucudan cevap alamadık. Sayfayı yenilemeyi veya ayarlardan başka bir sunucuya geçmeyi deneyebilirsin.',
		ServerSetNotWorking: 'Sunucu uyumlu değil ya da cevap vermiyor.',
		NotFound: 'Bulunamadı',
		SupabaseNotFoundCantListen: 'Supabase bulunamadı. Üretimler izlenemeyecek.',
		InvalidEmail: 'Geçerli bir e-posta gir.',
		PasswordTooShort: 'Şifre en az 8 karakterli olmalı.',
		SomethingWentWrongTryAgain: 'Bir sıkıntı çıktı, tekrar dene.',
		InvalidCredentials: 'Geçersiz kimlik.',
		InvalidCode: 'Geçersiz kod.',
		TryAnotherImage: 'Başka fotoğraf dene :(',
		OnceEvery60Seconds: 'Her 60 saniyede sadece bir link talebinde bulunabilirsin.',
		LinkExpired: {
			Title: 'Link Geçersiz',
			Paragraph: 'Link sadece bir kere kullanılabilir ve 24 saat sonunda geçersiz hale gelir.'
		},
		UpdateAvailable: {
			Title: 'Güncelleme Mevcut',
			Paragraph: 'Güncelleme mevcut! Sayfayı yenile.'
		},
		EmailProviderNotAllowed: 'Bu e-posta sağlayıcısı desteklenmiyor.',
		EmailNotAllowed: "This email isn't allowed.",
		EmailAlreadyInUse: 'Bu e-posta adresi biri tarafından kullanılıyor.'
	},
	UpcomingCredits: {
		MoreFreeCreditsTooltip: {
			Title: 'More on the way!',
			Paragraph: "You'll receive more free credits:"
		}
	},
	Admin: {
		AdminPanelTitle: 'Yönetici',
		DeleteButton: 'Sil',
		ApproveButton: 'Onayla',
		RejectButton: 'Reddet',
		EditButton: 'Düzenle',
		EditViewButton: 'Düzenleme Modu',
		NormalViewButton: 'Normal Mod',
		StopEditButton: 'Düzenlemeyi Durdur',
		NoGenerationsToReview: 'İncelecek üretim yok.',
		ServersButton: 'Sunucular',
		AdminGalleryButton: 'Admin Galerisi',
		UsersButton: 'Kullanıcılar',
		AdminTab: 'Admin',
		ServersTab: 'Sunucular',
		AdminGalleryTab: 'Admin Galerisi',
		UsersTab: 'Kullanıcılar',
		Users: {
			ConfirmAction: {
				ConfirmActionReferenceText: 'İşlemi onaylıyorum',
				ConfirmActionParagraph: 'Onaylamak için "{confirmActionText}" yaz.',
				ConfirmActionInput: {
					Placeholder: 'Onayla'
				}
			},
			DataDeletedAtTitle: 'Veri Silinme',
			WillBeDeletedTitle: 'Silinecek',
			BannedAtTitle: 'Banlandı',
			BannedTitle: 'Banlandı',
			UnbanUserButton: 'Banı Kaldır',
			BanDomainButton: 'Ban Domain',
			UnbanDomainButton: 'Unban Domain',
			BanUserButton: 'Banla',
			GiftCreditsButton: 'Kredi Hediye Et'
		},
		Gallery: {
			TotalTitle: 'Toplam',
			ApprovedTitle: 'Onaylanan',
			DeletedTitle: 'Silinen',
			StatusDropdown: {
				All: 'Hepsi',
				ManuallySubmitted: 'Manuel Gönderilmiş',
				Submitted: 'Gönderilenler',
				Approved: 'Onaylananlar',
				Rejected: 'Reddedilenler',
				Deleted: 'Silinenler',
				Private: 'Gizli'
			},
			NoGenerationsToReview: 'İncelenecek üretim kalmadı'
		}
	},
	SignUp: {
		PageTitle: 'Üye Ol',
		PageParagraph: "Tüm özelliklere erişmek için Stablecog'a katıl ve pro üye ol.",
		PageTitleConfirm: 'Onayla',
		PageTitleConfirmAlt: 'Posta kutunu kontrol et',
		PageParagraphConfirm: 'Sana 6 haneli bir kod yolladık. Üyeliğini onaylamak için onu aşağı gir.',
		SignUpButton: 'Üye Ol',
		AllTitle: 'Hepsi',
		ConfirmButton: 'Onayla',
		AlreadyHaveAnAccountTitle: 'Zaten üye misin?',
		LoginInsteadButton: 'Giriş yap',
		WantsEmailCheckbox: {
			Paragraph: 'Güncellemeler ve fırsatlar hakkında bilgi al.',
			NoSpamParagraph: 'Kesinlikle spam yapmıyoruz.'
		},
		SixDigitCodeInput: {
			Placeholder: '6 Haneli Kod'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Hemen Başla',
		GetStartedButton: 'Başla',
		PageTitle: 'Giriş Yap',
		PageParagraph: "Stablecog'u üyeliğine sağlanan tüm özelliklerle kullanmaya başla.",
		PageParagraphV2: 'Ücretsiz olarak süper fotoğraflar üretmeye hemen başla.',
		PageTitleCreateAccountOrSignIn: 'Üye ol veya giriş yap',
		PageParagraphCreateAccountOrSignIn:
			"Stablecog'u üyeliğine sağlanan tüm özelliklerle kullanmaya başla.",
		PageTitleSentLink: 'Posta kutunu kontrol et',
		PageParagraphSentLink:
			'Giriş yapabilmen için sana bir link yolladık. Bulamadıysan spam klasörüne bak.',
		ContinueButton: 'Devam Et',
		ContinueWithProviderButton: '{provider} ile devam et',
		SignInWithProviderButton: '{provider} ile giriş yap',
		OrContinueWithEmailTitle: 'Veya e-posta ile devam et',
		DontHaveAnAccountTitle: 'Üyeliğin yok mu?',
		SignUpInsteadButton: 'Üye ol',
		SignInButton: 'Giriş Yap',
		EnterCodeManuallyButton: 'Kod gir',
		SignOutButton: 'Çıkış Yap'
	},
	ChangeUsername: {
		ChangeUsernameTitle: 'Change Username',
		ChangeUsernameButton: 'Change Username',
		UsernameInput: { Title: 'Username' },
		Error: {
			MinimumCharacters: 'Must be at least {count} characters.',
			MaximumCharacters: 'Must be at most {count} characters.',
			InvalidCharacters: 'Can only contain letters, numbers, and dashes.',
			NotAvailable: "This username isn't available."
		}
	},
	Pro: {
		PageTitle: 'Pro Ol',
		PageParagraph:
			"Stablecog'un bütün özelliklerine eriş ve projeyi destekle. Pro üyeler olmadan Stablecog tamamen açık kaynak kodlu kalamaz, herkese ücretsiz fotoğraf üretimi imkanı sunamazdı.",
		PageTitleAlreadyPro: 'Zaten Prosun!',
		PageParagraphAlreadyPro:
			"Pro üye olarak projeyi desteklediğin için teşekkürler. Stablecog'un keyfini çıkarmanı ve arkadaşlarınla paylaşmanı tavsiye ederiz.",
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Gecikmesiz tam hız üretim',
			ImageDimensions: 'Farklı fotoğraf boyutları',
			Upscale: 'Büyütme/çözünürlük arttırma',
			Steps: 'Farklı tahmin adımı seçenekleri',
			MoreModels: 'Daha fazla AI modeli',
			MoreSchedulers: 'Daha fazla planlayıcı',
			SavedToCloud: 'Üretimleri buluta kaydetme',
			Upcoming: 'Gelecek özellikler',
			CommercialUse: 'Ticari kullanım'
		},
		Soon: '(yakında)',
		Month: '/ay',
		BecomeProButton: 'Pro Ol',
		Success: {
			PageTitle: 'Pro oldun!',
			PageParagraph:
				"Artık Stablecog'un tüm özelliklerine erişimin var. Soruların varsa bize buradan ulaşabilirsin: {platform}."
		},
		Cancel: {
			PageTitle: 'İptal Ettin',
			PageParagraph: 'Üyelik sürecini iptal ettin. Bir yanlışlık olduysa tekrar deneyebilirsin.'
		},
		Reason: {
			ParagraphWidth: 'O fotoğraf genişliği ayarı ücretsiz planda mevcut değil.',
			ParagraphHeight: 'O fotoğraf yüksekliği ayarı ücretsiz planda mevcut değil.',
			ParagraphDimensions: 'O fotoğraf boyutu ücretsiz planda mevcut değil.',
			ParagraphUpscale: 'Büyütme özelliği ücretsiz planda mevcut değil.',
			ParagraphInferenceSteps: 'O tahmin adımı seçeneği ücretsiz planda mevcut değil.',
			ParagraphModel: 'O AI modeli ücretsiz planda mevcut değil.',
			ParagraphScheduler: 'O planlayıcı ücretsiz planda mevcut değil.',
			ParagraphWidthGeneration:
				'O üretim ücretsiz planda mevcut olmayan bir fotoğraf genişliği ayarı ile yapıldı.',
			ParagraphHeightGeneration:
				'O üretim ücretsiz planda mevcut olmayan bir fotoğraf yüksekliği ayarı ile yapıldı.',
			ParagraphDimensionsGeneration:
				'O üretim ücretsiz planda mevcut olmayan bir fotoğraf boyutu ayarı ile yapıldı.',
			ParagraphInferenceStepsGeneration:
				'O üretim ücretsiz planda mevcut olmayan bir tahmin adımı ayarı ile yapıldı.',
			ParagraphModelGeneration:
				'O üretim ücretsiz planda mevcut olmayan bir AI modeli ile yapıldı.',
			ParagraphSchedulerGeneration:
				'O üretim ücretsiz planda mevcut olmayan bir planlayıcı seçeneği ile yapıldı.'
		},
		Tier: {
			Title: {
				Free: 'Ücretsiz',
				Pro: 'Pro'
			},
			Badge: {
				Free: 'ÜCRETSİZ',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Üyelik',
		ManageSubscriptionButton: 'Aboneliği Yönet',
		ComparePlansButton: 'Planları Kıyasla',
		ManageAccountButton: 'Üyeliği Yönet',
		AccountButton: 'Üyelik',
		MyAccountButton: 'Üyeliğim',
		SubscriptionPlanTitle: 'Üyelik Tipi',
		RemainingImagesTitle: 'Kalan Fotoğraflar',
		RemainingCreditsTitle: 'Kalan Krediler',
		RemainingTitle: 'Kalan',
		Subscription: {
			UpdateSubscriptionTitle: 'Paket Değiştir',
			ChangePlanTitle: 'Paket Değiştir',
			CurrentPlanTitle: 'Mevcut Paket',
			NewPlanTitle: 'Yeni paket',
			Downgrade: {
				DowngradingToTitle: 'Geçilecek paket',
				Explanation: 'Mevcut kredilerin silinmeyecek.'
			},
			Upgrade: {
				UpgadingToTitle: 'Geçilecek paket',
				Explanation: 'Mevcut kredilerin silinmeyecek.'
			},
			Failed: {
				PageTitle: 'Paket değiştirilemedi',
				PageParagraph: 'Paket değişikliği sırasında bir sorun çıktı. Tekrar dene.'
			},
			Succeeded: {
				PageTitle: 'Paket değiştirildi',
				PageParagraph: 'Paketin başarıyla değiştirildi.'
			}
		},
		Tabs: {
			Account: 'Üyelik',
			Usage: 'Kullanım',
			APIKeys: 'API Anahtarları'
		},
		Meta: {
			AccountCreationTitle: 'Üyelik',
			LastSignInTitle: 'Son Giriş',
			LastSeenTitle: 'Son Görülme'
		},
		ChangeEmail: {
			PageTitle: 'E-posta Değiştir',
			PageParagraph: 'Üyeliğin için yeni bir e-posta gir.',
			ChangeEmailButton: 'E-posta Değiştir',
			NewEmailInput: {
				Placeholder: 'Yeni E-posta'
			},
			PageTitleSentLink: 'E-postana bak',
			PageParagraphSentLink:
				'İki adrese de link yolladık. Üyeliğinin e-posta adresini değiştirmek için ikisini de onayla.',
			PageTitleConfirmOtherEmail: 'Diğer E-postayı Onayla',
			PageParagraphConfirmOtherEmail:
				'Diğer e-posta adresine de bir e-posta yolladık. Süreci tamamlamak için onu da onayla.'
		},
		Usage: {
			PageTitle: 'Kullanım',
			PageParagraph: 'Güncel kullanımlarını aşağıda görebilirsin.',
			RecentUsageTitle: 'Güncel Kullanım',
			UsageTable: {
				ID: 'No',
				Type: 'Tip',
				Duration: 'Süre',
				Source: 'Kaynak',
				RunTime: 'Çalışma Süresi',
				Cost: 'Ücret',
				Operation: 'Operasyon',
				Process: 'İşlem',
				Platform: 'Platform'
			},
			UsageType: {
				Voiceover: 'Seslendirme',
				Generate: 'Üret',
				Generation: 'Üretim',
				Upscale: 'Büyütme'
			},
			SourceType: {
				Web: 'Web',
				WebApp: 'Web Uygulaması',
				DiscordBot: 'Discord Botu',
				API: 'API'
			},
			NoUsageYet: 'Henüz bir kullanım yapmadın.'
		},
		APIKeys: {
			PageTitle: 'API Anahtarları',
			PageParagraph:
				'Gizli API anahtarların aşağıda. Bu anahtarları sadece ilk ürettiğin anda görebilirsin. Anahtaları güvenli bir yere kaydettiğinden emin ol.',
			NoKeysYet: 'Henüz bir API anatharın yok.',
			CreateAPIKeyButton: 'API Anahtarı Yarat',
			CreateNewKeyButton: 'Yeni Anahtar Üret',
			DeleteKeyButton: 'Anatarı Sil',
			KeyTable: {
				NameTitle: 'İsim',
				KeyTitle: 'Anahtar',
				CreatedAtTitle: 'Üretim',
				UsageTitle: 'Kullanım',
				LastUsedTitle: 'Son Kullanım',
				LastUsedNeverDescription: 'Kullanılmadı'
			},
			KeyModal: {
				Create: {
					Title: 'Yeni Anahtar Üret',
					Paragraph:
						'İstersen bu anahtara bir isim verebilirsin. Bu isim anahtarı ne için ürettiğini hatırlamana yardımcı olur.',
					Input: {
						Title: 'İsim',
						TitleAlt: 'İsim (opsiyonel)'
					},
					CreateKeyButton: 'Anahtar Üret'
				},
				Created: {
					Title: 'Yeni Anahtar',
					Paragraph:
						'Bu anahtarı güvenli bir yere kaydet. Güvenlik sebebiyle bu anahtarı bir daha göremeyeceksin.',
					Input: {
						Title: 'Gizli Anahtar'
					}
				},
				Delete: {
					Title: 'Anahtarı Sil',
					Paragraph:
						'Anahtar hemen silinicek. Bu anahtar kullanılarak yapılan istekler reddedilecek. Anathar silindiden itibaren bu anatharı bir daha göremeyeceksin.',
					RevokeKeyButton: 'Anatharı Sil'
				}
			}
		}
	},
	ForgotPassword: {
		PageTitle: 'Şifre Yenile',
		PageParagraph: 'E-posta adresine 6 haneli bir kod yollayacağız.',
		SendResetCodeButton: 'Kodu Yolla',
		PageTitleConfirmCode: 'Doğrula',
		PageTitleConfirmCodeAlt: 'E-posta Yolladık',
		PageParagraphConfirmCode:
			'E-posta adresine 6 haneli bir kod yolladık. Devam etmek için onu aşağı gir.',
		ConfirmCodeButton: 'Onayla',
		PageTitleNewPassword: 'Yeni Şifre',
		PageParagraphNewPassword: 'Üyeliğin için yeni bir şifre gir.',
		NewPasswordInput: {
			Placeholder: 'Yeni Şifre'
		},
		SetNewPasswordButton: 'Şifreyi Güncelle',
		PageTitleSuccess: 'Tamamdır!',
		PageParagraphSuccess: 'Şifren başarıyla güncellendi.',
		ForgotPasswordButton: 'Şifremi Unuttum'
	},
	FeaturedOn: {
		PageTitle: 'Basında'
	},
	Gallery: {
		PageTitle: 'Galeri',
		PageParagraph: 'Diğer insanların Stablecog ile ürettiklerini incele.',
		SearchInput: {
			Title: 'Ara'
		},
		BackToProfile: 'Back to Profile',
		BackToGalleryButton: 'Galeriye Gön',
		SearchingTitle: 'Arıyor',
		NoMatchingGenerationTitle: 'Benzer bir üretim bulunamadı'
	},
	Pricing: {
		PlansTitle: 'Planlar',
		PlansParagraph: 'Sana uyan planı seç.',
		CreditPacksTitle: 'Kredi Paketleri',
		CreditPacksParagraph: 'Daha fazla mı lazım? İstediğin zaman ekstra kredi alabilirsin.',
		SubscribeButton: 'Satın Al',
		SubscribedButton: 'Satın Alındı',
		UpgradeButton: 'Yükselt',
		DowngradeButton: 'Düşür',
		PurchaseButton: 'Satın Al',
		BuyCreditsButton: 'Kredi Satın Al',
		MonthlyTitle: 'Aylık',
		YearlyTitle: 'Yıllık',
		SlashMonth: '/ay',
		Plans: {
			FreeTitle: 'Ücretsiz',
			StarterTitle: 'Başlangıç',
			ProTitle: 'Profesyonel',
			UltimateTitle: 'Mega'
		},
		CreditPacks: {
			MediumTitle: 'Orta Paket',
			LargeTitle: 'Büyük Paket',
			MegaTitle: 'Mega Paket'
		},
		Features: {
			MonthlyCredits: '{count} kredi/ay.',
			MonthlyImages: 'Ayda {count} fotoğraf.',
			MonthlyGenerations: 'Ayda {count} üretim.',
			ParallelGenerations: '{count} paralel üretim.',
			Images: '{count} fotoğraf.',
			Generations: '{count} üretim.',
			NeverExpires: 'Tarihi geçmez.',
			CommercialUse: 'Ticari kullanım.',
			ImagesArePublic: 'Fotoğraflar halka açık.',
			ImagesArePrivate: 'Fotoğraflar gizli.'
		},
		Badges: {
			Recommended: 'Tavsiye Edilen',
			MostPopular: 'En Popüler',
			BestValue: 'En Kârlı'
		},
		Purchase: {
			Succeeded: {
				PageTitle: 'İşlem tamam!',
				PageParagraph: 'Teşekkürler! Soru sormak istersen bize şuradan ulaşabilirsin: {platform}.'
			},
			Cancelled: {
				PageTitle: 'Alımdan Vazgeçildi',
				PageParagraph: 'Satın alma sürecini iptal ettin. Yanlışlıkla olduysa tekrar deneyebilirsin.'
			}
		}
	},
	FAQ: {
		Title: 'SSO',
		TitleAlt: 'Sıkça Sorulan Sorular',
		Questions: {
			CommercialUse: {
				Question: 'Fotoğrafları ticari amaçlarla kullanabilir miyim?',
				Answer:
					'Ücretli planlarımızdan birine aboneyken bir fotoğraf ürettiysen, bu fotoğrafı aboneliğin bitse dahi ticari amaçlar için kullanabilirsin. Ücretsiz planı kullanıyorsan ürettiğin fotoğraflar sadece ticari olmayan, kişisel amaçlarla kullanabilirsin.'
			},
			MoreCredits: {
				Question: 'Daha fazla kredi satın alabilir miyim?',
				Answer:
					'Evet. Ücretli bir plana abone olduğun süre zarfında istediğin herhangi bir zaman daha fazla kredi alabilirsin. Bu kredileri satın almak için "fiyatlar" sayfamızı ziyaret edebilirsin.'
			},
			CreditRollOver: {
				Question: 'Krediler sonraki aya aktarılır mı?',
				Answer:
					'Hayır, krediler sonraki aya aktarılmaz. Kredilerin her ay, ilk ödemeni yaptığın tarihte resetlenir.'
			},
			PlanUpgradeOrDowngrade: {
				Question: 'Planımı yükseltip düşürebilir miyim?',
				Answer:
					'Evet. Planını istediğin zaman yükseltip düşürebilirsin. Planını yükseltirsen mevcut kredilerin bir dahaki aya kadar geçerli olmaya devam eder. Yaptığın yükseltmenin bedeli bütünüyle hemen yansıtılır ve gerekli krediler hesabına eklenir.'
			},
			PlanCancellation: {
				Question: 'Planımı iptal edebilir miyim?',
				Answer:
					'Evet, planını istediğin zaman iptal edebilirsin. İptal ettiğin takdirde kalan kredilerini ay sonuna kadar kullanabilirsin. Ücretlendirme de ay sonunda durur, yenilenmez.'
			},
			MoreQuestions: {
				Question: 'Başka sorularım var, nereden sorabilirim?',
				Answer:
					'{Discord} komünitemize katılıp istediğin soruyu sorabilirsin. Ayrıca bize {Twitter} veya {email} ile de ulaşabilirsin.',
				Parts: {
					Discord: 'Discord',
					Email: 'e-posta',
					Twitter: 'Twitter'
				}
			}
		}
	},
	LowOnCreditsCard: {
		Title: 'Kredin az kaldı ({remainingCredits})',
		FreeParagraph:
			'Tüm aktif kullanıcılara her gün ücretsiz kredi veriyoruz. Bir plan satın alarak veya etkinliklerimize katılarak daha fazla kredi elde edebilirsin.',
		HighestPlanParagraph: 'Kredi paketi satın alabilirsin.',
		OtherPlansParagraph: 'Paketini yükseltebilir veya kredi paketi satın alabilirsin.'
	},
	Contact: {
		PageTitle: 'Bize Ulaş',
		PageParagraph:
			'Bir sorun, önerin veya isteğin varsa aşağıdaki linkleri kullanarak bize ulaşabilirsin. Elimizden geldiğince hızlı cevaplayacağız.'
	},
	Support: {
		PageTitle: 'Destek',
		PageParagraph: 'Herhangi bir soru sormak istersen aşağıdaki linklerden bize ulaşabilirsin.'
	},
	Guide: {
		PageTitle: 'Kılavuz',
		GuideButton: 'Kılavuz',
		PreviousTitle: 'Önceki',
		EndpointsTitle: 'Sorgu Adresleri',
		EndpointTitle: 'Sorgu Adresi',
		NextTitle: 'Sonraki',
		ChaptersTitle: 'Bölümler',
		ChapterTitle: 'Bölüm'
	},
	Try: {
		PageTitle: 'Dene'
	},
	Legal: {
		PageTitle: 'Hukuki Dökümanlar',
		PageParagraph: 'Şartlarımız ve politikalarımız aşağıda.',
		TermsOfServiceTitle: 'Kullanım Şartları',
		PrivacyPolicyTitle: 'Gizlilik Politikası',
		RefundPolicyTitle: 'İade Politikası',
		ContentPolicyTitle: 'İçerik Politikası'
	},
	Documentation: {
		PageTitle: 'Dökümantasyon',
		PageTitleAlt: 'API Dökümantasyonu',
		APIReferenceButton: 'API Dökümantasyonu',
		DocumentationButton: 'Dökümantasyon',
		ForDevelopersTitle: 'Geliştiriciler İçin'
	},
	Scl: {
		Discord: 'Discord',
		Email: 'E-posta',
		Twitter: 'Twitter',
		Instagram: 'Instagram',
		YouTube: 'YouTube',
		LinkedIn: 'LinkedIn',
		Reddit: 'Reddit',
		GitHub: 'GitHub',
		Telegram: 'Telegram',
		Facebook: 'Facebook',
		ProductHunt: 'Product Hunt'
	},
	Voiceover: {
		ModelOptions: {
			'0f442a3e-cf53-490b-b4a9-b0dda63e9523': {
				Name: 'Bark'
			}
		},
		SpeakerOptions: {
			'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff': {
				Name: 'Paul'
			},
			'39f7fc5d-9031-4932-a4d5-b196bb06e203': {
				Name: 'Jony'
			},
			'0140c5dc-af12-4643-bfec-650d3cd03c56': {
				Name: 'Bryan'
			},
			'4a19f17c-eedc-4cf8-a45d-1f9d69547125': {
				Name: 'Rachel'
			},
			'2e4e9572-2ea6-48a3-b134-381c68c9d516': {
				Name: 'Ella'
			},
			'2364bfb5-cdce-4a30-b979-a12f9f49cd39': {
				Name: 'Alice'
			},
			'91bf1331-a234-4478-a2a5-4dba4ac647fc': {
				Name: 'Olivia'
			},
			'3aebf12b-a7b8-41cf-9411-5808a231138e': {
				Name: 'Daniel'
			},
			'b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0': {
				Name: 'Thomas'
			},
			'aad61bf9-0710-40f6-8050-8c412852f717': {
				Name: 'Henry'
			},
			'37c069ec-f124-4be8-9d4c-e74157738877': {
				Name: 'Liam'
			},
			'38f9bd69-fa4c-4e53-b398-9a0f5865e927': {
				Name: 'Dan'
			},
			'5bd0610f-f073-487e-a74c-2a89105ce282': {
				Name: 'Gamze'
			},
			'7c3f8e30-9957-4d5e-a70e-c8269ff5f550': {
				Name: 'Mert'
			},
			'0188871e-c4d1-4ad9-ab3d-ec958c443822': {
				Name: 'Halit'
			},
			'4802af70-6d40-429d-8b9d-8df591e30743': {
				Name: 'Leyla'
			},
			'e10d4dac-7c39-4e96-9622-6d4e46fc384b': {
				Name: 'Murat'
			},
			'9354180b-9735-412c-947f-9d15af6edfe0': {
				Name: 'Mia'
			},
			'bcb7ac57-fd61-4630-82f0-ae3f836bb7c2': {
				Name: 'Eizo'
			},
			'b7542bad-e5fc-4c02-89ce-0ec22f6deceb': {
				Name: 'Ai'
			},
			'2cdb9e2c-42c1-49d0-959b-43d4bfc1828f': {
				Name: 'Shinya'
			},
			'37bb1326-d83e-425a-b21a-1a03ffea4d05': {
				Name: 'Emi'
			},
			'1eca6e55-53fb-4d70-995f-7e4da9266574': {
				Name: 'Emika'
			},
			'4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f': {
				Name: 'Adriana'
			},
			'9206e75b-2b28-47f0-899e-76ab476e1c3f': {
				Name: 'Jorge'
			},
			'573c37c7-f741-4d36-80dc-f126131c6343': {
				Name: 'Carmen'
			},
			'b06d6333-1e35-45a6-b18b-3187d34cc387': {
				Name: 'Pedro'
			},
			'90ba9324-476b-48ae-b88e-aed1975a51fd': {
				Name: 'David'
			},
			'babbbc15-5040-4e97-a89f-8309b13d7785': {
				Name: 'Annika'
			},
			'cafafcaa-45bf-45e0-901c-8ca63575ad2a': {
				Name: 'Leonie'
			},
			'31d7c264-b674-422b-9b8f-13195c3289b6': {
				Name: 'Fritz'
			},
			'b349543b-c727-4934-9f4f-249aa2a6b184': {
				Name: 'Wilhelm'
			},
			'c4796108-0e8a-4a7a-9a8a-bb66ff21e215': {
				Name: 'Hans'
			},
			'83c0ee48-c8ef-4a4c-bca8-9dae843d25da': {
				Name: 'Boris'
			},
			'947786c1-810d-44ce-808f-cdcf732d97fd': {
				Name: 'Alisa'
			},
			'2885a060-badc-4896-a4fa-f3656a58bb82': {
				Name: 'Ivan'
			},
			'92929922-0608-4b62-8a0d-f9d87a4ca2f5': {
				Name: 'Oleg'
			},
			'cb8a2dc4-fce9-4f17-b977-050aa78d8101': {
				Name: 'Xin'
			},
			'5001a3c9-557c-4775-ad6f-b71c47c3b4f1': {
				Name: 'Ming'
			},
			'd45f479f-42e5-4f15-b1a0-c9feabcdb3aa': {
				Name: 'Hu'
			},
			'56714211-532c-479b-ac8f-f2449af2310a': {
				Name: 'Shuang'
			},
			'052b721a-da7e-4614-b352-826411c262e2': {
				Name: 'Wan'
			}
		},
		List: {
			NotSignedIn: {
				Paragraph: 'Seslendirmeleri görmek için giriş yap.'
			},
			NoVoiceovers: {
				Paragraph: 'Seslendirmeler burada belirecek.'
			}
		},
		Generate: {
			SpeakerParagraph: '{speakerName} şu dilde konuşacak: {languageName}.',
			VoiceoverParagraph: 'Seslendirme burada belirecek.'
		},
		PromptBar: {
			GenerateButton: 'Üret',
			CreditCost: '{creditCost} kredi',
			PromptInput: {
				Placeholder: 'Teknoloji, hayal ile gerçek arasındaki köprüdür.'
			}
		},
		Settings: {
			Speaker: {
				Title: 'Konuşmacı',
				Paragraph: 'Seslendirmeyi yapacak konuşmacı.'
			},
			Language: {
				Title: 'Dil',
				Paragraph: 'Seslendirmenin dili.'
			},
			VoiceStability: {
				Title: 'Ses Stabilitesi',
				Paragraph:
					'Sesin stabilite derecesi. Yüksek sayılar sesi daha stabil, düşük sayılar sesi daha değişken yapar.',
				Slider: {
					MoreStable: 'Daha stabil',
					MoreVariable: 'Daha değişken'
				}
			},
			DenoiseAudio: {
				Title: 'Gürültü Temizleme',
				Paragraph: 'Sesteki arkaplan gürültüsünü temizler.'
			},
			RemoveSilence: {
				Title: 'Sessizliği Temizle',
				Paragraph: 'Sesteki sessiz bölümleri ortadan kaldırır.'
			}
		},
		PlayButton: 'Oynat',
		PauseButton: 'Durdur',
		MuteButton: 'Sesi Kapa',
		UnmuteButton: 'Sesi Aç'
	},
	Connect: {
		PageTitle: 'Bağlan',
		PageParagraph: '{platform} üyeliğini Stablecog üyeliğine bağlamak için aşağıdaki butona tıkla.',
		PageSuccessTitle: 'Bağlandı!',
		ConnectButton: 'Bağla',
		ReturnBackToParagraph: '{platform} uygulamasına geri dönebilirsin.',
		NoPlatformTokenParagraph: 'Bu link bir {platform} tokeni içermiyor. Yeni bir link iste.',
		NoPlatformIDParagraph: 'Bu link bir {platform} kimliği içermiyor. Yeni bir link iste.',
		NoPlatformUsernameParagraph:
			'Bu link bir {platform} kullanıcı adı içermiyor. Yeni bir link iste.',
		Platform: {
			Discord: 'Discord',
			Stablecog: 'Stablecog'
		},
		ConnectToTitle: 'Şuraya Bağlan: {platform}',
		ConnectToParagraph:
			'{platform} hesabını Stablecog hesabına bağlamak için yeni bir hesap oluştur veya giriş yap.',
		Error: {
			InvalidToken: 'Bu token geçersiz. {platform} uygulamasından yeni bir link iste.',
			AlreadyLinked: 'Hesabına bağlanmış bir {platform} hesabı zaten mevcut.'
		}
	},
	ShareCard: { Title: 'Share' },
	UnderDevelopment: {
		PageTitle: 'Geri döneceğiz!',
		PageParagraph: 'Sistemlerimizi güncelliyoruz. Birkaç saate döneceğiz.'
	}
};

export default tr;
