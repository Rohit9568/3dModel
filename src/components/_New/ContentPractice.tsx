import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Radio,
  Text,
  TextInput,
} from "@mantine/core";
import { SimulationPage } from "../../pages/DetailsPages/SimulationPage";
import { Pages, Tabs } from "../../pages/_New/Teach";
import { ComingSoon } from "./ComingSoon";
import { useEffect, useState } from "react";
import { QuestionType } from "../../@types/QuestionTypes.d";
import { QuestionCard } from "../DetailsPageTab/QuestionCard";
import { QuizCard } from "../DetailsPageTab/QuizCard";
import { chapterQuestions } from "../../store/chapterQuestionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import {
  AddMcqQuestiontoUserTopic,
  AddSubjectiveQuestiontoUserTopic,
  fetchChapterQuestions,
} from "../../features/UserSubject/chapterDataSlice";
import { useNavigate } from "react-router-dom";
import { Worksheet } from "./Worksheet";
import { showNotification } from "@mantine/notifications";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { IconPlus } from "../_Icons/CustonIcons";
const chapterQuestionsActions = chapterQuestions.actions;
interface AddQuizQuestionProps {
  topic: SingleTopicQuestions;
  setLoadingData: (val: boolean) => void;
  onUpdateTopic: (id: string, data: SingleTopicQuestions) => void;
  setSelectedAddType: (data: QuestionType | null) => void;
  chapterId: string;
}

const options = [1, 2, 3, 4];
interface Option {
  text: string;
  isCorrect: boolean;
}
export function AddQuizQuestion(props: AddQuizQuestionProps) {
  const [value, setValue] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>("");
  const [optionsText, setOptionsText] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    const allOptionsFilled = optionsText.every((option) => option !== "");
    setIsFormValid(allOptionsFilled && questionText !== "" && value !== "");
  }, [questionText, optionsText, value]);

  async function formHandler(event: any) {
    event.preventDefault();
    props.setSelectedAddType(null);
    const formData = new FormData(event.target);
    const formDataObj: any = Object.fromEntries(formData.entries());
    const answers: Option[] = [];
    for (let i = 0; i < 4; i++) {
      const isCorrect1: boolean = formDataObj["correctOption"] == i + 1;
      answers.push({
        text: formDataObj[`option${i}`],
        isCorrect: isCorrect1,
      });
    }
    const questionbody = {
      text: formDataObj.text,
      topicId: props.topic._id,
      answers: answers,
      sortOrder: props.topic.mcqQuestions.length,
    };
    props.setLoadingData(true);
    await AddMcqQuestiontoUserTopic({
      id: props.topic._id,
      questionbody: questionbody,
      chapterId: props.chapterId,
    })
      .then((data: any) => {
        props.setLoadingData(false);
        props.onUpdateTopic(props.topic._id, data);
      })
      .catch((error) => {
        props.setLoadingData(false);
        console.log(error);
      });
  }
  return (
    <Flex p={10} direction="column">
      <Text fw={400} fz={18} mb={10}>
        Add Question:
      </Text>
      <form onSubmit={formHandler}>
        <TextInput
          placeholder="Question"
          mb={10}
          name="text"
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <Radio.Group
          value={value}
          orientation="vertical"
          onChange={setValue}
          name="correctOption"
          withAsterisk
        >
          {options.map((x, i) => {
            return (
              <Flex
                align="center"
                justify="space-around"
                style={{
                  width: "100%",
                }}
                key={i}
              >
                <Radio value={`${x}`} />
                <TextInput
                  style={{
                    width: "90%",
                  }}
                  placeholder={`Option ${x}`}
                  name={`option${i}`}
                  onChange={(e) => {
                    const newOptions = [...optionsText];
                    newOptions[i] = e.target.value;
                    setOptionsText(newOptions);
                  }}
                />
              </Flex>
            );
          })}
        </Radio.Group>
        <Button
          onClick={() => {
            showNotification({ message: "Successfully Added Question" });
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_PRACTICE_PAGE_SUBMIT_CLICKED
            );
          }}
          type="submit"
          mt={20}
          disabled={!isFormValid}
          w={"100%"}
        >
          Submit
        </Button>
      </form>
    </Flex>
  );
}

interface AddSubjectiveQuestionProps {
  topic: SingleTopicQuestions;
  setLoadingData: (val: boolean) => void;
  onUpdateTopic: (id: string, data: SingleTopicQuestions) => void;
  setSelectedAddType: (data: QuestionType | null) => void;
  selectedQuestionType: QuestionType;
  chapterId: string;
}

