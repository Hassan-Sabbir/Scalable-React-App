import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<Home />}></Route>
                <Route path="/test" element={<div>Test</div>}></Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
