import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './reducers/orderSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            order: orderReducer,
        }
    })
}