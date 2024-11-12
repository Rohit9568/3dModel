import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Tooltip,
  Transition,
  createStyles,
  useMantineTheme
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { useIntersection, useMediaQuery } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
import { marked } from "marked";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  fetchEasyTheoryByTopicId,
  fetchExamplesByTopicId,
  fetchHardTheoryByTopicId,
} from "../../../features/topic/topicSlice";
import useFeatureAccess from "../../../hooks/useFeatureAccess";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { chapterQuestions } from "../../../store/chapterQuestionsSlice";
import { chapter } from "../../../store/chapterSlice";
import { currentSelection } from "../../../store/currentSelectionSlice";
import { subjects } from "../../../store/subjectsSlice";
import {
  isHTML,
  reduceImageScaleAndAlignLeft,
} from "../../../utilities/HelperFunctions";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import AddContent from "../../TeachPage/AddContent";
import AddContentModal from "../../TeachPage/AddContentModal";
import DeleteContentModal from "../../TeachPage/DeleteContentModal";
import SimulationsCarousel from "../../TeachPage/SimulationsCarousel";
import VideoCarousel from "../../TeachPage/VideoCarousel";
import {
  IconDeleteContent,
  IconEditContent,
  IconShowVideo,
  IconTeachAddContent
} from "../../_Icons/CustonIcons";
import { HtmlEdit } from "../ContentLearn";
import { CarouselTabs } from "./ModifiedOptionsSim";
const OpenAi = require("openai");

