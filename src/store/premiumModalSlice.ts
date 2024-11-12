import { createSlice } from "@reduxjs/toolkit";

interface premiuimModalInitialState {
  value: boolean;
}
const intitalproductState: premiuimModalInitialState = {
  value: false,
};
export const isPremiumModalOpened = createSlice({
  name: "isPremiumModalOpened",
  initialState: intitalproductState,
  reducers: {
    setModalValue(
      state,
      actions: {
        payload: boolean;
      }
    ) {
      state.value = actions.payload;
    },
  },
});
export default isPremiumModalOpened.reducer;
