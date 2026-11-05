
import { useState, useEffect } from "react";
import { client, surahsList, type Surah } from "@ntq/sdk";
import { useNavigate } from "react-router-dom";

client.setConfig({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

function Search() {

    const navigate = useNavigate();

    const [surah, setsurah] = useState<Surah[]>([]);
    const [lodingsurah, setlodingsurah] = useState<boolean>(false);
    const [errorsurah, seterrorsurah] = useState<string>("");

    async function getsurah() {
        try {
            setsurah([]);
            seterrorsurah("");
            setlodingsurah(true);

            const api_surah = await surahsList({
                query: {
                    rasm_ol_mushaf: "hafs",
                },
            });

            if (api_surah.error) {
                throw new Error("Failed to fetch surahs.");
            }

            const data = api_surah.data ?? [];
            setsurah(data);

        } catch (err: unknown) {
            seterrorsurah(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred while fetching surahs."
            );
        } finally {
            setlodingsurah(false);
        }
    }

    useEffect(() => {
        getsurah();
    }, []);

    if (lodingsurah) {
        return (
            <p>
                Loading surahs
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.1s]">.</span>
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.2s]">.</span>
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.3s]">.</span>
            </p>
        );
    }

    if (errorsurah) {
        return (
            <div>
                <p>{errorsurah}</p>
                <button onClick={getsurah}>Retry</button>
            </div>
        );
    }

    return (
        <div>
            {surah.map((surahs) => (
                <div
                    key={surahs.id}
                    onClick={() => navigate(`/surah/${surahs.id}`)}
                >
                    <p>{surahs.number}</p>
                    <p>{surahs.names[0].name}</p>
                    <p>{surahs.period}</p>
                    
                </div>
            ))}
        </div>
    );
}

export default Search;
