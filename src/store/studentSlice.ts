import { createSlice } from "@reduxjs/toolkit";

interface studentintialState {
  student: StudentsDataWithBatch | null;
}

const studentIntital = {
  _id: "",
  name: "",
  phoneNumber: [],
  parentName: "",
  instituteId: "",
  batchId: "",
  attendance: [],
  paymentRecords: [],
  totalFees: 0,
  dateOfBirth: "",
  address: "",
  totalPaidFees: 0,
  uniqueRoll: -1,
  isInActive: false,
  checked: false,
  totalRewardpoints: 0,
  noofGivenTests: 0,
  profilePic:""
};
const intitalproductState: studentintialState = {
  student: null,
};

export const currentLoginStudent = createSlice({
  name: "currentLoginStudent",
  initialState: intitalproductState,
  reducers: {
    setCurrentLoginStudentDetails(
      state,
      actions: {
        payload: any;
      }
    ) {
      state.student = actions.payload;
    },

    setCurrentLoginStudentInitialState(state) {
      state.student = studentIntital;
    },
  },
});
export default currentLoginStudent.reducer;
