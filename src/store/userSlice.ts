import { createSlice } from "@reduxjs/toolkit";
import { User1 } from "../@types/User";

interface userintialState {
  user: User1 | null;
}

const userintial = {
  _id: "",
  email: "",
  name: "",
  role: "",
  homeworkshareToken: "",
  instituteId: "",
  instituteName: "",
  subscriptionModelType: null,
  phoneNo: "",
  testRecords: [],
  isOrganic: false,
  schoolIcon: "",
  createdAt: "",
  featureAccess: null,
  userSubjects: [],
  logo: "",
  userFeatureAccess: null,
};
const intitalproductState: userintialState = {
  user: null,
};

export const currentLoginUser = createSlice({
  name: "currentLoginUser",
  initialState: intitalproductState,
  reducers: {
    setUserDetails(
      state,
      actions: {
        payload: any;
      }
    ) {
      state.user = actions.payload;
    },

    setuserInitialState(state) {
      state.user = userintial;
    },
  },
});
export default currentLoginUser.reducer;