const chapterActions = chapter.actions;
const subjectActions = subjects.actions;
const currentSelectionActions = currentSelection.actions;
const chapterQuestionsActions = chapterQuestions.actions;
const openai = new OpenAi({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const useStyles = createStyles((theme) => ({
  heading: {
    color: "#3174F3",
    fontSize: "30px",
    fontWeight: 600,
  },
  modal: {
    background: "white",
  },
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));

enum TheoryLevel {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum Tabs1 {
  theory = "undefined",
  resources = "resources",
  mindmap = "mindmap",
  questionbank = "questionbank",
}

interface TheorySectionProps {
  topic: SingleTopic;
  setLoadingData: (val: boolean) => void;
  currentSubjectName: string;
  currenClassName: string;
  theoryLevel: string;
  exampleState: boolean;
  singleChapter: SingleChapter;
  isUpdateTheory: boolean;
  setisUpdateTheory: (val: boolean) => void;
  onUpdateTopic: (id: string, data: SingleTopic) => void;
  selectedTopic: SingleTopic;
  viewportRef: any;
}

export function TheorySection(props: TheorySectionProps) {
  const theme = useMantineTheme();
  const [theorytobeshown, setTheorytobeShown] = useState<string>(
    props.topic.theory
  );
  const [exampleText, setExampleText] = useState<string>("<br>");
  const [addMorExamplesPressed, setAddMoreExamplesPressed] =
    useState<boolean>(false);
  const [examples, setExamples] = useState<string | null>(null);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [sliderValue, setSliderValue] = useState<TheoryLevel>(
    TheoryLevel.MEDIUM
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editorContent1, setEditorContent1] = useState<string>(
    props.topic.theory ?? ""
  );

  const scrollToElement = () => {
    const targetElement = document.querySelector(`.topic-${props.topic._id}`);

    if (targetElement) {
      props.viewportRef.current.scrollTo({
        top:
          props.viewportRef.current.scrollTop +
          targetElement.getBoundingClientRect().bottom -
          200,
        behavior: "smooth", // optional for smooth scrolling
      });
    }
  };
  useEffect(() => {
    if (props.isUpdateTheory) {
      props.setisUpdateTheory(true);
    }
  }, [props.isUpdateTheory]);

  function addMoreExamplesHandler() {
    props.setLoadingData(true);
    Mixpanel.track(
      WebAppEvents.TEACHER_APP_LEARN_PAGE_ADD_MORE_EXAMPLES_CLICKED
    );
    fetchExamplesByTopicId({
      _id: props.topic.topicId,
      subjectName: props.currentSubjectName,
      className: props.currenClassName,
      chapterName: props.singleChapter.name,
    })
      .then((x: any) => {
        props.setLoadingData(false);
        setExamples(x);
      })
      .catch((e) => {
        props.setLoadingData(false);
        console.log(e);
      });
  }

  async function generateExamples(data: {
    chapterName: string;
    topicName: string;
    className: string;
    subjectName: string;
    originalTheory: string;
  }) {
    try {
      setIsLoading(true);
      const { response } = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
      I am a teacher, of ${data.className} ${data.subjectName} teaching my students chapter ${data.chapterName} and the topic is ${data.topicName} , please provide 5-10 examples that These examples should be concise and relevant to help clarify the concept for better understanding. and after each point send <br> tag also.
     `,
          },
        ],
        stream: true,
      });
      const reader = response.body.getReader();
      // scrollToElement()
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const chunk = await reader.read();
        const { done, value } = chunk;
        if (done) {
          setIsLoading(false);
          setExamples(exampleText);
          break;
        }

        const decoderChunk = decoder.decode(value);
        const lines = decoderChunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            if (props.isUpdateTheory)
              setExampleText((prev) => `${prev}${content}`);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (sliderValue === TheoryLevel.EASY) {
      props.setLoadingData(true);
      fetchEasyTheoryByTopicId({
        _id: props.topic.topicId,
        subjectName: props.currentSubjectName,
        className: props.currenClassName,
        chapterName: props.singleChapter.name,
      })
        .then((x: any) => {
          props.setLoadingData(false);
          setTheorytobeShown(x);
        })
        .catch((e) => {
          props.setLoadingData(false);
          console.log(e);
        });
    } else if (sliderValue === TheoryLevel.MEDIUM) {
      setTheorytobeShown(props.topic.theory);
    } else if (sliderValue === TheoryLevel.HARD) {
      props.setLoadingData(true);
      fetchHardTheoryByTopicId({
        _id: props.topic.topicId,
        subjectName: props.currentSubjectName,
        className: props.currenClassName,
        chapterName: props.singleChapter.name,
      })
        .then((x: any) => {
          props.setLoadingData(false);
          setTheorytobeShown(x);
        })
        .catch((e) => {
          props.setLoadingData(false);
          console.log(e);
        });
    }
  }, [sliderValue, props.topic]);

  const markdownText = `${theorytobeshown ?? ""}`;
  const htmlText = marked(markdownText);
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlText;
  const images = tempElement.querySelectorAll("img");
  images.forEach((image) => {
    image.setAttribute("width", "300");
    image.setAttribute("height", "250");
  });
  const modifiedHtml = tempElement.innerHTML;

  function handleSliderChange(e: any) {
    props.setisUpdateTheory(false);
    const val = e.target.value;
    if (val >= 0 && val < 0.33) {
      setSliderValue(TheoryLevel.EASY);
    } else if (val >= 0.33 && val < 0.67) {
      setSliderValue(TheoryLevel.MEDIUM);
    } else if (val >= 0.67 && val <= 1) {
      setSliderValue(TheoryLevel.HARD);
    }
  }
  function scrollToBottom() {
    var sunEditor: any = document.querySelector(".sun-editor-editable");
    if (sunEditor) sunEditor.scrollTop = sunEditor.scrollHeight;
  }
  useEffect(() => {
    if (exampleText !== "") {
      scrollToBottom();
      setEditorContent1(`${props?.selectedTopic?.theory}${exampleText}`);
    }
  }, [exampleText, props.isUpdateTheory]);

  return (
    <>
      <div>
        <Text fz={22} fw={600}>
          {props.topic.name}
        </Text>
        <TheoryContainer>
          {isHTML(theorytobeshown ?? "") && isMd && (
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: reduceImageScaleAndAlignLeft(theorytobeshown) ?? "",
                }}
                // style={{
                //   padding: '0'
                // }}
              />
            </Text>
          )}
          {isHTML(theorytobeshown ?? "") && !isMd && (
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: theorytobeshown ?? "",
                }}
                // style={{
                //   padding: '0'
                // }}
              />
            </Text>
          )}

          {!isHTML(theorytobeshown ?? "") && (
            <div
              dangerouslySetInnerHTML={{ __html: modifiedHtml }}
              style={{
                padding: "0",
              }}
            />
          )}
        </TheoryContainer>
      </div>
      <Modal
        opened={props.isUpdateTheory}
        centered
        onClose={() => {
          props.setisUpdateTheory(false);
        }}
        title="Update Theory"
        size="auto"
        styles={{
          title: {
            fontWeight: 700,
          },
        }}
        zIndex={999}
      >
        <div style={{ width: isMd ? "80vw" : "60vw", height: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <Group mb={10}>
              <span>{props?.selectedTopic?.name}</span>
              <Button
                onClick={() => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_LEARN_PAGE_ADD_MORE_EXAMPLES_CLICKED
                  );
                  setExampleText("<br>");
                  generateExamples({
                    subjectName: props.currentSubjectName,
                    className: props.currenClassName,
                    topicName: props?.selectedTopic?.name,
                    chapterName: props.singleChapter.name,
                    originalTheory: props?.selectedTopic?.theory,
                  });
                }}
                variant="outline"
                disabled={addMorExamplesPressed || isLoading}
                style={{
                  border: "1px solid #193A65",
                  color: "#193A65",
                  borderRadius: "12px",
                }}
                size="xs"
              >
                Add More Examples
              </Button>
            </Group>
          </div>
          <Flex
            w={"100%"}
            // mt={"2rem"}
            justify={"space-between"}
            align={"center"}
            direction={`${isMd ? "column" : "row"}`}
            gap={"sm"}
          >
            {/* {props.topic !== null && isHTML(theorytobeshown) && ( */}
            <HtmlEdit
              topicDetail={props?.selectedTopic}
              onClose={() => {
                // setShowEdit(false);
              }}
              onUpdateTopic={props.onUpdateTopic}
              chapterId={props.singleChapter._id}
              setloadingData={props.setLoadingData}
              examples={exampleText}
              isLoading={isLoading}
              setAddMoreExamplesPressed={setAddMoreExamplesPressed}
              setonCloseClick={() => {}}
              editorContent={editorContent1}
              setEditorContent={setEditorContent1}
            />
            {/* )} */}
            {/* {props.topic !== null && !isHTML(theorytobeshown) && (
              <MarkdownEdit
                topicDetail={props.topic}
                onClose={() => {
                  // setShowEdit(false);
                }}
                onUpdateTopic={props.onUpdateTopic}
                chapterId={props.singleChapter._id}
                setloadingData={props.setLoadingData}
              />
            )} */}
          </Flex>
        </div>
      </Modal>
    </>
  );
}

const TheoryContainer = styled.div`
  padding-top: 0;
  @media (max-width: 1000px) {
    width: 65vw;
  }
  @media (max-width: 820px) {
    width: 85vw;
  }
  @media (max-width: 350px) {
    width: 80vw;
  }
`;

interface MainPageProps {
  selectedSubject: SingleSubject;
  selectedChapter: SingleChapter;
  selectedTopic: SingleTopic | null;
  chapterChangeHandler: (id: string) => void;
  topicChangeHandler: (id: string) => void;
  currentTab: string | null;
  viewportRef: any;
  setloadingData: (val: boolean) => void;
  isLoading: boolean;
  handleViewAllButton: (a: any) => void;
  setModalSimulation: (
    a: {
      name: string;
      _id: string;
      isSimulationPremium: boolean;
      videoUrl: string;
    } | null
  ) => void;
  simulationClickHandler: (name: string, _id: string) => void;
  videos: IVideos[];
  setCurrentTab: (a: any) => void;
  acitveTab: any;
  setSelectedTopic: (topic: SingleTopic) => void;
  showSimulations: boolean;
}
export function MainPage(props: MainPageProps) {
  const { classes, theme } = useStyles();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [simulations, setSimulations] = useState<any[]>([]);
  const initialStates = Array(props?.selectedChapter?.topics.length).fill(
    TheoryLevel.MEDIUM
  );
  const initialisupdatetheory = Array(
    props?.selectedChapter?.topics.length
  ).fill(false);
  const initialExampleStates = Array(
    props?.selectedChapter?.topics.length
  ).fill(false);
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });

  const [theorylevel, setTheoryLevel] = useState<string[]>(initialStates);
  const [exampleState, setExampleState] =
    useState<boolean[]>(initialExampleStates);
  const [isUpdateTheory, setisUpdateTheory] = useState<boolean[]>(
    initialisupdatetheory
  );
  const [isDeleteContentModalOpen, setIsDeleteContentModalOpen] =
    useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  // const [selectedTopic, setSelectedTopic] = useState<SingleTopic | null>()
  const myDivRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    myDivRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    setExampleState(initialExampleStates);
  }, [props.selectedChapter]);

  useEffect(() => {
    if (props.viewportRef && props.viewportRef.current)
      props.viewportRef.current.scrollTo(0, 0);
  }, [props.currentTab]);
  useEffect(() => {
    setisUpdateTheory(initialisupdatetheory);
  }, [props.selectedChapter]);

  const data = [TheoryLevel.EASY, TheoryLevel.MEDIUM, TheoryLevel.HARD];

  useEffect(() => {
    if (props.selectedChapter && props.selectedChapter.simulations) {
      const simulations1 = props?.selectedChapter?.simulations.filter((x) => {
        const found = props.selectedChapter.unselectedSimulations.find(
          (y) => y === x._id
        );
        if (found) {
          return false;
        } else {
          return true;
        }
      });
      setSimulations(simulations1);
    }
  }, [props.selectedChapter]);
  async function topicUpdate(id: string, data: SingleTopic) {
    dispatch(chapterActions.setTopicUpdate({ id, topic: data }));
    dispatch(
      chapterQuestionsActions.updateTopicwithNewId({
        oldId: id,
        newId: data._id,
      })
    );
  }

  const allTopicsData = props?.selectedChapter?.topics.map((x) => {
    return {
      value: x._id,
      label:
        x?.name?.length < (isMd ? 15 : 20)
          ? x?.name
          : x?.name.substring(0, isLg ? 15 : 15) + "...",
    };
  });

  const itemRefs = useRef<any>([]);

  const scrollToElement = (no: number, id: string) => {
    const targetElement = document.querySelector(`.topic-${id}`);

    if (targetElement) {
      const offset =
        targetElement.getBoundingClientRect().top -
        props.viewportRef.current.getBoundingClientRect().top;
      props.viewportRef.current.scrollTo({
        top:
          props.viewportRef.current.scrollTop +
          targetElement.getBoundingClientRect().top -
          100,
        behavior: "smooth", // optional for smooth scrolling
      });
    }
  };

  // useEffect(()=>{
  //   setSelectedTopic(props?.selectedTopic)
  // }, [allTopicsData, props?.selectedTopic])

  useEffect(() => {
    const handleScroll = () => {
      const topics = props?.selectedChapter?.topics;
      topics.forEach((topic, index) => {
        const topicElement = document.querySelector(`.topic-${topic._id}`);
        if (topicElement) {
          const rect = topicElement.getBoundingClientRect();

          if (rect.top < 200 && rect.bottom > 0) {
            props.topicChangeHandler(topic._id);
          }
        }
      });
    };
    if (props.viewportRef && props.viewportRef.current)
      props.viewportRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (props.viewportRef && props.viewportRef.current)
        props.viewportRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [props?.selectedChapter?.topics]);

  function scroll(id: string) {
    const foundIndex = props?.selectedChapter?.topics.findIndex(
      (x) => x._id === id
    );
    console.log("myLog scroll:", id);
    scrollToElement(foundIndex, id);
  }

  function tabChangeHandler(tab: Tabs1) {
    navigate(
      `${mainPath}/teach/study/${props.selectedSubject._id}/${props.selectedChapter._id}?tab=${tab}`
    );
  }

  const [foundIndex, setFoundIndex] = useState<number>();
  useEffect(() => {
    setFoundIndex(
      props?.selectedChapter?.topics.findIndex(
        (x) => x._id === (props.selectedTopic ? props.selectedTopic._id : "")
      )
    );
  }, [props?.selectedChapter?.topics, props?.selectedTopic]);
  const { ref, entry } = useIntersection({
    root: props.viewportRef.current,
    threshold: 0,
  });
  useEffect(() => {
    const element: any = document.querySelector(".app-navbar");
    if (entry && !entry.isIntersecting) {
      if (element) {
        element.style.boxShadow = "none";
      }
    } else {
      if (element) {
        element.style.boxShadow = "0px 0px 16px 0px rgba(0, 0, 0, 0.10)";
      }
    }
  }, [entry]);
  const divRef = useRef<any>(null);

  const changeTopPosition = (newTop: number) => {
    if (divRef.current) {
      divRef.current.style.top = newTop + "px";
    }
  };
  async function teachertopicsUpdate(id: string, data: SingleTopic) {
    dispatch(chapterActions.setTopicUpdate({ id, topic: data }));
    dispatch(
      chapterQuestionsActions.updateTopicwithNewId({
        oldId: id,
        newId: data._id,
      })
    );
    dispatch(currentSelectionActions.setTopicId(data._id));
  }
  const [playSimulation, setPlaySimulation] = useState<{
    name: string;
    _id: string;
  } | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("play");

  useEffect(() => {
    if (!paramValue) {
      setPlaySimulation(null);
    }
  }, [paramValue]);

  function simulationClickHandler(name: string, _id: string) {
    setPlaySimulation({
      name,
      _id,
    });
  }

  const topicId = queryParams.get("topicId");
  useEffect(() => {
    if (topicId) {
      const topic = props?.selectedChapter?.topics.find(
        (x: any) => x._id === topicId
      );
      const orignaltopic = props?.selectedChapter?.topics.find(
        (x) => x.topicId === topicId
      );
      if (topic) {
        props.topicChangeHandler(topic._id);
        // props.viewportRef.current.scrollTo(600,600)
        scroll(topic._id);
      } else if (orignaltopic) {
        {
          props.topicChangeHandler(orignaltopic._id);
          // props.viewportRef.current.scrollTo(600,600)
          scroll(orignaltopic._id);
        }
      }
    }
  }, [topicId, props.selectedChapter]);

  const handleEditContent = () => {
    Mixpanel.track(WebAppEvents.TEACHER_APP_LEARN_PAGE_EDIT_THEORY_CLICKED);
    setisUpdateTheory((prev) => {
      const prev1 = prev.map((x, i) => {
        if (i === foundIndex) {
          return true;
        }
        return false;
      });
      return prev.length === 0 ? [true] : prev1;
    });
  };

  const { isFeatureValidwithNotification, UserFeature } = useFeatureAccess();

  return (
    <Stack
      style={{
        position: "relative",
      }}
      w="100%"
      h="100%"
      className="thisOneOrNot"
    >
      <Flex
        sx={{
          flexDirection: `${!isMd ? "row" : "column"}`,
          gap: "15px",
          // padding: `${isMd ? '15px' : '30px'}`,
          // maxWidth: '100vw',
          margin: `${isSm ? "0 10px" : "0 20px"}`,
        }}
      >
        <CarouselsConatiner className="teach-carousel-container" ref={ref}>
          <SimulationCarouselContainer color="#CFECFE" className="thisone">
            <SimulationInfoContainer>
              Simulations
              <p>Simulations are a powerful educational tool.</p>
              <button
                onClick={() => {
                  if (
                    props.showSimulations &&
                    isFeatureValidwithNotification(UserFeature.SIMULATIONS)
                  )
                    props?.handleViewAllButton(CarouselTabs.simulation);
                }}
              >
                View All
              </button>
            </SimulationInfoContainer>
            {simulations.length !== 0 ? (
              <SimulationsCarousel
                simulations={simulations}
                simulationClickHandler={(name: string, _id: string) => {
                  if (
                    props.showSimulations &&
                    isFeatureValidwithNotification(UserFeature.SIMULATIONS)
                  ) {
                    props.simulationClickHandler(name, _id);
                  }
                }}
                setModalSimulation={(val) => {
                  if (
                    props.showSimulations &&
                    isFeatureValidwithNotification(UserFeature.SIMULATIONS)
                  ) {
                    props.setModalSimulation(val);
                  }
                }}
              />
            ) : (
              <img
                alt="Person"
                src={require("../../../assets/personLaptop.png")}
                style={{
                  // width: isMd ? "45%" : "40%",
                  aspectRatio: "1/1",
                  maxHeight: `${isMd ? "200px" : "250px"}`,
                }}
              />
            )}
          </SimulationCarouselContainer>
          <VideoCarousel
            videos={props?.videos}
            setCurrentTab={props?.setCurrentTab}
          />
        </CarouselsConatiner>
      </Flex>

      <TeachInteractContainer>
        <ContentContainer>
          {allTopicsData.length > 0 ? (
            <>
              <Flex
                // justify={!isMd ? 'left' : 'space-between'}
                align="center"
                bg={"white"}
                // w={'100%'}
                sx={{
                  position: "sticky",
                  top: "0px",
                  // maxWidth: '100vw',
                }}
                ref={divRef}
              >
                <Stack w="100%">
                  <Flex
                    align={`${isLg ? "flex-start" : "center"}`}
                    justify="flex-start"
                    style={{
                      background: "white",
                      zIndex: 99999999,
                      paddingTop: "10px",
                      width: "100%",
                    }}
                    direction={!isLg ? "row" : "column"}
                  >
                    <DropdownContainer className="dropdown-container">
                      <StyledSelect
                        data={allTopicsData}
                        w="70%"
                        styles={{
                          input: {
                            height: "40px",
                            borderRadius: "12px",
                            border: "0",
                            // color: '#193A65'
                          },
                          rightSection: { pointerEvents: "none" },
                        }}
                        dropdownPosition="bottom"
                        rightSection={
                          <IconChevronDown size={14} color="#193A65" />
                        }
                        value={
                          props.selectedTopic ? props.selectedTopic._id : null
                        }
                        onChange={(e) => {
                          if (e) {
                            const topic = props?.selectedChapter?.topics.find(
                              (x) => x._id === e
                            );
                            Mixpanel.track(
                              WebAppEvents.TEACHER_APP_TOPIC_CLICKED,
                              {
                                name: topic?.name,
                                chapterName: props.selectedChapter.name,
                                className: props.selectedSubject.className,
                              }
                            );
                            props.topicChangeHandler(e);
                            scroll(e);
                          }
                        }}
                        onClick={() => {
                          Mixpanel.track(
                            WebAppEvents.TEACHER_APP_LEARN_PAGE_TOPIC_DROPDOWN_CLICKED
                          );
                        }}
                        size="md"
                      />
                      <Button
                        variant="outline"
                        style={{
                          marginLeft: `${isMd ? "auto" : "10px"}`,
                          padding: "0",
                          border: 0,
                        }}
                        sx={{
                          ":hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                        size="md"
                        onClick={handleEditContent}
                        leftIcon={
                          <Box w="24px" h="24px" style={{ paddingRight: "0" }}>
                            <IconEditContent col="#193A65" />
                          </Box>
                        }
                      />
                      <Button
                        variant="outline"
                        style={{
                          // marginLeft: '10px',
                          padding: "0",
                          border: 0,
                          marginRight: "0",
                        }}
                        sx={{
                          ":hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                        size="md"
                        onClick={() => {
                          setIsDeleteContentModalOpen(true);
                        }}
                        leftIcon={
                          <Box
                            w="24px"
                            h="24px"
                            style={{
                              paddingRight: "0",
                              marginTop: "5px",
                              marginRight: "0",
                            }}
                          >
                            <IconDeleteContent col="#193A65" />
                          </Box>
                        }
                      />
                      {!isMd && (
                        <Button
                          variant="outline"
                          style={{
                            color: "black",
                            borderRadius: "24px",
                            display: "flex",
                            alignItems: "center",
                            width: `${isSm ? "auto" : "144px"}`,
                            border: `${isSm ? "0" : "1px solid #808080"}`,
                          }}
                          className="add-content-button"
                          size="md"
                          ml={isMd ? (isSm ? 0 : 15) : 25}
                          onClick={() => {
                            setIsAddContentModalOpen(true);
                          }}
                          // mr={isMd ? 20 : 0}
                          leftIcon={
                            <Box>
                              <IconTeachAddContent />
                            </Box>
                          }
                        >
                          {isSm ? "" : "Add Content"}
                        </Button>
                      )}
                    </DropdownContainer>
                    <Transition
                      mounted={entry && !entry.isIntersecting}
                      transition="fade"
                      duration={150}
                      timingFunction="ease-in"
                    >
                      {(styles) => (
                        <Flex
                          mr={isMd ? 0 : 20}
                          pt={10}
                          style={{
                            order: isMd ? 1 : 2,
                            padding: "5px 10px",
                            justifyContent: "flex-start",
                            width: `${isMd ? "100%" : "auto"}`,
                          }}
                          // w={isMd ? '100%' : '25%'}
                        >
                          <Tooltip label="simulations" position="bottom">
                            <div
                              style={{
                                cursor: "pointer",
                                // marginRight: `${isSm ? '10px' : '40px'}`,
                                // marginLeft: '10px'
                              }}
                              onClick={props?.handleViewAllButton}
                            >
                              <img
                                src={require("./../../../assets/Simulationsticky.png")}
                                width="45px"
                                height="45px"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip label="videos" position="bottom">
                            <div
                              style={{
                                cursor: "pointer",
                                width: `${isMd ? "35px" : "45px"}`,
                                height: `${isMd ? "35px" : "45px"}`,
                                marginLeft: "20px",
                              }}
                              onClick={() => {
                                props?.setCurrentTab(CarouselTabs.video);
                              }}
                            >
                              <IconShowVideo />
                            </div>
                          </Tooltip>
                          {isMd ? (
                            <Button
                              variant="outline"
                              style={{
                                color: "black",
                                borderRadius: "24px",
                                display: "flex",
                                alignItems: "center",
                                width: "144px",
                                border: "1px solid #808080",
                                marginLeft: "auto",
                              }}
                              className="add-content-button"
                              size="md"
                              onClick={() => {
                                setIsAddContentModalOpen(true);
                              }}
                              // mr={isMd ? 20 : 0}
                              leftIcon={
                                <Box>
                                  <IconTeachAddContent />
                                </Box>
                              }
                            >
                              Add Content
                            </Button>
                          ) : null}
                        </Flex>
                      )}
                    </Transition>
                  </Flex>
                </Stack>
              </Flex>
              {/* </Stack> */}
              {props?.selectedChapter?.topics?.map((topic, i) => {
                return (
                  <div
                    style={{
                      padding: `${isMd ? "15px" : "30px"}`,

                      // marginTop: "-20px",
                    }}
                    className={`topic-${topic._id}`}
                    ref={(el) => (itemRefs.current[i] = el)}
                    key={topic._id}
                  >
                    <TheorySection
                      currenClassName={props.selectedSubject.className}
                      currentSubjectName={props.selectedSubject.name}
                      singleChapter={props.selectedChapter}
                      topic={topic}
                      setLoadingData={props.setloadingData}
                      theoryLevel={theorylevel[i]}
                      exampleState={exampleState[i]}
                      isUpdateTheory={isUpdateTheory[i]}
                      setisUpdateTheory={(val) => {
                        setisUpdateTheory((prev) => {
                          const prev1 = prev.map((x, j) => {
                            if (i === j) return val;
                            return x;
                          });
                          return prev1;
                        });
                      }}
                      onUpdateTopic={teachertopicsUpdate}
                      viewportRef={props.viewportRef}
                      selectedTopic={props?.selectedTopic as SingleTopic}
                    />
                  </div>
                );
              })}
              <div style={{ height: "70vh" }} ref={myDivRef}></div>
            </>
          ) : (
            <AddContent setAddContentModalOpen={setIsAddContentModalOpen} />
          )}
        </ContentContainer>
        {/* adding new one */}

      </TeachInteractContainer>
      <DeleteContentModal
        isModalOpen={isDeleteContentModalOpen}
        setIsModalOpen={setIsDeleteContentModalOpen}
        selectedChapter={props?.selectedChapter}
        selectedTopic={props?.selectedTopic}
        setLoadingData={props?.setloadingData}
      />
      <AddContentModal
        isModalOpen={isAddContentModalOpen}
        setIsModalOpen={setIsAddContentModalOpen}
        selectedChapter={props?.selectedChapter}
        selectedTopic={props?.selectedTopic}
        setSelectedTopic={props?.setSelectedTopic}
        handleEditContent={handleEditContent}
        scrollToEnd={scrollToEnd}
      />
      {/* <HtmlEdit
        topicDetail={props.selectedTopic as SingleTopic}
        onClose={() => {
          // setShowEdit(false);
        }}
        onUpdateTopic={teachertopicsUpdate}
        chapterId={props.selectedChapter._id}
        setloadingData={props.setloadingData}
        examples={exampleText}
        isLoading={isLoading}
        setAddMoreExamplesPressed={setAddMoreExamplesPressed}
        setonCloseClick={() => {}}
        editorContent={editorContent1}
        setEditorContent={setEditorContent1}
      /> */}
    </Stack>
  );
}

const TeachInteractContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1500px) {
    max-width: 700px;
    flex: 1;
  }
  @media (max-width: 1500px) {
    width: 100%;
  }
`;
const CarouselsConatiner = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

interface CarouselContainerProps {
  color?: string;
}

const SimulationCarouselContainer = styled.div<CarouselContainerProps>`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: #cfecfe;
  min-height: 251px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  border-radius: 12px;
  padding: 10px 3px;
  @media (max-width: 1000px) {
    /* width: 100%; */
    min-height: 200px;
    /* margin: 10px; */
  }
`;

const SimulationInfoContainer = styled.div`
  /* flex: 1; */
  max-width: 161px;
  @media (max-width: 1500px) {
    max-width: 121px;
  }
  @media (max-width: 1000px) {
    max-width: 161px;
  }
  @media (max-width: 500px) {
    max-width: 121px;
  }
  height: fit-content;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  color: #193a65;
  font-size: 24px;
  font-weight: 700;
  @media (max-width: 900px) {
    font-size: 16px;
  }
  span {
    color: #193a65;
    font-size: 24px;
    @media (max-width: 900px) {
      font-size: 17px;
      margin: 0;
    }
  }

  p {
    color: #193a65;
    font-family: "Nunito";
    font-weight: 400;
    font-size: 16px;
    line-height: 21.82px;
    @media (max-width: 900px) {
      font-size: 12.25px;
      margin: 0;
    }
    padding: 20px 0;
  }
  button {
    text-align: center;
    font-weight: 700;
    color: #193a65;
    width: 109px;
    background-color: transparent;
    border: 1px #193a65 solid;
    color: #193a65;
    width: fit-content;
    border-radius: 4px;
    padding: 5px 9px 5px 9px;
    font-family: "Nunito";
    font-size: 16px;
    cursor: pointer;
    @media (max-width: 720px) {
      font-size: 12.25px;
      margin: 0;
    }
  }
`;
const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  position: sticky;
  padding-left: 20px;
  margin-right: 5px;
  width: 100%;
  @media (max-width: 1024px) {
    padding-left: 20px;
    width: 100%;
  }
  @media (max-width: 820px) {
    padding-left: 10px;
    width: 100%;
  }
  .add-content-button {
    font-size: 16px;
    font-weight: 400;
    .mantine-Button-leftIcon {
      margin-right: 5px;
    }
  }
`;

const StyledSelect = styled(Select)`
  color: black;
  /* .mantine-Input-wrapper {
    min-width: 200px;
    width: 100%;
    @media (max-width: 400px) {
      max-width: 150px;
    }
  } */
  .mantine-Select-input {
    font-size: 18px;
    font-weight: 600;
    padding: 0;
  }
  .mantine-Input-rightSection {
    svg {
      stroke: black;
      scale: 1.5;
    }
  }
`;
const ToggleButton = styled.button`
  position: fixed;
  bottom: 150px;
  right: 0;
  z-index: 10;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  @media (min-width: 1500px) {
    display: none;
  }
`;

{
  /* in future */
}