export const AddSubjectiveQuestion = (props: AddSubjectiveQuestionProps) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [answerText, setAnswerText] = useState<string>("");

  const isSubmitDisabled =
    questionText.trim() === "" || answerText.trim() === "";

  async function formHandler(event: any) {
    event.preventDefault();
    props.setSelectedAddType(null);
    const formData = new FormData(event.target);
    const formDataObj: any = Object.fromEntries(formData.entries());
    const questionbody = {
      ...formDataObj,
      sortOrder: props.topic.subjectiveQuestions.length + 1,
      type: props.selectedQuestionType.type,
    };
    props.setLoadingData(true);
    await AddSubjectiveQuestiontoUserTopic({
      id: props.topic._id,
      questionbody: questionbody,
      chapterId: props.chapterId,
    })
      .then((data: any) => {
        props.setLoadingData(false);
        props.onUpdateTopic(props.topic._id, data);
      })
      .catch((error) => {
        props.setLoadingData(false);
        console.log(error);
      });
  }

  return (
    <Flex p={10} direction="column">
      <Text fz={20} fw={700} mb={10}>
        Add Question:
      </Text>
      <form onSubmit={formHandler}>
        <TextInput
          mb={10}
          placeholder="Question"
          name="text"
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <textarea
          style={{
            height: "50vh",
            width: "100%",
            outline: "none",
          }}
          placeholder="Answer"
          name="answer"
          onChange={(e) => setAnswerText(e.target.value)}
        />
        <Button
          onClick={() => {
            showNotification({ message: "Successfully Added Question" });
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_PRACTICE_PAGE_SUBMIT_CLICKED
            );
          }}
          type="submit"
          my={15}
          disabled={isSubmitDisabled}
          w={"100%"}
        >
          Submit
        </Button>
      </form>
    </Flex>
  );
};

interface QuestionButtonProps {
  thisQuestionType: QuestionType;
  selectedQuestionType: QuestionType;
  setSelectedQuestionType: (val: QuestionType) => void;
}
function QuestionButton(props: QuestionButtonProps) {
  return (
    <Button
      variant={
        props.selectedQuestionType === props.thisQuestionType
          ? "filled"
          : "outline"
      }
      onClick={() => {
        props.setSelectedQuestionType(props.thisQuestionType);
        Mixpanel.track(
          WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_FILTER_CLICKED,
          { questionType: props.thisQuestionType.name }
        );
      }}
    >
      {props.thisQuestionType.name}
    </Button>
  );
}

interface QuestionContentProps {
  currentTopicQuestions: SingleTopicQuestions;
  onUpdateTopic: (id: string, data: SingleTopicQuestions) => void;
}
function QuestionsContent(props: QuestionContentProps) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType>(QuestionType.AllQues);
  const [selectedAddType, setSelectedAddType] = useState<QuestionType | null>(
    null
  );
  const chapterId = useSelector<RootState, string | null>((state) => {
    return state.currentSelectionSlice.chapterId;
  });
  return (
    <>
      <Group>
        <QuestionButton
          thisQuestionType={QuestionType.AllQues}
          selectedQuestionType={selectedQuestionType}
          setSelectedQuestionType={setSelectedQuestionType}
        />
        <QuestionButton
          thisQuestionType={QuestionType.LongQues}
          selectedQuestionType={selectedQuestionType}
          setSelectedQuestionType={setSelectedQuestionType}
        />
        <QuestionButton
          thisQuestionType={QuestionType.FillQues}
          selectedQuestionType={selectedQuestionType}
          setSelectedQuestionType={setSelectedQuestionType}
        />
        <QuestionButton
          thisQuestionType={QuestionType.ShortQues}
          selectedQuestionType={selectedQuestionType}
          setSelectedQuestionType={setSelectedQuestionType}
        />
        <QuestionButton
          thisQuestionType={QuestionType.McqQues}
          selectedQuestionType={selectedQuestionType}
          setSelectedQuestionType={setSelectedQuestionType}
        />
        {selectedAddType === null && (
          <Menu position="top-end">
            <Menu.Target>
              <div
                style={{
                  position: "relative",
                  zIndex: 0,
                }}
                onClick={() => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_PRACTICE_PAGE_ADD_QUESTION_CLICKED
                  );
                }}
              >
                <div
                  style={{
                    border: "#2289E9 solid 3px",
                    bottom: "6vh",
                    borderRadius: "50%",
                    padding: "7px",
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                  }}
                >
                  <IconPlus/>
                </div>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  setSelectedAddType(QuestionType.FillQues);
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                    { questionType: QuestionType.FillQues.name }
                  );
                }}
              >
                {QuestionType.FillQues.name}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setSelectedAddType(QuestionType.LongQues);
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                    { questionType: QuestionType.LongQues.name }
                  );
                }}
              >
                {QuestionType.LongQues.name}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setSelectedAddType(QuestionType.ShortQues);
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                    { questionType: QuestionType.ShortQues.name }
                  );
                }}
              >
                {QuestionType.ShortQues.name}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setSelectedAddType(QuestionType.McqQues);
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                    { questionType: QuestionType.McqQues.name }
                  );
                }}
              >
                {QuestionType.McqQues.name}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      <Flex direction="column">
        {(selectedQuestionType === QuestionType.AllQues ||
          selectedQuestionType === QuestionType.McqQues) &&
          props.currentTopicQuestions.mcqQuestions.map((x,i) => {
            return (
              <QuizCard question={x} disabled={false} onLoginClick={() => {}} key={x._id} index={i+1}/>
            );
          })}

        {(selectedQuestionType === QuestionType.AllQues ||
          selectedQuestionType !== QuestionType.McqQues) &&
          props.currentTopicQuestions.subjectiveQuestions.map((x, index) => {
            if (
              x.type === selectedQuestionType.type ||
              selectedQuestionType === QuestionType.AllQues
            ) {
              return (
                <QuestionCard
                  no={index + 1}
                  question={x}
                  disabled={false}
                  onLoginClick={() => {}}
                  key={x._id}
                />
              );
            }
          })}
      </Flex>
      <Modal
        opened={selectedAddType !== null}
        onClose={() => {
          setSelectedAddType(null);
        }}
      >
        {selectedAddType === QuestionType.McqQues &&
          props.currentTopicQuestions &&
          chapterId && (
            <AddQuizQuestion
              topic={props.currentTopicQuestions}
              onUpdateTopic={props.onUpdateTopic}
              setLoadingData={setisLoading}
              setSelectedAddType={setSelectedAddType}
              chapterId={chapterId}
            />
          )}
        {selectedAddType !== QuestionType.McqQues &&
          props.currentTopicQuestions &&
          chapterId &&
          selectedAddType !== null && (
            <AddSubjectiveQuestion
              topic={props.currentTopicQuestions}
              onUpdateTopic={props.onUpdateTopic}
              setLoadingData={setisLoading}
              setSelectedAddType={setSelectedAddType}
              selectedQuestionType={selectedAddType}
              chapterId={chapterId}
            />
          )}
      </Modal>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}

