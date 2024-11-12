import { createSlice } from "@reduxjs/toolkit";

interface loadingStateInitialState{
    value:boolean
}
const intitalproductState:loadingStateInitialState={
  value:false
}
export const isLoading=createSlice({
    name:'isLoading',
    initialState:intitalproductState,
    reducers:{
        setModalValue(state,actions:{
            payload:boolean
        }){
            state.value=actions.payload
        },
    }
})
export default isLoading.reducer