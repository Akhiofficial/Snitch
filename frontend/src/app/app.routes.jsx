import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProductDetails from "../features/products/pages/SellerProductDetail";
import SellerDashboard from "../features/products/pages/SellerDashboard";
import ErrorPage from "./ErrorPage";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import Products from "../features/products/pages/Products";
import ProductDetail from "../features/products/pages/ProductDetail";
import Cart from "../features/cart/pages/cart.jsx";
import OrderSuccess from "../features/cart/pages/OrderSuccess.jsx";



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
        path: "/cart",
        element: <Cart />
    },
    {
        path: "/order-success",
        element: <OrderSuccess />
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
                path: "product/:id",
                element: <Protected 
                role="seller"
                > <SellerProductDetails /> </Protected>
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
