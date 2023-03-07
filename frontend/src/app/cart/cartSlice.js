import {createSlice} from '@reduxjs/toolkit';

const initState = {
    cartItems: localStorage.getItem('satwa_cart_items') ? JSON.parse(localStorage.getItem('satwa_cart_items')) : []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;

            
            let isFound = false;

            let newCartItems = state.cartItems.map(item => {
                if(item._id === newItem._id && item.color === newItem.color) {
                    
                    isFound = true;
                    return {
                        ...item,
                        qty: newItem.qty
                    }
                }
                return item;
            })

            if(!isFound) {
                newCartItems.push(newItem);
            }

            
            localStorage.setItem('satwa_cart_items', JSON.stringify(newCartItems));
            state.cartItems = newCartItems;
            return state;
        },
        removeItemFromCart: (state, action) => {
            const itemData = action.payload;

            const updatedCartItems =  state.cartItems.filter(i => !(i._id === itemData.id && i.color === itemData.color));

            state.cartItems = updatedCartItems;
            return state;
        },
        cleanCart: (state, action) => {
            state.cartItems = [];
            localStorage.removeItem('satwa_cart_items');
            return state;
        }
    }
})

export const selectCartItems = state => state.cart.cartItems;

export const {addItemToCart, removeItemFromCart, cleanCart} = cartSlice.actions;

export default cartSlice.reducer;