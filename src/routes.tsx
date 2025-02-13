import { BrowserRouter as Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>

            </Route>
        </Routes>
    );
};

export default AppRoutes;
