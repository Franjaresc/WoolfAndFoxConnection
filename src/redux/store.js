import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './reducers/orderSlice'
import companyReducer from './reducers/companySlice'
import orderTypeReducer from './reducers/orderTypeSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            order: orderReducer,
            company: companyReducer,
            orderType: orderTypeReducer,
        }
    })
}