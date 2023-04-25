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
		AspectRatioDropdown: {
			Title: 'Aspect Ratio',
			Paragraph: 'Aspect ratio of the image.',
			Options: {
				Square: 'Square (1:1)',
				Portrait: 'Portrait (2:3)',
				Landscape: 'Landscape (3:2)',
				Mobile: 'Mobile (9:16)',
				Desktop: 'Desktop (16:9)',
				Squarish: 'Squarish (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: 'Aspect Ratio',
			Paragraph: 'Aspect ratio of the image.'
		},
		InitialImageTabBar: {
			Title: 'Initial Image',
			Paragraph: 'The generation will be created based on this image.'
		},
		InitialImageStrengthTabBar: {
			TitleAlt: 'Image Strength',
			Title: 'Initial Image Strength',
			Paragraph:
				'Controls the influence of the initial image. The bigger the value, the more influence the initial image has.'
		},
		NegativePromptInput: {
			Title: 'Prompt Negativo',
			Placeholder: 'Prompt Negativo',
			PlaceholderAlt: 'Enter things to avoid',
			Paragraph: 'Remove coisas indesejadas da imagem. Faz o oposto do que o prompt faz.'
		},
		ImageInput: { Paragraph: 'Click or drop your image here', Title: 'Upload Image' },
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
		NumOutputsSlider: {
			Title: 'Number of Images',
			Paragraph: 'The number of images that will be generated.'
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
		DownloadLegacyGenerationsButton: 'Download Legacy Generations',
		NoFavoritesYet: "You don't have any favorites yet.",
		Views: {
			AllTitle: 'All',
			FavoritesTitle: 'Favorites'
		},
		NoGenerationsYet: 'Você ainda não gerou nenhuma imagem.'
	},
	Live: {
		GenerationsTitle: 'Gerações',
		TotalDurationTitle: 'Duração Total',
		UpscalesTitle: 'Melhorias',
		GenerationTooltip: {
			AspectRatioTitle: 'Aspect Ratio',
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
			UnknownTitle: 'Desconhecido',
			OutputsTitle: 'Outputs'
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
		GenerateSimilarButton: 'Generate Similar',
		RerollButton: 'Rolar de novo',
		RegenerateButton: 'Regenerar',
		GenerateButton: 'Gerar',
		UpscaleButton: 'Melhoria',
		SubmitToGalleryButton: 'Submit to Gallery',
		SubmittedTitle: 'Submitted',
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
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Junte-se a nós no {name}',
		ShareButton: 'Compartilhar',
		ShareOnButton: 'Compartilhe no {name}',
		GoBackButton: 'Go Back',
		YesButton: 'Sim',
		NoButton: 'Não',
		EnableButton: 'Ativar',
		ClearAllButton: 'Clear All',
		DisableButton: 'Desativar',
		AddButton: 'Adicionar',
		CopyLinkButton: 'Copiar Link',
		CopyButton: 'Copiar',
		DeleteButton: 'Deletar',
		LoadingTitle: 'Carregando',
		ContinueButton: 'Continue',
		LoadingParagraph: 'Carregando...',
		InsufficientCreditsTitle: 'Insufficient credits ({remainingCredits}/{neededCredits})',
		AllTitle: 'All',
		ConfirmButton: 'Confirm',
		ConfirmQuestionMarkButton: 'Confirm?',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'Credit Type',
				RemainingCreditsTitle: 'Remaining',
				ExpiryTitle: 'Expiry',
				LastReplenish: 'Last Replenish'
			}
		},
		BatchEditBar: {
			PauseEditingButton: 'Pause Editing',
			DeselectButton: 'Deselect ({selectedCount})',
			DeleteButton: 'Delete ({selectedCount})',
			FavoriteButton: 'Favorite ({selectedCount})',
			ApproveButton: 'Approve ({selectedCount})',
			RejectButton: 'Reject ({selectedCount})',
			UnfavoriteButton: 'Unfavorite ({selectedCount})',
			ConfirmationModal: {
				CancelButton: 'Cancel',
				Deselect: {
					Title: 'Deselect {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to deselect {selectedCount} item(s)?',
					ConfirmButton: 'Deselect'
				},
				Delete: {
					Title: 'Delete {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to delete {selectedCount} item(s)?',
					ConfirmButton: 'Delete'
				},
				Favorite: {
					Title: 'Favorite {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to favorite {selectedCount} item(s)?',
					ConfirmButton: 'Favorite'
				},
				Unfavorite: {
					Title: 'Unfavorite {selectedCount} item(s)?',
					Paragraph: 'Are you sure you want to unfavorite {selectedCount} item(s)?',
					ConfirmButton: 'Unfavorite'
				}
			}
		},
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
				realName: 'DPM Multistep'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			},
			'82cf78dd-6afb-48cc-aca6-14224cca6950': {
				realName: 'DDIM'
			},
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'P Sampler'
			}
		},
		UnknownTitle: 'Desconhecido',
		AdvancedSettingsButton: 'Advanced Settings',
		MoreOptionsTitle: 'Mais Opções',
		LessOptionsTitle: 'Menos Opções',
		TryAgainButton: 'Tente Novamente',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: 'Algo deu errado :(',
		ImageWasNSFW: 'This image was NSFW :(',
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
		InvalidCode: 'Código inválido.',
		TryAnotherImage: 'Try another image :(',
		OnceEvery60Seconds: 'You can only request a link once every 60 seconds.',
		LinkExpired: {
			Title: 'Link Expired',
			Paragraph: 'The link can only be used once and expires after 24 hours.'
		},
		UpdateAvailable: {
			Title: 'Update Available',
			Paragraph: 'There is an update! Refresh the page to get it.'
		},
		EmailProviderNotAllowed: "This email provider isn't allowed.",
		EmailAlreadyInUse: 'This email is already in use.'
	},
	Admin: {
		AdminPanelTitle: 'Administrador',
		DeleteButton: 'Deletar',
		ApproveButton: 'Aprovar',
		RejectButton: 'Reject',
		EditButton: 'Edit',
		EditViewButton: 'Edit View',
		NormalViewButton: 'Normal View',
		StopEditButton: 'Stop Editing',
		NoGenerationsToReview: 'Sem gerações para revisar.',
		ServersButton: 'Servidores',
		AdminGalleryButton: 'Galeria',
		UsersButton: 'Usuários',
		AdminTab: 'Administrador',
		ServersTab: 'Servidores',
		AdminGalleryTab: 'Galeria',
		UsersTab: 'Usuários',
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
			GiftCreditsButton: 'Gift Credits'
		},
		Gallery: {
			TotalTitle: 'Total',
			ApprovedTitle: 'Aprovadas',
			DeletedTitle: 'Deletadas',
			StatusDropdown: {
				All: 'All',
				ManuallySubmitted: 'Manually Submitted',
				Submitted: 'Submitted',
				Approved: 'Approved',
				Rejected: 'Rejected',
				Deleted: 'Deleted',
				Private: 'Private'
			},
			NoGenerationsToReview: 'No generations to review'
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
		AllTitle: 'All',
		ConfirmButton: 'Confirmar',
		AlreadyHaveAnAccountTitle: 'Já possui uma conta?',
		LoginInsteadButton: 'Efetuar Login',
		SixDigitCodeInput: {
			Placeholder: 'Código de 6 dígitos'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Get Started',
		GetStartedButton: 'Get Started',
		PageTitle: 'Iniciar Sessão',
		PageParagraph: 'Comece a usar o Stablecog com todos os recursos disponíveis para a sua conta.',
		PageParagraphV2: 'Start creating amazing art in seconds for free, no credit card required.',
		PageTitleCreateAccountOrSignIn: 'Create an account or sign in',
		PageParagraphCreateAccountOrSignIn:
			'Start using Stablecog with all features that are available to your account.',
		PageTitleSentLink: 'Check your email',
		PageParagraphSentLink:
			"We've emailed you a sign-in link. If you don't see it, check your spam folder.",
		ContinueButton: 'Continue',
		ContinueWithProviderButton: 'Continue with {provider}',
		SignInWithProviderButton: 'Sign in with {provider}',
		OrContinueWithEmailTitle: 'Or continue with email',
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
		ComparePlansButton: 'Compare Plans',
		ManageAccountButton: 'Gerenciar Conta',
		MyAccountButton: 'Minha conta',
		SubscriptionPlanTitle: 'Plano',
		RemainingImagesTitle: 'Remaining Images',
		RemainingCreditsTitle: 'Remaining Credits',
		RemainingTitle: 'Remaining',
		Subscription: {
			UpdateSubscriptionTitle: 'Update Subscription',
			ChangePlanTitle: 'Change Plan',
			CurrentPlanTitle: 'Current Plan',
			NewPlanTitle: 'New plan',
			Downgrade: {
				DowngradingToTitle: 'Downgrading to',
				Explanation: 'Your existing credits will remain.'
			},
			Upgrade: {
				UpgadingToTitle: 'Upgrading to',
				Explanation: 'Your existing credits will remain.'
			},
			Failed: {
				PageTitle: 'Failed to update',
				PageParagraph: 'Something went wrong while changing your plan. Please try again.'
			},
			Succeeded: {
				PageTitle: 'Changed plan',
				PageParagraph: 'Your plan has been changed successfully.'
			}
		},
		Meta: {
			AccountCreationTitle: 'Creation',
			LastSignInTitle: 'Last Sign-in',
			LastSeenTitle: 'Last Seen'
		},
		ChangeEmail: {
			PageTitle: 'Change Email',
			PageParagraph: 'Enter a new email address for your account.',
			ChangeEmailButton: 'Change Email',
			NewEmailInput: {
				Placeholder: 'New Email'
			},
			PageTitleSentLink: 'Check your email',
			PageParagraphSentLink:
				"We've sent links to both addresses. Confirm both to change your account's email address.",
			PageTitleConfirmOtherEmail: 'Confirm Other Email',
			PageParagraphConfirmOtherEmail:
				"We've also sent a link to your other email address. Confirm that one as well to complete the process."
		}
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
		PageParagraph: 'Check out what others have created with Stablecog.',
		SearchInput: {
			Title: 'Search'
		},
		SearchingTitle: 'Searching',
		NoMatchingGenerationTitle: 'No matching generation'
	},
	Pricing: {
		PlansTitle: 'Plans',
		PlansParagraph: 'Choose a plan that works for you.',
		CreditPacksTitle: 'Credit Packs',
		CreditPacksParagraph: 'Need more? You can purchase additional credits anytime.',
		SubscribeButton: 'Subscribe',
		SubscribedButton: 'Subscribed',
		UpgradeButton: 'Upgrade',
		DowngradeButton: 'Downgrade',
		PurchaseButton: 'Purchase',
		BuyCreditsButton: 'Buy Credits',
		MonthlyTitle: 'Monthly',
		YearlyTitle: 'Yearly',
		SlashMonth: '/month',
		Plans: {
			FreeTitle: 'Free',
			StarterTitle: 'Starter',
			ProTitle: 'Pro',
			UltimateTitle: 'Ultimate'
		},
		CreditPacks: {
			MediumTitle: 'Medium Pack',
			LargeTitle: 'Large Pack',
			MegaTitle: 'Mega Pack'
		},
		Features: {
			MonthlyCredits: '{count} credits per month.',
			MonthlyImages: '{count} images per month.',
			MonthlyGenerations: '{count} generations per month.',
			Images: '{count} images.',
			Generations: '{count} generations.',
			NeverExpires: 'Never expires.',
			CommercialUse: 'Commercial use.',
			ImagesArePublic: 'Images are public.',
			ImagesArePrivate: 'Images are private.'
		},
		Badges: {
			Recommended: 'Recommended',
			MostPopular: 'Most Popular',
			BestValue: 'Best Value'
		},
		Purchase: {
			Succeeded: {
				PageTitle: "You're all set!",
				PageParagraph:
					'Thank you for your purchase. If you have any questions, feel free to reach out to us on {platform}.'
			},
			Cancelled: {
				PageTitle: 'Purchase Cancelled',
				PageParagraph:
					'You have cancelled the purchase process. If it was a mistake, you can try again.'
			}
		}
	},
	LowOnCreditsCard: {
		Title: "You're low on credits ({remainingCredits})",
		FreeParagraph:
			'We give all active users free credits daily. You can get more by subscribing to a plan or by participating in our events.',
		HighestPlanParagraph: 'You can buy a credit pack.',
		OtherPlansParagraph: 'You can upgrade to a higher plan or buy a credit pack.'
	},
	Support: {
		PageTitle: 'Support',
		PageParagraph:
			"If you have any questions, please reach out to us using the links below and we'll answer them as soon as possible."
	},
	Guide: {
		PageTitle: 'Guide',
		GuideButton: 'Guide',
		PreviousTitle: 'Previous',
		NextTitle: 'Next',
		ChaptersTitle: 'Chapters',
		ChapterTitle: 'Chapter'
	},
	Legal: {
		TermsOfServiceTitle: 'Terms of Service',
		PrivacyPolicyTitle: 'Privacy Policy',
		RefundPolicyTitle: 'Refund Policy',
		ContentPolicyTitle: 'Content Policy'
	},
	UnderDevelopment: {
		PageTitle: "We'll be back soon!",
		PageParagraph: "We're upgrading our systems. We'll be back in a couple of hours."
	}
};
export default ptBr;
