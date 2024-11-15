import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './slices/orderSlice'
import companyReducer from './slices/companySlice'
import orderTypeReducer from './slices/orderTypeSlice'
import csvReducer from './slices/csvSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            order: orderReducer,
            company: companyReducer,
            orderType: orderTypeReducer,
            csv: csvReducer,
        }
    })
}