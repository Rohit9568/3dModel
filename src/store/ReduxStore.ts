import { configureStore } from "@reduxjs/toolkit";

import loginSlice from "../features/auth/loginSlice";
import signupSlice from "../features/auth/signupSlice";
import subjectsSlice from "./subjectsSlice";
import chapterSlice from "./chapterSlice";
import chapterQuestionsSlice from "./chapterQuestionsSlice";
import currentSelectionSlice from "./currentSelectionSlice";
import simulaionColorSlice from "./simulaionColorSlice";
import userSlice from "./userSlice";
import instituteDetailsSlice from "./instituteDetailsSlice";
import premiumModalSlice from "./premiumModalSlice";
import mainPathSlice from "./mainPath.slice";
import studentSlice from "./studentSlice";
export const store = configureStore({
  reducer: {
    signUpSlice: signupSlice,
    loginSlice: loginSlice,
    subjectSlice: subjectsSlice,
    chapterSlice: chapterSlice,
    chapterQuestionsSlice: chapterQuestionsSlice,
    currentSelectionSlice: currentSelectionSlice,
    currentSimulationColor: simulaionColorSlice,
    currentUser: userSlice,
    premiumModalSlice: premiumModalSlice,
    mainPathSlice: mainPathSlice,
    instituteDetailsSlice: instituteDetailsSlice,
    studentSlice:studentSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
