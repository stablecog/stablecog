import type { Translation } from '../i18n-types';

const ru: Translation = {
	Language: 'Язык',
	Home: {
		GenerateButton: 'Сгенерировать',
		PromptInput: {
			Placeholder: 'Портрет кота, стиль ван гога'
		},
		WidthTabBar: {
			Title: 'Ширина',
			Paragraph: 'Ширина изображения.'
		},
		HeightTabBar: {
			Title: 'Высота',
			Paragraph: 'Высота изображения.'
		},
		InferenceStepsTabBar: {
			Title: 'Количество итераций',
			Paragraph: 'Сколько итераций будет сделано при создании (улучшении) изображения.'
		},
		GuidanceScaleSlider: {
			Title: 'Уровень соответствия',
			Paragraph:
				'Насколько изображение будет похоже на ваш запрос. Большие значения означают более точное следование/соответствие запросу.'
		},
		NegativePromptInput: {
			Title: 'Исключения',
			Placeholder: 'Исключения',
			Paragraph:
				'Чтобы убрать нежелательное содержимое из изображения. Противоположность основному запросу.'
		},
		SeedInput: {
			Title: 'Сид (seed)',
			Placeholder: 'Сид (seed)',
			Paragraph:
				'Для воспроизведения результата. Сид в сочетании с тем же текстом запроса и опциями генерирует одно и то же изображение.'
		},
		ModelDropdown: {
			Title: 'Модель',
			Paragraph: 'Модель ИИ, которая будет использоваться для создания изображения.'
		},
		SchedulerDropdown: {
			Title: 'Планировщик',
			Paragraph:
				'Рассеивает изображение определенным образом. Может кардинально изменить созданное изображение. Некоторые планировщики требуют меньше шагов для получения хороших результатов.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Отправить сгенерированные изображения в галерею?',
			Paragraph: 'Впоследствии вы сможете изменить это опцию в настройках.'
		}
	},
	History: {
		GenerationsTitle: 'Сгенерированные изображения',
		GenerationsMaxSavedCountWarning: 'Только последние {count}',
		NoGenerationsYet: 'Вы еще не сгенерировали ни одного изображения.'
	},
	Live: {
		GenerationsTitle: 'Сгенерированные изображения',
		TotalDurationTitle: 'Общая длительность',
		UpscalesTitle: 'Масштабирования',
		GenerationTooltip: {
			CountryTitle: 'Страна',
			Type: {
				Title: 'Тип',
				Generation: 'Генерация',
				Upscale: 'Масштабирование'
			},
			DimensionsTitle: 'Размеры',
			StepsTitle: 'Итераций',
			ScaleTitle: 'Масштаб',
			DurationTitle: 'Длительность',
			Status: {
				Title: 'Статус',
				Started: 'Начато',
				Succeeded: 'Успех',
				Failed: 'Неудача'
			},
			Server: {
				Title: 'Сервер',
				Default: 'По умолчанию',
				Custom: 'Свой'
			},
			UnknownTitle: 'Неизвестно'
		},
		WaitingTitle: 'В ожидании генераций',
		DurationStatusUnknown: 'Неизвестно'
	},
	Navbar: {
		HomeTab: 'Домой',
		HistoryTab: 'История',
		GalleryTab: 'Галерея',
		LiveTab: 'Онлайн'
	},
	Settings: {
		Title: 'Настройки',
		SwitchServerButton: 'Сменить сервер',
		SubmitToGalleryToggle: 'Отправить в галерею',
		AdvancedModeToggle: 'Расширенный режим',
		AdvancedOptionsDropdown: 'Дополнительные настройки',
		AdvancedDropdown: 'Дополнительно',
		GenerationSettingsButton: 'Настройки генерации',
		GenerationSettingsTitle: 'Настройки генерации',
		DarkModeToggle: 'Тёмный режим'
	},
	GenerationFullscreen: {
		DownloadButton: 'Скачать',
		DoneButtonState: 'Готово!',
		CopyPromptButton: 'Скопировать запрос',
		CopyNegativePromptButton: 'Скопировать исключения',
		CopiedButtonState: 'Скопировано!',
		RerollButton: 'Пересоздать',
		RegenerateButton: 'Улучшить',
		GenerateButton: 'Сгенерировать',
		UpscaleButton: 'Масштабировать',
		UpscaleTabBar: {
			UpscaledTitle: 'Масштабированное',
			OriginalTitle: 'Оригинал'
		},
		Dimensions: {
			Title: 'Размеры'
		},
		Duration: {
			Title: 'Длительность'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Выбрать сервер',
		SwitchServerTitle: 'Сменить сервер',
		Paragraph: 'Сервер будет использоваться для генерации изображений.',
		SetButton: 'Использовать',
		DefaultButton: 'По умолчанию'
	},
	Blog: {
		Title: 'Записи блога',
		TitleAlt: 'Блог',
		BackToBlogButton: 'Назад к блогу'
	},
	Redirect: {
		RedirectingToTitle: 'Перенаправление в {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Начните создавать прекрасные изображения!',
		StartGeneratingButton: 'Начать генерацию',
		JoinUsTitle: 'Присоединяйтесь к нам',
		GoHomeButton: 'Домой',
		SwitchToDefaultServerButton: 'Переключиться на сервер по умолчанию',
		JoinUsOnTitle: 'Join us on {name}',
		ShareButton: 'Поделиться',
		ShareOnButton: 'Поделиться в {name}',
		YesButton: 'Да',
		NoButton: 'Нет',
		EnableButton: 'Включить',
		DisableButton: 'Выключить',
		AddButton: 'Добавить',
		CopyLinkButton: 'Копировать ссылку',
		CopyButton: 'Копировать',
		DeleteButton: 'Удалить',
		LoadingTitle: 'Загружается',
		LoadingParagraph: 'Загружается...',
		ServerUrlInput: {
			Placeholder: 'URL-адрес сервера'
		},
		EmailInput: {
			Placeholder: 'Email'
		},
		PasswordInput: {
			Placeholder: 'Пароль'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: 'Обычный'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3D изображение'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3D комикс'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Аниме'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Анимированный фильм'
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
		UnknownTitle: 'Неизвестно',
		MoreOptionsTitle: 'Больше опций',
		LessOptionsTitle: 'Меньше опций',
		TryAgainButton: 'Try Again'
	},
	Error: {
		SomethingWentWrong: 'Что-то пошло не так :(',
		NSFW: 'Обнаружен NSFW-контент, попробуйте другую подсказку :(',
		ServerSeemsOffline:
			'Сервер недоступен. Возможно, вы захотите обновить страницу или установить другой сервер в настройках.',
		ServerSetNotWorking: 'Этот сервер не совместим или не отвечает.',
		NotFound: 'Не найдено',
		SupabaseNotFoundCantListen:
			'Сервер Supabase не найден. Невозможно отслеживать новые генерации.',
		InvalidEmail: 'Enter a valid email.',
		PasswordTooShort: 'Password must be at least 8 characters.',
		SomethingWentWrongTryAgain: 'Something went wrong, try again.',
		InvalidCredentials: 'Invalid credentials.'
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Delete',
		ApproveButton: 'Approve',
		NoGenerationsToReview: 'No generations to review.',
		ServersButton: 'Servers',
		AdminGalleryButton: 'Gallery',
		UsersButton: 'Users',
		AdminTab: 'Admin',
		ServersTab: 'Servers',
		AdminGalleryTab: 'Gallery',
		UsersTab: 'Users'
	},
	SignUp: {
		PageTitle: 'Sign Up',
		PageParagraph: 'Join Stablecog to become a pro member and unlock its full potential.',
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
	SignIn: {
		PageTitle: 'Sign In',
		PageParagraph: 'Start using Stablecog with all features that are available to your account.',
		DontHaveAnAccountTitle: "Don't have an account?",
		SignUpInsteadButton: 'Sign up instead',
		SignInButton: 'Sign In',
		SignOutButton: 'Sign Out'
	},
	Pro: {
		PageTitle: 'Become a Pro',
		PageParagraph:
			"Unlock all features of Stablecog and support the project. Without the pro members, Stablecog wouldn't be able to stay completely open-source and offer free generations to everyone.",
		PageTitleAlreadyPro: 'Already a Pro!',
		PageParagraphAlreadyPro:
			'You are already a pro member. Thank you for supporting the project! Go ahead and enjoy Stablecog, and consider sharing it with your friends.',
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Full speed without set limits',
			ImageDimensions: 'Different image dimensions',
			Upscale: 'Upscale images',
			Steps: 'Different inference steps',
			MoreModels: 'More models',
			MoreSchedulers: 'More schedulers',
			SavedToCloud: 'Generations saved to the cloud',
			Upcoming: 'Upcoming features',
			CommercialUse: 'Commercial Use'
		},
		Soon: '(soon)',
		Month: '/month',
		BecomeProButton: 'Become a Pro',
		Success: {
			PageTitle: "You're a Pro!",
			PageParagraph:
				'You now have access to everything Stablecog has to offer. If you have any questions, reach out to us on {platform}.'
		},
		Cancel: {
			PageTitle: "You've cancelled",
			PageParagraph:
				"You've cancelled the subscription process. If it was a mistake, you can try again."
		},
		Reason: {
			ParagraphWidth: "That image width isn't available on the free plan.",
			ParagraphHeight: "That image height isn't available on the free plan.",
			ParagraphDimensions: "Those image dimensions aren't available on the free plan.",
			ParagraphUpscale: "Upscale feature isn't available on the free plan.",
			ParagraphInferenceSteps: "That inference steps setting isn't available on the free plan.",
			ParagraphModel: "That AI model isn't available on the free plan.",
			ParagraphScheduler: "That scheduler isn't available on the free plan.",
			ParagraphWidthGeneration:
				"That generation was created using an image width that isn't available on the free plan.",
			ParagraphHeightGeneration:
				"That generation was created using an image height that isn't available on the free plan.",
			ParagraphDimensionsGeneration:
				"That generation was created using image dimensions that aren't available on the free plan.",
			ParagraphInferenceStepsGeneration:
				"That generation was created using an inference steps setting that isn't available on the free plan.",
			ParagraphModelGeneration:
				"That generation was created using a model that isn't available on the free plan.",
			ParagraphSchedulerGeneration:
				"That generation was created using a scheduler that isn't available on the free plan."
		},
		Tier: {
			FreeTitle: 'Free',
			ProTitle: 'Pro',
			Badge: {
				Free: 'FREE',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Account',
		ManageSubscriptionButton: 'Manage Subscription',
		ManageAccountButton: 'Manage Account',
		MyAccountButton: 'My Account',
		SubscriptionPlanTitle: 'Plan'
	},
	ForgotPassword: {
		PageTitle: 'Reset Password',
		PageParagraph: 'We will send a 6-digit code to your email for resetting your password.',
		SendResetCodeButton: 'Send Code',
		PageTitleConfirmCode: 'Confirm',
		PageParagraphConfirmCode: "We've emailed you a 6-digit code. Enter it below to continue.",
		ConfirmCodeButton: 'Confirm',
		PageTitleNewPassword: 'New Password',
		PageParagraphNewPassword: 'Enter a new password for your account.',
		NewPasswordInput: {
			Placeholder: 'New Password'
		},
		SetNewPasswordButton: 'Set New Password',
		PageTitleSuccess: 'Done!',
		PageParagraphSuccess: 'Your password has been successfully reset.',
		ForgotPasswordButton: 'Forgot Password?'
	},
	FeaturedOn: {
		PageTitle: 'We Are Featured On'
	}
};
export default ru;
