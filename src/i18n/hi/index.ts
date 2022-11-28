import type { BaseTranslation } from '../i18n-types';

const hi: BaseTranslation = {
	Language: 'भाषा',
	Home: {
		GenerateButton: 'बनाए',
		PromptInput: {
			Placeholder: 'वैन गो द्वारा एक बिल्ली का चित्र'
		},
		WidthTabBar: {
			Title: 'चौड़ाई',
			Paragraph: 'चित्र की चौड़ाई।'
		},
		HeightTabBar: {
			Title: 'ऊंचाई',
			Paragraph: 'चित्र की ऊँचाई।'
		},
		InferenceStepsTabBar: {
			Title: 'अनुमानित कदम',
			Paragraph: 'चित्र को बनाने (बिखराव) करने के लिए कितने कदम लगेंगे।'
		},
		GuidanceScaleSlider: {
			Title: 'मार्गदर्शन पैमाना',
			Paragraph:
				'चित्र आपके संकेत से कितना मिलता-जुलता होगा। उच्च मान चित्र को आपके संकेत के करीब बनाता हैं।'
		},
		NegativePromptInput: {
			Title: 'नकारात्मक संकेत',
			Placeholder: 'नकारात्मक संकेत',
			Paragraph: 'चित्र से अनचहित चीजों को हटाने के लिए। यह संकेत के विपरीत करता है।'
		},
		SeedInput: {
			Title: 'सीड',
			Placeholder: 'सीड संख्या',
			Paragraph:
				'दोहराने योग्य परिणाम प्राप्त करें। एक ही संकेत विकल्पों के साथ संयुक्त एक सीड एक ही छवि उत्पन्न करता है।'
		},
		ModelDropdown: {
			Title: 'Model',
			Paragraph: 'The AI Model that will be used to generate the image.'
		},
		SchedulerDropdown: {
			Title: 'Scheduler',
			Paragraph:
				'Diffuse the image in a certain way. It can drastically change the generated image. Some require less steps to produce good results.'
		},
		SubmitToGalleryQuestion: {
			Title: 'बनावट को गैलरी में दर्ज करे?',
			Paragraph: 'आप बाद में सेटिंग्स से अपनी प्राथमिकताएं बदल सकते हैं।'
		}
	},
	History: {
		GenerationsTitle: 'बनावटे',
		GenerationsMaxSavedCountWarning: 'आखरी {count:number} ही',
		NoGenerationsYet: 'आपने अभी तक कोई चित्र नहीं बनाया है।'
	},
	Live: {
		GenerationsTitle: 'बनावटे',
		TotalDurationTitle: 'कुल अवधि',
		UpscalesTitle: 'निखार',
		GenerationTooltip: {
			CountryTitle: 'देश',
			Type: {
				Title: 'प्रकार',
				Generation: 'बनावत',
				Upscale: 'निखार'
			},
			DimensionsTitle: 'माप',
			StepsTitle: 'कदम',
			ScaleTitle: 'पैमाना',
			DurationTitle: 'अवधि',
			Status: {
				Title: 'स्थिति',
				Started: 'शुरू हो गया',
				Succeeded: 'सफल हो गया',
				Failed: 'असफल हो गया'
			},
			Server: {
				Title: 'सर्वर',
				Default: 'डिफ़ॉल्ट',
				Custom: 'कस्टम'
			},
			UnknownTitle: 'अनजान'
		},
		WaitingTitle: 'बनावटो का इंतजार किया जा रहा है',
		DurationStatusUnknown: 'अनजान'
	},
	Navbar: {
		HomeTab: 'होम',
		HistoryTab: 'इतिहास',
		GalleryTab: 'गैलरी',
		LiveTab: 'लाइव'
	},
	Settings: {
		Title: 'सेटिंग्स',
		SwitchServerButton: 'सर्वर बदले',
		SubmitToGalleryToggle: 'गैलरी में दर्ज करें',
		AdvancedModeToggle: 'एडवांस सेटिंग',
		AdvancedOptionsDropdown: 'Advanced Options',
		AdvancedDropdown: 'Advanced',
		GenerationSettingsButton: 'Generation Settings',
		GenerationSettingsTitle: 'Generation Settings',
		DarkModeToggle: 'डार्क मोड'
	},
	GenerationFullscreen: {
		DownloadButton: 'डाउनलोड',
		DoneButtonState: 'हो गया!',
		CopyPromptButton: 'संकेत कॉपी करें',
		CopyNegativePromptButton: 'नकारात्मक संकेत कॉपी करें',
		CopiedButtonState: 'कॉपी हो गया!',
		RerollButton: 'नया बनाए',
		RegenerateButton: 'दोबारा बनाए',
		GenerateButton: 'बनाए',
		UpscaleButton: 'निखारे',
		UpscaleTabBar: {
			UpscaledTitle: 'निखरित',
			OriginalTitle: 'असल'
		},
		Dimensions: {
			Title: 'माप'
		},
		Duration: {
			Title: 'अवधि'
		}
	},
	SetServerModal: {
		SetServerTitle: 'सर्वर चुने',
		SwitchServerTitle: 'सर्वर बदले',
		Paragraph: 'चित्रों को बनाने के लिए सर्वर का इस्तेमाल किया जाएगा।',
		SetButton: 'चुने',
		DefaultButton: 'डिफॉल्ट'
	},
	Blog: {
		Title: 'ब्लॉग पोस्ट',
		TitleAlt: 'ब्लॉग',
		BackToBlogButton: 'ब्लॉग पर वापिस'
	},
	Redirect: {
		RedirectingToTitle: '{name:string} पर लेजाया जा रहा है'
	},
	Shared: {
		StartGeneratingTitle: 'सुंदर चित्र बनने शुरू हो गए है!',
		StartGeneratingButton: 'बनाना शुरु करे',
		JoinUsTitle: 'हमसे जुड़े',
		GoHomeButton: 'होम जाए',
		SwitchToDefaultServerButton: 'डिफॉल्ट सर्वर पर वापसी करे',
		ShareButton: 'शेयर',
		ShareOnButton: '{name:string} पर शेयर करे',
		YesButton: 'हां',
		NoButton: 'नही',
		EnableButton: 'चालू करे',
		DisableButton: 'बंद करे',
		AddButton: 'जोड़े',
		CopyLinkButton: 'लिंक कॉपी करे',
		CopyButton: 'कॉपी',
		DeleteButton: 'हटाए',
		ServerUrlInput: {
			Placeholder: 'सर्वर URL'
		},
		LoadingTitle: 'लोड हो रहा है',
		LoadingParagraph: 'लोड हो रहा है...',
		LoginButton: 'लॉग इन',
		LogoutButton: 'लॉग आउट',
		EmailInput: {
			Placeholder: 'ईमेल'
		},
		PasswordInput: {
			Placeholder: 'पासवर्ड'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: 'General'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3D Digital Art'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3D Comic'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': { realName: 'Ghibli Diffusion', simpleName: 'Anime' },
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Animated Movie'
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
		UnknownTitle: 'Unknown'
	},
	Error: {
		SomethingWentWrong: 'कुछ गलत हो गया :(',
		NSFW: 'अश्लील सामग्री पता चला, कोई और संकेत का प्रयास करें :(',
		ServerSeemsOffline:
			'सर्वर ऑफ़लाइन लगता है। हो सकता है कि आप पेज को रीफ्रेश करना चाहें या सेटिंग से कोई अन्य सर्वर सेट करना चाहें।',
		ServerSetNotWorking: 'यह सर्वर अनुकूल नहीं है या काम नहीं कर रहा है।',
		NotFound: 'नही मिला',
		SupabaseNotFoundCantListen: 'सुपरबेस उदाहरण नहीं मिला। बनावट नहीं हो सकती।'
	},
	Admin: {
		AdminPanelTitle: 'एडमिन',
		DeleteButton: 'हटाए',
		ApproveButton: 'मंजूर करे',
		NoGenerationsToReview: 'समीक्षा के लिए कोई बानावट नही है।',
		ServersButton: 'सर्वर्स',
		GalleryButton: 'गैलरी'
	}
};
export default hi;
