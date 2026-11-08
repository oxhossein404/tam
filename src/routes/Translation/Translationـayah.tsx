
import { useState, useEffect } from "react";

import {
    client,
    ayahsList,
    translationsList,
    translationsAyahsList,
    type Ayah,
    type TranslationList,
    type AyahTranslation,
} from "@ntq/sdk";

import { useParams, Link } from "react-router-dom";
import AyahBox from "../surah/ayah";

client.setConfig({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

function SurahPage() {
    const { id } = useParams();

    // آیات عربی
    const [ayah, setayah] = useState<Ayah[]>([]);
    const [lodingayah, setlodingayah] = useState(false);
    const [erroraya, seterrorayah] = useState("");

    // ترجمه ها
    const [translations, setTranslations] = useState<TranslationList[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedTranslator, setSelectedTranslator] = useState("");
    const [translation, setTranslation] = useState<AyahTranslation[]>([]);
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    const [translationError, setTranslationError] = useState("");

    // دریافت آیات عربی
    async function getayahs(surahId: string) {
        try {
            setayah([]);
            seterrorayah("");
            setlodingayah(true);

            const result = await ayahsList({
                query: {
                    surah_id: surahId,
                    limit: 400,
                },
            });

            if (result.error) {
                throw new Error("Failed to fetch ayahs.");
            }

            setayah(result.data ?? []);
        } catch (err: unknown) {
            seterrorayah(
                err instanceof Error ? err.message : "An error occurred."
            );
        } finally {
            setlodingayah(false);
        }
    }

    // دریافت فهرست ترجمه ها
    async function getTranslations() {
        try {
            const result = await translationsList({
                query: {
                    rasm_ol_mushaf: "hafs",
                    limit: 400,
                },
            });

            if (result.error) {
                throw new Error("Failed to fetch translations.");
            }

            setTranslations(result.data ?? []);
        } catch (err: unknown) {
            setTranslationError(
                err instanceof Error ? err.message : "Translation error."
            );
        }
    }

    // دریافت ترجمه آیات
    async function getTranslation(surahId: string, translationId: string) {
        try {
            setTranslation([]);
            setTranslationError("");
            setLoadingTranslation(true);

            const result = await translationsAyahsList({
                path: {
                    id: translationId,
                },
                query: {
                    surah_id: surahId,
                    limit: 400,
                    ordering: "asc",
                },
            });

            if (result.error) {
                throw new Error("Failed to fetch ayah translations.");
            }

            setTranslation(result.data ?? []);
        } catch (err: unknown) {
            setTranslationError(
                err instanceof Error ? err.message : "Translation error."
            );
        } finally {
            setLoadingTranslation(false);
        }
    }

    // دریافت آیات هنگام ورود به سوره
    useEffect(() => {
        if (id) {
            getayahs(id);
        }
    }, [id]);

    // دریافت فهرست ترجمه ها هنگام ورود به صفحه
    useEffect(() => {
        getTranslations();
    }, []);

    // دریافت ترجمه با انتخاب مترجم
    useEffect(() => {
        if (id && selectedTranslator) {
            getTranslation(id, selectedTranslator);
        } else {
            setTranslation([]);
        }
    }, [id, selectedTranslator]);

    // زبان های موجود
    const languages = [
        ...new Set(translations.map((item) => item.language)),
    ];

    // مترجم های زبان انتخاب شده
    const filteredTranslators = translations.filter(
        (item) => item.language === selectedLanguage
    );

    if (lodingayah) {
        return <p>Loading ayahs...</p>;
    }

    if (erroraya) {
        return <p>{erroraya}</p>;
    }

    return (
        <div>
            <Link to="/search">
                Back to Surahs
            </Link>

            {/* انتخاب زبان */}
            <div>
                <label>Select Language</label>

                <select
                    value={selectedLanguage}
                    onChange={(event) => {
                        setSelectedLanguage(event.target.value);
                        setSelectedTranslator("");
                        setTranslation([]);
                    }}
                >
                    <option value="">Select a language</option>

                    {languages.map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
            </div>

            {/* انتخاب مترجم */}
            <div>
                <label>Select Translator</label>

                <select
                    value={selectedTranslator}
                    disabled={!selectedLanguage}
                    onChange={(event) => {
                        setSelectedTranslator(event.target.value);
                    }}
                >
                    <option value="">Select a translator</option>

                    {filteredTranslators.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.translator?.name ?? "Unknown translator"}
                        </option>
                    ))}
                </select>
            </div>

            {translationError && (
                <p>{translationError}</p>
            )}

            {/* نمایش آیات و ترجمه */}
            <div>
                {ayah.map((item, index) => (
                    <div key={item.id}>
                        <AyahBox data={item} />

                        {selectedTranslator && (
                            <div>
                                {loadingTranslation ? (
                                    <p>Loading translation...</p>
                                ) : (
                                    <p>
                                        {translation[index]?.text ??
                                            "Translation not found."}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SurahPage;
