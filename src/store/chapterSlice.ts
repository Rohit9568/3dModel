import { createSlice } from "@reduxjs/toolkit";

interface userChapterState {
  currentChapter: SingleChapter;
}
const intitalproductState: userChapterState = {
  currentChapter: {
    _id: "",
    name: "",
    chapterId: "",
    topics: [],
    chapterLessonPlan: [],
    chapterNotes: [],
    chapterPreTestsStatus: {
      isFirstTime: true,
      testTaken: false,
    },
    videos: [],
    chapterWorksheets: [],
    chapterMindmaps: [],
    preRequisiteTopics: [],
    objectives: [],
    chapterPreTest: "",
    introduction: "",
    shared: false,
    unselectedSimulations: [],
    simulations: [],
    sharedBatches: [],
    chapterQuestionsCount: 0
  },
};
export enum UpdateType {
  CLP = "chapterLessonPlan",
  CN = "chapterNotes",
  CW = "chapterWorksheets",
}
export const chapter = createSlice({
  name: "chapter",
  initialState: intitalproductState,
  reducers: {
    setintialStateChapter(state, actions) {
      state = intitalproductState;
    },
    setCurrentChapter(
      state,
      actions: {
        payload: SingleChapter;
      }
    ) {
      state.currentChapter = actions.payload;
      state.currentChapter.topics = state.currentChapter.topics.sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
    },
    setTopicUpdate(
      state,
      actions: {
        payload: {
          topic: SingleTopic;
          id: string;
        };
      }
    ) {
      const topics = state.currentChapter.topics
        .map((x) => {
          if (x._id === actions.payload.id) return actions.payload.topic;
          return x;
        })
        .sort((a, b) => a.sortOrder - b.sortOrder);
      state.currentChapter.topics = topics;
    },
    setTopics(
      state,
      actions: {
        payload: {
          data: SingleTopic[];
        };
      }
    ) {
      state.currentChapter.topics = actions.payload.data;
    },
    updateCurrentChapter(
      state,
      actions: {
        payload: {
          type: UpdateType;
          data: ChapterFile[];
        };
      }
    ) {
      switch (actions.payload.type) {
        case UpdateType.CLP: {
          state.currentChapter.chapterLessonPlan = actions.payload.data;
          break;
        }
        case UpdateType.CN: {
          state.currentChapter.chapterNotes = actions.payload.data;
          break;
        }
        case UpdateType.CW: {
          state.currentChapter.chapterWorksheets = actions.payload.data;
          break;
        }
      }
    },
    updateMindmaps(
      state,
      actions: {
        payload: Mindmap;
      }
    ) {
      state.currentChapter.chapterMindmaps.push(actions.payload);
    },
    updateVideos(
      state,
      actions: {
        payload: IVideos;
      }
    ) {
      state.currentChapter.videos.push(actions.payload);
    },
    removeVideos(
      state,
      actions: {
        payload: string;
      }
    ) {
      state.currentChapter.videos = state.currentChapter.videos.filter(
        (v) => v._id !== actions.payload
      );
    },
    updateMindmapsData(
      state,
      actions: {
        payload: {
          mindmapId: string;
          data: any;
        };
      }
    ) {
      state.currentChapter.chapterMindmaps =
        state.currentChapter.chapterMindmaps.map((x) => {
          if (x._id === actions.payload.mindmapId) {
            return actions.payload.data;
          }
          return x;
        });
    },
    updatePreTest(
      state,
      actions: {
        payload: string;
      }
    ) {
      state.currentChapter.chapterPreTest = actions.payload;
    },
    updateTopicwithNewId(
      state,
      actions: {
        payload: {
          oldId: string;
          newId: string;
        };
      }
    ) {
      if (actions.payload.newId !== actions.payload.oldId) {
        state.currentChapter.topics = state.currentChapter.topics.map((x) => {
          if (x._id === actions.payload.oldId) {
            const topic1 = x;
            topic1._id = actions.payload.newId;
            return topic1;
          }
          return x;
        });
      }
    },
    updatePreTestStatus(
      state,
      actions: {
        payload: {
          isFirstTime: boolean;
          testTaken: boolean;
        };
      }
    ) {
      state.currentChapter.chapterPreTestsStatus = actions.payload;
    },
    updateSharedChapterStatus(
      state,
      actions: {
        payload: {
          shared: boolean;
          batches: string[];
        };
      }
    ) {
      state.currentChapter.shared = actions.payload.shared;
      state.currentChapter.sharedBatches = actions.payload.batches;
    },
  },
});
export default chapter.reducer;
