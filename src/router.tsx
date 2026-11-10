import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Search from "./routes/search/search";
import SurahPage from "./routes/surah/surah";
// import Tamren from "./routes/Translation/Translationـayah"

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/search" replace />} />
                <Route path="/search" element={<Search />} />
                <Route path="/surah/:id" element={<SurahPage />} />
                {/* <Route path="/tamren" element={<Tamren/>} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default Router;