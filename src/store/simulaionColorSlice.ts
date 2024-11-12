import { createSlice } from "@reduxjs/toolkit";

interface simulationColorIntitialState{
    color:string
}
const intitalproductState:simulationColorIntitialState={
  color:'white'
}
export const currentSimulationColor=createSlice({
    name:'currentSimulationColor',
    initialState:intitalproductState,
    reducers:{
        setSimulationColor(state,actions:{
            payload:string
        }){
            state.color=actions.payload
        },
    }
})
export default currentSimulationColor.reducer