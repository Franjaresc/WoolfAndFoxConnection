import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { fetchOrdersByDateRangeAndCompany, generateCSV } from '@/Services/Orders';


// Acción asíncrona para obtener las órdenes y generar el CSV
export const generateInvoiceCSV = createAsyncThunk(
    'csv/generateInvoiceCSV',
    async ({ company, startDate, endDate }, { rejectWithValue }) => {
        try {
            const orders = await fetchOrdersByDateRangeAndCompany(company, startDate, endDate);
            console.log(orders);
            const csvContent = await generateCSV(orders);
            return { csvContent, message: 'Invoice CSV generated successfully' };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const csvSlice = createSlice({
    name: 'csv',
    initialState: {
        status: 'idle',
        message: '',
        error: null,
        csvContent: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateInvoiceCSV.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(generateInvoiceCSV.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
                state.csvContent = action.payload.csvContent;
            })
            .addCase(generateInvoiceCSV.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});


// Selectores
export const selectCSVStatus = (state) => state.csv.status;
export const selectCSVMessage = (state) => state.csv.message;
export const selectCSVError = (state) => state.csv.error;
export const selectCSVContent = (state) => state.csv.csvContent;

export const selectCSVData = createSelector(
    selectCSVStatus,
    selectCSVMessage,
    selectCSVError,
    selectCSVContent,
    (status, message, error, csvContent) => ({
        status,
        message,
        error,
        csvContent,
    })
);

export default csvSlice.reducer;