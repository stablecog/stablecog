import type { Translation } from '../i18n-types';

const ko: Translation = {
	Language: '한국어',
	Home: {
		GenerateButton: '생성하기',
		PromptInput: {
			Placeholder: '반 고흐가 그린 고양이 초상화'
		},
		WidthTabBar: {
			Title: '너비',
			Paragraph: '이미지의 너비를 의미합니다.'
		},
		HeightTabBar: {
			Title: '높이',
			Paragraph: '이미지의 높이를 의미합니다.'
		},
		InferenceStepsTabBar: {
			Title: '생성 스텝 수',
			Paragraph: '이미지를 만들기까지 수행할 생성(diffuse) 스텝의 수를 의미합니다.'
		},
		GuidanceScaleSlider: {
			Title: '유사한 정도',
			Paragraph:
				'입력한 문구와 이미지가 유사한 정도를 의미합니다. 값이 높을 수록 이미지가 입력 문구와 비슷해집니다.'
		},
		NegativePromptInput: {
			Title: '포함하지 않을 문구',
			Placeholder: '포함하지 않을 문구',
			Paragraph:
				'원하지 않는 결과를 없애기 위한 문구입니다. 원하는 문구를 입력하는 것과 반대되는 역할을 합니다.'
		},
		SeedInput: {
			Title: '난수 시드',
			Placeholder: '난수 시드 값',
			Paragraph:
				'난수 시드 값을 바꾸면, 동일한 문구와 동일한 옵션에서 다른 이미지를 생성할 수 있습니다.'
		},
		ModelDropdown: {
			Title: 'AI 모델',
			Paragraph: '이미지를 생성하기 위한 AI 모델을 의미합니다.'
		},
		SchedulerDropdown: {
			Title: '스케쥴러',
			Paragraph:
				'이미지에 노이즈를 넣거나 샘플을 업데이트 하는 방법을 의미합니다. 스케쥴러의 변화는 생성된 이미지의 큰 변화로 이어집니다. 스케쥴러에 따라 더 적은 생성 스텝을 써야 좋은 이미지를 생성할 수 있습니다.'
		},
		SubmitToGalleryQuestion: {
			Title: '생성한 이미지를 갤러리에 전시할까요?',
			Paragraph: '갤러리에 전시하는 옵션은 설정을 통해 언제든 키거나 끌 수 있어요.'
		}
	},
	History: {
		GenerationsTitle: '생성한 이미지',
		GenerationsMaxSavedCountWarning: '최대 {count}개',
		NoGenerationsYet: '아직 생성한 이미지가 없어요.'
	},
	Live: {
		GenerationsTitle: '생성된 이미지',
		TotalDurationTitle: '총 생성 시간',
		UpscalesTitle: '화질 개선 횟수',
		GenerationTooltip: {
			CountryTitle: '국가',
			Type: {
				Title: '타입',
				Generation: '이미지 생성',
				Upscale: '화질 개선'
			},
			DimensionsTitle: '해상도',
			StepsTitle: '생성 스텝 수',
			ScaleTitle: '유사한 정도',
			DurationTitle: '걸린 시간',
			Status: {
				Title: '현재 상태',
				Started: '시작됨',
				Succeeded: '완료',
				Failed: '실패'
			},
			Server: {
				Title: '서버',
				Default: '일반',
				Custom: '커스텀'
			},
			UnknownTitle: '알 수 없음'
		},
		WaitingTitle: '이미지 생성을 기다리는 중',
		DurationStatusUnknown: '알 수 없음'
	},
	Navbar: {
		HomeTab: '홈 화면',
		HistoryTab: '생성 기록',
		GalleryTab: '갤러리',
		LiveTab: '실시간 통계'
	},
	Settings: {
		Title: '설정',
		SwitchServerButton: '서버 변경하기',
		SubmitToGalleryToggle: '갤러리에 전시하기',
		AdvancedModeToggle: '고급 옵션 보기',
		AdvancedOptionsDropdown: '고급 옵션',
		AdvancedDropdown: '고급 옵션',
		GenerationSettingsButton: '생성 이미지 설정',
		GenerationSettingsTitle: '생성 이미지 설정',
		DarkModeToggle: '다크모드'
	},
	GenerationFullscreen: {
		DownloadButton: '다운로드',
		DoneButtonState: '완료!',
		CopyPromptButton: '문구 복사하기',
		CopyNegativePromptButton: '미포함 문구 복사하기',
		CopiedButtonState: '복사 완료!',
		RerollButton: '다시하기',
		RegenerateButton: '다시 생성하기',
		GenerateButton: '나도 생성해보기',
		UpscaleButton: '고화질 이미지로 만들기',
		UpscaleTabBar: {
			UpscaledTitle: '고화질',
			OriginalTitle: '원본'
		},
		Dimensions: {
			Title: '해상도'
		},
		Duration: {
			Title: '걸린 시간'
		}
	},
	SetServerModal: {
		SetServerTitle: '서버 설정',
		SwitchServerTitle: '서버 변경하기',
		Paragraph: '이미지를 생성하기 위한 서버를 변경합니다.',
		SetButton: '확인',
		DefaultButton: '기본값 사용'
	},
	Blog: {
		Title: '블로그',
		TitleAlt: '블로그',
		BackToBlogButton: '되돌아가기'
	},
	Redirect: {
		RedirectingToTitle: '{name}으로 이동합니다.'
	},
	Shared: {
		StartGeneratingTitle: '아름다운 이미지를 만들어 보세요!',
		StartGeneratingButton: '이미지 만들러 가기',
		JoinUsTitle: '함께 해요!',
		GoHomeButton: '홈페이지로 가기',
		SwitchToDefaultServerButton: '기본 설정된 서버를 사용하기',
		JoinUsOnTitle: 'Join us on {name}',
		ShareButton: '공유하기',
		ShareOnButton: '{name}에 공유하기',
		YesButton: '좋아요',
		NoButton: '괜찮아요',
		EnableButton: '활성화',
		DisableButton: '비활성화',
		AddButton: '추가하기',
		CopyLinkButton: '링크 복사하기',
		CopyButton: '복사하기',
		DeleteButton: '삭제하기',
		LoadingTitle: '로딩 중',
		LoadingParagraph: '조금만 기다려주세요...',
		ServerUrlInput: {
			Placeholder: '커스텀 서버 주소'
		},
		EmailInput: {
			Placeholder: '이메일 주소'
		},
		PasswordInput: {
			Placeholder: '비밀번호'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: '기본 모델'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3D 디지털 아트'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3D 만화'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: '애니메이션'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: '애니메이션 영화'
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
		UnknownTitle: '알 수 없음',
		MoreOptionsTitle: '더 많은 옵션 보기',
		LessOptionsTitle: '옵션 숨기기',
		TryAgainButton: 'Try Again'
	},
	Error: {
		SomethingWentWrong: '웁스.. 뭔가 잘못됐어요. :(',
		NSFW: '부적절한 단어가 포함된 것 같아요, 새로운 문구를 입력해주세요 :(',
		ServerSeemsOffline:
			'서버와 연결이 끊긴 것 같아요. 웹사이트를 새로고침하거나 설정 화면을 통해 다른 서버를 지정해주세요.',
		ServerSetNotWorking: '입력한 서버와 호환되지 않거나 요청에 대한 응답을 받지 못하고 있어요.',
		NotFound: '요청한 페이지를 찾지 못했어요.',
		SupabaseNotFoundCantListen: '데이터베이스를 찾을 수 없어요.',
		InvalidEmail: 'Enter a valid email.',
		PasswordTooShort: 'Password must be at least 8 characters.',
		SomethingWentWrongTryAgain: 'Something went wrong, try again.',
		InvalidCredentials: 'Invalid credentials.',
		InvalidCode: 'Invalid code.'
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
		UsersTab: 'Users',
		Gallery: {
			TotalTitle: 'Total',
			ApprovedTitle: 'Approved',
			DeletedTitle: 'Deleted'
		}
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
				"That generation was created using an AI model that isn't available on the free plan.",
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
export default ko;
