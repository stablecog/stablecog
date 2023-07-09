import type { Translation } from '../i18n-types';

const ja: Translation = {
	Language: '言語',
	Landing: {
		Hero: {
			Title: '素晴らしいアートをAIで瞬時に作成しよう。'
		},
		Describe: {
			Title: '画像生成は、思いのまま。',
			Paragraph:
				'あなたの限りない発想を、瞬時にAIで画像にしてみませんか。数千ものスタイルから選べます。',
			Prompt: 'サイケデリックで勇敢な猫、紫色のトーン、ファンタジー背景'
		},
		InitImage: {
			Title: 'または画像から始めます。',
			Paragraph: '任意画像に基づいて新しい画像を生成しよう。',
			Prompt: '異星人型ロボット'
		},
		StartCreating: {
			Title: '早速作成を始めましょう！',
			Paragraph:
				'無料でお試しできますので、ぜひ使って見てください。何千ものユーザーに愛用されていただいておりますので、きっとあなたにも気に入っていただけると思います。'
		},
		TryItNowButton: '試してみましょう',
		StartCreatingButton: '作成を始めてみましょう！',
		GetStartedButton: '早速始めよう!'
	},
	Home: {
		GenerateButton: '生成',
		PromptInput: {
			Title: 'プロンプト',
			Placeholder: 'ヴァン・ゴッホ風の猫の肖像画'
		},
		WidthTabBar: {
			Title: '幅',
			Paragraph: '画像の幅。'
		},
		HeightTabBar: {
			Title: '高さ',
			Paragraph: '画像の高さ。'
		},
		InferenceStepsTabBar: {
			Title: '推論ステップ',
			Paragraph: '画像の生成(拡散)に必要なステップ数。'
		},
		GuidanceScaleSlider: {
			Title: 'ガイダンススケール',
			Paragraph:
				'生成画像がプロンプトにどれほど近似するかを指定します。値が高いほど、画像がプロンプトにより近似することを意味します。'
		},
		AspectRatioDropdown: {
			Title: '縦横比',
			Paragraph: '画像の縦横比。',
			Options: {
				Square: '正方形(1:1)',
				Portrait: '縦向き (2:3)',
				Landscape: '横 (3:2)',
				Mobile: 'モバイル (9:16)',
				Desktop: 'デスクトップ (16:9)',
				Anamorphic: 'アナモフィックC (2.4:1)',
				Squarish: '四方形 (4:5)'
			}
		},
		AspectRatioTabBar: {
			Title: '縦横比',
			Paragraph: '画像の縦横比。'
		},
		InitialImageTabBar: {
			Title: '初期画像',
			Paragraph: 'この画像に基づいて生成されます。'
		},
		InitialImageStrengthTabBar: {
			TitleAlt: '画像強度',
			Title: '初期画像強度',
			Paragraph:
				'初期画像による影響をコントロールします。値が大きいほど、初期画像の影響も増えます。'
		},
		NegativePromptInput: {
			Title: '負のプロンプト',
			Placeholder: '負のプロンプト',
			PlaceholderAlt: '回避する項目を入力してください',
			Paragraph:
				'生成画像から除去したいもの指定します。プロンプトとは対照的な意味としてとらわれます。'
		},
		ImageInput: {
			Paragraph: 'クリックまたは画像をここにドロップします',
			Title: '画像をアップロード'
		},
		SeedInput: {
			Title: 'シード値',
			Placeholder: 'シード値',
			Paragraph:
				'再現性のある結果を可能とします。固定されたシード数とプロンプトを組み合わせると、毎回同じ画像が生成されます。'
		},
		ModelDropdown: {
			Title: 'モデル',
			Paragraph: '画像生成するために使用されるAIモデル。'
		},
		NumOutputsSlider: {
			Title: '画像数',
			Paragraph: '生成される画像数。'
		},
		SchedulerDropdown: {
			Title: 'スケジュラー',
			Paragraph:
				'特定の方法で画像を拡散します。生成された画像を大幅に変更することができます。スケジュラーによっては、任意の結果を生み出すために必要なステップ数が少ない場合があります。'
		},
		SubmitToGalleryQuestion: {
			Title: '生成された画像をギャラリーに提出しますか?',
			Paragraph: '後で設定から任意に変更できます。'
		}
	},
	Generate: {
		ShowSettingsButton: '設定を表示',
		HideSettingsButton: '設定を非表示',
		Grid: {
			NotSignedIn: {
				Paragraph: '生成画像を参照するにはサインインしてください。'
			},
			NoGeneration: {
				Paragraph: '生成画像はここに表示されます。'
			}
		}
	},
	History: {
		GenerationsTitle: '生成画像',
		GenerationsMaxSavedCountWarning: '最新の {count} のみ',
		DownloadLegacyGenerationsButton: 'レガシー生成をダウンロード',
		NoFavoritesYet: 'お気に入りがまだありません。',
		Views: {
			AllTitle: '全て',
			FavoritesTitle: 'お気に入り'
		},
		NoGenerationsYet: 'まだ画像を生成していません。'
	},
	Live: {
		GenerationsTitle: '生成数',
		TotalDurationTitle: '合計所用時間',
		UpscalesTitle: 'アップスケール数',
		VoiceoversTitle: 'Voiceovers',
		GenerationTooltip: {
			AspectRatioTitle: '縦横比',
			CountryTitle: '国',
			Type: {
				Title: '種類',
				Generation: '生成画像',
				Upscale: 'アップスケール',
				Voiceover: 'Voiceover'
			},
			DimensionsTitle: '寸法',
			StepsTitle: 'ステップ',
			ScaleTitle: 'スケール',
			DurationTitle: '所用時間',
			Status: {
				Title: 'ステータス',
				Started: '開始済み',
				Succeeded: '成功',
				Failed: '失敗'
			},
			Server: {
				Title: 'サーバ',
				Default: '既定値',
				Custom: 'カスタム設定'
			},
			UnknownTitle: '不明',
			OutputsTitle: '出力'
		},
		WaitingTitle: '生成待機中',
		DurationStatusUnknown: '不明'
	},
	Navbar: {
		HomeTab: 'ホーム',
		GenerateTab: '生成',
		HistoryTab: '履歴',
		GalleryTab: 'ギャラリー',
		AdminGalleryTab: '管理用ギャラリー',
		PricingTab: '価格',
		AccountTab: 'アカウント',
		VoiceoverTab: 'Voiceover',
		LiveTab: 'ライブ'
	},
	Settings: {
		Title: '設定',
		SwitchServerButton: 'サーバーを切り替え',
		SubmitToGalleryToggle: 'ギャラリーに提出',
		AdvancedModeToggle: '高度なモード',
		AdvancedOptionsDropdown: '高度なオプション',
		AdvancedDropdown: '高度な設定',
		GenerationSettingsButton: '生成設定',
		GenerationSettingsTitle: '生成設定',
		DarkModeToggle: 'ダークモード'
	},
	GenerationFullscreen: {
		DownloadButton: 'ダウンロード',
		DoneButtonState: '完了！',
		CopyPromptButton: 'プロンプトをコピー',
		CopyNegativePromptButton: '負のプロンプトをコピー',
		CopiedButtonState: 'コピー済',
		GenerateSimilarButton: '類似画像を生成',
		ExploreSimilarButton: '類似を探索',
		ExploreStyleButton: 'スタイルを探索',
		RerollButton: 'リロール',
		RegenerateButton: '再生成',
		GenerateButton: '生成',
		UpscaleButton: 'アップスケール',
		SimilarTitle: '類似画像',
		SubmitToGalleryButton: 'ギャラリーに提出',
		SubmittedTitle: '提出済み',
		UpscaleTabBar: {
			UpscaledTitle: 'アップスケール済',
			OriginalTitle: 'オリジナル'
		},
		Dimensions: {
			Title: '寸法'
		},
		Duration: {
			Title: '所用時間'
		}
	},
	SetServerModal: {
		SetServerTitle: 'サーバー設定',
		SwitchServerTitle: 'サーバーの切り替え',
		Paragraph: 'サーバーは画像の生成に使用されます。',
		SetButton: '設定',
		DefaultButton: '既定値'
	},
	Blog: {
		Title: 'ブログの投稿',
		TitleAlt: 'ブログ',
		ThanksForReading: 'Thanks for reading!',
		BackToBlogButton: 'ブログに戻る'
	},
	Redirect: {
		RedirectingToTitle: '{name} に転送'
	},
	Shared: {
		StartGeneratingTitle: '美しい画像を生成し始めよう!',
		StartGeneratingButton: '生成を開始',
		JoinUsTitle: '今すぐ参加',
		GoHomeButton: 'ホームに戻る',
		SwitchToDefaultServerButton: 'デフォルトのサーバーに切り替える',
		JoinOnDiscord: 'Discordに参加',
		JoinUsOnTitle: '{name} にて参加してください',
		ShareButton: '共有',
		ShareOnButton: '{name} にて共有',
		GoBackButton: '戻る',
		YesButton: 'はい',
		NoButton: 'いいえ',
		EnableButton: '有効にする',
		DoneButton: '完了',
		CancelButton: 'キャンセル',
		ClearAllButton: '全てクリア',
		DisableButton: '無効にする',
		DownloadButton: 'Download',
		AddButton: '追加',
		CopyLinkButton: 'リンクをコピー',
		CopyButton: 'コピー',
		DeleteButton: '削除',
		LoadingTitle: '読み込み中',
		ContinueButton: '続行',
		LoadingParagraph: '読み込み中...',
		InsufficientCreditsTitle: 'クレジットが不足しています({remainingCredits}/{neededCredits})',
		AllTitle: '全て',
		ConfirmButton: '確定',
		SimilarToTitle: '類似画像: {item}',
		ResourcesTitle: 'リソース',
		ResourcesButton: 'リソース',
		On: 'On',
		Off: 'Off',
		BetaTitle: 'Beta',
		ConfirmQuestionMarkButton: '確定しますか？',
		Credits: {
			CreditsTable: {
				CreditTypeTitle: 'クレジットタイプ',
				RemainingCreditsTitle: 'クレジット残高',
				ExpiryTitle: '有効期限',
				LastReplenish: '最終補充'
			}
		},
		BatchEditBar: {
			PauseEditingButton: '編集を一時停止',
			DeselectButton: '選択解除 ({selectedCount})',
			DeleteButton: '削除 ({selectedCount})',
			FavoriteButton: 'お気に入り ({selectedCount})',
			ApproveButton: '承認 ({selectedCount})',
			RejectButton: '却下 ({selectedCount})',
			UnfavoriteButton: 'お気に入り取り消し ({selectedCount})',
			ConfirmationModal: {
				CancelButton: 'キャンセル',
				Deselect: {
					Title: '{selectedCount} 個のアイテムを選択解除しますか？',
					Paragraph: '{selectedCount} 個のアイテムを選択解除してもよろしいですか？',
					ConfirmButton: '選択解除'
				},
				Delete: {
					Title: '{selectedCount} 個のアイテムを削除しますか？',
					Paragraph: '{selectedCount} 個のアイテムを削除してもよろしいですか？',
					ConfirmButton: '削除'
				},
				Favorite: {
					Title: '{selectedCount} 個のアイテムをお気に入りとして追加しますか？',
					Paragraph:
						'本当に{selectedCount} 個のアイテムをお気に入りとして追加してもよろしいですか？',
					ConfirmButton: 'お気に入りに追加する'
				},
				Unfavorite: {
					Title: '{selectedCount} 個のアイテムをお気に入りから外しますか？',
					Paragraph:
						'本当に選択した {selectedCount} 個の項目をお気に入りから外してよろしいですか？',
					ConfirmButton: 'お気に入りを解除'
				}
			}
		},
		ServerUrlInput: {
			Placeholder: 'サーバ URL'
		},
		EmailInput: {
			Placeholder: 'メールアドレス'
		},
		PasswordInput: {
			Placeholder: 'パスワード'
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
			},
			'8002bc51-7260-468f-8840-cf1e6dbe3f8a': { realName: 'SDXL' },
			'a3636543-91cc-4290-b1a4-9d506457b9be': {
				realName: 'Freedom'
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
				realName: 'DPM マルチステップ'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			},
			'82cf78dd-6afb-48cc-aca6-14224cca6950': {
				realName: 'DDIM'
			},
			'b7224e56-1440-43b9-ac86-66d66f9e8c91': {
				realName: 'Pサンプラー'
			}
		},
		UnknownTitle: '不明',
		AdvancedSettingsButton: '詳細設定',
		MoreOptionsTitle: 'オプションを表示',
		LessOptionsTitle: 'オプションを隠す',
		TryAgainButton: '再試行',
		RefreshButton: '更新',
		LoadMoreButton: 'さらに読み込む',
		BackToGalleryButton: 'ギャラリーに戻る',
		SearchingTitle: '検索中',
		NoResultsFoundTitle: '検索結果なし'
	},
	Error: {
		SomethingWentWrong: '不具合が発生しました。',
		PromptWasNSFW: 'This prompt might produce sensitive content :(',
		ImageWasNSFW: 'この画像は18禁でした (X_X)',
		NSFW: 'NSFW (閲覧注意) コンテンツが検出されました。別のプロンプトを試してください ☹️',
		ServerSeemsOffline:
			'サーバーはオフラインの様です。ページを更新するか、設定から別のサーバーを設定してください。',
		ServerSetNotWorking: 'このサーバーは互換性がないか、応答していません。',
		NotFound: '見つかりませんでした',
		SupabaseNotFoundCantListen:
			'Supabase インスタンスが見つからないため、生成への応答には利用できません。',
		InvalidEmail: '有効なメールアドレスを入力してください。',
		PasswordTooShort: 'パスワードは8文字以上でなければなりません。',
		SomethingWentWrongTryAgain: 'エラーが発生しました。再試行してください。',
		InvalidCredentials: '不正な認証情報',
		InvalidCode: 'コードが無効です。',
		TryAnotherImage: '別の画像をお試しください (^_^);',
		OnceEvery60Seconds: 'リンクは60秒ごとに1回しかリクエストできません。',
		LinkExpired: {
			Title: 'リンクが期限切れ',
			Paragraph: 'リンクは一度だけ使用でき、24時間後に期限切れになります。'
		},
		UpdateAvailable: {
			Title: 'アップデートがあります',
			Paragraph: 'アップデートがあります！ページを更新して取得してください。'
		},
		EmailProviderNotAllowed: 'このメールプロバイダは許可されていません。',
		EmailAlreadyInUse: 'このメールアドレスは既に使用されています。'
	},
	Admin: {
		AdminPanelTitle: 'アドミ',
		DeleteButton: '削除',
		ApproveButton: '承認',
		RejectButton: '却下',
		EditButton: '編集',
		EditViewButton: '編集ビュー',
		NormalViewButton: '標準表示',
		StopEditButton: '編集停止',
		NoGenerationsToReview: 'レビューする生成がありません。',
		ServersButton: 'サーバ',
		AdminGalleryButton: '管理用ギャラリー',
		UsersButton: 'ユーザー',
		AdminTab: 'アドミ',
		ServersTab: 'サーバ',
		AdminGalleryTab: '管理用ギャラリー',
		UsersTab: 'ユーザー',
		Users: {
			ConfirmAction: {
				ConfirmActionReferenceText: 'アクションを確認',
				ConfirmActionParagraph: '「{confirmActionText}」と入力して確認します。',
				ConfirmActionInput: {
					Placeholder: '確認'
				}
			},
			DataDeletedAtTitle: 'このデータは削除されました',
			WillBeDeletedTitle: '削除します',
			BannedAtTitle: '禁止',
			BannedTitle: '禁止',
			UnbanUserButton: 'ユーザーの禁止解除',
			BanUserButton: 'ユーザーの禁止',
			GiftCreditsButton: 'ギフトクレジット'
		},
		Gallery: {
			TotalTitle: '合計',
			ApprovedTitle: '承認済',
			DeletedTitle: '削除済',
			StatusDropdown: {
				All: '全て',
				ManuallySubmitted: '手動で提出済み',
				Submitted: '提出済み',
				Approved: '承認済',
				Rejected: '却下',
				Deleted: '削除済み',
				Private: '非公開'
			},
			NoGenerationsToReview: 'レビューする生成がありません'
		}
	},
	SignUp: {
		PageTitle: '新規登録',
		PageParagraph: 'Stablecogに参加してプロメンバーになり、その可能性を最大限に引き出しましょう。',
		PageTitleConfirm: '確認',
		PageTitleConfirmAlt: 'メールをチェックしてください',
		PageParagraphConfirm:
			'6桁のコードをメールで送信しました。アカウントを確認するには以下に入力してください。',
		SignUpButton: '新規登録',
		AllTitle: '全て',
		ConfirmButton: '確認',
		AlreadyHaveAnAccountTitle: '既にアカウントをお持ちですか？',
		LoginInsteadButton: '代わりにログインする',
		WantsEmailCheckbox: {
			Paragraph: '製品の更新、お得な情報、ニュース等の購読に同意',
			NoSpamParagraph: '迷惑メールは発信しませんのでご安心ください。'
		},
		SixDigitCodeInput: {
			Placeholder: '6 桁のコード'
		}
	},
	SignIn: {
		PageTitleGetStarted: 'はじめに',
		GetStartedButton: 'はじめに',
		PageTitle: 'サインイン',
		PageParagraph: 'あなたのアカウントで利用可能なすべての機能でStablecogを利用しよう！',
		PageParagraphV2:
			'無料で素晴らしいアートをアッ！という間に作成し始めましょう。クレジットカードは不要です。',
		PageTitleCreateAccountOrSignIn: 'アカウントの作成またはサインイン',
		PageParagraphCreateAccountOrSignIn:
			'アカウントで利用可能な全ての機能でStablecogを利用しましょう。',
		PageTitleSentLink: 'メールを確認してください',
		PageParagraphSentLink:
			'サインインリンクをメールで送信しました。見つからない場合は、迷惑メールフォルダを確認してください。',
		ContinueButton: '次へ進む',
		ContinueWithProviderButton: '{provider} で続行',
		SignInWithProviderButton: '{provider} でサインイン',
		OrContinueWithEmailTitle: 'またはメールで続ける',
		DontHaveAnAccountTitle: 'アカウントをお持ちでないですか？',
		SignUpInsteadButton: '代わりにサインアップする',
		SignInButton: 'サインイン',
		EnterCodeManuallyButton: 'コードを手動で入力',
		SignOutButton: 'サインアウト'
	},
	Pro: {
		PageTitle: 'Pro版に登録',
		PageParagraph:
			'Stablecogプロジェクトの援助し、全ての機能のアンロックすることができます。Stablecogを完全オープンソースとして無料生成を引き続き提供できるのは、プロメンバーの皆様のおかげであります。',
		PageTitleAlreadyPro: '既にPro版に登録済です!',
		PageParagraphAlreadyPro:
			'あなたはすでにPro版のメンバーです。当プロジェクトをサポートしていただき誠に有難うございます！是非Stablecogを楽しんで、友達と共有してください。',
		ProPlanTitle: 'プロ',
		Features: {
			FullSpeed: '制限なしのフルスピード',
			ImageDimensions: '任意の画像寸法',
			Upscale: '画像のアップスケーリング',
			Steps: '様々な推論ステップ',
			MoreModels: 'より多くのモデル',
			MoreSchedulers: 'より多くのスケジュラー',
			SavedToCloud: '生成画像をクラウドに保存',
			Upcoming: '今後追加される機能',
			CommercialUse: '商用利用'
		},
		Soon: '(近日中)',
		Month: '/ 月',
		BecomeProButton: 'Pro版に登録',
		Success: {
			PageTitle: 'プロ版にアップグレードしました!',
			PageParagraph:
				'Stablecogが提供するすべての機能にアクセスできます。ご質問があれば、 {platform} までお問い合わせください。'
		},
		Cancel: {
			PageTitle: 'プランを解約されました',
			PageParagraph:
				'サブスクリプションの処理がキャンセルされました。間違いであった場合は、もう一度やり直してください。'
		},
		Reason: {
			ParagraphWidth: 'その画像の幅は無料プランでは利用できません。',
			ParagraphHeight: 'その画像の高さは無料プランでは利用できません。',
			ParagraphDimensions: 'これらの画像寸法は無料プランでは利用できません。',
			ParagraphUpscale: 'アップスケール機能は無料プランでは利用できません。',
			ParagraphInferenceSteps: 'この推論ステップの設定は無料プランでは利用できません。',
			ParagraphModel: 'このAIモデルは無料プランでは利用できません。',
			ParagraphScheduler: 'このスケジュラーは無料プランでは利用できません。',
			ParagraphWidthGeneration:
				'その生成は、無料プランでは利用できない画像幅を使用して作成されました。',
			ParagraphHeightGeneration:
				'その生成は、無料プランでは利用できない画像の高さを使用して作成されました。',
			ParagraphDimensionsGeneration:
				'その生成は、無料プランでは利用できない画像寸法を使用して作成されました。',
			ParagraphInferenceStepsGeneration:
				'その生成は、無料プランでは利用できない推論ステップ設定を使用して作成されました。',
			ParagraphModelGeneration:
				'その世代は、無料プランでは利用できないAIモデルを使用して作成されました。',
			ParagraphSchedulerGeneration:
				'その生成は、無料プランでは利用できないスケジュラーを使用して作成されました。'
		},
		Tier: {
			Title: {
				Free: '無料',
				Pro: 'Pro'
			},
			Badge: {
				Free: '無料',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'アカウント',
		ManageSubscriptionButton: 'サブスクリプションを管理',
		ComparePlansButton: 'プランを比較',
		ManageAccountButton: 'アカウントを管理',
		AccountButton: 'アカウント',
		MyAccountButton: 'アカウント',
		SubscriptionPlanTitle: 'プラン',
		RemainingImagesTitle: '残りの画像数',
		RemainingCreditsTitle: 'クレジット残高',
		RemainingTitle: 'クレジット残高',
		Subscription: {
			UpdateSubscriptionTitle: 'サブスクリプションを更新',
			ChangePlanTitle: 'プランを変更',
			CurrentPlanTitle: '現在のプラン',
			NewPlanTitle: '新しいプラン',
			Downgrade: {
				DowngradingToTitle: 'ダウングレード先',
				Explanation: '既存のクレジットは残ります。'
			},
			Upgrade: {
				UpgadingToTitle: 'アップグレード先',
				Explanation: '既存のクレジットは残ります。'
			},
			Failed: {
				PageTitle: 'アップデートに失敗しました',
				PageParagraph: 'プランを変更中に問題が発生しました。もう一度お試しください。'
			},
			Succeeded: {
				PageTitle: 'プランを変更',
				PageParagraph: 'プランが変更されました。'
			}
		},
		Tabs: {
			Account: 'アカウント',
			Usage: '利用状況',
			APIKeys: 'APIキー'
		},
		Meta: {
			AccountCreationTitle: '作成',
			LastSignInTitle: '最終ログイン',
			LastSeenTitle: '最終閲覧'
		},
		ChangeEmail: {
			PageTitle: 'メールアドレスを変更',
			PageParagraph: 'アカウントの新しいメールアドレスを入力してください。',
			ChangeEmailButton: 'メールアドレスを変更',
			NewEmailInput: {
				Placeholder: '新しいメールアドレス'
			},
			PageTitleSentLink: 'メールを確認してください',
			PageParagraphSentLink:
				'両方のアドレスにリンクを送信しました。アカウントのメールアドレスを変更するには両方にてご確認ください。',
			PageTitleConfirmOtherEmail: '他のメールアドレスを確認',
			PageParagraphConfirmOtherEmail:
				'別のメールアドレスへもリンクを送信しました。プロセスを完了するために確認してください。'
		},
		Usage: {
			PageTitle: '利用状況',
			PageParagraph: '最近の利用状況は以下で確認できます。',
			RecentUsageTitle: '最近の利用状況',
			UsageTable: {
				ID: 'ID',
				Type: '種別',
				Duration: '所用時間',
				Source: '操作元',
				RunTime: '実行時間',
				Cost: '費用（クレジット）',
				Operation: '操作',
				Process: 'プロセス',
				Platform: 'プラットフォーム'
			},
			UsageType: {
				Generate: '生成',
				Generation: '生成',
				Upscale: 'アップスケール'
			},
			SourceType: {
				Web: 'ウェブ',
				WebApp: 'ウェブアプリ',
				API: 'API'
			},
			NoUsageYet: 'まだ使用されていません。'
		},
		APIKeys: {
			PageTitle: 'APIキー',
			PageParagraph:
				'シークレット API キーは以下に表示されます。最初に生成時のみ一度だけ表示されますので、安全な場所に保管しておいてください。',
			NoKeysYet: 'まだAPIキーがありません。',
			CreateAPIKeyButton: 'API キーを作成',
			CreateNewKeyButton: '新しいキーの作成',
			DeleteKeyButton: 'キーの削除',
			KeyTable: {
				NameTitle: '名前',
				KeyTitle: 'キー',
				CreatedAtTitle: '作成日時',
				UsageTitle: '利用状況',
				LastUsedTitle: '最終使用',
				LastUsedNeverDescription: '未使用'
			},
			KeyModal: {
				Create: {
					Title: '新しいキーの作成',
					Paragraph: 'このキーを識別するために、任意の名前を付けることができます。',
					Input: {
						Title: '名前',
						TitleAlt: '名前（オプション）'
					},
					CreateKeyButton: 'キーの作成'
				},
				Created: {
					Title: '新しいキー',
					Paragraph:
						'このシークレットキーを安全な場所に保存してください。セキュリティ上の理由により、再度表示されません。',
					Input: {
						Title: 'シークレットキー'
					}
				},
				Delete: {
					Title: 'キーを失効',
					Paragraph:
						'このキーはすぐに無効になります。今後このキーを使用したリクエストは拒否されます。無効になると、このキーは再度表示されません。',
					RevokeKeyButton: 'キーを失効'
				}
			}
		}
	},
	ForgotPassword: {
		PageTitle: 'パスワードのリセット',
		PageParagraph: 'パスワードをリセットするための6桁のコードをメールで送信します。',
		SendResetCodeButton: 'コードを送信',
		PageTitleConfirmCode: '確認する',
		PageTitleConfirmCodeAlt: 'メールを確認してください',
		PageParagraphConfirmCode:
			'6桁のコードをメールで送信しました。続行するには以下に入力してください。',
		ConfirmCodeButton: '確認',
		PageTitleNewPassword: '新しいパスワード',
		PageParagraphNewPassword: 'アカウントの新しいパスワードを入力してください。',
		NewPasswordInput: {
			Placeholder: '新しいパスワード'
		},
		SetNewPasswordButton: '新しいパスワードを設定',
		PageTitleSuccess: '完了！',
		PageParagraphSuccess: 'パスワードが正常にリセットされました。',
		ForgotPasswordButton: 'パスワードをお忘れですか？'
	},
	FeaturedOn: {
		PageTitle: '私たちは以下で紹介されています'
	},
	Gallery: {
		PageTitle: 'ギャラリー',
		PageParagraph: 'Stablecogで他の人が作成したものをご覧ください。',
		SearchInput: {
			Title: '検索'
		},
		BackToGalleryButton: 'ギャラリーに戻る',
		SearchingTitle: '検索中...',
		NoMatchingGenerationTitle: '一致する生成がありません'
	},
	Pricing: {
		PlansTitle: 'プラン',
		PlansParagraph: 'あなたに最適なプランをお選びください。',
		CreditPacksTitle: 'クレジットパック',
		CreditPacksParagraph: '追加クレジットはいつでも購入できます。',
		SubscribeButton: '登録',
		SubscribedButton: '登録済み',
		UpgradeButton: 'アップグレード',
		DowngradeButton: 'ダウングレード',
		PurchaseButton: '購入',
		BuyCreditsButton: 'クレジットを購入',
		MonthlyTitle: '月額',
		YearlyTitle: '年額',
		SlashMonth: '/ 月',
		Plans: {
			FreeTitle: '無料',
			StarterTitle: '入門者向け',
			ProTitle: 'プロ向け',
			UltimateTitle: '超人向け'
		},
		CreditPacks: {
			MediumTitle: 'Mパック',
			LargeTitle: 'Lパック',
			MegaTitle: 'メガパック'
		},
		Features: {
			MonthlyCredits: '月毎 {count} クレジット。',
			MonthlyImages: '月毎{count}個まで生成',
			MonthlyGenerations: '月毎 {count} 枚の生成',
			ParallelGenerations: '{count}個の画像を並列生成',
			Images: '{count} 枚の画像。',
			Generations: '{count} 回の生成。',
			NeverExpires: '無期限。',
			CommercialUse: '商業利用可能',
			ImagesArePublic: '生成画像は公開',
			ImagesArePrivate: '生成画像は非公開'
		},
		Badges: {
			Recommended: 'おすすめ',
			MostPopular: '一番好評',
			BestValue: 'お買い得'
		},
		Purchase: {
			Succeeded: {
				PageTitle: 'これで完了です!',
				PageParagraph:
					'ご購入ありがとうございます。ご不明な点がございましたら、 {platform} までお気軽にお問い合わせください。'
			},
			Cancelled: {
				PageTitle: '購入がキャンセルされました',
				PageParagraph:
					'購入手続きが中断されました。誤って中断してしまった場合は、もう一度手続きを開始することができます。'
			}
		}
	},
	FAQ: {
		Title: 'FAQ（よくある質問）',
		TitleAlt: 'よくある質問',
		Questions: {
			CommercialUse: {
				Question: '生成された画像は商業利用できますか?',
				Answer:
					'有料プラン(Starter、Pro、Ultimate)に加盟中に画像を生成した場合は、のちにプランを解約されても画像の商業利用は可能です。 無料プランをご利用の場合は、生成された画像は個人利用のみに制限されます。'
			},
			MoreCredits: {
				Question: 'さらにクレジットを購入できますか?',
				Answer:
					'お持ちのサブスクリプションが有効である限り、随時クレジットを追加購入できます。 追加クレジットを購入するには、アカウントまたはプラン情報ページにて行ってください。'
			},
			CreditRollOver: {
				Question: 'クレジットは翌月に繰り越しできますか?',
				Answer:
					'いいえ、クレジットは翌月に繰り越しされません。クレジットは請求日に毎月リセットされます。'
			},
			PlanUpgradeOrDowngrade: {
				Question: 'プランのアップグレードやダウングレードはできますか?',
				Answer:
					'いつでもプランをアップグレードまたはダウングレードできます。 プランをアップグレードしますと、以前のプランのクレジット残高が期限切れになるまで利用できます。 アップグレードされたプランは直ちに全額請求されます。'
			},
			PlanCancellation: {
				Question: 'プランはいつでも解約できますか？',
				Answer:
					'プランはいつでも解約することができ、その時点での請求期間最終日に請求が停止します。 またお持ちのクレジットは、その請求期間が終了するまで利用できます。'
			},
			MoreQuestions: {
				Question: '他の質問はどちらに問い合わせしたらよろしいでしょうか？',
				Answer:
					'ご質問その他のご要望がありましたら、私たちの {Discord} にてお問い合わせください。担当者が喜んでお手伝いいたします。また {Twitter} 及び {email} でもお問い合わせを受け付けておりますので、ぜひお問い合わせください。',
				Parts: {
					Discord: 'Discord',
					Email: 'メール',
					Twitter: 'ツイッター'
				}
			}
		}
	},
	LowOnCreditsCard: {
		Title: 'クレジットが不足しています ({remainingCredits})',
		FreeParagraph:
			'全てのアクティブ・ユーザーにクレジットが毎日無料で提供されます。プランに加入するか、当サイトのイベントに参加することによって、さらにクレジットを獲得できます。',
		HighestPlanParagraph: 'クレジットパックを購入することができます。',
		OtherPlansParagraph: 'プランにアップグレードするか、クレジットパックを購入することができます。'
	},
	Contact: {
		PageTitle: 'Contact',
		PageParagraph:
			"If you have any inquiries or a questions, don't hesitate to reach out to us using the links below. We'll answer as soon as possible."
	},
	Support: {
		PageTitle: 'サポート',
		PageParagraph:
			'ご不明な点がございましたら、下記のリンクからお問い合わせください。できるだけ早く回答いたします。'
	},
	Guide: {
		PageTitle: 'ガイド',
		GuideButton: 'ガイド',
		PreviousTitle: '戻る',
		EndpointsTitle: 'Endpoints',
		EndpointTitle: 'Endpoint',
		NextTitle: '次へ',
		ChaptersTitle: 'チャプター',
		ChapterTitle: 'チャプター'
	},
	Try: {
		PageTitle: '試してみる'
	},
	Legal: {
		TermsOfServiceTitle: '利用規約',
		PrivacyPolicyTitle: 'プライバシーポリシー',
		RefundPolicyTitle: '返金ポリシー',
		ContentPolicyTitle: 'コンテンツポリシー'
	},
	Documentation: {
		PageTitle: 'ドキュメンテーション',
		PageTitleAlt: 'APIリファレンス',
		APIReferenceButton: 'APIリファレンス',
		DocumentationButton: 'ドキュメンテーション',
		ForDevelopersTitle: '開発者向け'
	},
	Scl: {
		Discord: 'Discord',
		Email: 'メール',
		Twitter: 'Twitter',
		Instagram: 'Instagram',
		YouTube: 'YouTube',
		LinkedIn: 'LinkedIn',
		Reddit: 'Reddit',
		GitHub: 'GitHub',
		Telegram: 'Telegram',
		ProductHunt: 'Product Hunt'
	},
	Voiceover: {
		ModelOptions: {
			'0f442a3e-cf53-490b-b4a9-b0dda63e9523': {
				Name: 'バーク'
			}
		},
		SpeakerOptions: {
			'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff': {
				Name: 'ポール'
			},
			'39f7fc5d-9031-4932-a4d5-b196bb06e203': {
				Name: 'ジョニー'
			},
			'0140c5dc-af12-4643-bfec-650d3cd03c56': {
				Name: 'ブライアン'
			},
			'4a19f17c-eedc-4cf8-a45d-1f9d69547125': {
				Name: 'レイチェル'
			},
			'2e4e9572-2ea6-48a3-b134-381c68c9d516': { Name: 'Ella' },
			'2364bfb5-cdce-4a30-b979-a12f9f49cd39': { Name: 'Alice' },
			'91bf1331-a234-4478-a2a5-4dba4ac647fc': { Name: 'Olivia' },
			'3aebf12b-a7b8-41cf-9411-5808a231138e': { Name: 'Daniel' },
			'b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0': { Name: 'Thomas' },
			'aad61bf9-0710-40f6-8050-8c412852f717': {
				Name: 'ヘンリー'
			},
			'37c069ec-f124-4be8-9d4c-e74157738877': {
				Name: 'リアム'
			},
			'38f9bd69-fa4c-4e53-b398-9a0f5865e927': {
				Name: 'ダン'
			},
			'5bd0610f-f073-487e-a74c-2a89105ce282': {
				Name: 'ガムゼ'
			},
			'7c3f8e30-9957-4d5e-a70e-c8269ff5f550': {
				Name: 'メルト'
			},
			'0188871e-c4d1-4ad9-ab3d-ec958c443822': {
				Name: 'ハリット'
			},
			'4802af70-6d40-429d-8b9d-8df591e30743': {
				Name: 'レイラ'
			},
			'e10d4dac-7c39-4e96-9622-6d4e46fc384b': {
				Name: 'ムラット'
			},
			'9354180b-9735-412c-947f-9d15af6edfe0': {
				Name: 'ミア'
			},
			'bcb7ac57-fd61-4630-82f0-ae3f836bb7c2': {
				Name: '映造'
			},
			'b7542bad-e5fc-4c02-89ce-0ec22f6deceb': {
				Name: '愛'
			},
			'2cdb9e2c-42c1-49d0-959b-43d4bfc1828f': {
				Name: '進也'
			},
			'37bb1326-d83e-425a-b21a-1a03ffea4d05': {
				Name: '絵見'
			},
			'1eca6e55-53fb-4d70-995f-7e4da9266574': {
				Name: '絵見華'
			},
			'4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f': {
				Name: 'アドリアーナ'
			},
			'9206e75b-2b28-47f0-899e-76ab476e1c3f': {
				Name: 'ホルヘ'
			},
			'573c37c7-f741-4d36-80dc-f126131c6343': {
				Name: 'カルメン'
			},
			'b06d6333-1e35-45a6-b18b-3187d34cc387': {
				Name: 'ペドロ'
			},
			'90ba9324-476b-48ae-b88e-aed1975a51fd': {
				Name: 'デビッド'
			},
			'babbbc15-5040-4e97-a89f-8309b13d7785': {
				Name: 'Annika'
			},
			'cafafcaa-45bf-45e0-901c-8ca63575ad2a': {
				Name: 'Leonie'
			},
			'31d7c264-b674-422b-9b8f-13195c3289b6': {
				Name: 'Fritz'
			},
			'b349543b-c727-4934-9f4f-249aa2a6b184': {
				Name: 'Wilhelm'
			},
			'c4796108-0e8a-4a7a-9a8a-bb66ff21e215': {
				Name: 'Hans'
			},
			'83c0ee48-c8ef-4a4c-bca8-9dae843d25da': {
				Name: 'Boris'
			},
			'947786c1-810d-44ce-808f-cdcf732d97fd': {
				Name: 'Alisa'
			},
			'2885a060-badc-4896-a4fa-f3656a58bb82': {
				Name: 'Ivan'
			},
			'92929922-0608-4b62-8a0d-f9d87a4ca2f5': {
				Name: 'Oleg'
			},
			'cb8a2dc4-fce9-4f17-b977-050aa78d8101': {
				Name: 'Xin'
			},
			'5001a3c9-557c-4775-ad6f-b71c47c3b4f1': {
				Name: 'Ming'
			},
			'd45f479f-42e5-4f15-b1a0-c9feabcdb3aa': {
				Name: 'Hu'
			},
			'56714211-532c-479b-ac8f-f2449af2310a': {
				Name: 'Shuang'
			},
			'052b721a-da7e-4614-b352-826411c262e2': {
				Name: 'Wan'
			}
		},
		List: {
			NotSignedIn: {
				Paragraph: 'ボイスオーバーを確認するにはサインインしてください。'
			},
			NoVoiceovers: {
				Paragraph: 'ボイスオーバーがここに表示されます。'
			}
		},
		Generate: {
			SpeakerParagraph: '{speakerName}は{languageName}で話します。',
			VoiceoverParagraph: 'ボイスオーバーがここに表示されます。'
		},
		PromptBar: {
			GenerateButton: 'Generate',
			CreditCost: '{creditCost} credit(s)',
			PromptInput: {
				Placeholder: 'Technology is a bridge between imagination and reality.'
			}
		},
		Settings: {
			Speaker: {
				Title: 'Speaker',
				Paragraph: 'The speaker for the voiceover.'
			},
			Language: {
				Title: 'Language',
				Paragraph: 'The language for the voiceover.'
			},
			VoiceStability: {
				Title: 'Voice Stability',
				Paragraph:
					'The stability level of the voice. Higher values make the voice more stable, lower values make it more variable.',
				Slider: {
					MoreStable: 'More stable',
					MoreVariable: 'More variable'
				}
			},
			DenoiseAudio: {
				Title: 'Denoise',
				Paragraph: 'Remove background noise from the audio.'
			},
			RemoveSilence: {
				Title: 'Remove Silence',
				Paragraph: 'Remove silent parts from the audio.'
			}
		},
		PlayButton: 'Play',
		PauseButton: 'Pause',
		MuteButton: 'Mute',
		UnmuteButton: 'Unmute'
	},
	Connect: {
		PageTitle: 'Connect',
		PageParagraph:
			'Click the button below to connect your {platform} account to your Stablecog account.',
		PageSuccessTitle: 'Connected!',
		ConnectButton: 'Connect',
		ReturnBackToParagraph: 'You can return back to {platform} now.',
		NoDiscordTokenParagraph:
			"This link doesn't contain a Discord token. Please request a new link.",
		NoDiscordIDParagraph: "This link doesn't contain a Discord ID. Please request a new link.",
		Platform: {
			Discord: 'Discord',
			Stablecog: 'Stablecog'
		},
		ConnectToTitle: 'Connect to {platform}',
		ConnectToParagraph:
			'Create an account or sign in to connect your {platform} account to your Stablecog account.'
	},
	UnderDevelopment: {
		PageTitle: 'しばらくお待ちください',
		PageParagraph: 'システムをアップグレードしています。数時間後に戻ります。'
	}
};

export default ja;
