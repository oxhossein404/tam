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

    const [translation, setTranslation] = useState<AyahTranslation[]>([]);
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
            setTranslation([])
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
            setTranslation(data)
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
            setTranslation([])
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
                {ayah.map((ayah) => (
                    <AyahBox 
                    key={ayah.id}
                    data={ayah}
                    />
                ))}
            </div>

            <div>
                {languages.map}
            </div>
        </div>
    )
} 

export default SurahPage;