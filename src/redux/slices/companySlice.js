import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchCompanies } from "@/Services/Company";

// Define una acción asíncrona para obtener la compañía
export const getCompanies = createAsyncThunk(
    'company/getCompany',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchCompanies();
            return response; // Retorna la respuesta como el payload
        } catch (error) {
            return rejectWithValue(error.message); // Maneja el error
        }
    }
);

// Estado inicial
const initialState = {
    company: [], 
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
            .addCase(getCompanies.pending, (state) => {
                state.loading = true;
                state.error = null; // Resetea el error
            })
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.company = action.payload; // Guarda la compañía
                state.loading = false; // Finaliza la carga
            })
            .addCase(getCompanies.rejected, (state, action) => {
                state.loading = false; // Finaliza la carga
                state.error = action.payload; // Guarda el error
            });
    },
});

// Selector memoizado para obtener la compañía
export const selectCompany = (state) => state.company.company;
export const selectLoading = (state) => state.company.loading;
export const selectError = (state) => state.company.error;

export const selectCompanyData = createSelector(
    [selectCompany, selectLoading, selectError],
    (company, loading, error) => ({
        company: company || [],
        loading,
        error: error || null,
    })
);

// Exporta las acciones del slice
export const { clearCompany } = companySlice.actions;

// Exporta el reductor del slice
export default companySlice.reducer;
