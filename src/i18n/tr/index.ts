import type { Translation } from '../i18n-types';

const tr: Translation = {
	Language: 'Dil',
	Home: {
		GenerateButton: 'Üret',
		PromptInput: {
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
		AspectRatioTabBar: {
			Title: 'Oran',
			Paragraph: 'Fotoğrafın oranı.'
		},
		InitialImageTabBar: {
			Title: 'Baz Fotoğraf',
			Paragraph: 'Üretim bu fotoğrafı baz alarak yapılacak.'
		},
		InitialImageStrengthTabBar: {
			Title: 'Baz Fotoğraf Gücü',
			Paragraph:
				'Baz fotoğrafın üretimi ne kadar etkileyeceğinin ölçüsü. Değer ne kadar büyükse baz fotoğrafın etkisi o kadar yüksek olur.'
		},
		NegativePromptInput: {
			Title: 'Negatif Komut',
			Placeholder: 'Negatif komut',
			Paragraph:
				'İstemediğin şeyleri üretilecek fotoğraftan çıkartmak için. Komutun yaptığının tam tersini yapar.'
		},
		ImageInput: {
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
		GenerationTooltip: {
			AspectRatioTitle: 'Oran',
			CountryTitle: 'Ülke',
			Type: {
				Title: 'Tip',
				Generation: 'Üretim',
				Upscale: 'Büyütme'
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
		HistoryTab: 'Tarihçe',
		GalleryTab: 'Galeri',
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
		RerollButton: 'Rastgele Üret',
		RegenerateButton: 'Tekrar Üret',
		GenerateButton: 'Üret',
		UpscaleButton: 'Büyüt',
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
		DisableButton: 'Durdur',
		AddButton: 'Ekle',
		CopyLinkButton: 'Linki Kopyala',
		CopyButton: 'Kopyala',
		DeleteButton: 'Sil',
		LoadingTitle: 'Yükleniyor',
		ContinueButton: 'Devam Et',
		LoadingParagraph: 'Yükleniyor...',
		InsufficientCreditsTitle: 'Yetersiz kredi ({remainingCredits}/{neededCredits})',
		AllTitle: 'Hepsi',
		ConfirmButton: 'Onayla',
		ConfirmQuestionMarkButton: 'Onayla?',
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
		UnknownTitle: 'Bilinmeyen',
		MoreOptionsTitle: 'Daha Fazla Seçenek',
		LessOptionsTitle: 'Daha Az Seçenek',
		TryAgainButton: 'Yeniden Dene',
		RefreshButton: 'Yenile',
		LoadMoreButton: 'Daha Fazla',
		SearchingTitle: 'Aranıyor',
		NoResultsFoundTitle: 'Sonuç bulunamadı'
	},
	Error: {
		SomethingWentWrong: 'Bir şeyler ters gitti :(',
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
		EmailAlreadyInUse: 'Bu e-posta adresi biri tarafından kullanılıyor.'
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
		AdminGalleryButton: 'Galeri',
		UsersButton: 'Kullanıcılar',
		AdminTab: 'Admin',
		ServersTab: 'Sunucular',
		AdminGalleryTab: 'Galeri',
		UsersTab: 'Kullanıcılar',
		Users: {
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
		SignOutButton: 'Çıkış Yap'
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
		ComparePlansButton: 'Paketleri Kıyasla',
		ManageAccountButton: 'Üyeliği Yönet',
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
		SearchingTitle: 'Arıyor',
		NoMatchingGenerationTitle: 'Benzer bir üretim bulunamadı'
	},
	Pricing: {
		PlansTitle: 'Paketler',
		PlansParagraph: 'Sana uyan paketi seç.',
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
			LargeTitle: 'Büyük Paket'
		},
		Features: {
			MonthlyCredits: '{count} kredi/ay.',
			MonthlyImages: 'Ayda {count} fotoğraf.',
			MonthlyGenerations: 'Ayda {count} üretim.',
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
	LowOnCreditsCard: {
		Title: 'Kredin azalıyor ({remainingCredits})',
		FreeParagraph:
			'Tüm aktif kullanıcılara her gün ücretsiz kredi veriyoruz. Bir plan satın alarak veya etkinliklerimize katılarak daha fazla kredi elde edebilirsin.',
		HighestPlanParagraph: 'Kredi paketi satın alabilirsin.',
		OtherPlansParagraph: 'Paketini yükseltebilir veya kredi paketi satın alabilirsin.'
	},
	Support: {
		PageTitle: 'Desktek',
		PageParagraph: 'Herhangi bir soru sormak istersen aşağıdaki linklerden bize ulaşabilirsin.'
	},
	Legal: {
		TermsOfServiceTitle: 'Kullanım Şartları',
		PrivacyPolicyTitle: 'Gizlilik Politikası',
		RefundPolicyTitle: 'İade Politikası',
		ContentPolicyTitle: 'İçerik Politikası'
	},
	UnderDevelopment: {
		PageTitle: 'Geri döneceğiz!',
		PageParagraph: 'Sistemlerimizi güncelliyoruz. Birkaç saate döneceğiz.'
	}
};

export default tr;