interface ContentPracticeProps {
  topicDetail: SingleTopic | null; 
  currentTab: Tabs;
  OnWorksheetUpload: (name: string, url: string) => void;
  currentChapter: SingleChapter;
  topicQuestionsUpdate: (id: string, data: SingleTopicQuestions) => void;
}

export function ContentPractice(props: ContentPracticeProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentChapterQuestions = useSelector<
    RootState,
    SingleChapterQuestions
  >((state) => {
    return state.chapterQuestionsSlice.currentChapterQuestions;
  });
  const [currentQuestions, setCurrentQuestions] =
    useState<SingleTopicQuestions | null>(null);
  useEffect(() => {
    if(props.topicDetail){
    const currentTopicQuestions = currentChapterQuestions.topics.find(
      (x) => x._id === props.topicDetail?._id
    );
    if (currentTopicQuestions) {
      const allQuestions: {
        _id: string;
        mcqQuestions: McqQuestion[];
        subjectiveQuestions: SubjectiveQuestion[];
      } = {
        _id: currentTopicQuestions._id,
        mcqQuestions: currentTopicQuestions?.mcqQuestions ?? [],
        subjectiveQuestions: currentTopicQuestions?.subjectiveQuestions ?? [],
      };

      currentChapterQuestions.topics.map((x) => {
        if (x._id !== props.topicDetail?._id) {
          allQuestions.mcqQuestions = allQuestions.mcqQuestions.concat(
            x.mcqQuestions
          );
          allQuestions.subjectiveQuestions =
            allQuestions.subjectiveQuestions.concat(x.subjectiveQuestions);
        }
      });

      setCurrentQuestions(allQuestions);
    }
  }
  }, [props.topicDetail, currentChapterQuestions]);


  
  return (
    <Box px={5} pb={50}>
      {props.currentTab === Tabs.Topics && (
        <>
          <Text c="#3174F3" fz="30px" fw="600" mb={30}>
            Activities
          </Text>
          {
            props.topicDetail &&
            <SimulationPage
            page={Pages.Exercise}
            topic={props.topicDetail}
            onUpdateTopic={() => {}}
            isActivity={true}
          />
          }
         
          <Divider size={2} mt={40} mb={35} />
          {currentQuestions && (
            <QuestionsContent
              onUpdateTopic={props.topicQuestionsUpdate}
              currentTopicQuestions={currentQuestions}
            />
          )}
        </>
      )}
      {props.currentTab === Tabs.Worksheets && (
        <Worksheet
          files={props.currentChapter.chapterWorksheets}
          OnFileDrop={props.OnWorksheetUpload}
          tab={props.currentTab}
        />
      )}
      {props.currentTab === Tabs.PYQ && <ComingSoon></ComingSoon>}
    </Box>
  );
}
