import type { Translation } from '../i18n-types';

const ptBr: Translation = {
	Language: 'Idioma',
	Home: {
		GenerateButton: 'Gerar',
		PromptInput: {
			Placeholder: 'Retrato de um gato por Van Gogh'
		},
		WidthTabBar: {
			Title: 'Largura',
			Paragraph: 'A largura da imagem.'
		},
		HeightTabBar: {
			Title: 'Altura',
			Paragraph: 'A altura da imagem.'
		},
		InferenceStepsTabBar: {
			Title: 'Etapas de Inferência',
			Paragraph: 'Quantas etapas serão tomadas para gerar (difundir) a imagem.'
		},
		GuidanceScaleSlider: {
			Title: 'Escala de Orientação',
			Paragraph:
				'O quão semelhante a imagem será do seu prompt.\nValores maiores tornam a imagem mais próxima do seu prompt.'
		},
		NegativePromptInput: {
			Title: 'Prompt Negativo',
			Placeholder: 'Prompt Negativo',
			Paragraph: 'Remove coisas indesejadas da imagem. Faz o oposto do que o prompt faz.'
		},
		SeedInput: {
			Title: 'Semente',
			Placeholder: 'Número de semente',
			Paragraph:
				'Isto gera resultados repetidos. Uma semente combinada com o mesmo prompt e opções gera a mesma imagem.'
		},
		ModelDropdown: {
			Title: 'Modelo',
			Paragraph: 'O modelo da IA que será utilizado para gerar a imagem.'
		},
		SchedulerDropdown: {
			Title: 'Agendador',
			Paragraph:
				'Difunde a imagem de uma certa maneira. Pode alterar drasticamente a imagem gerada. Alguns requerem menos etapas para produzir bons resultados.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Submeter as gerações para a galeria?',
			Paragraph: 'Você pode alterar a sua preferência nas configurações quando quiser.'
		}
	},
	History: {
		GenerationsTitle: 'Gerações',
		GenerationsMaxSavedCountWarning: 'Somente os {count} últimos',
		NoGenerationsYet: 'Você ainda não gerou nenhuma imagem.'
	},
	Live: {
		GenerationsTitle: 'Gerações',
		TotalDurationTitle: 'Duração Total',
		UpscalesTitle: 'Melhorias',
		GenerationTooltip: {
			CountryTitle: 'País',
			Type: {
				Title: 'Tipo',
				Generation: 'Gerações',
				Upscale: 'Melhorias'
			},
			DimensionsTitle: 'Dimensões',
			StepsTitle: 'Etapas',
			ScaleTitle: 'Escala',
			DurationTitle: 'Duração',
			Status: {
				Title: 'Status',
				Started: 'Iniciado',
				Succeeded: 'Bem-sucedido',
				Failed: 'Falhado'
			},
			Server: {
				Title: 'Servidor',
				Default: 'Padrão',
				Custom: 'Personalizado'
			},
			UnknownTitle: 'Desconhecido'
		},
		WaitingTitle: 'Aguardando por gerações',
		DurationStatusUnknown: 'Desconhecido'
	},
	Navbar: {
		HomeTab: 'Início',
		HistoryTab: 'Histórico',
		GalleryTab: 'Galeria',
		LiveTab: 'Ao vivo'
	},
	Settings: {
		Title: 'Configurações',
		SwitchServerButton: 'Alternar Servidor',
		SubmitToGalleryToggle: 'Submeter à Galeria',
		AdvancedModeToggle: 'Modo Avançado',
		AdvancedOptionsDropdown: 'Opções Avançadas',
		AdvancedDropdown: 'Avançado',
		GenerationSettingsButton: 'Configurações de Geração',
		GenerationSettingsTitle: 'Configurações de Geração',
		DarkModeToggle: 'Modo Escuro'
	},
	GenerationFullscreen: {
		DownloadButton: 'Baixar',
		DoneButtonState: 'Pronto!',
		CopyPromptButton: 'Copiar Prompt',
		CopyNegativePromptButton: 'Copiar Prompt Negativo',
		CopiedButtonState: 'Copiado!',
		RerollButton: 'Rolar de novo',
		RegenerateButton: 'Regenerar',
		GenerateButton: 'Gerar',
		UpscaleButton: 'Melhoria',
		UpscaleTabBar: {
			UpscaledTitle: 'Melhorado',
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
		SetServerTitle: 'Definir Servidor',
		SwitchServerTitle: 'Alternar Servidor',
		Paragraph: 'O servidor será utilizado para geração de imagens.',
		SetButton: 'Definir',
		DefaultButton: 'Padrão'
	},
	Blog: {
		Title: 'Postagens do Blog',
		TitleAlt: 'Blog',
		BackToBlogButton: 'Voltar ao Blog'
	},
	Redirect: {
		RedirectingToTitle: 'Redirecionando para {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Começar a gerar lindas imagens!',
		StartGeneratingButton: 'Começar a Gerar',
		JoinUsTitle: 'Junte-se a Nós',
		GoHomeButton: 'Ir para a Página Inicial',
		SwitchToDefaultServerButton: 'Alternar para o Servidor Padrão',
		JoinUsOnTitle: 'Junte-se a nós no {name}',
		ShareButton: 'Compartilhar',
		ShareOnButton: 'Compartilhe no {name}',
		YesButton: 'Sim',
		NoButton: 'Não',
		EnableButton: 'Ativar',
		DisableButton: 'Desativar',
		AddButton: 'Adicionar',
		CopyLinkButton: 'Copiar Link',
		CopyButton: 'Copiar',
		DeleteButton: 'Deletar',
		LoadingTitle: 'Carregando',
		LoadingParagraph: 'Carregando...',
		ServerUrlInput: {
			Placeholder: 'URL do Servidor'
		},
		EmailInput: {
			Placeholder: 'E-mail'
		},
		PasswordInput: {
			Placeholder: 'Senha'
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
				simpleName: 'Quadrinhos 3D'
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
				simpleName: 'Renderização 3D'
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
		TryAgainButton: 'Tente Novamente'
	},
	Error: {
		SomethingWentWrong: 'Algo deu errado :(',
		NSFW: 'Conteúdo impróprio detectado, tente outro prompt :(',
		ServerSeemsOffline:
			'O servidor parece estar offline. Talvez você queira atualizar a página ou definir outro servidor nas configurações.',
		ServerSetNotWorking: 'Este servidor não é compatível ou não responde.',
		NotFound: 'Não encontrado',
		SupabaseNotFoundCantListen:
			'Instância de Supabase não encontrado. Não posso escutar para gerações.',
		InvalidEmail: 'Digite um e-mail válido.',
		PasswordTooShort: 'A senha deve conter pelo menos 8 caracteres.',
		SomethingWentWrongTryAgain: 'Algo deu errado, tente novamente.',
		InvalidCredentials: 'Credenciais inválidas.',
		InvalidCode: 'Código inválido.'
	},
	Admin: {
		AdminPanelTitle: 'Administrador',
		DeleteButton: 'Deletar',
		ApproveButton: 'Aprovar',
		NoGenerationsToReview: 'Sem gerações para revisar.',
		ServersButton: 'Servidores',
		AdminGalleryButton: 'Galeria',
		UsersButton: 'Usuários',
		AdminTab: 'Administrador',
		ServersTab: 'Servidores',
		AdminGalleryTab: 'Galeria',
		UsersTab: 'Usuários',
		Gallery: {
			TotalTitle: 'Total',
			ApprovedTitle: 'Aprovadas',
			DeletedTitle: 'Deletadas'
		}
	},
	SignUp: {
		PageTitle: 'Cadastre-se',
		PageParagraph:
			'Junte-se ao Stablecog para se tornar um membro pro e desbloquear todo seu potencial.',
		PageTitleConfirm: 'Confirmar',
		PageTitleConfirmAlt: 'Verifique Seu E-mail',
		PageParagraphConfirm:
			'Nós lhe enviamos um código com 6 dígitos. Insira-o abaixo para confirmar a sua conta.',
		SignUpButton: 'Cadastre-se',
		ConfirmButton: 'Confirmar',
		AlreadyHaveAnAccountTitle: 'Já possui uma conta?',
		LoginInsteadButton: 'Efetuar Login',
		SixDigitCodeInput: {
			Placeholder: 'Código de 6 dígitos'
		}
	},
	SignIn: {
		PageTitle: 'Iniciar Sessão',
		PageParagraph: 'Comece a usar o Stablecog com todos os recursos disponíveis para a sua conta.',
		DontHaveAnAccountTitle: 'Não possui uma conta?',
		SignUpInsteadButton: 'Cadastre-se',
		SignInButton: 'Iniciar sessão',
		SignOutButton: 'Encerrar Sessão'
	},
	Pro: {
		PageTitle: 'Torne-se um Pro',
		PageParagraph:
			'Desbloqueie todos os recursos do Stablecog e apoie o projeto. Sem os membros pro, o Stablecog não seria capaz de ficar completamente fonte aberta (open-source) e oferecer gerações gratuitas a todos.',
		PageTitleAlreadyPro: 'Já é um Pro!',
		PageParagraphAlreadyPro:
			'Você já é um membro pro. Obrigado por apoiar o projeto! Vá em frente e aproveite o Stablecog, e considere compartilhá-lo com seus amigos.',
		ProPlanTitle: 'Pro',
		Features: {
			FullSpeed: 'Velocidade total sem limites definidos',
			ImageDimensions: 'Dimensões de imagem diferentes',
			Upscale: 'Melhoria de imagens',
			Steps: 'Etapas de inferência diferentes',
			MoreModels: 'Mais modelos',
			MoreSchedulers: 'Mais agendadores',
			SavedToCloud: 'Gerações salvas na nuvem',
			Upcoming: 'Recursos próximos',
			CommercialUse: 'Uso Comercial'
		},
		Soon: '(em breve)',
		Month: '/mês',
		BecomeProButton: 'Torne-se um Pro',
		Success: {
			PageTitle: 'Você é um Pro!',
			PageParagraph:
				'Agora você tem acesso a tudo que o Stablecog tem para oferecer. Em caso de dúvidas, entre em contato conosco no {platform}.'
		},
		Cancel: {
			PageTitle: 'Você cancelou',
			PageParagraph:
				'Você cancelou o processo de assinatura. Se foi um erro, pode tentar novamente.'
		},
		Reason: {
			ParagraphWidth: 'Essa largura da imagem não está disponível no plano gratuito.',
			ParagraphHeight: 'Essa altura da imagem não está disponível no plano gratuito.',
			ParagraphDimensions: 'Essas dimensões da imagem não estão disponíveis no plano gratuito.',
			ParagraphUpscale: 'Recurso de melhoria não está disponível no plano gratuito.',
			ParagraphInferenceSteps:
				'Essa configuração de etapas de inferência não está disponível no plano gratuito.',
			ParagraphModel: 'Esse modelo de IA não está disponível no plano gratuito.',
			ParagraphScheduler: 'Esse agendador não está disponível no plano gratuito.',
			ParagraphWidthGeneration:
				'Essa geração foi criada usando uma largura de imagem que não está disponível no plano gratuito.',
			ParagraphHeightGeneration:
				'Essa geração foi criada usando uma altura de imagem que não está disponível no plano gratuito.',
			ParagraphDimensionsGeneration:
				'Essa geração foi criada usando dimensões de imagem que não estão disponíveis no plano gratuito.',
			ParagraphInferenceStepsGeneration:
				'Essa geração foi criada usando uma configuração de etapas de inferência que não está disponível no plano gratuito.',
			ParagraphModelGeneration:
				'Essa geração foi criada usando um modelo de IA que não está disponível no plano gratuito.',
			ParagraphSchedulerGeneration:
				'Essa geração foi criada usando um agendador que não está disponível no plano gratuito.'
		},
		Tier: {
			Title: {
				Free: 'Gratuito',
				Pro: 'Pro'
			},
			Badge: {
				Free: 'GRATUITO',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'Conta',
		ManageSubscriptionButton: 'Gerenciar assinatura',
		ManageAccountButton: 'Gerenciar Conta',
		MyAccountButton: 'Minha conta',
		SubscriptionPlanTitle: 'Plano'
	},
	ForgotPassword: {
		PageTitle: 'Redefinir Senha',
		PageParagraph:
			'Enviaremos um código de 6 dígitos para o seu e-mail para redefinir a sua senha.',
		SendResetCodeButton: 'Enviar código',
		PageTitleConfirmCode: 'Confirmar',
		PageTitleConfirmCodeAlt: 'Verifique Seu E-mail',
		PageParagraphConfirmCode:
			'Nós lhe enviamos um código com 6 dígitos. Insira-o abaixo para continuar.',
		ConfirmCodeButton: 'Confirmar',
		PageTitleNewPassword: 'Nova Senha',
		PageParagraphNewPassword: 'Digite uma nova senha para a sua conta.',
		NewPasswordInput: {
			Placeholder: 'Nova Senha'
		},
		SetNewPasswordButton: 'Definir Nova Senha',
		PageTitleSuccess: 'Pronto!',
		PageParagraphSuccess: 'A sua senha foi redefinida com sucesso.',
		ForgotPasswordButton: 'Esqueceu a Senha?'
	},
	FeaturedOn: {
		PageTitle: 'Estamos em destaque em'
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
export default ptBr;
