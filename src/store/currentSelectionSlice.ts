import { createSlice } from "@reduxjs/toolkit";

interface CurrentSelectionState {
  subjectId: string | null;
  topicId: string | null;
  chapterId: string | null;
}
const intitalproductState: CurrentSelectionState = {
  subjectId: null,
  chapterId: null,
  topicId: null,
};
export const currentSelection = createSlice({
  name: "currentSelection",
  initialState: intitalproductState,
  reducers: {
    setChapterId(
      state,
      actions: {
        payload: string | null;
      }
    ) {
      state.chapterId = actions.payload;
    },
    setSubjectId(
      state,
      actions: {
        payload: string | null;
      }
    ) {
      state.subjectId = actions.payload;
    },
    setTopicId(
      state,
      actions: {
        payload: string | null;
      }
    ) {
      state.topicId = actions.payload;
    },
  },
});
export default currentSelection.reducer;
