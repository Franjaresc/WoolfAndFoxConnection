import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchOrders, deleteOrder, insertOrder, updateOrder, fetchOrderCountsByMonth } from "@/Services/Orders";

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

// Acción asíncrona para obtener el conteo de órdenes por mes
export const getOrderCountsByMonth = createAsyncThunk(
    'order/getOrderCountsByMonth',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await fetchOrderCountsByMonth({ startDate, endDate });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
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
    orderCountsByMonth: [],
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
                const index = state.orders.findIndex(order => order.Id === action.payload.Id);
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
                console.log(state.orders)
                state.orders = state.orders.filter(order => order.Id !== action.payload);
                state.loading = false;
            })
            .addCase(removeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Caso para getOrderCountsByMonth
            .addCase(getOrderCountsByMonth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderCountsByMonth.fulfilled, (state, action) => {
                state.orderCountsByMonth = action.payload;
                state.loading = false;
            })
            .addCase(getOrderCountsByMonth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selector memoizado
export const selectOrders = (state) => state.order.orders;
export const selectLoading = (state) => state.order.loading;
export const selectError = (state) => state.order.error;
export const selectOrderCountsByMonth = (state) => state.order.orderCountsByMonth;

export const selectOrdersData = createSelector(
    [selectOrders, selectLoading, selectError, selectOrderCountsByMonth],
    (orders, loading, error, orderCountsByMonth) => ({
        orders: orders || [],
        loading,
        error: error || null,
        orderCountsByMonth: orderCountsByMonth || [],
    })
);

// Exporta las acciones del slice
export const { clearOrders } = orderSlice.actions;

// Exporta el reductor del slice
export default orderSlice.reducer;