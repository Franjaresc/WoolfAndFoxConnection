import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders } from "@/Services/Orders";

const initialState = {
    orders: [],
    loading: false,
    error: null,
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        ordersLoading: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        ordersFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setOrders: (state, action) => {
            state.orders = action.payload
            state.loading = false;
        }
    }
})

export const getOrders = () => (dispatch) => {
    dispatch(orderSlice.actions.ordersLoading());
    fetchOrders().then(
        (res) => {
            dispatch(orderSlice.actions.setOrders(res))
        }
    ).catch((error) => {
        dispatch(orderSlice.actions.ordersFailed(error.message))
    })
}

export default orderSlice.reducer;