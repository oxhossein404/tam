import type { Ayah } from "@ntq/sdk";

type AyahBoxProps = {
    data: Ayah;
};

export default function AyahBox({ data }: AyahBoxProps) {
    return (
        <article className="ayah-box">
            <div className="ayah-box__number">
                {data.number}
            </div>

            <p className="ayah-box__text">
                {data.text}
            </p>

                <span className="ayah-box__sajdah">
                    {data.sajdah}
                </span>
        </article>
    );
}