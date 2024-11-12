import { createSlice } from "@reduxjs/toolkit";

interface userSubjectsState {
  userSubjects: UserClassAndSubjects[];
  currentSubject: SingleSubject;
}
const intitalproductState: userSubjectsState = {
  userSubjects: [],
  currentSubject: {
    _id: "",
    name: "",
    simulationFilter: "",
    className: "",
    tests: [],
    userChapters: [],
  },
};
export const subjects = createSlice({
  name: "subjects",
  initialState: intitalproductState,
  reducers: {
    setUserSubjects(
      state,
      actions: {
        payload: UserClassAndSubjects[];
      }
    ) {
      state.userSubjects = actions.payload;
    },
    setCurrentSubject(
      state,
      actions: {
        payload: SingleSubject;
      }
    ) {
      state.currentSubject = actions.payload;
    },
    setIntialUserChapter(state) {
      state.currentSubject = intitalproductState.currentSubject;
    },
    updateTestIsShared(
      state,
      actions: {
        payload: { testId: string };
      }
    ) {
      state.currentSubject.tests.map((x) => {
        if (x._id === actions.payload.testId) {
          const test1 = x;
          test1.isShared = true;
          return test1;
        }
        return x;
      });
    },
  },
});
export default subjects.reducer;
