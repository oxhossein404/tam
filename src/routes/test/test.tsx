
import { useOptions } from "@/context/optionsContext";
import { Link } from "react-router-dom";
import LanguageSelect from "../../components/features/SelectTranslator/TranslationsSelected";

function TestPage() {

    const [options] = useOptions();

    return (
        <div>

            <h1>Test Page</h1>

            <LanguageSelect />

            <h2>{options.translation}</h2>

            <Link to="/search">
                Go To Search
            </Link>

        </div>
    );
}

export default TestPage;
