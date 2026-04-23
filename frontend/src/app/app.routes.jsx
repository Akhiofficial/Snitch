import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProductView from "../features/products/pages/SellerProductView";
import SellerDashboard from "../features/products/pages/SellerDashboard";
import ErrorPage from "./ErrorPage";



const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home</h1>,
        errorElement: <ErrorPage />
    },

    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/seller/create-product",
        element: <CreateProduct />
    },
    {
        path: "/seller/view-product/:id",
        element: <SellerProductView />
    },

    {
        path: "/seller/dashboard",
        element: <SellerDashboard />
    }

]);


export default routes;
