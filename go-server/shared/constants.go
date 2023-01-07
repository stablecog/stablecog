package shared

import (
	"fmt"
	"time"

	"github.com/fatih/color"
	"github.com/meilisearch/meilisearch-go"
	"github.com/supabase-community/gotrue-go"
	"github.com/supabase-community/storage-go"
	"github.com/supabase/postgrest-go"
)

var SUPABASE_ADMIN_KEY = GetEnv("SUPABASE_ADMIN_KEY", "")
var SUPABASE_URL = GetEnv("PUBLIC_SUPABASE_URL", "")
var SUPABASE_REFERENCE_ID = GetEnv("PUBLIC_SUPABASE_REFERENCE_ID", "")
var PUBLIC_SUPABASE_POSTGREST_URL = GetEnv("PUBLIC_SUPABASE_POSTGREST_URL", "")
var DEFAULT_SERVER_URL = GetEnv("PUBLIC_DEFAULT_SERVER_URL", "")
var MEILI_URL = func() string {
	if GetEnv("RENDER", "") != "" {
		return GetEnv("MEILI_URL_RENDER", "")
	} else {
		return GetEnv("MEILI_URL", "")
	}
}()
var SENTRY_DSN_URL = GetEnv("SENTRY_DSN_URL", "")

var SupabaseDb = postgrest.NewClient(PUBLIC_SUPABASE_POSTGREST_URL, "", map[string]string{
	"Authorization": "Bearer " + SUPABASE_ADMIN_KEY,
	"apikey":        SUPABASE_ADMIN_KEY,
})
var SupabaseAuth = gotrue.New(SUPABASE_REFERENCE_ID, SUPABASE_ADMIN_KEY)
var SupabaseStorage = storage_go.NewClient(fmt.Sprintf("%s/storage/v1", SUPABASE_URL), SUPABASE_ADMIN_KEY, nil)
var Meili = meilisearch.NewClient(meilisearch.ClientConfig{
	Host:   MEILI_URL,
	APIKey: GetEnv("MEILI_MASTER_KEY", ""),
})

const MaxSeed = 2147483647
const MaxPromptLen = 500
const MaxWidth = 768
const MaxHeight = 768

const MaxProPixelSteps = 640 * 640 * 50

var ModelIdToModelNameCog = map[string]string{
	"048b4aa3-5586-47ed-900f-f4341c96bdb2": "Stable Diffusion v1.5",
	"897461c5-d8e8-49f6-95a2-1c7d697b8644": "Stable Diffusion v1.5 Inpaint",
	"8acfe4c8-751d-4aa6-8c3c-844e3ef478e0": "Openjourney",
	"36d9d835-646f-4fc7-b9fe-98654464bf8e": "Arcane Diffusion",
	"790c80e1-65b1-4556-9332-196344389572": "Mo-Di Diffusion",
	"48a7031d-43b6-4a23-9f8c-8020eb6862e4": "Ghibli Diffusion",
	"eaa438e1-dbf9-48fd-be71-206f0f257617": "Redshift Diffusion",
	"f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9": "Waifu Diffusion v1.4",
	"fc06f6ab-ed14-4186-a7c0-aaec288d4f38": "22h Diffusion v0.1",
}

var SchedulerIdToSchedulerNameCog = map[string]string{
	"55027f8b-f046-4e71-bc51-53d5448661e0": "K_LMS",
	"6fb13b76-9900-4fa4-abf8-8f843e034a7f": "K_EULER",
	"af2679a4-dbbb-4950-8c06-c3bb15416ef6": "K_EULER_ANCESTRAL",
	"162b6989-f635-4bfe-a2f5-24d4246df318": "PNDM",
	"efee957a-dea5-48b2-a66a-1990dc2265c5": "HEUN",
	"9d175114-9a26-4371-861c-729ba9ecb4da": "DPM",
	"7e98751f-e135-4206-b855-48b141e7b98f": "DPM_SINGLESTEP",
}

var green = color.New(color.FgHiGreen).SprintFunc()
var yellow = color.New(color.FgHiYellow).SprintFunc()
var red = color.New(color.FgHiRed).SprintFunc()

var IsDev = GetEnv("PUBLIC_APP_MODE", "") == "development"

const DBTimeLayout = "2006-01-02T15:04:05.999999-07:00"

var AvailableWidthsFree = []int{512}
var AvailableHeightsFree = []int{512}
var AvailableInferenceStepsFree = []int{30}
var AvailableModelIdsFree = []string{
	"048b4aa3-5586-47ed-900f-f4341c96bdb2",
	"8acfe4c8-751d-4aa6-8c3c-844e3ef478e0",
	"48a7031d-43b6-4a23-9f8c-8020eb6862e4",
	"f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9",
}
var AvailableSchedulerIdsFree = []string{
	"55027f8b-f046-4e71-bc51-53d5448661e0",
	"6fb13b76-9900-4fa4-abf8-8f843e034a7f",
	"af2679a4-dbbb-4950-8c06-c3bb15416ef6",
}

const GenerationOrUpscaleTimeout = time.Second * 30
