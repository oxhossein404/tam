
import { useState, useEffect } from "react";

import {
    client,
    ayahsList,
    translationsAyahsList,
    type Ayah,
    type AyahTranslation,
} from "@ntq/sdk";

import { useParams, Link } from "react-router-dom";

import { useOptions } from "@/context/optionsContext";


import AyahBox from "./ayah";
import TranslationsSelected from "@/components/features/SelectTranslator/TranslationsSelected";

client.setConfig({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

function SurahPage() {

    const { id } = useParams();

    const [options] = useOptions();

    const [ayah, setayah] = useState<Ayah[]>([]);
    const [lodingayah, setlodingayah] = useState<boolean>(false);
    const [erroraya, seterrorayah] = useState<string>("");

    const [texttranslation, setTexttranslation] = useState<AyahTranslation[]>([]);
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    const [translationError, setTranslationError] = useState("");

    async function getayahs(surahId: string) {
        try {
            setayah([]);
            seterrorayah("");
            setlodingayah(true);

            const response = await ayahsList({
                query: {
                    surah_id: surahId,
                },
            });

            if (response.error) {
                throw new Error("Failed to fetch ayahs.");
            }

            const data = response.data ?? [];

            setayah(data);

        } catch (err: unknown) {
            seterrorayah(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred while fetching ayahs."
            );
        } finally {
            setlodingayah(false);
        }
    }

    async function getTranslation(surahId: string, translationId: string) {
        try {
            setTexttranslation([]);
            setTranslationError("");
            setLoadingTranslation(true);

            const response = await translationsAyahsList({
                path: {
                    id: translationId,
                },
                query: {
                    surah_id: surahId,
                },
            });

            if (response.error) {
                throw new Error("Failed to fetch ayah translations.");
            }

            const data = response.data ?? [];

            setTexttranslation(data);

        } catch (err: unknown) {
            setTranslationError(
                err instanceof Error
                    ? err.message
                    : "Translation error."
            );
        } finally {
            setLoadingTranslation(false);
        }
    }

    useEffect(() => {
        if (id) {
            getayahs(id);
        }
    }, [id]);

    useEffect(() => {
        if (id && options.translation) {
            getTranslation(id, options.translation);
        } else {
            setTexttranslation([]);
            setTranslationError("");
        }
    }, [id, options.translation]);

    if (lodingayah) {
        return (
            <p>
                Loading ayahs
                <span className="inline-block animate-bounce text-5xl">.</span>
                <span className="inline-block animate-bounce text-5xl">.</span>
                <span className="inline-block animate-bounce text-5xl">.</span>
            </p>
        );
    }

    if (erroraya) {
        return <p>{erroraya}</p>;
    }

    return (
        <div>

            <Link to="/search">
                Back to Surahs
            </Link>

            <TranslationsSelected />

            {translationError && (
                <p>{translationError}</p>
            )}

            <div>
                {ayah.map((ayah, index) => (
                    <div key={ayah.id}>

                        <AyahBox data={ayah} />

                        {options.translation && (
                            <div>
                                {loadingTranslation ? (
                                    <p>Loading translation...</p>
                                ) : (
                                    <p>
                                        {texttranslation[index]?.text ?? "Translation not found."}
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
