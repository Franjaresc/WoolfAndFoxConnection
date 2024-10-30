import { createSlice } from "@reduxjs/toolkit";
import { fetchCompany } from "@/Services/Company";

const initialState = {
    company: [],
    loading: false,
    error: null,
}

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        companyLoading: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        companyFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setCompany: (state, action) => {
            state.company = action.payload
            state.loading = false;
        }
    }
})

export const getCompany = () => (dispatch) => {
    dispatch(companySlice.actions.companyLoading());
    fetchCompany().then(
        (res) => {
            dispatch(companySlice.actions.setCompany(res))
        }
    ).catch((error) => {
        dispatch(companySlice.actions.companyFailed(error.message))
    })
}

export default companySlice.reducer;