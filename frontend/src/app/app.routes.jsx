import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProductView from "../features/products/pages/SellerProductView";
import SellerDashboard from "../features/products/pages/SellerDashboard";
import ErrorPage from "./ErrorPage";
import Protected from "../features/auth/components/Protected";



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
        path: "/seller",
        children: [
            {
                path: "create-product",
                element: <Protected 
                role="seller"
                > <CreateProduct /> </Protected>
            },
            {
                path: "view-product/:id",
                element: <Protected 
                role="seller"
                > <SellerProductView /> </Protected>
            },
            {
                path: "dashboard",
                element: <Protected 
                role="seller"
                > <SellerDashboard /> </Protected>
            }
        ]
    }
    // {
    //     path: "/seller/create-product",
    //     element: <CreateProduct />
    // },
    // {
    //     path: "/seller/view-product/:id",
    //     element: <SellerProductView />
    // },

    // {
    //     path: "/seller/dashboard",
    //     element: <SellerDashboard />
    // }

]);


export default routes;
