import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchOrders, deleteOrder, insertOrder, updateOrder } from "@/Services/Orders";

// Acción asíncrona para obtener órdenes
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

// Acción asíncrona para insertar una orden
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await insertOrder(orderData);
            return response; // Retorna la respuesta como el payload
        } catch (error) {
            return rejectWithValue(error.message); // Maneja el error
        }
    }
);

// Acción asíncrona para actualizar una orden
export const updateOrderById = createAsyncThunk(
    'order/updateOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await updateOrder(orderData);
            return response; // Retorna la respuesta como el payload
        } catch (error) {
            return rejectWithValue(error.message); // Maneja el error
        }
    }
);

// Acción asíncrona para eliminar una orden
export const removeOrder = createAsyncThunk(
    'order/removeOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await deleteOrder(orderId);
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
            // Get Orders
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
            })

            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
                state.loading = false;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Order
            .addCase(updateOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderById.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Order
            .addCase(removeOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order.id !== action.payload.id);
                state.loading = false;
            })
            .addCase(removeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selector memoizado
export const selectOrders = (state) => state.order.orders;
export const selectLoading = (state) => state.order.loading;
export const selectError = (state) => state.order.error;

export const selectOrdersData = createSelector(
    [selectOrders, selectLoading, selectError],
    (orders, loading, error) => ({
        orders: orders || [],
        loading,
        error: error || null,
    })
);

// Exporta las acciones del slice
export const { clearOrders } = orderSlice.actions;

// Exporta el reductor del slice
export default orderSlice.reducer;