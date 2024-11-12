import { createSlice } from "@reduxjs/toolkit";

interface mainPathIntialState {
  value: string | null;
}
const intitalproductState: mainPathIntialState = {
  value: null,
};
export const mainPath = createSlice({
  name: "mainPath",
  initialState: intitalproductState,
  reducers: {
    setMainPathValue(
      state,
      actions: {
        payload: string;
      }
    ) {
      state.value = actions.payload;
    },
  },
});
export default mainPath.reducer;
