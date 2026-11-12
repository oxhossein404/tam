
import { useState, useEffect } from "react";

import {
    client,
    translationsList,
    type TranslationList
} from "@ntq/sdk";

import { useOptions } from "@/context/optionsContext";

client.setConfig({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

function TranslationsSelected() {

    const [options, setOptions] = useOptions();

    const [translations, setTranslations] = useState<TranslationList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [Languageselected, setLanguageSelected] = useState("");
    const [Translatorselected, setTranslatorSelected] = useState("");

    async function getTranslations() {
        try {
            setTranslations([]);
            setError("");
            setLoading(true);

            const response = await translationsList({
                query: {
                    rasm_ol_mushaf: "hafs"
                }
            });

            if (response.error) {
                throw new Error("Failed to fetch translations");
            }

            const data = response.data ?? [];
            setTranslations(data);

        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTranslations();
    }, []);

    const languages = [
        ...new Set(
            translations.map((item) => item.language)
        )
    ];

    const filteredTranslators = translations.filter(
        (item) => item.language === Languageselected
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>

            <label>Select Language</label>

            <select
                value={Languageselected}
                onChange={(event) => {
                    setLanguageSelected(event.target.value);
                    setTranslatorSelected("");
                }}
            >
                <option value="">Select a language</option>

                {languages.map((language) => (
                    <option key={language} value={language}>
                        {language}
                    </option>
                ))}
            </select>

            <br />

            <label>Select Translator</label>

            <select
                value={Translatorselected}
                onChange={(event) => {
                    const translatorId = event.target.value;

                    setTranslatorSelected(translatorId);

                    setOptions({
                        ...options,
                        translation: translatorId
                    });
                }}
            >
                <option value="">Select a translator</option>

                {filteredTranslators.map((translator) => (
                    <option
                        key={translator.id}
                        value={translator.id}
                    >
                        {translator.translator?.name ?? "Unknown translator"}
                    </option>
                ))}
            </select>

        </div>
    );
}

export default TranslationsSelected;
