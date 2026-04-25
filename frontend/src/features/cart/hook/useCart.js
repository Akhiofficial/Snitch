import { useDispatch, useSelector } from "react-redux";
// Api
import { addItem } from "../service/cart.api.js";
// Redux
import { addItem as addItemToCart } from "../state/cart.slice.js";


export const useCart = () => {

    const dispatch = useDispatch();

    async function handleAddItem({productId, variantId}) {

        const data = await addItem({productId, variantId});

        return data;
    }

    return { handleAddItem }
}
