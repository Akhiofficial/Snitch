import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProductView from "../features/products/pages/SellerProductView";
import SellerDashboard from "../features/products/pages/SellerDashboard";
import ErrorPage from "./ErrorPage";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import Products from "../features/products/pages/Products";
import ProductDetail from "../features/products/pages/ProductDetail";



const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />
    },
    {
        path: "/products",
        element: <Products />
    },
    {
        path: "/product/:id",
        element: <ProductDetail />
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

]);


export default routes;
