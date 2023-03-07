import {configureStore} from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    },
    devTools: true
})

export default store;