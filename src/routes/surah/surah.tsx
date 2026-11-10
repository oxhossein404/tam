import { useState, useEffect } from "react";
import { client, ayahsList, translationsList, translationsAyahsList, type Ayah, type TranslationList, type AyahTranslation,} from "@ntq/sdk";
import { useParams } from "react-router-dom";
import AyahBox from "./ayah";
import { Link } from "react-router-dom";

client.setConfig({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

function  SurahPage(){

    const { id } = useParams();

    const [ ayah, setayah ] = useState<Ayah[]>([])
    const [ lodingayah, setlodingayah ] = useState<boolean>(false)
    const [ erroraya, seterrorayah ] = useState<string>("")

    const [ texttranslation, setTexttranslation] = useState<AyahTranslation[]>([]);
    const [ listtranslations, setListtranslations ] = useState<TranslationList[]>([])
    const [ selectedLanguage, setSelectedLanguage ] = useState("")
    const [selectedlistTranslator, setSelectedlistTranslator] = useState("");
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    const [translationError, setTranslationError] = useState("");


    async function getayahs( surahId : string){
        try{
            setayah([])
            seterrorayah("")
            setlodingayah(true)

            const response= await ayahsList({
                query:{
                    surah_id: surahId,
                    // limit: 400
                }
            })
            if(response.error){
                throw new Error ("Failed to fetch ayahs.")
            }
            const data = response.data ?? []
            setayah(data)
        }
        catch( err : unknown ){
            seterrorayah(
                err instanceof Error
                ? err.message
                : "An unknown error occurred while fetching ayahs."
            )
        }
        finally{
            setlodingayah(false)
        }
    }

    async function gettranslations(){
        try{

            const response = await translationsList({
                query:{
                    rasm_ol_mushaf: "hafs"
                }
            })
            if(response.error){
                throw new Error ("Failed to fetch translations.")
            }
            const data = response.data ?? []
            setListtranslations(data)
        }
        catch(err : unknown){
            setTranslationError(
                err instanceof Error
                ?err.message
                : "Translation error."
            )
        }
    }

    async function getTranslation(surahId: string, translationId: string) {
        try{
            setTexttranslation([])
            setTranslationError("")
            setLoadingTranslation(true)

            const response = await translationsAyahsList({
                path:{
                    id: translationId,
                },
                 query:{
                    surah_id: surahId
                 }
            })
            if(response.error){
                throw new Error("Failed to fetch ayah translations.")
            }
            const data = response.data ?? []
            setTexttranslation(data)
        }
        catch(err : unknown){
            setTranslationError(
                err instanceof Error
                ? err.message
                : "Translation error."
            )    
        }
        finally{
            setLoadingTranslation(false)
        }
    }

    useEffect(() => {
        if(id){
            getayahs(id)
        }
    }, [id])

    useEffect(() => {
        gettranslations()
    }, [])

    useEffect(() => {
        if(id && selectedlistTranslator){
            getTranslation(id, selectedlistTranslator)
        }else{
            setTexttranslation([])
        }
    }, [id, selectedlistTranslator])

    const languages =[
        ...new Set(listtranslations.map((languages) => languages.language))
    ]

    const filteredTranslators = listtranslations.filter((list) => list.language === selectedLanguage)

    if (lodingayah) {
        return(
            <p>
                Loading ayahs
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.1s]">.</span>
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.2s]">.</span>
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.3s]">.</span>
            </p>
        )
    }

    if (erroraya) {
        return(
            <div>
                <p>{erroraya}</p>
            </div>
        )
    }

    return(
        <div>

            <Link to="/search">
                Back to Surahs
            </Link>

            <div>

                <label>Select Language</label>

                <select 
                value={selectedLanguage}
                onChange={(event) => {
                    setSelectedLanguage(event.target.value)
                    setSelectedlistTranslator("")
                    setTexttranslation([])
                }}
                >
                    <option value="">Select a language</option>

                    {languages.map((languages) => (
                        <option value={languages} key={languages}>
                            {languages}
                        </option>
                    ))}
                </select>
            </div>

            <div>

                <label>Select Translator</label>

                <select
                value={selectedlistTranslator}
                disabled={!selectedLanguage}
                onChange={((event) => (
                    setSelectedlistTranslator(event.target.value)
                ))}
                >
                    <option value="">Select a translator</option>

                    {filteredTranslators.map((translators) => (
                        <option key={translators.id} value={translators.id}>
                            {translators.translator?.name?? "Unknown translator"}
                        </option>
                    ))}
                </select>
            </div>
            {translationError && (
                <p>{translationError}</p>
            )}

            <div>
                {ayah.map((ayah,Translation ) => (
                    <div key={ayah.id}>
                        <AyahBox 
                        key={ayah.id}
                        data={ayah}
                        />

                        {selectedlistTranslator && (
                            <div>
                                {loadingTranslation ?(
                                    <p>Loading translation...</p>
                                ) : (
                                    <p>
                                        {texttranslation[Translation]?.text ?? "Translation not found."}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                ))}
            </div>


        </div>
    )
} 

export default SurahPage;