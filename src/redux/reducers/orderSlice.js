import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders } from "@/Services/Orders";

// Define una acción asíncrona para obtener órdenes
export const getOrders = createAsyncThunk(
    'order/getOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchOrders();
            return response; // Retorna la respuesta como el payload
        } catch (error) {
            return rejectWithValue(error.message); // Maneja el error
        }
    }
);

// Estado inicial
const initialState = {
    orders: [],
    loading: false,
    error: null,
};

// Crea el slice
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Exporta las acciones del slice
export const { clearOrders } = orderSlice.actions;

// Exporta el reductor del slice
export default orderSlice.reducer;
