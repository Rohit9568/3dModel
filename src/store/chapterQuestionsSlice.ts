import { createSlice } from "@reduxjs/toolkit";

interface userChapterQuestionsState{
    currentChapterQuestions:SingleChapterQuestions
}
const intitalproductState:userChapterQuestionsState={
    currentChapterQuestions:{
    _id:"",
    topics:[]
  }
}
export const chapterQuestions=createSlice({
    name:'chapterQuestions',
    initialState:intitalproductState,
    reducers:{
        setCurrentChapterQuestions(state,actions:{
            payload:SingleChapterQuestions
        }){
            state.currentChapterQuestions=actions.payload
        },
        setTopicUpdate(state,actions:{
            payload:{
                topic:SingleTopicQuestions,
                id:string
            },
        }){
          const updatedTopic={
            _id:actions.payload.topic._id,
            mcqQuestions:actions.payload.topic.mcqQuestions.reverse(),
            subjectiveQuestions:actions.payload.topic.subjectiveQuestions.reverse(),
          }
            const topics=state.currentChapterQuestions.topics.map((x)=>{
                if(x._id===actions.payload.id) return updatedTopic;
                return x;
            })
            state.currentChapterQuestions.topics=topics;
        },
        updateTopicwithNewId(state,
            actions:{
              payload:{
                oldId:string,
                newId:string
              }
            }){
              if(actions.payload.newId!==actions.payload.oldId){
                state.currentChapterQuestions.topics=state.currentChapterQuestions.topics.map((x)=>{
                  if(x._id===actions.payload.oldId){
                    const topic1=x;
                    topic1._id=actions.payload.newId;
                    return topic1;
                  }
                  return x;
                })
              }
            }
    }
})
export default chapterQuestions.reducer