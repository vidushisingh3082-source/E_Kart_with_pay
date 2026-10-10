import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import shopProductsReducer from "./shop/products-slice";
import cartReducer from "./shop/cart-slice";
import addressReducer from "./shop/address-slice";
import orderReducer from "./shop/order-slice";
import reviewReducer from "./shop/review-slice";
import adminProductsReducer from "./admin/products-slice";
import adminOrderReducer from "./admin/order-slice";
import commonReducer from "./common-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shopProducts: shopProductsReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    review: reviewReducer,
    adminProducts: adminProductsReducer,
    adminOrder: adminOrderReducer,
    common: commonReducer,
  },
});
