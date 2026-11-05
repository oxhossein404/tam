import { useState, useEffect } from "react";
import { client, ayahsList, type Ayah } from "@ntq/sdk"
import AyahBox from "./ayah";
import { useParams } from "react-router-dom";

client.setConfig({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})


function  SurahPage(){

    const { id } = useParams();

    const [ ayah, setayah ] = useState<Ayah[]>([])
    const [ lodingayah, setlodingayah ] = useState<boolean>(false)
    const [ erroraya, seterrorayah ] = useState<string>("")

    async function getayahs( surahId : string){
        try{
            setayah([])
            seterrorayah("")
            setlodingayah(true)

            const api_ayahs= await ayahsList({
                query:{
                    surah_id: surahId
                }
            })
            if(!api_ayahs.data){
                throw new Error ("Failed to fetch ayahs.")
            }
            const data = api_ayahs.data ?? []
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
    useEffect(() => {
        if(id){
            getayahs(id)
        }
    }, [id])
    if(lodingayah){
        return(
            <p>
                Loading ayahs
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.1s]">.</span>
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.2s]">.</span>
                <span className="inline-block animate-bounce text-5xl [animation-delay:-0.3s]">.</span>
            </p>
        )
    }
    if(erroraya){
        return(
            <div>
                <p>{erroraya}</p>
            </div>
        )
    }

    return(
        <div>
            {ayah.map((ayah) => (
                <AyahBox 
                key={ayah.id}
                {...ayah}
                />
            ))}
        </div>
    )
} 

export default SurahPage;