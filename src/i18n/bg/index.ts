import type { Translation } from '../i18n-types';

const bg: Translation = {
	Language: 'Език',
	Home: {
		GenerateButton: 'Създай',
		PromptInput: {
			Placeholder: 'Портрет на котка от Ван Гог'
		},
		WidthTabBar: {
			Title: 'Ширина',
			Paragraph: 'Ширина на изображението.'
		},
		HeightTabBar: {
			Title: 'Височина',
			Paragraph: 'Височина на изображението.'
		},
		InferenceStepsTabBar: {
			Title: 'Стъпки',
			Paragraph: 'Броя на стъпките за създаване (дифузия) на изображението.'
		},
		GuidanceScaleSlider: {
			Title: 'Насока',
			Paragraph:
				'Колко близко да се следват напътствията. По-високи стойности водят до по-буквално тълкуване.'
		},
		AspectRatioDropdown: {
			Title: 'Съотношение',
			Paragraph: 'Съотношението между размерите на изображението.',
			Options: {
				Square: 'Квадрат (1:1)',
				Portrait: 'Портрет (2:3)',
				Landscape: 'Пейзаж (3:2)',
				Mobile: 'Телефон (9:16)',
				Desktop: 'Настолен (16:9)',
				Squarish: 'Правоъгълник (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: 'Съотношение',
			Paragraph: 'Съотношението между размерите на изображението.'
		},
		InitialImageTabBar: {
			Title: 'Първоначално изображение',
			Paragraph: 'Резултатът ще бъде базиран на това изображение.'
		},
		InitialImageStrengthTabBar: {
			TitleAlt: 'Image Strength',
			Title: 'Сила на въздействие',
			Paragraph:
				'Въздействието на първоначалното изображение. По-високи стойности оказват по-силно влияние на крайния резултат.'
		},
		NegativePromptInput: {
			Title: 'Отрицателни напътствия',
			Placeholder: 'Вето',
			PlaceholderAlt: 'Какво да се избегне',
			Paragraph: 'Премахва нежелани елементи при изработване. Напътствия които да се избягват.'
		},
		ImageInput: {
			Paragraph: 'Click or drop your image here',
			Title: 'Качи изображение'
		},
		SeedInput: {
			Title: 'Семе (Сийд)',
			Placeholder: 'Семе',
			Paragraph:
				'За повтарящи се резултати. Ключ, заедно с еднакви напътствия и настройки, ще създаде еднакви резултати.'
		},
		ModelDropdown: {
			Title: 'Модел',
			Paragraph: 'Моделът изкуствен интелект, който ще бъде използван за създаване на изображения.'
		},
		NumOutputsSlider: {
			Title: 'Брой изображения',
			Paragraph: 'Броят изображения за създаване наведнъж.'
		},
		SchedulerDropdown: {
			Title: 'Аналитик',
			Paragraph:
				'Обезшумява изображението по определен начин. Може драстично да промени резултата. Различни аналитици изискват по-малко или повече стъпки за постигане на добри резултати.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Качи изработките в галерията?',
			Paragraph: 'Можете по-късно да промените настройките си.'
		}
	},
	History: {
		GenerationsTitle: 'Изработки',
		GenerationsMaxSavedCountWarning: 'Само последните {count}',
		DownloadLegacyGenerationsButton: 'Изтегли неподдържани изработки',
		NoFavoritesYet: 'Все още нямате любими изображения.',
		Views: {
			AllTitle: 'Всички',
			FavoritesTitle: 'Любими'
		},
		NoGenerationsYet: 'Все още не сте създали никакви изображения.'
	},
	Live: {
		GenerationsTitle: 'Изработки',
		TotalDurationTitle: 'Общо време',
		UpscalesTitle: 'Уголемявания',
		GenerationTooltip: {
			AspectRatioTitle: 'Съотношение',
			CountryTitle: 'Държава',
			Type: {
				Title: 'Тип',
				Generation: 'Изработка',
				Upscale: 'Уголемяване'
			},
			DimensionsTitle: 'Размери',
			StepsTitle: 'Стъпки',
			ScaleTitle: 'Насока',
			DurationTitle: 'Време',
			Status: {
				Title: 'Състояние',
				Started: 'Започнато',
				Succeeded: 'Успех',
				Failed: 'Провал'
			},
			Server: {
				Title: 'Сървър',
				Default: 'Основен',
				Custom: 'Избран'
			},
			UnknownTitle: 'Непознат',
			OutputsTitle: 'Резултати'
		},
		WaitingTitle: 'Изчакват се изработки',
		DurationStatusUnknown: 'Непознат'
	},
	Navbar: {
		HomeTab: 'Начало',
		HistoryTab: 'История',
		GalleryTab: 'Галерия',
		LiveTab: 'На живо'
	},
	Settings: {
		Title: 'Настройки',
		SwitchServerButton: 'Промени сървъра',
		SubmitToGalleryToggle: 'Качи в галерията',
		AdvancedModeToggle: 'Разширен режим',
		AdvancedOptionsDropdown: 'Разширени настройки',
		AdvancedDropdown: 'За напреднали',
		GenerationSettingsButton: 'Използвани настройки',
		GenerationSettingsTitle: 'Използвани настройки',
		DarkModeToggle: 'Тъмна тема'
	},
	GenerationFullscreen: {
		DownloadButton: 'Изтегли',
		DoneButtonState: 'Готово!',
		CopyPromptButton: 'Копирай заданието',
		CopyNegativePromptButton: 'Копирай отрицателното задание',
		CopiedButtonState: 'Копирано!',
		GenerateSimilarButton: 'Създай подобни',
		RerollButton: 'Превърти',
		RegenerateButton: 'Пресъздай',
		GenerateButton: 'Създай',
		UpscaleButton: 'Уголеми',
		SubmitToGalleryButton: 'Качи в галерията',
		SubmittedTitle: 'Качено',
		UpscaleTabBar: {
			UpscaledTitle: 'Уголемено',
			OriginalTitle: 'Оригинал'
		},
		Dimensions: {
			Title: 'Размери'
		},
		Duration: {
			Title: 'Време'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Задай сървър',
		SwitchServerTitle: 'Промяна на сървъра',
		Paragraph: 'Сървър за създаване на изображенията.',
		SetButton: 'Задай',
		DefaultButton: 'Основен'
	},
	Blog: {
		Title: 'Публикации',
		TitleAlt: 'Блог',
		BackToBlogButton: 'Обратно към блога'
	},
	Redirect: {
		RedirectingToTitle: 'Пренасочване към {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Започни да създаваш прекрасни картини!',
		StartGeneratingButton: 'Започни',
		JoinUsTitle: 'Присъедини се',
		GoHomeButton: 'Начало',
		SwitchToDefaultServerButton: 'Смени на основния съръвър',
		JoinOnDiscord: 'Елате в нашия Discord',
		JoinUsOnTitle: 'Елате на нашият {name}',
		ShareButton: 'Сподели',
		ShareOnButton: 'Споделяне по {name}',
		GoBackButton: 'Назад',
		YesButton: 'Да',
		NoButton: 'Не',
		EnableButton: 'Включи',
		ClearAllButton: 'Изчисти всички',
		DisableButton: 'Изключи',
		AddButton: 'Добави',
		CopyLinkButton: 'Копирай линк',
		CopyButton: 'Копирай',
		DeleteButton: 'Изтрий',
		LoadingTitle: 'Зареждане',
		ContinueButton: 'Продължи',
		LoadingParagraph: 'Зареждане...',
		InsufficientCreditsTitle: 'Липса на кредит ({remainingCredits}/{neededCredits})',
		AllTitle: 'Всички',
		ConfirmButton: 'Потвърди',
		ConfirmQuestionMarkButton: 'Потвърди?',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Тип кредит',
				RemainingCreditsTitle: 'Остават',
				ExpiryTitle: 'Изтича',
				LastReplenish: 'Последно възобновяване'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Готово',
			DeselectButton: 'Изчисти ({selectedCount})',
			DeleteButton: 'Изтрий ({selectedCount})',
			FavoriteButton: 'Харесай ({selectedCount})',
			ApproveButton: 'Одобри ({selectedCount})',
			RejectButton: 'Отхвърли ({selectedCount})',
			UnfavoriteButton: 'Премахни ({selectedCount}) харесан(и)',
			ConfirmationModal: {
				CancelButton: 'Отмяна',
				Deselect: {
					Title: 'Изчисти {selectedCount} избор(а)?',
					Paragraph: 'Сигурни ли сте, че искате да изчистите {selectedCount} избор(а)?',
					ConfirmButton: 'Изчисти'
				},
				Delete: {
					Title: 'Изтрий {selectedCount} избор(а)?',
					Paragraph: 'Сигурни ли сте, че искате да изчистите {selectedCount} избор(а)?',
					ConfirmButton: 'Изтрий'
				},
				Favorite: {
					Title: 'Харесай {selectedCount} избор(а)?',
					Paragraph: 'Сигурни ли сте, че искате да харесате {selectedCount} избор(а)?',
					ConfirmButton: 'Харесай'
				},
				Unfavorite: {
					Title: 'Премахни {selectedCount} харесан(и)?',
					Paragraph: 'Сигурни ли сте, че искате да премахнете {selectedCount} харесан(и)?',
					ConfirmButton: 'Премахни'
				}
			}
		},
		ServerUrlInput: {
			Placeholder: 'Сървърен адрес (URL)'
		},
		EmailInput: {
			Placeholder: 'Имейл'
		},
		PasswordInput: {
			Placeholder: 'Парола'
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
				realName: 'Euler A.'
			},
			'9d175114-9a26-4371-861c-729ba9ecb4da': {
				realName: 'DPM Многостъпков'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Едностъпков'
			},
			'82cf78dd-6afb-48cc-aca6-14224cca6950': {
				realName: 'DDIM'
			},
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		UnknownTitle: 'Непознат',
		AdvancedSettingsButton: 'Разширени настройки',
		MoreOptionsTitle: 'Още опции',
		LessOptionsTitle: 'По-малко опции',
		TryAgainButton: 'Опитайте отново',
		RefreshButton: 'Опресни',
		LoadMoreButton: 'Зареди повече',
		SearchingTitle: 'Търсене',
		NoResultsFoundTitle: 'Не бяха открити резултати'
	},
	Error: {
		SomethingWentWrong: 'Нещо се обърка :(',
		ImageWasNSFW: 'Неподходящо изображение :(',
		NSFW: 'Съдържа неподходящи елементи, опитайте отново :(',
		ServerSeemsOffline:
			'Сървърът не е на линия. Опреснете странницата или изберете друг сървър от настройките.',
		ServerSetNotWorking: 'Сървърът е несъвместим или не отговаря.',
		NotFound: 'Не намерен',
		SupabaseNotFoundCantListen:
			'Инстанцията "Supabase" не бе намерена. Невъзножно е слушането за изработки.',
		InvalidEmail: 'Въведете валиден имейл.',
		PasswordTooShort: 'Паролата трябва да е поне 8 символа.',
		SomethingWentWrongTryAgain: 'Нещо се обърка, опитайте отново.',
		InvalidCredentials: 'Невалидни данни.',
		InvalidCode: 'Грешен код.',
		TryAnotherImage: 'Опитайте различно изображение :(',
		OnceEvery60Seconds: 'Може да поискате линк само на всеки 60 секунди.',
		LinkExpired: {
			Title: 'Линкът ви изтече',
			Paragraph: 'Този еднократен линк изтича след 24 часа.'
		},
		UpdateAvailable: {
			Title: 'Налично е обновление',
			Paragraph: 'Обновление! Опреснете странницата.'
		},
		EmailProviderNotAllowed: 'Този имейл доставчик е забранен.',
		EmailAlreadyInUse: 'Имейлът вече се използва.'
	},
	Admin: {
		AdminPanelTitle: 'Администратор',
		DeleteButton: 'Изтрий',
		ApproveButton: 'Одобри',
		RejectButton: 'Отхвърли',
		EditButton: 'Промени',
		EditViewButton: 'Изглед',
		NormalViewButton: 'Нормален изглед',
		StopEditButton: 'Прекрати редактирането',
		NoGenerationsToReview: 'Няма изработки за преглеждане.',
		ServersButton: 'Сървъри',
		AdminGalleryButton: 'Галерия',
		UsersButton: 'Потребители',
		AdminTab: 'Администратор',
		ServersTab: 'Сървъри',
		AdminGalleryTab: 'Галерия',
		UsersTab: 'Потребители',
		Users: {
			ConfirmAction: {
				ConfirmActionReferenceText: 'I confirm the action',
				ConfirmActionParagraph: 'Type "{confirmActionText}" to confirm.',
				ConfirmActionInput: { Placeholder: 'Confirm' }
			},
			DataDeletedAtTitle: 'Data Deleted',
			WillBeDeletedTitle: 'Will Be Deleted',
			BannedAtTitle: 'Banned',
			BannedTitle: 'Banned',
			UnbanUserButton: 'Unban User',
			BanUserButton: 'Ban User',
			GiftCreditsButton: 'Дари кредити'
		},
		Gallery: {
			TotalTitle: 'Общо',
			ApprovedTitle: 'Одобрени',
			DeletedTitle: 'Изтрити',
			StatusDropdown: {
				All: 'Всички',
				ManuallySubmitted: 'Ръчно качени',
				Submitted: 'Качени',
				Approved: 'Одобрени',
				Rejected: 'Отхвърлени',
				Deleted: 'Изтрити',
				Private: 'Частни'
			},
			NoGenerationsToReview: 'Няма изработки за преглеждане'
		}
	},
	SignUp: {
		PageTitle: 'Регистрация',
		PageParagraph:
			'Присъдедини се към "Stablecog" и стани платен потребител за да отключиш пълния му потенциал.',
		PageTitleConfirm: 'Потвърди',
		PageTitleConfirmAlt: 'Проверете си имейла',
		PageParagraphConfirm: 'Изпратихме ви 6-цифрен код за потвърждения на акаунта ви.',
		SignUpButton: 'Регистрирай се',
		AllTitle: 'Всички',
		ConfirmButton: 'Потвърди',
		AlreadyHaveAnAccountTitle: 'Вече имате профил?',
		LoginInsteadButton: 'Вместо това Влизане',
		SixDigitCodeInput: {
			Placeholder: '6-цифрен код'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Да започнем',
		GetStartedButton: 'Започнете',
		PageTitle: 'Вход',
		PageParagraph: 'Влезте в "Stablecog" и се възползвайте от всичките му възможности.',
		PageParagraphV2: 'Създайте уникални картини за секунди, напълно безплатно.',
		PageTitleCreateAccountOrSignIn: 'Създай профил или влез',
		PageParagraphCreateAccountOrSignIn:
			'Влезте в "Stablecog" и се възползвайте от всичките му възможности.',
		PageTitleSentLink: 'Проверете си имейла',
		PageParagraphSentLink:
			'Изпратихме ви връзка за влизане. Проверети папката спам, в случай че не я виждате.',
		ContinueButton: 'Продължи',
		ContinueWithProviderButton: 'Продължи през {provider}',
		SignInWithProviderButton: 'Влез през {provider}',
		OrContinueWithEmailTitle: 'Или продължете с имейл',
		DontHaveAnAccountTitle: 'Нямате профил?',
		SignUpInsteadButton: 'Вместо това Регистрация',
		SignInButton: 'Вход',
		SignOutButton: 'Излез'
	},
	Pro: {
		PageTitle: 'Станете платен потребител',
		PageParagraph:
			'Отключете всички възможности и помогнете на проекта. Без дарители, не би било възможно да останем отворен-код и да предоставяме безплатни услуги на всеки.',
		PageTitleAlreadyPro: 'Вече сте платили!',
		PageParagraphAlreadyPro:
			'Вече сте платен потребител. Благодарим ви, че подпомагате на проекта! Забавлявайте се, а може би споделете и с приятели.',
		ProPlanTitle: 'Платен',
		Features: {
			FullSpeed: 'Пълна скорост, без граници',
			ImageDimensions: 'Различни размери',
			Upscale: 'Уголеми изображения',
			Steps: 'Различен брой стъпки',
			MoreModels: 'Повече модели',
			MoreSchedulers: 'Повече аналитици',
			SavedToCloud: 'Автоматично запазване в облака',
			Upcoming: 'Предстоящи обновления',
			CommercialUse: 'Търговски приложения'
		},
		Soon: '(скоро)',
		Month: '/месец',
		BecomeProButton: 'Стани платен потребител',
		Success: {
			PageTitle: 'Вече сте платен потребител!',
			PageParagraph:
				'Вече имате достъп до всички възможности на "Stablecog". Ако имате въпроси, свържете се с нас през {platform}.'
		},
		Cancel: {
			PageTitle: 'Отказахте покупката',
			PageParagraph: 'Успешно прекратихте планът. Ако е било грешка, опитайте отново.'
		},
		Reason: {
			ParagraphWidth: 'Тази ширина е недостъпна на безплатен план.',
			ParagraphHeight: 'Тази височина е недостъпна на безплатен план.',
			ParagraphDimensions: 'Тези размери са недостъпни на безплатен план.',
			ParagraphUpscale: 'Уголемяването е недостъпно на безплатен план.',
			ParagraphInferenceSteps: 'Този брой стъпки е недостъпен на безплатен план.',
			ParagraphModel: 'Този модел е недостъпен на безплатен план.',
			ParagraphScheduler: 'Този аналитик е недостъпен на безплатен план.',
			ParagraphWidthGeneration:
				'Тази изработка бе създадена от друга, със ширина, недостъпна на безплатен план.',
			ParagraphHeightGeneration:
				'Тази изработка бе създадена от друга, с височина, недостъпна на безплатен план.',
			ParagraphDimensionsGeneration:
				'Тази изработка бе създадена от друга, с размери, недостъпни на безплатен план.',
			ParagraphInferenceStepsGeneration:
				'Тази изработка бе създадена от друга, с брой стъпки, недостъпни на безплатен план.',
			ParagraphModelGeneration:
				'Тази изработка бе създадена от друга, с модел, недостъпен на безплатен план.',
			ParagraphSchedulerGeneration:
				'Тази изработка бе създадена от друга, с аналитик, недостъпен на безплатен план.'
		},
		Tier: {
			Title: {
				Free: 'Безплатен',
				Pro: 'Платен'
			},
			Badge: {
				Free: 'БЕЗПЛАТЕН',
				Pro: 'ПЛАТЕН'
			}
		}
	},
	Account: {
		PageTitle: 'Профил',
		ManageSubscriptionButton: 'Управление на абонамента',
		ComparePlansButton: 'Сравнете планове',
		ManageAccountButton: 'Управление на профила',
		MyAccountButton: 'Моят профил',
		SubscriptionPlanTitle: 'План',
		RemainingImagesTitle: 'Оставащи изработки',
		RemainingCreditsTitle: 'Оставащ кредит',
		RemainingTitle: 'Кредит',
		Subscription: {
			UpdateSubscriptionTitle: 'Актуализирай абонамента',
			ChangePlanTitle: 'Промяна на плана',
			CurrentPlanTitle: 'Текущ план',
			NewPlanTitle: 'Нов план',
			Downgrade: {
				DowngradingToTitle: 'Понижава се на',
				Explanation: 'Оставащият кредит ще се запази.'
			},
			Upgrade: {
				UpgadingToTitle: 'Повишава се на',
				Explanation: 'Оставащият кредит ще се запази.'
			},
			Failed: {
				PageTitle: 'Неуспешна промяна',
				PageParagraph: 'Нещо се обърка при промяната. Моля опитайте отново.'
			},
			Succeeded: {
				PageTitle: 'Успех',
				PageParagraph: 'Успешно сменихте плана.'
			}
		},
		Meta: {
			AccountCreationTitle: 'Създай',
			LastSignInTitle: 'Последно влизане',
			LastSeenTitle: 'Последна активност'
		},
		ChangeEmail: {
			PageTitle: 'Промяна на имейл',
			PageParagraph: 'Въведете нов имейл адрес.',
			ChangeEmailButton: 'Промяна на имейл',
			NewEmailInput: {
				Placeholder: 'Нов имейл'
			},
			PageTitleSentLink: 'Проверете си имейла',
			PageParagraphSentLink:
				'Изпратихме връзки до двата адреса. Потвърдете и на двата за успешна промяна.',
			PageTitleConfirmOtherEmail: 'Потвърдете друг имейл',
			PageParagraphConfirmOtherEmail:
				'Изпратили сме също и връзка на другия ви адрес. Потвърдете и него за да завършите.'
		}
	},
	ForgotPassword: {
		PageTitle: 'Нулиране на парола',
		PageParagraph: 'Изпратихме ви 6-цифрен код на вашия имейл адрес за възобновяване на паролата.',
		SendResetCodeButton: 'Изпрати код',
		PageTitleConfirmCode: 'Потвърждаване',
		PageTitleConfirmCodeAlt: 'Проверете имейла си',
		PageParagraphConfirmCode: 'Изпратихме ви 6-цифрен код. Впишете го за да продължите.',
		ConfirmCodeButton: 'Потвърди',
		PageTitleNewPassword: 'Нова парола',
		PageParagraphNewPassword: 'Въведете нова парола.',
		NewPasswordInput: {
			Placeholder: 'Нова парола'
		},
		SetNewPasswordButton: 'Задайте нова парола',
		PageTitleSuccess: 'Готово!',
		PageParagraphSuccess: 'Парлоата ви бе успешно сменена.',
		ForgotPasswordButton: 'Забравена парола?'
	},
	FeaturedOn: {
		PageTitle: 'Представени сме на'
	},
	Gallery: {
		PageTitle: 'Галерия',
		PageParagraph: 'Вижте какво създават други със "Stablecog".',
		SearchInput: {
			Title: 'Потърси'
		},
		SearchingTitle: 'Търсене',
		NoMatchingGenerationTitle: 'Няма съответствия'
	},
	Pricing: {
		PlansTitle: 'Планове',
		PlansParagraph: 'Изберете правилния план за вас.',
		CreditPacksTitle: 'Кредит пакети',
		CreditPacksParagraph: 'Нужда от повече? Може да купите кредит по всяко време.',
		SubscribeButton: 'Абонирай се',
		SubscribedButton: 'Абониран',
		UpgradeButton: 'Повиши',
		DowngradeButton: 'Понижи',
		PurchaseButton: 'Купи',
		BuyCreditsButton: 'Купи кредит',
		MonthlyTitle: 'Месечно',
		YearlyTitle: 'Годишно',
		SlashMonth: '/месец',
		Plans: {
			FreeTitle: 'Безплатен',
			StarterTitle: 'Начален',
			ProTitle: 'Платен',
			UltimateTitle: 'Професионален'
		},
		CreditPacks: {
			MediumTitle: 'Среден пакет',
			LargeTitle: 'Голям пакет',
			MegaTitle: 'Огромен пакет'
		},
		Features: {
			MonthlyCredits: '{count} кредит на месец.',
			MonthlyImages: '{count} изображения на месец.',
			MonthlyGenerations: '{count} изработки на месец.',
			Images: '{count} изображения.',
			Generations: '{count} изработки.',
			NeverExpires: 'Постоянен.',
			CommercialUse: 'Търговски приложими.',
			ImagesArePublic: 'Изображенията са публични.',
			ImagesArePrivate: 'Изображенията са частни.'
		},
		Badges: {
			Recommended: 'Препоръчано',
			MostPopular: 'Най-популярен',
			BestValue: 'Най-стойностно'
		},
		Purchase: {
			Succeeded: {
				PageTitle: 'Всичко е готово!',
				PageParagraph:
					'Благодарим ви за покупката. Ако имате въпроси, не се притеснявайте да ни потърсите на {platform}.'
			},
			Cancelled: {
				PageTitle: 'Покупката е отменена',
				PageParagraph: 'Успешно прекратихте покупката. Ако е било грешка, опитайте отново.'
			}
		}
	},
	LowOnCreditsCard: {
		Title: 'Вашият кредит привършва ({remainingCredits})',
		FreeParagraph:
			'Всеки ден даваме безплатен кредит на активни потребители. Може да закупите чрез платен план, или чрез участие в наши събития.',
		HighestPlanParagraph: 'Може да закупите кредит пакет.',
		OtherPlansParagraph: 'Повишете вашия план или закупете кредит пакет.'
	},
	Support: {
		PageTitle: 'Поддръжка',
		PageParagraph:
			'В случай на въпроси, свържете се чрез връзките по-долу и ще ви отговорим възможно най-скоро.'
	},
	Guide: {
		PageTitle: 'Ръководство',
		GuideButton: 'Упътване',
		PreviousTitle: 'Назад',
		NextTitle: 'Напред',
		ChaptersTitle: 'Съдържание',
		ChapterTitle: 'Глава'
	},
	Legal: {
		TermsOfServiceTitle: 'Условия на ползване',
		PrivacyPolicyTitle: 'Поверителност',
		RefundPolicyTitle: 'Връщане на плащания',
		ContentPolicyTitle: 'Съдържателни норми'
	},
	UnderDevelopment: {
		PageTitle: 'Скоро ще се върнем!',
		PageParagraph: 'Обновяваме системите си. Ще се върнем след няколко часа.'
	}
};

export default bg;
