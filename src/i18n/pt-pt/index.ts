import type { BaseTranslation } from '../i18n-types';

const ptPt: BaseTranslation = {
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
		GenerationsMaxSavedCountWarning: 'Últimas {count:number} apenas',
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
		RedirectingToTitle: 'Redirecionando para {name:string}'
	},
	Shared: {
		StartGeneratingTitle: 'Comece a gerar belas imagens!',
		StartGeneratingButton: 'Iniciar Geração',
		JoinUsTitle: 'Junte-se a nós',
		GoHomeButton: 'Voltar para Início',
		SwitchToDefaultServerButton: 'Mudar para servidor padrão',
		ShareButton: 'Compartilhar',
		ShareOnButton: 'Compartilhar em {name:string}',
		YesButton: 'Sim',
		NoButton: 'Não',
		EnableButton: 'Ativar',
		DisableButton: 'Desativar',
		AddButton: 'Adicionar',
		CopyLinkButton: 'Copiar Ligação',
		CopyButton: 'Copiar',
		DeleteButton: 'Eliminar',
		ServerUrlInput: {
			Placeholder: 'URL do Servidor'
		},
		LoadingTitle: 'A Carregar',
		LoadingParagraph: 'A Carregar...',
		LoginButton: 'Iniciar Sessão',
		LogoutButton: 'Encerrar Sessão',
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
		LessOptionsTitle: 'Menos Opções'
	},
	Error: {
		SomethingWentWrong: 'Ocorreu algo de errado :(',
		NSFW: 'Conteúdo NSFW detectado, tente outro prompt :(',
		ServerSeemsOffline:
			'O servidor parece estar offline. Talvez você queira atualizar a página ou definir outro servidor a partir das configurações.',
		ServerSetNotWorking: 'Este servidor não é compatível ou não está respondendo.',
		NotFound: 'Não Encontrado',
		SupabaseNotFoundCantListen:
			'Instância de Supabase não encontrada. Não é possível registar gerações.'
	},
	Admin: {
		AdminPanelTitle: 'Admin',
		DeleteButton: 'Eliminar',
		ApproveButton: 'Aprovar',
		NoGenerationsToReview: 'Sem gerações para rever.',
		ServersButton: 'Servidores',
		GalleryButton: 'Galeria'
	}
};
export default ptPt;
