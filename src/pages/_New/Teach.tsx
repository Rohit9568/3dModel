import { ContentLearn } from "../../components/_New/ContentLearn";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  fetchCurrentChapter,
  fetchCurrentSubjectData,
} from "../../features/UserSubject/TeacherSubjectSlice";
import { Sidebar2 } from "../../components/_New/Sidebar2";
import { Topbar } from "../../components/_New/TopBar";
import {
  AppShell,
  Box,
  Button,
  Center,
  Flex,
  Header,
  LoadingOverlay,
  Modal,
  Navbar,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { ContentPractice } from "../../components/_New/ContentPractice";
import { ContentTest } from "../../components/_New/ContentTest";
import {
  AddLessonPlans,
  AddNotes,
  AddWorksheets,
  UpdateShareStatus,
  UpdateTestStatus,
} from "../../features/UserSubject/chapterDataSlice";
import { CanvasWrapper } from "../../components/SideUserBar/CanvasWrapper";
import { SideUserBar } from "../../components/SideUserBar/SideUserBar";
import { SideBarItems } from "../../@types/SideBar.d";
import { UpdateType, chapter } from "../../store/chapterSlice";
import { subjects } from "../../store/subjectsSlice";
import { currentSelection } from "../../store/currentSelectionSlice";
import { chapterQuestions } from "../../store/chapterQuestionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { useMediaQuery } from "@mantine/hooks";
import { TopBarTeacher } from "../../components/NavbarTeacher/TopBarTeacher";
import { MobileFooter } from "../../components/_New/MobileFooter";
import { AllSubjectSimualtions } from "../../components/_New/SubjectSimulations";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { convertToHyphenSeparated } from "../../utilities/HelperFunctions";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
} from "@tabler/icons";
const chapterActions = chapter.actions;
const subjectActions = subjects.actions;
const currentSelectionActions = currentSelection.actions;
const chapterQuestionsActions = chapterQuestions.actions;
export enum Tabs {
  Notes = "Notes",
  LessonPlan = "LessonPlan",
  AllSimulations = "AllSimulations",
  MindMap = "MindMap",
  Topics = "Topics",
  Upcoming = "Upcomimg",
  Worksheets = "Worksheets",
  PYQ = "PYQ",
  Test = "Test",
  QuestionBank = "QuestionBank",
}
export enum Pages {
  Teach = "Teach",
  Exercise = "Exercise",
  Test = "Test",
}
export interface IconProps {
  icon: any;
  name: string;
  onClick: () => void;
  color: string;
}

export function Icon(props: IconProps) {
  return (
    <Stack
      justify="center"
      align="center"
      w="80px"
      onClick={props.onClick}
      spacing={5}
      style={{
        cursor: "pointer",
      }}
    >
      <Center
        style={{
          height: "50px",
          width: "50px",
          borderRadius: "50%",
          backgroundColor: props.color,
        }}
      >
        {props.icon}
      </Center>
      <Text fz={12} ta="center">
        {props.name}
      </Text>
    </Stack>
  );
}

