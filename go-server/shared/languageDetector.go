package shared

import (
	"log"
	"strings"
	"time"

	"github.com/pemistahl/lingua-go"
)

var LanguageDetector lingua.LanguageDetector

const targetLangFlores = "eng_Latn"
const targetLangMaxScore float64 = 0.9
const targetLangMinDif float64 = 0.1

func PrimeLanguageDetector() {
	LanguageDetector = lingua.NewLanguageDetectorBuilder().FromAllLanguages().Build()
	LanguageDetector.DetectLanguageOf("Hello, world!")
}

func GetPromptFloresCodes(prompt string, negativePrompt string) (string, string) {
	s := time.Now()
	promptFlores := GetFloresCode(prompt)
	negativePromptFlores := GetFloresCode(negativePrompt)
	log.Printf("-- GetPromptFloresCodes took: %v - %s - %s --", green(time.Since(s).Milliseconds(), "ms"), promptFlores, negativePromptFlores)
	return promptFlores, negativePromptFlores
}

func GetFloresCode(text string) string {
	if text == "" {
		return targetLangFlores
	}

	confidenceValues := LanguageDetector.ComputeLanguageConfidenceValues(text)
	if len(confidenceValues) < 1 {
		return targetLangFlores
	}

	detectedLang := strings.ToUpper(confidenceValues[0].Language().String())
	detectedLangFlores, ok := LANG_TO_FLORES[detectedLang]
	if !ok {
		return targetLangFlores
	}
	detectedLangScore := confidenceValues[0].Value()

	var targetLangScore float64 = 0
	for _, confidenceValue := range confidenceValues {
		lang := strings.ToUpper(confidenceValue.Language().String())
		flores, ok := LANG_TO_FLORES[lang]
		if !ok {
			continue
		}
		if flores == targetLangFlores {
			targetLangScore = confidenceValue.Value()
		}
	}

	if targetLangScore > targetLangMaxScore || detectedLangScore-targetLangScore < targetLangMinDif {
		return targetLangFlores
	}

	return detectedLangFlores
}

var LANG_TO_FLORES = map[string]string{
	"AFRIKAANS":   "afr_Latn",
	"ALBANIAN":    "als_Latn",
	"ARABIC":      "arb_Arab",
	"ARMENIAN":    "hye_Armn",
	"AZERBAIJANI": "azj_Latn",
	"BASQUE":      "eus_Latn",
	"BELARUSIAN":  "bel_Cyrl",
	"BENGALI":     "ben_Beng",
	"BOKMAL":      "nob_Latn",
	"BOSNIAN":     "bos_Latn",
	"CATALAN":     "cat_Latn",
	"CHINESE":     "zho_Hans",
	"CROATIAN":    "hrv_Latn",
	"CZECH":       "ces_Latn",
	"DANISH":      "dan_Latn",
	"DUTCH":       "nld_Latn",
	"ENGLISH":     "eng_Latn",
	"ESPERANTO":   "epo_Latn",
	"ESTONIAN":    "est_Latn",
	"FINNISH":     "fin_Latn",
	"FRENCH":      "fra_Latn",
	"GANDA":       "lug_Latn",
	"GEORGIAN":    "kat_Geor",
	"GERMAN":      "deu_Latn",
	"GREEK":       "ell_Grek",
	"GUJARATI":    "guj_Gujr",
	"HEBREW":      "heb_Hebr",
	"HINDI":       "hin_Deva",
	"HUNGARIAN":   "hun_Latn",
	"ICELANDIC":   "isl_Latn",
	"INDONESIAN":  "ind_Latn",
	"IRISH":       "gle_Latn",
	"ITALIAN":     "ita_Latn",
	"JAPANESE":    "jpn_Jpan",
	"KAZAKH":      "kaz_Cyrl",
	"KOREAN":      "kor_Hang",
	"LATVIAN":     "lvs_Latn",
	"LITHUANIAN":  "lit_Latn",
	"MACEDONIAN":  "mkd_Cyrl",
	"MALAY":       "zsm_Latn",
	"MAORI":       "mri_Latn",
	"MARATHI":     "mar_Deva",
	"MONGOLIAN":   "khk_Cyrl",
	"NYNORSK":     "nno_Latn",
	"PERSIAN":     "pes_Arab",
	"POLISH":      "pol_Latn",
	"PORTUGUESE":  "por_Latn",
	"PUNJABI":     "pan_Guru",
	"ROMANIAN":    "ron_Latn",
	"RUSSIAN":     "rus_Cyrl",
	"SERBIAN":     "srp_Cyrl",
	"SHONA":       "sna_Latn",
	"SLOVAK":      "slk_Latn",
	"SLOVENE":     "slv_Latn",
	"SOMALI":      "som_Latn",
	"SOTHO":       "nso_Latn",
	"SPANISH":     "spa_Latn",
	"SWAHILI":     "swh_Latn",
	"SWEDISH":     "swe_Latn",
	"TAGALOG":     "tgl_Latn",
	"TAMIL":       "tam_Taml",
	"TELUGU":      "tel_Telu",
	"THAI":        "tha_Thai",
	"TSONGA":      "tso_Latn",
	"TURKISH":     "tur_Latn",
	"UKRAINIAN":   "ukr_Cyrl",
	"URDU":        "urd_Arab",
	"VIETNAMESE":  "vie_Latn",
	"XHOSA":       "xho_Latn",
	"YORUBA":      "yor_Latn",
	"ZULU":        "zul_Latn",
}
