import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCompany } from "@/Services/Company";

// Define una acción asíncrona para obtener la compañía
export const getCompany = createAsyncThunk(
    'company/getCompany',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchCompany();
            return response; // Retorna la respuesta como el payload
        } catch (error) {
            return rejectWithValue(error.message); // Maneja el error
        }
    }
);

// Estado inicial
const initialState = {
    company: null, // Cambia a null para representar que no hay datos inicialmente
    loading: false,
    error: null,
};

// Crea el slice
const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        clearCompany: (state) => {
            state.company = null; // Limpia los datos de la compañía
            state.error = null;   // Limpia cualquier error
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompany.pending, (state) => {
                state.loading = true;
                state.error = null; // Resetea el error
            })
            .addCase(getCompany.fulfilled, (state, action) => {
                state.company = action.payload; // Guarda la compañía
                state.loading = false; // Finaliza la carga
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.loading = false; // Finaliza la carga
                state.error = action.payload; // Guarda el error
            });
    },
});

// Exporta las acciones del slice
export const { clearCompany } = companySlice.actions;

// Exporta el reductor del slice
export default companySlice.reducer;
