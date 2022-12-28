import type { Translation } from '../i18n-types';

const ptPt: Translation = {
	Language: 'Idioma',
	Home: {
		GenerateButton: 'Gerar',
		PromptInput: {
			Placeholder: 'Retrato de um gato por Van Gogh'
		},
		WidthTabBar: {
			Title: 'Largura',
			Paragraph: 'Largura da imagem.'
		},
		HeightTabBar: {
			Title: 'Altura',
			Paragraph: 'Altura da imagem.'
		},
		InferenceStepsTabBar: {
			Title: 'Etapas de Inferência',
			Paragraph: 'Quantas etapas serão necessárias para gerar (definição) a imagem.'
		},
		GuidanceScaleSlider: {
			Title: 'Escala de orientação',
			Paragraph:
				'Como a imagem será semelhante à sua prompt "texto". Valores maiores tornam a imagem mais próxima de seu prompt.'
		},
		NegativePromptInput: {
			Title: 'Prompt negativa',
			Placeholder: 'Prompt negativa',
			Paragraph: 'Para remover coisas indesejadas da imagem. Ele faz o oposto do prompt faz.'
		},
		SeedInput: {
			Title: 'Seed',
			Placeholder: 'Número da Seed',
			Paragraph:
				'Obtenha resultados repetidos. Uma seed combinada com o mesmo prompt e opções gera a mesma imagem.'
		},
		ModelDropdown: {
			Title: 'Modelo',
			Paragraph: 'O AI Model que será utilizado para gerar a imagem.'
		},
		SchedulerDropdown: {
			Title: 'Programação',
			Paragraph:
				'Define a qualidade imagem de uma certa maneira. Ela pode alterar drasticamente a imagem gerada. Alguns requerem menos etapas para produzir bons resultados.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Submeter gerações para a galeria?',
			Paragraph: 'Você pode alterar sua preferência nas configurações mais tarde.'
		}
	},
	History: {
		GenerationsTitle: 'Gerações',
		GenerationsMaxSavedCountWarning: 'Últimas {count} apenas',
		NoGenerationsYet: 'Você ainda não gerou nenhuma imagem.'
	},
	Live: {
		GenerationsTitle: 'Gerações',
		TotalDurationTitle: 'Duração total',
		UpscalesTitle: 'Interpolação',
		GenerationTooltip: {
			CountryTitle: 'País',
			Type: {
				Title: 'Tipo',
				Generation: 'Gerações',
				Upscale: 'Interpolação'
			},
			DimensionsTitle: 'Dimensões',
			StepsTitle: 'Passos',
			ScaleTitle: 'Escala',
			DurationTitle: 'Duração',
			Status: {
				Title: 'Estado',
				Started: 'Iniciado',
				Succeeded: 'Com sucesso',
				Failed: 'Falhou'
			},
			Server: {
				Title: 'Servidor',
				Default: 'Predefinição',
				Custom: 'Personalizado'
			},
			UnknownTitle: 'Desconhecido'
		},
		WaitingTitle: 'Esperando por gerações',
		DurationStatusUnknown: 'Desconhecido'
	},
	Navbar: {
		HomeTab: 'Início',
		HistoryTab: 'História',
		GalleryTab: 'Galeria',
		LiveTab: 'Em Direto'
	},
	Settings: {
		Title: 'Configurações',
		SwitchServerButton: 'Mudar de servidor',
		SubmitToGalleryToggle: 'Enviar para Galeria',
		AdvancedModeToggle: 'Modo Avançado',
		AdvancedOptionsDropdown: 'Opções Avançadas',
		AdvancedDropdown: 'Avançado',
		GenerationSettingsButton: 'Configurações de Geração',
		GenerationSettingsTitle: 'Configurações de Geração',
		DarkModeToggle: 'Modo Escuro'
	},
	GenerationFullscreen: {
		DownloadButton: 'Descarregar',
		DoneButtonState: 'Concluído!',
		CopyPromptButton: 'Copiar Prompt',
		CopyNegativePromptButton: 'Copiar Prompt Negativa',
		CopiedButtonState: 'Copiado!',
		RerollButton: 'Reroll',
		RegenerateButton: 'Regenerar',
		GenerateButton: 'Gerar',
		UpscaleButton: 'Interpolação',
		UpscaleTabBar: {
			UpscaledTitle: 'Interpolado',
			OriginalTitle: 'Original'
		},
		Dimensions: {
			Title: 'Dimensões'
		},
		Duration: {
			Title: 'Duração'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Configurar Servidor',
		SwitchServerTitle: 'Mudar de Servidor',
		Paragraph: 'O servidor será usado para gerar imagens.',
		SetButton: 'Definir',
		DefaultButton: 'Predefinição'
	},
	Blog: {
		Title: "Publicações do 'Blog'",
		TitleAlt: 'Blog',
		BackToBlogButton: 'Voltar para o blog'
	},
	Redirect: {
		RedirectingToTitle: 'Redirecionando para {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Comece a gerar belas imagens!',
		StartGeneratingButton: 'Iniciar Geração',
		JoinUsTitle: 'Junte-se a nós',
		GoHomeButton: 'Voltar para Início',
		SwitchToDefaultServerButton: 'Mudar para servidor padrão',
		JoinUsOnTitle: 'Join us on {name}',
		ShareButton: 'Compartilhar',
		ShareOnButton: 'Compartilhar em {name}',
		YesButton: 'Sim',
		NoButton: 'Não',
		EnableButton: 'Ativar',
		DisableButton: 'Desativar',
		AddButton: 'Adicionar',
		CopyLinkButton: 'Copiar Ligação',
		CopyButton: 'Copiar',
		DeleteButton: 'Eliminar',
		LoadingTitle: 'A Carregar',
		LoadingParagraph: 'A Carregar...',
		ServerUrlInput: {
			Placeholder: 'URL do Servidor'
		},
		EmailInput: {
			Placeholder: 'E-mail'
		},
		PasswordInput: {
			Placeholder: 'Palavra-chave'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: 'Geral'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: 'Arte Digital 3D'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: 'Comic 3D'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Anime'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Filme Animado'
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
		UnknownTitle: 'Desconhecido',
		MoreOptionsTitle: 'Mais Opções',
		LessOptionsTitle: 'Menos Opções',
		TryAgainButton: 'Try Again'
	},
	Error: {
		SomethingWentWrong: 'Ocorreu algo de errado :(',
		NSFW: 'Conteúdo NSFW detectado, tente outro prompt :(',
		ServerSeemsOffline:
			'O servidor parece estar offline. Talvez você queira atualizar a página ou definir outro servidor a partir das configurações.',
		ServerSetNotWorking: 'Este servidor não é compatível ou não está respondendo.',
		NotFound: 'Não Encontrado',
		SupabaseNotFoundCantListen:
			'Instância de Supabase não encontrada. Não é possível registar gerações.',
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
export default ptPt;
