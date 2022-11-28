import type { BaseTranslation } from '../i18n-types';

const zhHans: BaseTranslation = {
	Language: '语言',
	Home: {
		GenerateButton: '生成',
		PromptInput: {
			Placeholder: '猫的肖像，梵高的风格'
		},
		WidthTabBar: {
			Title: '宽度',
			Paragraph: '图像的宽度'
		},
		HeightTabBar: {
			Title: '高度',
			Paragraph: '图像的高度'
		},
		InferenceStepsTabBar: {
			Title: '推理步骤',
			Paragraph: '将采取多少步骤(生成) 图像。'
		},
		GuidanceScaleSlider: {
			Title: '指导量表',
			Paragraph: '图像与您的提示有多么相似。值越高，图像就越靠近您的提示。'
		},
		NegativePromptInput: {
			Title: '否定提示',
			Placeholder: '否定提示',
			Paragraph: '从图像中移除不想要的东西。它与提示的作用相反。'
		},
		SeedInput: {
			Title: '种子',
			Placeholder: '种子编号',
			Paragraph: '获得可重复的结果。含有结合相同提示和选项的种子会生成相同的图像。'
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
			Title: '是否要将生成的图像提交到图库？',
			Paragraph: '您可以稍后从设置中更改您的偏好。'
		}
	},
	History: {
		GenerationsTitle: '生成的图像',
		GenerationsMaxSavedCountWarning: '只限于前 {count:number} 个生成的图像',
		NoGenerationsYet: '您还没有生成任何图像。'
	},
	Live: {
		GenerationsTitle: '生成的图像',
		TotalDurationTitle: '总时长',
		UpscalesTitle: '图像被分辨率提高的总次数',
		GenerationTooltip: {
			CountryTitle: '国家/地区',
			Type: {
				Title: '类型',
				Generation: '生成的',
				Upscale: '被提高过分辨率的图像'
			},
			DimensionsTitle: '维度',
			StepsTitle: '步骤',
			ScaleTitle: '被乘以的倍数',
			DurationTitle: '期间',
			Status: {
				Title: '状态',
				Started: '已开始',
				Succeeded: '成功',
				Failed: '失败'
			},
			Server: {
				Title: '服务器',
				Default: '默认设置',
				Custom: '自定'
			},
			UnknownTitle: '未知'
		},
		WaitingTitle: '正在等待被生成的图像',
		DurationStatusUnknown: '未知'
	},
	Navbar: {
		HomeTab: '首页',
		HistoryTab: '历史记录',
		GalleryTab: '图库',
		LiveTab: '实时统计'
	},
	Settings: {
		Title: '设置',
		SwitchServerButton: '切换服务器',
		SubmitToGalleryToggle: '提交到图库',
		AdvancedModeToggle: '进阶模式',
		AdvancedOptionsDropdown: 'Advanced Options',
		AdvancedDropdown: 'Advanced',
		GenerationSettingsButton: 'Generation Settings',
		GenerationSettingsTitle: 'Generation Settings',
		DarkModeToggle: '深色模式'
	},
	GenerationFullscreen: {
		DownloadButton: '下载',
		DoneButtonState: '已完成！',
		CopyPromptButton: '复制提示',
		CopyNegativePromptButton: '复制否定提示',
		CopiedButtonState: '已复制！',
		RerollButton: '随机种子',
		RegenerateButton: '再生成',
		GenerateButton: '生成',
		UpscaleButton: '提高分辨率',
		UpscaleTabBar: {
			UpscaledTitle: '提高分辨率后',
			OriginalTitle: '原始'
		},
		Dimensions: {
			Title: '图像维度'
		},
		Duration: {
			Title: '花费的时间'
		}
	},
	SetServerModal: {
		SetServerTitle: '设定服务器',
		SwitchServerTitle: '切换服务器',
		Paragraph: '用于生成图像的服务器。',
		SetButton: '设定',
		DefaultButton: '默认设置'
	},
	Blog: {
		Title: '博客帖子',
		TitleAlt: '博客',
		BackToBlogButton: '返回博客'
	},
	Redirect: {
		RedirectingToTitle: '重定向到 {name:string}'
	},
	Shared: {
		StartGeneratingTitle: '开始生成美丽的图像！',
		StartGeneratingButton: '开始生成',
		JoinUsTitle: '加入我们',
		GoHomeButton: '返回首页',
		SwitchToDefaultServerButton: '切换至默认服务器',
		ShareButton: '分享',
		ShareOnButton: '在 {name:string} 上分享',
		YesButton: '是',
		NoButton: '否',
		EnableButton: '启用',
		DisableButton: '禁用',
		AddButton: '添加',
		CopyLinkButton: '复制链接',
		CopyButton: '复制',
		DeleteButton: '删除',
		ServerUrlInput: {
			Placeholder: '服务器 URL'
		},
		LoadingTitle: '加载',
		LoadingParagraph: '加载中...',
		LoginButton: '登录',
		LogoutButton: '登出',
		EmailInput: {
			Placeholder: '电邮地址'
		},
		PasswordInput: {
			Placeholder: '密码'
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
		UnknownTitle: 'Unknown',
		MoreOptionsTitle: 'More Options',
		LessOptionsTitle: 'Less Options'
	},
	Error: {
		SomethingWentWrong: '出了问题:(',
		NSFW: '检测到不适宜工作场所的内容，请尝试另一个提示 :(',
		ServerSeemsOffline: '服务器似乎离线。您可能想要刷新页面或从设置中切换另一台服务器。',
		ServerSetNotWorking: '此服务器不兼容或未响应。',
		NotFound: '未找到',
		SupabaseNotFoundCantListen: '未找到Supabase 实例。无法实时显示生成的图像。'
	},
	Admin: {
		AdminPanelTitle: '管理员',
		DeleteButton: '删除',
		ApproveButton: '批准',
		NoGenerationsToReview: '并没有需要审核的生成的图像。',
		ServersButton: '服务器',
		GalleryButton: '图库'
	}
};
export default zhHans;
