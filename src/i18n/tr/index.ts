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
		NegativePromptInput: {
			Title: 'Negatif Komut',
			Placeholder: 'Negatif komut',
			Paragraph:
				'İstemediğin şeyleri üretilecek fotoğraftan çıkartmak için. Komutun yaptığının tam tersini yapar.'
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
		NoGenerationsYet: 'Henüz fotoğraf üretmedin.'
	},
	Live: {
		GenerationsTitle: 'Üretimler',
		TotalDurationTitle: 'Toplam Süre',
		UpscalesTitle: 'Büyütmeler',
		GenerationTooltip: {
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
			UnknownTitle: 'Bilinmeyen'
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
		RerollButton: 'Rastgele Üret',
		RegenerateButton: 'Tekrar Üret',
		GenerateButton: 'Üret',
		UpscaleButton: 'Büyüt',
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
		JoinUsOnTitle: 'Bize katıl: {name}',
		ShareButton: 'Paylaş',
		ShareOnButton: 'Paylaş: {name}',
		YesButton: 'Evet',
		NoButton: 'Hayır',
		EnableButton: 'Aktifleştir',
		DisableButton: 'Durdur',
		AddButton: 'Ekle',
		CopyLinkButton: 'Linki Kopyala',
		CopyButton: 'Kopyala',
		DeleteButton: 'Sil',
		LoadingTitle: 'Yükleniyor',
		LoadingParagraph: 'Yükleniyor...',
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
				realName: 'Stable Diffusion 1.5',
				simpleName: 'Genel'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3B Dijital Sanat'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3B Çizgi Roman'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Anime'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Animasyon Filmi'
			},
			'eaa438e1-dbf9-48fd-be71-206f0f257617': {
				realName: 'Redshift Diffusion',
				simpleName: '3B Render'
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
		UnknownTitle: 'Bilinmeyen',
		MoreOptionsTitle: 'Daha Fazla Seçenek',
		LessOptionsTitle: 'Daha Az Seçenek',
		TryAgainButton: 'Yeniden Dene'
	},
	Error: {
		SomethingWentWrong: 'Bir şeyler ters gitti :(',
		NSFW: 'Sıkıntılı içerik, başka bir komut dene :(',
		ServerSeemsOffline:
			'Sunucudan cevap alamadık. Sayfayı yenilemeyi veya ayarlardan başka bir sunucuya geçmeyi deneyebilirsin.',
		ServerSetNotWorking: 'Sunucu uyumlu değil ya da cevap vermiyor.',
		NotFound: 'Bulunamadı',
		SupabaseNotFoundCantListen: 'Supabase bulunamadı. Üretimler izlenemeyecek.',
		InvalidEmail: 'Geçerli bir e-posta gir.',
		PasswordTooShort: 'Şifre en az 8 karakterli olmalı.',
		SomethingWentWrongTryAgain: 'Bir sıkıntı çıktı, tekrar dene.',
		InvalidCredentials: 'Geçersiz kimlik.',
		InvalidCode: 'Geçersiz kod.'
	},
	Admin: {
		AdminPanelTitle: 'Yönetici',
		DeleteButton: 'Sil',
		ApproveButton: 'Onayla',
		NoGenerationsToReview: 'İncelecek üretim yok.',
		ServersButton: 'Sunucular',
		AdminGalleryButton: 'Galeri',
		UsersButton: 'Kullanıcılar',
		AdminTab: 'Admin',
		ServersTab: 'Sunucular',
		AdminGalleryTab: 'Galeri',
		UsersTab: 'Kullanıcılar',
		Gallery: {
			TotalTitle: 'Toplam',
			ApprovedTitle: 'Onaylanan',
			DeletedTitle: 'Silinen'
		}
	},
	SignUp: {
		PageTitle: 'Üye Ol',
		PageParagraph: "Tüm özelliklere erişmek için Stablecog'a katıl ve pro üye ol.",
		PageTitleConfirm: 'Onayla',
		PageTitleConfirmAlt: 'E-posta Yolladık',
		PageParagraphConfirm: 'Sana 6 haneli bir kod yolladık. Üyeliğini onaylamak için onu aşağı gir.',
		SignUpButton: 'Üye Ol',
		ConfirmButton: 'Onayla',
		AlreadyHaveAnAccountTitle: 'Zaten üye misin?',
		LoginInsteadButton: 'Giriş yap',
		SixDigitCodeInput: {
			Placeholder: '6 Haneli Kod'
		}
	},
	SignIn: {
		PageTitle: 'Giriş Yap',
		PageParagraph: "Stablecog'u üyeliğine sağlanan tüm özelliklerle kullanmaya başla.",
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
		ManageAccountButton: 'Üyeliği Yönet',
		MyAccountButton: 'Üyeliğim',
		SubscriptionPlanTitle: 'Üyelik Tipi'
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
		PageTitle: 'Gallery',
		PageParagraph: 'Check out what others have with Stablecog.',
		SearchInput: {
			Title: 'Search'
		},
		SearchingTitle: 'Searching',
		NoMatchingGenerationTitle: 'No matching generation'
	}
};
export default tr;
