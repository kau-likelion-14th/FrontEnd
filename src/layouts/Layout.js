import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />    
        </>
    );
}
export default Layout;