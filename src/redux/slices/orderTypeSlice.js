import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchOrderTypes, insertOrderType, updateOrderType, deleteOrderType } from "@/Services/OrderTypes";

// --- Async Actions for Order Types ---
// Fetch all order types
export const getOrderTypes = createAsyncThunk(
    'orderType/getOrderTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchOrderTypes();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Insert a new order type
export const createOrderType = createAsyncThunk(
    'orderType/createOrderType',
    async (orderTypeData, { rejectWithValue }) => {
        try {
            const response = await insertOrderType(orderTypeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update an existing order type
export const updateOrderTypeById = createAsyncThunk(
    'orderType/updateOrderType',
    async (orderTypeData, { rejectWithValue }) => {
        try {
            const response = await updateOrderType(orderTypeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete an order type
export const removeOrderType = createAsyncThunk(
    'orderType/removeOrderType',
    async (orderTypeId, { rejectWithValue }) => {
        try {
            const response = await deleteOrderType(orderTypeId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --- Initial State ---
const initialState = {
    orderTypes: [],
    loading: false,
    error: null,
};

// --- Slice Definition ---
const orderTypeSlice = createSlice({
    name: 'orderType',
    initialState,
    reducers: {
        clearOrderTypes: (state) => {
            state.orderTypes = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Order Types
            .addCase(getOrderTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderTypes.fulfilled, (state, action) => {
                state.orderTypes = action.payload;
                state.loading = false;
            })
            .addCase(getOrderTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Order Type
            .addCase(createOrderType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderType.fulfilled, (state, action) => {
                state.orderTypes.push(action.payload);
                state.loading = false;
            })
            .addCase(createOrderType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Order Type
            .addCase(updateOrderTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderTypeById.fulfilled, (state, action) => {
                const index = state.orderTypes.findIndex(orderType => orderType.Id === action.payload.Id);
                if (index !== -1) {
                    state.orderTypes[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateOrderTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Order Type
            .addCase(removeOrderType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeOrderType.fulfilled, (state, action) => {
                state.orderTypes = state.orderTypes.filter(orderType => orderType.Id !== action.payload);
                state.loading = false;
            })
            .addCase(removeOrderType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// --- Memoized Selectors ---
export const selectOrderTypes = (state) => state.orderType.orderTypes;
export const selectOrderTypeLoading = (state) => state.orderType.loading;
export const selectOrderTypeError = (state) => state.orderType.error;

export const selectOrderTypesData = createSelector(
    [selectOrderTypes, selectOrderTypeLoading, selectOrderTypeError],
    (orderTypes, loading, error) => ({
        orderTypes: orderTypes || [],
        loading,
        error: error || null,
    })
);

// --- Export Actions and Reducer ---
export const { clearOrderTypes } = orderTypeSlice.actions;
export default orderTypeSlice.reducer;
