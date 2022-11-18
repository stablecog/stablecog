import type { BaseTranslation } from '../i18n-types';

const ru: BaseTranslation = {
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
		SubmitToGalleryQuestion: {
			Title: 'Отправить сгенерированные изображения в галерею?',
			Paragraph: 'Впоследствии вы сможете изменить это опцию в настройках.'
		}
	},
	History: {
		GenerationsTitle: 'Сгенерированные изображения',
		GenerationsMaxSavedCountWarning: 'Только последние {count:number}',
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
		RedirectingToTitle: 'Перенаправление в {name:string}'
	},
	Shared: {
		StartGeneratingTitle: 'Начните создавать прекрасные изображения!',
		StartGeneratingButton: 'Начать генерацию',
		JoinUsTitle: 'Присоединяйтесь к нам',
		GoHomeButton: 'Домой',
		SwitchToDefaultServerButton: 'Переключиться на сервер по умолчанию',
		ShareButton: 'Поделиться',
		ShareOnButton: 'Поделиться в {name:string}',
		YesButton: 'Да',
		NoButton: 'Нет',
		EnableButton: 'Включить',
		DisableButton: 'Выключить',
		AddButton: 'Добавить',
		CopyLinkButton: 'Копировать ссылку',
		CopyButton: 'Копировать',
		DeleteButton: 'Удалить',
		ServerUrlInput: {
			Placeholder: 'URL-адрес сервера'
		},
		LoadingTitle: 'Загружается',
		LoadingParagraph: 'Загружается...',
		LoginButton: 'Войти',
		LogoutButton: 'Выйти',
		EmailInput: {
			Placeholder: 'Email'
		},
		PasswordInput: {
			Placeholder: 'Пароль'
		}
	},
	Error: {
		SomethingWentWrong: 'Что-то пошло не так :(',
		NSFW: 'Обнаружен NSFW-контент, попробуйте другую подсказку :(',
		ServerSeemsOffline:
			'Сервер недоступен. Возможно, вы захотите обновить страницу или установить другой сервер в настройках.',
		ServerSetNotWorking: 'Этот сервер не совместим или не отвечает.',
		NotFound: 'Не найдено',
		SupabaseNotFoundCantListen: 'Сервер Supabase не найден. Невозможно отслеживать новые генерации.'
	},
	Admin: {
		AdminPanelTitle: 'Админ',
		DeleteButton: 'Удалить',
		ApproveButton: 'Одобрить',
		NoGenerationsToReview: 'Нет генераций для проверки.',
		ServersButton: 'Серверы',
		GalleryButton: 'Галерея'
	}
};
export default ru;
