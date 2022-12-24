import type { BaseTranslation } from '../i18n-types';

const es: BaseTranslation = {
	Language: 'Idioma',
	Home: {
		GenerateButton: 'Generar',
		PromptInput: {
			Placeholder: 'Retrato de un gato por Van Gogh'
		},
		WidthTabBar: {
			Title: 'Ancho',
			Paragraph: 'El ancho de la imagen.'
		},
		HeightTabBar: {
			Title: 'Alto',
			Paragraph: 'El alto de la imagen.'
		},
		InferenceStepsTabBar: {
			Title: 'Pasos de Inferencia',
			Paragraph: 'Cuántos pasos se tomarán para generar (difundir) la imagen.'
		},
		GuidanceScaleSlider: {
			Title: 'Escala de Orientación',
			Paragraph:
				'Cuán similar será la imagen a su indicación. Valores más altos hacen que la imagen se acerque más a su indicación.'
		},
		NegativePromptInput: {
			Title: 'Indicación Negativa',
			Placeholder: 'Indicación negativa',
			Paragraph:
				'Para remover cosas no deseadas de la imagen. Hace lo contrario de lo que hace la indicación.'
		},
		SeedInput: {
			Title: 'Semilla',
			Placeholder: 'Número de semilla',
			Paragraph:
				'Obtener resultados repetibles. Una semilla combinada con la misma indicación y opciones genera la misma imagen.'
		},
		ModelDropdown: {
			Title: 'Modelo',
			Paragraph: 'El modelo de IA que se utilizará para generar la imagen.'
		},
		SchedulerDropdown: {
			Title: 'Planificador',
			Paragraph:
				'Difunda la imagen de una cierta manera. Puede cambiar drásticamente la imagen generada. Algunos requieren menos pasos para producir buenos resultados.'
		},
		SubmitToGalleryQuestion: {
			Title: '¿Enviar generaciones a la galería?',
			Paragraph: 'Puede cambiar su preferencia desde la configuración más adelante.'
		}
	},
	History: {
		GenerationsTitle: 'Generaciones',
		GenerationsMaxSavedCountWarning: 'Últimas {count:number} solamente',
		NoGenerationsYet: 'No has generado ninguna imagen todavía.'
	},
	Live: {
		GenerationsTitle: 'Generaciones',
		TotalDurationTitle: 'Duración Total',
		UpscalesTitle: 'Mejoras',
		GenerationTooltip: {
			CountryTitle: 'País',
			Type: {
				Title: 'Tipo',
				Generation: 'Generación',
				Upscale: 'Mejora'
			},
			DimensionsTitle: 'Dimensiones',
			StepsTitle: 'Pasos',
			ScaleTitle: 'Escala',
			DurationTitle: 'Duración',
			Status: {
				Title: 'Estado',
				Started: 'Iniciado',
				Succeeded: 'Exitoso',
				Failed: 'Fallido'
			},
			Server: {
				Title: 'Servidor',
				Default: 'Predeterminado',
				Custom: 'Personalizado'
			},
			UnknownTitle: 'Desconocido'
		},
		WaitingTitle: 'Esperando las generaciones',
		DurationStatusUnknown: 'Desconocido'
	},
	Navbar: {
		HomeTab: 'Inicio',
		HistoryTab: 'Historial',
		GalleryTab: 'Galería',
		LiveTab: 'En vivo'
	},
	Settings: {
		Title: 'Configuración',
		SwitchServerButton: 'Cambiar de Servidor',
		SubmitToGalleryToggle: 'Enviar a la Galería',
		AdvancedModeToggle: 'Modo Avanzado',
		AdvancedOptionsDropdown: 'Opciones Avanzadas',
		AdvancedDropdown: 'Avanzado',
		GenerationSettingsButton: 'Configuración de Generación',
		GenerationSettingsTitle: 'Configuración de Generación',
		DarkModeToggle: 'Modo Oscuro'
	},
	GenerationFullscreen: {
		DownloadButton: 'Descargar',
		DoneButtonState: '¡Hecho!',
		CopyPromptButton: 'Copiar Indicación',
		CopyNegativePromptButton: 'Copiar Indicación Negativa',
		CopiedButtonState: '¡Copiado!',
		RerollButton: 'Generar Aleatorio',
		RegenerateButton: 'Regenerar',
		GenerateButton: 'Generar',
		UpscaleButton: 'Mejorar',
		UpscaleTabBar: {
			UpscaledTitle: 'Mejorada',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Dimensiones'
		},
		Duration: {
			Title: 'Duración'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Establecer Servidor',
		SwitchServerTitle: 'Cambiar de Servidor',
		Paragraph: 'El servidor se utilizará para generar imágenes.',
		SetButton: 'Establecer',
		DefaultButton: 'Predeterminado'
	},
	Blog: {
		Title: 'Entradas del Blog',
		TitleAlt: 'Blog',
		BackToBlogButton: 'Volver al Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Redirigiendo a {name:string}'
	},
	Shared: {
		StartGeneratingTitle: '¡Comienza a generar hermosas imágenes!',
		StartGeneratingButton: 'Comenzar a Generar',
		JoinUsTitle: 'Únete a Nosotros',
		GoHomeButton: 'Ir a Inicio',
		SwitchToDefaultServerButton: 'Cambiar al Servidor Predeterminado',
		ShareButton: 'Compartir',
		ShareOnButton: 'Compartir en {name:string}',
		YesButton: 'Sí',
		NoButton: 'No',
		EnableButton: 'Habilitar',
		DisableButton: 'Deshabilitar',
		AddButton: 'Añadir',
		CopyLinkButton: 'Copiar Enlace',
		CopyButton: 'Copiar',
		DeleteButton: 'Eliminar',
		ServerUrlInput: {
			Placeholder: 'URL del Servidor'
		},
		LoadingTitle: 'Cargando',
		LoadingParagraph: 'Cargando...',
		LoginButton: 'Iniciar Sesión',
		LogoutButton: 'Cerrar Sesión',
		EmailInput: {
			Placeholder: 'Correo electrónico'
		},
		PasswordInput: {
			Placeholder: 'Contraseña'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: 'General'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: 'Arte Digital 3D'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: 'Cómic 3D'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Anime'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Película Animada'
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
		UnknownTitle: 'Desconocido',
		MoreOptionsTitle: 'Más Opciones',
		LessOptionsTitle: 'Menos Opciones',
		TryAgainButton: 'Try Again'
	},
	Error: {
		SomethingWentWrong: 'Algo salió mal :(',
		NSFW: 'Contenido inapropiado detectado, intente con otra indicación :(',
		ServerSeemsOffline:
			'El servidor parece estar fuera de línea. Puede que desee refrescar la página o establecer otro servidor desde la configuración.',
		ServerSetNotWorking: 'Este servidor no es compatible o no responde.',
		NotFound: 'No Encontrado',
		SupabaseNotFoundCantListen:
			'Instancia de Supabase no encontrada. Las generaciones no serán rastreadas.',
		InvalidEmail: 'Enter a valid email.',
		PasswordTooShort: 'Password must be at least 8 characters.',
		SomethingWentWrongTryAgain: 'Something went wrong, try again.'
	},
	Admin: {
		AdminPanelTitle: 'Administrador',
		DeleteButton: 'Eliminar',
		ApproveButton: 'Aprobar',
		NoGenerationsToReview: 'No hay generaciones para revisar.',
		ServersButton: 'Servidores',
		GalleryButton: 'Galería'
	},
	SignUp: {
		PageTitle: 'Sign Up',
		PageParagraph: 'Sign up to become a pro member. Unlock the full potential of Stablecog.',
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
	Login: {
		PageTitle: 'Login',
		PageParagraph: 'Start using Stablecog with all features that are available to your account.',
		DontHaveAnAccountTitle: "Don't have an account?",
		SignUpInsteadButton: 'Sign up instead'
	},
	Pro: {
		PageTitle: 'Become a Pro',
		PageParagraph:
			"Unlock all features of Stablecog and support the project. Without the pro members, Stablecog wouldn't be able to stay completely open-source and offer free generations to everyone.",
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Full speed without set limits',
			ImageDimensions: 'Different image dimensions',
			Upscale: 'Upscale images',
			Steps: 'Different inference steps',
			MoreModels: 'More models',
			MoreSchedulers: 'More schedulers',
			SavedToCloud: 'Generations saved to the cloud',
			Upcoming: 'All upcoming features',
			CommercialUse: 'Commercial Use'
		},
		Soon: '(soon)',
		Month: '/month',
		BecomeProButton: 'Become a Pro',
		Success: {
			PageTitle: 'Thanks for becoming a pro!',
			PageParagraph:
				'You now have access to everything Stablecog has to offer. If you have any questions, reach out to us on {platform:string}.'
		},
		Cancel: {
			PageTitle: "You've cancelled",
			PageParagraph:
				"You've cancelled the subscription process. If it was a mistake, you can try again."
		}
	},
	Account: {
		PageTitle: 'Account',
		ManageSubscriptionButton: 'Manage Subscription',
		ManageAccountButton: 'Manage Account',
		MyAccountButton: 'My Account',
		SubscriptionPlanTitle: 'Plan'
	}
};
export default es;
