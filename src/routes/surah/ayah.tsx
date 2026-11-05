import type { Ayah } from "@ntq/sdk";

export default function AyahBox(data: Ayah) {
    return(
        <div>
            <h4>{data.number}</h4>
            <p>{data.text}</p>
            <span>{data.sajdah}</span>
        </div>
    );
}