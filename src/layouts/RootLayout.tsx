import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <main className="container mx-auto px-4">
                <Outlet />
            </main>
        </>
    );
};

export default RootLayout;