export function Teach() {
  const isMd = useMediaQuery(`(max-width: 880px)`);
  const params = useParams<any>();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<SingleTopic | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [isSideBarCollapse, setIsSideBarCollapse] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Pages>(
    Pages[params.entryComponent as keyof typeof Pages]
  );
  const [currentTab, setCurrentTab] = useState<Tabs>(
    currentPage === Pages.Test ? Tabs.Test : Tabs.Topics
  );
  const [itemSelected, setItemSelected] = useState<SideBarItems>(
    SideBarItems.NULL
  );
  const [topicsOpen, setTopicsOpen] = useState<boolean>(false);
  const [isShareLink, setIsShareLink] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const [introductionSelected, setInttroductionSelected] = useState(true);
  const currentChapter1 = useSelector<RootState, SingleChapter>((state) => {
    return state.chapterSlice.currentChapter;
  });
  const currentSubject = useSelector<RootState, SingleSubject>((state) => {
    return state.subjectSlice.currentSubject;
  });
  const entryComponet = params.entryComponent;

  useEffect(() => {
    setCurrentPage(Pages[params.entryComponent as keyof typeof Pages]);
    setCurrentTab(
      Pages[params.entryComponent as keyof typeof Pages] === Pages.Test
        ? Tabs.Test
        : Tabs.Topics
    );
    setInttroductionSelected(false);
  }, [params]);

  useEffect(() => {
    if (
      itemSelected === SideBarItems.Pen ||
      itemSelected === SideBarItems.Highlighter
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [itemSelected]);

  const subjectId = params.subjectId;
  const chapterId = params.chapterId;
  const topicId = params.topicId;
  const widthValue = isMd
    ? "100%"
    : isSideBarCollapse
    ? "calc(100% - 100px)"
    : "calc(100% - 250px)";
  const heightValue = isMd ? "calc(100vh - 160px)" : "calc(100vh - 105px)";
  useEffect(() => {
    if (params.subjectId)
      dispatch(currentSelectionActions.setSubjectId(params.subjectId));
    else dispatch(currentSelectionActions.setSubjectId(null));

    if (params.chapterId)
      dispatch(currentSelectionActions.setChapterId(params.chapterId));
    else dispatch(currentSelectionActions.setChapterId(null));

    if (params.topicId)
      dispatch(currentSelectionActions.setTopicId(params.topicId));
    else dispatch(currentSelectionActions.setTopicId(null));
  }, [params]);

  useEffect(() => {
    if (subjectId)
      fetchCurrentSubjectData({ subject_id: subjectId })
        .then((data: any) => {
          dispatch(subjectActions.setCurrentSubject(data));
        })
        .catch((err) => {
          console.log(err);
        });
  }, [subjectId]);
  useEffect(() => {
    if (chapterId && subjectId === currentSubject._id) {
      setLoadingData(true);
      fetchCurrentChapter({ chapter_id: chapterId })
        .then((data: any) => {
          setLoadingData(false);
          if (data.length === 0) {
            navigate(`/teach/${currentPage}/${subjectId}`);
          }
          dispatch(chapterActions.setCurrentChapter(data));
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
    } else if (subjectId === currentSubject._id) {
      setLoadingData(true);
      fetchCurrentChapter({ chapter_id: currentSubject.userChapters[0]._id })
        .then((data: any) => {
          setLoadingData(false);
          // if (data.length === 0) {
          //   navigate(`/teach`);
          // }
          setInttroductionSelected(true);
          navigate(
            `/teach/${currentPage}/${subjectId}/${currentSubject.userChapters[0]._id}`
          );
          dispatch(chapterActions.setCurrentChapter(data));
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
    }
  }, [subjectId, chapterId, currentSubject]);

  useEffect(() => {
    if (topicId && chapterId) {
      if (topicId) {
        if (currentPage !== Pages.Test) {
          setInttroductionSelected(false);
          setCurrentTab(Tabs.Topics);
          setTopicsOpen(true);
        } else {
          setCurrentTab(Tabs.Test);
        }
      }
      window.scrollTo(0, 0);
    } else if (chapterId) {
      if (currentPage === Pages.Teach) {
        setInttroductionSelected(true);
        setCurrentTab(Tabs.Topics);
        setSelectedTopic(null);
      } else if (currentPage === Pages.Exercise) {
        setSelectedTopic(null);
        setCurrentTab(Tabs.Worksheets);
      } else {
        setCurrentTab(Tabs.Test);
      }
    }
  }, [topicId, chapterId]);

  useEffect(() => {
    if (topicId) {
      const topic = currentChapter1.topics.find((x: any) => x._id === topicId);
      const orignaltopic = currentChapter1.topics.find(
        (x) => x.topicId === topicId
      );
      if (topic) setSelectedTopic(topic);
      else if (orignaltopic) {
        setSelectedTopic(orignaltopic);
      } else setSelectedTopic(currentChapter1.topics[0]);
    }
  }, [currentChapter1, topicId]);

  function OnPageChange(pageTab: Pages) {
    switch (pageTab) {
      case Pages.Teach:
        setCurrentTab(Tabs.Topics);
        break;
      case Pages.Exercise:
        setCurrentTab(Tabs.Topics);
        break;
      case Pages.Test:
        setCurrentTab(Tabs.Test);
        break;
    }
    if (topicId) {
      navigate(
        `/teach/${pageTab}/${subjectId}/${currentChapter1._id}/${topicId}`
      );
    } else {
      navigate(`/teach/${pageTab}/${subjectId}/${currentChapter1._id}/`);
      if (pageTab === Pages.Exercise) {
        setCurrentTab(Tabs.Worksheets);
        setSelectedTopic(currentChapter1.topics[0]);
      }
    }
    setCurrentPage(pageTab);
  }

  function OnChapterChange(chapterId: string) {
    navigate(`/teach/${currentPage}/${subjectId}/${chapterId}/`);
  }
  function OnTopicChange(topicId: string) {
    setCurrentTab(Tabs.Topics);
    setItemSelected(SideBarItems.NULL);
    navigate(`/teach/${currentPage}/${subjectId}/${chapterId}/${topicId}`);
  }
  async function teachertopicsUpdate(id: string, data: SingleTopic) {
    dispatch(chapterActions.setTopicUpdate({ id, topic: data }));
    dispatch(
      chapterQuestionsActions.updateTopicwithNewId({
        oldId: id,
        newId: data._id,
      })
    );
    dispatch(currentSelectionActions.setTopicId(data._id));
    setSelectedTopic(data);
    navigate(`/teach/${currentPage}/${subjectId}/${chapterId}/${data._id}`);
  }
  async function topicQuestionsUpdate(id: string, data: SingleTopicQuestions) {
    dispatch(chapterQuestionsActions.setTopicUpdate({ id, topic: data }));
    dispatch(
      chapterActions.updateTopicwithNewId({ oldId: id, newId: data._id })
    );
    dispatch(currentSelectionActions.setTopicId(data._id));
    navigate(`/teach/${currentPage}/${subjectId}/${chapterId}/${data._id}`);
  }

  function onNoteUpload(name: string, url: string) {
    if (chapterId) {
      AddNotes({ id: chapterId, fileName: name, url })
        .then((x: any) => {
          dispatch(
            chapterActions.updateCurrentChapter({
              type: UpdateType.CN,
              data: x,
            })
          );
        })
        .catch((e) => {
          console.log(e);
        });
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_LEARN_PAGE_NOTES_SECTION_FILE_ADDED
      );
    }
  }
  function OnLessonPlanUplaod(name: string, url: string) {
    if (chapterId) {
      AddLessonPlans({ id: chapterId, fileName: name, url })
        .then((x: any) => {
          dispatch(
            chapterActions.updateCurrentChapter({
              type: UpdateType.CLP,
              data: x,
            })
          );
        })
        .catch((e) => {
          console.log(e);
        });
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_FILE_ADDED
      );
    }
  }
  function OnWorksheetUplaod(name: string, url: string) {
    if (chapterId) {
      AddWorksheets({ id: chapterId, fileName: name, url })
        .then((x: any) => {
          dispatch(
            chapterActions.updateCurrentChapter({
              type: UpdateType.CW,
              data: x,
            })
          );
        })
        .catch((e) => {
          console.log(e);
        });
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_FILE_ADDED
      );
    }
  }

  function OnUpdateTestStatus(testTaken: boolean, isFirstTime: boolean) {
    if (currentChapter1) {
      const PreTestData = {
        subject_id: params,
        chapter_id: currentChapter1._id,
        testTaken,
        isFirstTime,
      };
      UpdateTestStatus({ formObj: PreTestData })
        .then((x: any) => {
          dispatch(
            chapterActions.updatePreTestStatus({
              isFirstTime: PreTestData.isFirstTime,
              testTaken: PreTestData.testTaken,
            })
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  function onShareChapterClick() {
    setLoadingData(true);
    UpdateShareStatus({
      chapterId: currentChapter1._id,
      subjectId: currentSubject._id,
      batches: [],
    })
      .then((x: any) => {
        setLoadingData(false);
        setIsShareLink(true);
      })
      .catch((e) => {
        setLoadingData(false);
        console.log(e);
      });
  }

  // Example usage:
  function appendParentToBaseUrl() {
    const currentUrl = window.location.href;
    const user = GetUser();
    const urlParts = new URL(currentUrl);
    const base = urlParts.origin;

    const modifiedUrl = `${base}/${convertToHyphenSeparated(
      user.instituteName
    )}/${user.instituteId}/home/study/${currentSubject._id}/${
      currentChapter1._id
    }`;
    return modifiedUrl;
  }

  const modifiedURL = appendParentToBaseUrl();

  const sendMessage = (url: string) => {
    const messageText = encodeURIComponent(url);
    const messageUrl = `sms:?body=${messageText}`; // You can use other URL schemes for different messaging apps
    window.open(messageUrl);
  };

  return (
    <>
      <LoadingOverlay visible={loadingData} />
      <AppShell
        layout="alt"
        header={
          <>
            {isMd && (
              <TopBarTeacher
                SetSideBarVisibility={() => {
                  setIsSideBarOpen(true);
                }}
                showSideBar={true}
                itemSelected={itemSelected}
                onLogout={() => {
                  navigate("/");
                }}
              ></TopBarTeacher>
            )}
            {!isMd && (
              <Header height={70}>
                <Topbar
                  OnPageTabClick={OnPageChange}
                  currentPage={currentPage}
                />
              </Header>
            )}
          </>
        }
        footer={
          <>
            {isMd && (
              <MobileFooter
                OnPageTabClick={OnPageChange}
                currentPage={currentPage}
              ></MobileFooter>
            )}
          </>
        }
        navbar={
          <Sidebar2
            chapters={currentSubject.userChapters}
            selectedTopic={selectedTopic?._id}
            currentPage={currentPage}
            currentTab={currentTab}
            OnChapterClick={OnChapterChange}
            OnTopicClick={OnTopicChange}
            setCurrentTab={setCurrentTab}
            currentChapter={currentChapter1}
            isOpen={isSideBarOpen}
            setIsOpen={setIsSideBarOpen}
            isCollapsed={isSideBarCollapse}
            setIsCollapsed={setIsSideBarCollapse}
            topicsOpen={topicsOpen}
            setTopicsOpen={setTopicsOpen}
            onShareClick={onShareChapterClick}
            isIntroductionSelected={introductionSelected}
            setIsIntroductionSelected={setInttroductionSelected}
            currentSubject={currentSubject}
            setselectedTopic={setSelectedTopic}
          />
        }
      >
        <Box
          style={{
            width: widthValue,
            marginLeft: isMd ? "0px" : isSideBarCollapse ? "100px" : "250px",
            height: heightValue,
            // marginBottom:'60px',
          }}
        >
          {currentTab !== Tabs.AllSimulations && (
            <SideUserBar
              itemSelected={itemSelected}
              setItemSelected={(data: SideBarItems) => {
                setItemSelected((prev) => {
                  if (prev === data) return SideBarItems.NULL;
                  else return data;
                });
              }}
              currentTab={currentTab}
              currentPage={currentPage}
            />
          )}
        </Box>
      </AppShell>
      <Modal
        opened={isShareLink}
        onClose={() => {
          setIsShareLink(false);
        }}
        title="Share the chapter with Students"
        centered
      >
        <Stack>
          <Flex>
            <FacebookShareButton url={modifiedURL}>
              <Icon
                name="Facebook"
                icon={<IconBrandFacebook color="white" />}
                onClick={() => {}}
                color="#1776F1"
              />
            </FacebookShareButton>

            <WhatsappShareButton url={modifiedURL}>
              <Icon
                name="Whatsapp"
                icon={<IconBrandWhatsapp color="white" />}
                onClick={() => {}}
                color="#43C553"
              />
            </WhatsappShareButton>

            <EmailShareButton url={modifiedURL}>
              <Icon
                name="Email"
                icon={<IconMail color="white" />}
                onClick={() => {}}
                color="#E0534A"
              />
            </EmailShareButton>
            <Icon
              name="Message"
              icon={<IconMessage2 color="white" />}
              onClick={() => {
                sendMessage(modifiedURL);
              }}
              color="#0859C5"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <TextInput
              style={{
                // border: "gray solid 1px",
                marginRight: "5px",
                // borderRadius: "10px",
                // padding: "7px",
                height: "40px",
                width: "95%",
              }}
              value={modifiedURL}
            >
              {/* {!isMd && modifiedURL.slice(0, 30).concat("...")}
              {isMd && modifiedURL.slice(0, 20).concat("...")} */}
            </TextInput>
            <CopyToClipboard text={modifiedURL}>
              <Button
                // variant="outline"
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
