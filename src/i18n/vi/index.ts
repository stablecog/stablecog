import type { Translation } from '../i18n-types';

const vi: Translation = {
	Language: 'Ngôn ngữ',
	Home: {
		GenerateButton: 'Khởi tạo',
		PromptInput: {
			Placeholder: 'Tranh chân dung một con mèo vẽ bởi Van Gogh'
		},
		WidthTabBar: {
			Title: 'Chiều rộng',
			Paragraph: 'Chiều rộng của hình ảnh.'
		},
		HeightTabBar: {
			Title: 'Chiều cao',
			Paragraph: 'Chiều cao của hình ảnh.'
		},
		InferenceStepsTabBar: {
			Title: 'Số bước suy luận',
			Paragraph: 'Bao nhiêu bước sẽ được thực hiện để tạo ra ảnh.'
		},
		GuidanceScaleSlider: {
			Title: 'Mức độ hướng dẫn',
			Paragraph:
				'Hình ảnh sẽ theo sát lời mô tả đến đâu. Giá trị cao hơn khiến hình ảnh dược tạo ra sát với lời mô tả hơn.'
		},
		NegativePromptInput: {
			Title: 'Mô tả nghịch đảo',
			Placeholder: 'Mô tả nghịch đảo',
			Paragraph:
				'Để xóa những thứ không mong muốn xuất hiện trong hình ảnh. Nó có tác dụng ngược so với lời mô tả.'
		},
		SeedInput: {
			Title: 'Số khởi tạo',
			Placeholder: 'Số khởi tạo',
			Paragraph:
				'Nhận được kết quả lặp lại giống nhau. Một số khởi tạo kết hợp với cùng một lời mô tả và các tùy chọn giống nhau sẽ tạo ra cùng một hình ảnh giống nhau.'
		},
		ModelDropdown: {
			Title: 'Mẫu',
			Paragraph: 'Kiểu mẫu AI sẽ được dùng để tạo hình ảnh.'
		},
		SchedulerDropdown: {
			Title: 'Bộ lấy mẫu',
			Paragraph:
				'Tạo ảnh theo từng cách nhất định. Dùng bộ lấy mẫu khác nhau sẽ thay đổi hình ảnh đáng kể. Có những bộ lấy mẫu cần ít bước suy luận hơn để cho ra hình ảnh tốt.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Gửi hình ảnh tới thư viện công cộng?',
			Paragraph: 'Bạn có thể thay đổi thiết lập này sau trong phần cài đặt.'
		}
	},
	History: {
		GenerationsTitle: 'Các hình ảnh',
		GenerationsMaxSavedCountWarning: 'Chỉ hiện thị {count}',
		NoGenerationsYet: 'Bạn chưa tạo hình ảnh nào cả.'
	},
	Live: {
		GenerationsTitle: 'Số lượng hình ảnh',
		TotalDurationTitle: 'Tổng thời gian',
		UpscalesTitle: 'Số lệnh phóng to',
		GenerationTooltip: {
			CountryTitle: 'Quốc gia',
			Type: {
				Title: 'Kiểu',
				Generation: 'Tạo ảnh',
				Upscale: 'Phóng to'
			},
			DimensionsTitle: 'Kích thước',
			StepsTitle: 'Số bước',
			ScaleTitle: 'Tỉ lệ',
			DurationTitle: 'Thời gian',
			Status: {
				Title: 'Trạng thái',
				Started: 'Đã bắt đầu',
				Succeeded: 'Thành công',
				Failed: 'Thất bại'
			},
			Server: {
				Title: 'Máy chủ',
				Default: 'Mặc định',
				Custom: 'Tùy chỉnh'
			},
			UnknownTitle: 'Không xác định',
			OutputsTitle: 'Outputs'
		},
		WaitingTitle: 'Chờ khởi tạo',
		DurationStatusUnknown: 'Không xác định'
	},
	Navbar: {
		HomeTab: 'Trang chủ',
		HistoryTab: 'Lịch sử',
		GalleryTab: 'Thư viện',
		LiveTab: 'Trực tiếp'
	},
	Settings: {
		Title: 'Cài đặt',
		SwitchServerButton: 'Đổi Máy chủ',
		SubmitToGalleryToggle: 'Lưu vào Thư viện',
		AdvancedModeToggle: 'Chế độ nâng cao',
		AdvancedOptionsDropdown: 'Tùy chọn nâng cao',
		AdvancedDropdown: 'Nâng cao',
		GenerationSettingsButton: 'Cài đặt chung',
		GenerationSettingsTitle: 'Cài đặt tạo ảnh',
		DarkModeToggle: 'Chế độ tối'
	},
	GenerationFullscreen: {
		DownloadButton: 'Tải về',
		DoneButtonState: 'Hoàn thành!',
		CopyPromptButton: 'Sao chép mô tả',
		CopyNegativePromptButton: 'Sao chép mô tả nghịch đảo',
		CopiedButtonState: 'Đã sao chép!',
		GenerateSimilarButton: 'Generate Similar',
		RerollButton: 'Tái tạo ngẫu nhiên',
		RegenerateButton: 'Tái tạo',
		GenerateButton: 'Khởi tạo',
		UpscaleButton: 'Phóng to',
		UpscaleTabBar: {
			UpscaledTitle: 'Phóng to',
			OriginalTitle: 'Nguyên bản'
		},
		Dimensions: {
			Title: 'Kích thước'
		},
		Duration: {
			Title: 'Thời gian'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Nhập máy chủ',
		SwitchServerTitle: 'Đổi máy chủ',
		Paragraph: 'Máy chủ sẽ được dùng để tạo hình ảnh.',
		SetButton: 'Chọn',
		DefaultButton: 'Mặc định'
	},
	Blog: {
		Title: 'Bài đăng trên blog',
		TitleAlt: 'Nhật ký',
		BackToBlogButton: 'Quay lại nhật ký'
	},
	Redirect: {
		RedirectingToTitle: 'Đang chuyển hướng đến {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Sẵn sàng tạo ra những bức ảnh đẹp đẽ!',
		StartGeneratingButton: 'Khởi tạo ảnh',
		JoinUsTitle: 'Gia nhập',
		GoHomeButton: 'Về trang chủ',
		SwitchToDefaultServerButton: 'Chuyển sang máy chủ mặc định',
		JoinOnDiscord: 'Join on Discord',
		JoinUsOnTitle: 'Gia nhập tại {name}',
		ShareButton: 'Chia sẻ',
		ShareOnButton: 'Chia sẻ trên {name}',
		GoBackButton: 'Go Back',
		YesButton: 'Có',
		NoButton: 'Không',
		EnableButton: 'Cho phép',
		DisableButton: 'Vô hiệu hóa',
		AddButton: 'Thêm',
		CopyLinkButton: 'Sao chép liên kết',
		CopyButton: 'Sao chép',
		DeleteButton: 'Xóa',
		LoadingTitle: 'Đang tải',
		LoadingParagraph: 'Đang tải...',
		InsufficientCreditsTitle: 'Insufficient credits ({remainingCredits}/{neededCredits})',
		ConfirmButton: 'Confirm',
		ServerUrlInput: {
			Placeholder: 'Đường dẫn máy chủ'
		},
		EmailInput: {
			Placeholder: 'Địa chỉ email'
		},
		PasswordInput: {
			Placeholder: 'Mật khẩu'
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
				realName: 'Waifu Diffusion v1.4'
			},
			'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
				realName: '22h Diffusion v0.1'
			},
			'b6c1372f-31a7-457c-907c-d292a6ffef97': {
				realName: 'Luna Diffusion'
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
			}
		},
		UnknownTitle: 'Không xác định',
		MoreOptionsTitle: 'Tuỳ chọn khác',
		LessOptionsTitle: 'Tùy chọn ít hơn',
		TryAgainButton: 'Thử lại',
		RefreshButton: 'Refresh',
		LoadMoreButton: 'Load More',
		SearchingTitle: 'Searching',
		NoResultsFoundTitle: 'No results found'
	},
	Error: {
		SomethingWentWrong: 'Đã xảy ra lỗi :(',
		ImageWasNSFW: 'This image was NSFW :(',
		NSFW: 'Phát hiện nội dung không lành mạnh, hãy viết lời mô tả khác :(',
		ServerSeemsOffline:
			'Máy chủ có lẽ ngoại tuyến. Bạn thử F5 hoặc chọn máy chủ khác trong phần cài đặt.',
		ServerSetNotWorking: 'Máy chủ này không tương thích hoặc không phản hồi.',
		NotFound: 'Không tìm thấy',
		SupabaseNotFoundCantListen:
			'Không tìm thấy phiên Supabase. Không thể nhận được các lệnh khởi tạo.',
		InvalidEmail: 'Nhập địa chỉ email hợp lệ.',
		PasswordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự.',
		SomethingWentWrongTryAgain: 'Có sự cố. Xin vui lòng thử lại.',
		InvalidCredentials: 'Thông tin dùng để xác thực không hợp lệ.',
		InvalidCode: 'Mã không hợp lệ.',
		OnceEvery60Seconds: 'You can only request a link once every 60 seconds.',
		LinkExpired: {
			Title: 'Link Expired',
			Paragraph: 'The link can only be used once and expires after 24 hours.'
		},
		UpdateAvailable: {
			Title: 'Update Available',
			Paragraph: 'There is an update! Refresh the page to get it.'
		},
		EmailProviderNotAllowed: "This email provider isn't allowed."
	},
	Admin: {
		AdminPanelTitle: 'Quản trị',
		DeleteButton: 'Xóa',
		ApproveButton: 'Phê duyệt',
		RejectButton: 'Reject',
		EditButton: 'Edit',
		EditViewButton: 'Edit View',
		NormalViewButton: 'Normal View',
		StopEditButton: 'Stop Editing',
		NoGenerationsToReview: 'Chưa có ảnh để duyệt.',
		ServersButton: 'Máy chủ',
		AdminGalleryButton: 'Thư viện',
		UsersButton: 'Người dùng',
		AdminTab: 'Quản trị',
		ServersTab: 'Máy chủ',
		AdminGalleryTab: 'Thư viện',
		UsersTab: 'Người dùng',
		Gallery: {
			TotalTitle: 'Tổng',
			ApprovedTitle: 'Đã duyệt',
			DeletedTitle: 'Đã xóa',
			StatusDropdown: {
				All: 'All',
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
		PageTitle: 'Đăng ký',
		PageParagraph:
			'Tham gia và trở thành người dùng trả phí để khai mở hết tiềm năng của Stablecog.',
		PageTitleConfirm: 'Xác nhận',
		PageTitleConfirmAlt: 'Kiểm tra Email của bạn',
		PageParagraphConfirm:
			'Chúng tôi đã gửi cho bạn mã gồm 6 chữ số qua email. Nhập nó phía dưới để xác nhận tài khoản.',
		SignUpButton: 'Đăng ký',
		ConfirmButton: 'Xác nhận',
		AlreadyHaveAnAccountTitle: 'Đã có một tài khoản?',
		LoginInsteadButton: 'Đăng Nhập',
		SixDigitCodeInput: {
			Placeholder: 'Mã 6 chữ số'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'Get Started',
		GetStartedButton: 'Get Started',
		PageTitle: 'Đăng nhập',
		PageParagraph:
			'Bắt đầu dùng Stablecog với tất cả các tính năng sẵn có trong tài khoản của bạn.',
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
		DontHaveAnAccountTitle: 'Bạn không có tài khoản?',
		SignUpInsteadButton: 'Đăng ký mới',
		SignInButton: 'Đăng nhập',
		SignOutButton: 'Đăng xuất'
	},
	Pro: {
		PageTitle: 'Trở thành người dùng trả phí',
		PageParagraph:
			'Mở khóa tất cả các tính năng của Stablecog và hỗ trợ dự án. Nếu không có các thành viên trả phí, Stablecog sẽ không thể duy trì nguồn mở hoàn toàn và tiếp tục miễn phí cho mọi người.',
		PageTitleAlreadyPro: 'Đã là người dùng trả phí!',
		PageParagraphAlreadyPro:
			'Bạn đã là thành viên trả phí. Cảm ơn bạn đã ủng hộ dự án! Hãy tận hưởng Stablecog và chia sẻ với bạn bè của bạn.',
		ProPlanTitle: 'Trả phí',
		Features: {
			FullSpeed: 'Tốc độ đầy đủ không giới hạn',
			ImageDimensions: 'Đa dạng kích thước ảnh',
			Upscale: 'Phóng to ảnh',
			Steps: 'Đa dạng số bước suy luận',
			MoreModels: 'Nhiều mẫu (mô hình AI) hơn',
			MoreSchedulers: 'Nhiều bộ lấy mẫu hơn',
			SavedToCloud: 'Ảnh tạo ra được lưu lên mây',
			Upcoming: 'Các tính năng sắp xuất hiện',
			CommercialUse: 'Thương mại'
		},
		Soon: '(sắp có)',
		Month: '/tháng',
		BecomeProButton: 'Trở thành người dùng trả phí',
		Success: {
			PageTitle: 'Bạn là người dùng trả phí!',
			PageParagraph:
				'Bây giờ bạn có quyền truy cập vào mọi thứ mà Stablecog cung cấp. Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi tại {platform}.'
		},
		Cancel: {
			PageTitle: 'Bạn đã hủy bỏ',
			PageParagraph: 'Bạn đã hủy quá trình đăng ký. Nếu đó là một nhẫm lẫn, bạn hãy thử lại.'
		},
		Reason: {
			ParagraphWidth: 'Chế độ miễn phí không hỗ trợ kích thước chiều rộng này.',
			ParagraphHeight: 'Chế độ miễn phí không hỗ trợ kích thước chiều cao này.',
			ParagraphDimensions: 'Chế độ miễn phí không hỗ trợ kích thước hình ảnh này.',
			ParagraphUpscale: 'Chế độ miễn phí không hỗ trợ chức năng phóng to.',
			ParagraphInferenceSteps: 'Chế độ miễn phí không hỗ trợ số bước suy luận này.',
			ParagraphModel: 'Chế độ miễn phí không hỗ trợ mô hình AI này.',
			ParagraphScheduler: 'Chế độ miễn phí không hỗ trợ bộ lấy mẫu này.',
			ParagraphWidthGeneration:
				'Chế độ miễn phí không hỗ trợ kích thước chiều rộng mà hình ảnh này được khởi tạo.',
			ParagraphHeightGeneration:
				'Chế độ miễn phí không hỗ trợ kích thước chiều cao mà hình ảnh này được khởi tạo.',
			ParagraphDimensionsGeneration:
				'Chế độ miễn phí không hỗ trợ kích thước mà hình ảnh này được khởi tạo.',
			ParagraphInferenceStepsGeneration:
				'Chế độ miễn phí không hỗ trợ số bước suy luận mà hình ảnh này được khởi tạo.',
			ParagraphModelGeneration:
				'Chế độ miễn phí không hỗ trợ mô hình AI đã dùng để khởi tạo hình ảnh này.',
			ParagraphSchedulerGeneration:
				'Chế độ miễn phí không hỗ trợ số bước suy luận đã dùng để khởi tạo hình ảnh này.'
		},
		Tier: {
			Title: {
				Free: 'Miễn phí',
				Pro: 'Trả phí'
			},
			Badge: {
				Free: 'MIỄN PHÍ',
				Pro: 'TRẢ PHÍ'
			}
		}
	},
	Account: {
		PageTitle: 'Tài khoản',
		ManageSubscriptionButton: 'Quản lý gói đăng ký',
		ComparePlansButton: 'Compare Plans',
		ManageAccountButton: 'Quản lý tài khoản',
		MyAccountButton: 'Tài khoản của tôi',
		SubscriptionPlanTitle: 'Gói',
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
		}
	},
	ForgotPassword: {
		PageTitle: 'Đặt lại mật khẩu',
		PageParagraph: 'Chúng tôi sẽ gửi mã số gồm 6 chữ số đến email của bạn để đặt lại mật khẩu.',
		SendResetCodeButton: 'Gửi mã',
		PageTitleConfirmCode: 'Xác nhận',
		PageTitleConfirmCodeAlt: 'Kiểm tra Email của bạn',
		PageParagraphConfirmCode:
			'Chúng tối đã gửi bạn mã số gồm 6 chữ số qua email. Nhập nó phía dưới để tiếp tục.',
		ConfirmCodeButton: 'Xác nhận',
		PageTitleNewPassword: 'Mật khẩu mới',
		PageParagraphNewPassword: 'Nhập mật khẩu mới cho tài khoản của bạn.',
		NewPasswordInput: {
			Placeholder: 'Mật khẩu mới'
		},
		SetNewPasswordButton: 'Đặt mật khẩu mới',
		PageTitleSuccess: 'Hoàn thành!',
		PageParagraphSuccess: 'Mật khẩu đã được đặt lại thành công.',
		ForgotPasswordButton: 'Quân mật khẩu?'
	},
	FeaturedOn: {
		PageTitle: 'Chúng tôi nổi bật trên'
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
			LargeTitle: 'Large Pack'
		},
		Features: {
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
	UnderDevelopment: {
		PageTitle: "We'll be back soon!",
		PageParagraph: "We're making some upgrades. We'll be back in a couple of hours."
	}
};
export default vi;
