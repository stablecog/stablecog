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
		LessOptionsTitle: 'Меньше опций'
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
