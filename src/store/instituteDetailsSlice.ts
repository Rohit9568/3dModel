import { createSlice } from "@reduxjs/toolkit";

interface instituteDetailsIntialState {
  instituteDetails: InstituteDetails | null;
}
const intitalproductState: instituteDetailsIntialState = {
  instituteDetails: null,
};
export const instituteDetails = createSlice({
  name: "instituteDetails",
  initialState: intitalproductState,
  reducers: {
    setDetails(
      state,
      actions: {
        payload: {
          name: string;
          _id: string;
          iconUrl: string;
          phoneNumber: string;
          secondPhoneNumber: string;
          address: string;
          featureAccess: AppFeaturesAccess;
          paymentDetailsImageUrl:string;
        };
      }
    ) {
      state.instituteDetails = actions.payload;
    },
  },
});
export default instituteDetails.reducer;
