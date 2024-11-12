import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  Navigate,
  Route,
  Router,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  fetchCurrentChapter,
  fetchCurrentSubjectData,
} from "../../../features/UserSubject/TeacherSubjectSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import {
  createStyles,
  Button,
  Flex,
  Stack,
  Container,
  LoadingOverlay,
  Header,
  Menu,
  Modal,
  Slider,
  Select,
  useMantineTheme,
  Switch,
  AppShell,
  ScrollArea,
  Box,
  TextInput,
  Text,
  Tabs,
  Center,
  Group,
  Loader,
  MultiSelect,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconArrowNarrowRight,
  // IconBrandFacebook,
  IconCheck,
  IconChevronDown,
  IconSearch,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
  IconX,
} from "@tabler/icons";
import { convertToHyphenSeparated } from "../../../utilities/HelperFunctions";
import {
  BackButtonWithCircle,
  IconPlus,
  IconRight,
  IconRightArrow,
} from "../../_Icons/CustonIcons";
import "../../../assets/css/Modified.css";
import { chapter } from "../../../store/chapterSlice";
import { subjects } from "../../../store/subjectsSlice";
import { currentSelection } from "../../../store/currentSelectionSlice";
import { chapterQuestions } from "../../../store/chapterQuestionsSlice";
import { MainPage, Tabs1 } from "./MainPage";
import { Navbar } from "./Navbar";
import { Footer1 } from "./Footer";
import { SideBarItems } from "../../../@types/SideBar.d";
import { CanvasWrapper2 } from "../../SideUserBar/CanvasWrapper2";
import { SideUserBar2 } from "../../SideUserBar/SideUserBar2";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Icon, Teach } from "../../../pages/_New/Teach";
import {
  Addbatches,
  UpdateShareStatus,
} from "../../../features/UserSubject/chapterDataSlice";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import SearchPage from "../../../pages/SearchPage/SearchPage";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import UploadResources from "./UploadResources";
import styled from "styled-components";
import { MindMap } from "../MindMap";
import { Carousel } from "@mantine/carousel";
import { ContentSimulation } from "../../../pages/SimulationPage/ContentSimulation";
import { CanvasDraw } from "../../../pages/DetailsPages/CanvasDraw";
import SimulationsCarousel from "../../TeachPage/SimulationsCarousel";
import TeachInteract from "../../TeachPage/TeachInteract";
import ViewSimulations from "../../TeachPage/ViewSimulations";
import { getSimulationById } from "../../../features/Simulations/getSimulationSlice";
import { ParentPageEvents } from "../../../utilities/Mixpanel/AnalyticEventParentApp";
import { User1 } from "../../../@types/User";
import VideoCarousel from "../../TeachPage/VideoCarousel";
import ViewVideos from "../../TeachPage/ViewVideos";
import { current } from "@reduxjs/toolkit";
import useFeatureAccess from "../../../hooks/useFeatureAccess";
import { getUserById } from "../../../features/user/userSlice";
import { GetAllClassesForUser } from "../../../_parentsApp/features/instituteUserSlice";
import TestPage from "./TestPage";
import TestPage2 from "./TestPage2";
const chapterActions = chapter.actions;
const subjectActions = subjects.actions;
const currentSelectionActions = currentSelection.actions;
const chapterQuestionsActions = chapterQuestions.actions;

export interface IconProps {
  icon: any;
  name: string;
  onClick: () => void;
  color: string;
}

export interface ISimulation {
  _id: string;
  name: string;
  thumbnailImageUrl: string;
  isActivity: boolean;
  isSimulation: boolean;
  videoUrl: string;
  simulationTags: string[];
}

const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));

export enum Pages {
  teach = "teach",
  test = "test",
  search = "search",
}

export enum TeachTabs {
  teach = "Teach",
  mindmap = "Mind-map",
  resources = "Resources",
  questionbank = "questionbank",
}

export enum CarouselTabs {
  simulation = "Simulations",
  video = "Videos",
}

export default function ModifiedOptionsSim(props: {
  showSimulations: boolean;
}) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const params = useParams<any>();
  const dispatch = useDispatch<AppDispatch>();
  const subjectId = params.subjectId;
  const chapterId = params.chapterId;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<SingleTopic | null>(null);
  const currentChapter = useSelector<RootState, SingleChapter>((state) => {
    return state.chapterSlice.currentChapter;
  });
  const currentSubject = useSelector<RootState, SingleSubject>((state) => {
    return state.subjectSlice.currentSubject;
  });
  const [itemSelected, setItemSelected] = useState<SideBarItems>(
    SideBarItems.NULL
  );

  const [currentPage, setCurrentPage] = useState<Pages>(Pages.teach);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [currentTab, setCurrentTab] = useState<CarouselTabs | string | null>(
    null
  );
  const topicId = queryParams.get("topicId");

  const viewport = useRef<HTMLDivElement>(null);
  const [isShareLoading, setisShareLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TeachTabs | string | null>(
    TeachTabs.questionbank
  );
  const values = ["Shared", "Not Shared"];
  const paramValue = queryParams.get("play");

  const [shareValue, setShareValue] = useState<string>(
    currentChapter.shared ? values[0] : values[1]
  );

  const [simulations, setSimulations] = useState<ISimulation[]>([]);

  const [playSimulation, setPlaySimulation] = useState<{
    name: string;
    _id: string;
  } | null>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);

  const [modalSimulation, setModalSimulation] = useState<{
    name: string;
    _id: string;
    isSimulationPremium: boolean;
    videoUrl: string;
  } | null>(null);
  const { isFeatureValidwithNotification, UserFeature } = useFeatureAccess();
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [allClasses, setClasses] = useState<string[]>([]);

  useEffect(() => {
    GetAllClassesForUser()
      .then((x: any) => {
        console.log(x);
        const filteredClasses = x.filter((y: any) =>
          y.userSubjects.includes(subjectId)
        );
        setClasses(
          filteredClasses.map((y: any) => {
            return {
              label: y.name,
              value: y._id,
            };
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (currentChapter && currentChapter.simulations) {
      const simulations1 = currentChapter.simulations.filter((x) => {
        const found = currentChapter.unselectedSimulations.find(
          (y) => y === x._id
        );
        if (found) {
          return false;
        } else {
          return true;
        }
      });
      setSimulations(simulations1 as ISimulation[]);
      setSelectedClasses(currentChapter.sharedBatches);
    }
  }, [currentChapter]);

  const [simulation, setSimulation] = useState<SimulationData>();

  const videoRef = useRef(null);

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  useEffect(() => {
    if (currentChapter && !topicId) {
      setSelectedTopic(currentChapter.topics[0]);
    }
  }, [currentChapter]);

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
            navigate(`/study/${currentPage}/${subjectId}/`);
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
          dispatch(chapterActions.setCurrentChapter(data));
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
    }
  }, [subjectId, chapterId, currentSubject]);

  function OnChapterChange(chapterId: string) {
    if (currentTab) navigate(`/study/${currentPage}/${subjectId}/${chapterId}`);
    else {
      navigate(`/study/${currentPage}/${subjectId}/${chapterId}`);
    }
  }
  const [isShareLink, setIsShareLink] = useState<boolean>(false);
  function OnTopicChange(topicId: string) {
    setSelectedTopic(() => {
      const found = currentChapter.topics.find((x) => x._id === topicId);
      return found ?? null;
    });
  }
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

  function updateShareStatus() {
    setisShareLoading(true);
    UpdateShareStatus({
      chapterId: currentChapter._id,
      subjectId: currentSubject._id,
      batches: [],
    })
      .then((x: any) => {
        dispatch(
          chapterActions.updateSharedChapterStatus({
            shared: x.shared,
            batches: currentChapter.sharedBatches,
          })
        );
        setisShareLoading(false);
        if (x.shared) setIsShareLink(true);
      })
      .catch((e) => {
        setisShareLoading(false);
        console.log(e);
      });
  }

  function addbatches(val: string[]) {
    Addbatches({
      chapterId: currentChapter._id,
      batches: val,
    })
      .then((x) => {
        dispatch(
          chapterActions.updateSharedChapterStatus({
            shared: currentChapter.shared,
            batches: selectedClasses,
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function onShareChapterClick() {
    Mixpanel.track(WebAppEvents.TEACHER_APP_LEARN_PAGE_SHARE_CLICKED);
    if (isFeatureValidwithNotification(UserFeature.CONTENTSHARING)) {
      if (!currentChapter.shared) updateShareStatus();
      else {
        setIsShareLink(true);
      }
    }
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
      currentChapter._id
    }`;
    return modifiedUrl;
  }

  const modifiedURL = appendParentToBaseUrl();

  const sendMessage = (url: string) => {
    const messageText = encodeURIComponent(url);
    const messageUrl = `sms:?body=${messageText}`;
    window.open(messageUrl);
  };

  useEffect(() => {
    if (viewport && viewport.current) viewport.current?.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    setShareValue(currentChapter.shared ? values[0] : values[1]);
  }, [currentChapter]);

  function simulationClickHandler(name: string, _id: string) {
    setPlaySimulation({
      name,
      _id,
    });
  }

  const handleViewAllButton = (tab: string) => {
    setCurrentTab(tab);
  };

  const getSimulation = async () => {
    if (modalSimulation !== null) {
      const response = await getSimulationById({ id: modalSimulation._id });
      const simulations = response as SimulationData;

      setSimulation(simulations);
    }
  };

  useEffect(() => {
    getSimulation();
  }, [modalSimulation]);

  function handleVideoLoaded() {
    setVideoLoaded(true);
  }

  if (activeTab === TeachTabs.teach && currentTab) {
    return (
      <>
        {/* { currentTab === CarouselTabs.simulation ? (
          <ViewSimulations
            chapterName={currentChapter?.name}
            setCurrentTab={setCurrentTab}
            simulations={simulations}
            topicId={currentChapter?.topics?.[0]?._id}
            setOuterSimulations={setSimulations}
            simulationClickHandler={simulationClickHandler}
            setModalSimulation={setModalSimulation}
            onShareClick={onShareChapterClick}
            setIsShareLink={setIsShareLink}
          />
        ) : (
          <ViewVideos
            chapterId={currentChapter?._id}
            chapterName={currentChapter?.name}
            setCurrentTab={setCurrentTab}
            videos={currentChapter?.videos}
            onShareClick={onShareChapterClick}
            setIsShareLink={setIsShareLink}
          />
        )
        } */}
        <Modal
          opened={isShareLink}
          onClose={() => {
            setIsShareLink(false);
          }}
          title="Share the chapter with Students"
          centered
        >
          <Stack>
            <Flex align="center" justify="space-between">
              <Text mr={20}>Batches to Share with:</Text>
              <MultiSelect
                value={selectedClasses}
                data={allClasses}
                onChange={(val) => {
                  addbatches(val);
                  setSelectedClasses(val);
                }}
              />
            </Flex>
            <Flex align="center" justify="space-between">
              <Text mr={20}>Status:</Text>
              <Select
                value={shareValue}
                data={values}
                onChange={(e) => {
                  updateShareStatus();
                }}
                // w="50%"
              />
            </Flex>
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
              ></TextInput>
              <CopyToClipboard text={modifiedURL}>
                <Button
                  bg="#3174F3"
                  style={{
                    borderRadius: "20px",
                  }}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_LEARN_PAGE_SHARE_DIALOG_BOX_COPY_LINK_CLICKED
                    );
                  }}
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </Flex>
          </Stack>
          <LoadingOverlay visible={isShareLoading} />
        </Modal>
        <Modal
          opened={playSimulation !== null}
          onClose={() => {
            setPlaySimulation(null);
          }}
          withCloseButton={false}
          closeOnClickOutside={false}
          styles={{
            inner: {
              padding: 0,
              margin: 0,
            },
            root: {
              padding: 0,
              margin: 0,
            },
            modal: {
              padding: 0,
              margin: 0,
            },
          }}
          size="auto"
          m={0}
          padding={0}
          lockScroll
          fullScreen
          zIndex={999}
        >
          { playSimulation !== null && (
            <CanvasDraw
              onCloseClick={() => {
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED
                );
                setPlaySimulation(null);
              }}
              simulation={playSimulation}
            >
              <Center
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <ContentSimulation
                  simulationId={playSimulation._id}
                  paramValue={paramValue}
                />
              </Center>
            </CanvasDraw>
          )}
        </Modal>
        <Modal
          opened={modalSimulation !== null}
          onClose={() => {
            setVideoLoaded(false);
            setModalSimulation(null);
          }}
          centered
          size={"lg"}
          padding={0}
          radius={0}
          withCloseButton={false}
          mt={"sm"}
          style={{ zIndex: 2000 }}
        >
          {modalSimulation !== null && (
            <>
              <div style={{ position: "relative", fontFamily: "Nunito" }}>
                {!simulation?.thumbnailImageUrl ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "20px",
                    }}
                  >
                    <Loader color="blue" size="md" />
                  </div>
                ) : (
                  <div>
                    <video
                      controls
                      src={modalSimulation.videoUrl}
                      onLoadedData={handleVideoLoaded}
                      ref={videoRef}
                      autoPlay
                      loop
                      muted
                      className="video-no-controls"
                      style={{
                        width: `${isMd ? "100%" : "100%"}`,
                        display: videoLoaded ? "block" : "none",
                      }}
                      playsInline
                      preload="auto"
                    />
                    {(!videoLoaded || !modalSimulation.videoUrl) && (
                      <img
                        alt="Tech"
                        style={{
                          width: "100%",
                          marginTop: "-50px",
                          // display: !videoLoaded ? "none" : "block",
                        }}
                        src={simulation?.thumbnailImageUrl}
                      />
                    )}
                    <button
                      style={{
                        position: "absolute",
                        top: "-40px",
                        right: "10px",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        display: "flex",
                        padding: "3px",
                        transitionDelay: "300ms",
                        borderRadius: "50%",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#313131",
                      }}
                      onClick={() => {
                        setVideoLoaded(false);
                        setModalSimulation(null);
                      }}
                    >
                      <IconX color="white" />
                    </button>
                  </div>
                )}
                {simulation?.thumbnailImageUrl ? (
                  <button
                    className="modalPlay"
                    style={{
                      border: "none",
                      outline: "none",

                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      paddingRight: "25px",
                      paddingLeft: "25px",
                      position: "absolute",
                      borderRadius: "2px",
                      bottom: "20px",
                      cursor: "pointer",
                      left: "20px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoLoaded(false);
                      setModalSimulation(null);
                      if (user?.subscriptionModelType === "FREE") {
                        if (
                          modalSimulation &&
                          (modalSimulation.isSimulationPremium === undefined ||
                            modalSimulation?.isSimulationPremium)
                        ) {
                          Mixpanel.track(
                            WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                            {
                              feature_name: "premium_simulation_accessed",
                              current_page: "all_simulations_page",
                            }
                          );
                          setVideoLoaded(false);

                          setModalSimulation(null);
                        } else {
                          simulationClickHandler(
                            simulation.name,
                            simulation._id
                          );
                        }
                      } else if (
                        user?.subscriptionModelType !== "FREE" ||
                        paramValue === "parent"
                      ) {
                        if (
                          modalSimulation &&
                          (modalSimulation.isSimulationPremium === undefined ||
                            modalSimulation.isSimulationPremium)
                        ) {
                          simulationClickHandler(
                            simulation.name,
                            simulation._id
                          );
                        } else {
                          simulationClickHandler(
                            simulation.name,
                            simulation._id
                          );
                        }
                      }
                      if (paramValue && paramValue === "parent") {
                        Mixpanel.track(
                          ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                          {
                            simulationName: modalSimulation.name,
                            id: modalSimulation._id,
                          }
                        );
                      } else
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                          {
                            simulationName: modalSimulation.name,
                            id: modalSimulation._id,
                          }
                        );
                    }}
                  >
                    <img
                      src={require("../../../assets/playBtn.png")}
                      alt="Play"
                      style={{ width: "21px", height: "21px" }}
                    />
                    <span style={{ marginLeft: "10px", color: "white" }}>
                      Play
                    </span>
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div
                style={{
                  paddingLeft: "30px",
                  paddingRight: "20px",
                  fontFamily: "Nunito",
                }}
              >
                <p style={{ fontWeight: "700", fontSize: "25px" }}>
                  {simulation?.name}
                </p>
                <button
                  className="modalPlay2"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    marginTop: "20px",

                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user?.subscriptionModelType === "FREE") {
                      if (
                        modalSimulation.isSimulationPremium === undefined ||
                        modalSimulation.isSimulationPremium
                      ) {
                        Mixpanel.track(
                          WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                          {
                            feature_name: "premium_simulation_accessed",
                            current_page: "all_simulations_page",
                          }
                        );
                        setVideoLoaded(false);
                        setModalSimulation(null);
                      } else {
                        if (simulation)
                          simulationClickHandler(
                            simulation.name,
                            simulation._id
                          );
                      }
                    } else if (
                      user?.subscriptionModelType !== "FREE" ||
                      paramValue === "parent"
                    ) {
                      if (
                        modalSimulation.isSimulationPremium === undefined ||
                        modalSimulation.isSimulationPremium
                      ) {
                        if (simulation)
                          simulationClickHandler(
                            simulation.name,
                            simulation._id
                          );
                      } else {
                        if (simulation)
                          simulationClickHandler(
                            simulation.name,
                            simulation._id
                          );
                      }
                    }
                    if (paramValue && paramValue === "parent") {
                      Mixpanel.track(
                        ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                        {
                          simulationName: modalSimulation.name,
                          id: modalSimulation._id,
                        }
                      );
                    } else
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                        {
                          simulationName: modalSimulation.name,
                          id: modalSimulation._id,
                        }
                      );
                  }}
                >
                  <img
                    src={require("../../../assets/playBtn.png")}
                    alt="Play"
                    style={{ width: "21px", height: "21px" }}
                  />
                  <span style={{ marginLeft: "10px", color: "white" }}>
                    Play
                  </span>
                </button>
                <p>{simulation?.simulationDescription}</p>
                {simulation?.simulationfeatures && (
                  <>
                    <p style={{ fontWeight: "700" }}>Key Features:</p>
                    <ol>
                      {simulation.simulationfeatures.map((feature) => (
                        <li>{feature}</li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            </>
          )}
        </Modal>
      </>
    );
  }

  return (
    <>
      {activeTab === TeachTabs.questionbank && ( 
        <></>
        // <TestPage2
        //   chapterId={currentChapter._id}
        //   setLoadingData={setLoadingData}
        //   // viewportRef={props.viewportRef}
        // />
      )}
      <LoadingOverlay visible={loadingData} />
      {activeTab !== TeachTabs.questionbank && (
        <>
          <Navbar
            currentPage={currentPage}
            onPageChange={(page) => {
              navigate(`/study/${page}/${subjectId}/${chapterId}`);
            }}
            selectedSubject={currentSubject}
            selectedChapter={currentChapter}
            chapterChangeHandler={OnChapterChange}
            onShareClick={onShareChapterClick}
            currentTab={activeTab}
            setIsShareLink={setIsShareLink}
            setCurrentTab={setActiveTab}
          />
          <Box
            style={{
              width: "100%",
              height: !isLg
                ? "calc(100vh - 51px)"
                : isSm
                ? "calc(100vh - 150px)"
                : "calc(100vh-91px)",
            }}
          >
            <SideUserBar2
              itemSelected={itemSelected}
              setItemSelected={(data: SideBarItems) => {
                setItemSelected((prev) => {
                  if (prev === data) return SideBarItems.NULL;
                  else return data;
                });
              }}
              currentTab={(currentTab as unknown as string) ?? "theory"}
              currentPage={currentPage}
              activeTab={activeTab}
            />
          </Box>
          <Modal
            opened={isShareLink}
            onClose={() => {
              setIsShareLink(false);
            }}
            title="Share the chapter with Students"
            centered
          >
            <Stack>
              <Flex align="center">
                <Text mr={20}>Batches to Share with:</Text>
                <MultiSelect
                  value={selectedClasses}
                  data={allClasses}
                  onChange={(val) => {
                    addbatches(val);
                    setSelectedClasses(val);
                  }}
                />
              </Flex>
              <Flex align="center" justify="space-between">
                <Text mr={20}>Status:</Text>
                <Select
                  value={shareValue}
                  data={values}
                  onChange={(e) => {
                    updateShareStatus();
                  }}
                  // w="50%"
                />
              </Flex>
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
                ></TextInput>
                <CopyToClipboard text={modifiedURL}>
                  <Button
                    bg="#3174F3"
                    style={{
                      borderRadius: "20px",
                    }}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_LEARN_PAGE_SHARE_DIALOG_BOX_COPY_LINK_CLICKED
                      );
                    }}
                  >
                    Copy
                  </Button>
                </CopyToClipboard>
              </Flex>
            </Stack>
            <LoadingOverlay visible={isShareLoading} />
          </Modal>
          <Modal
            opened={playSimulation !== null}
            onClose={() => {
              setPlaySimulation(null);
            }}
            withCloseButton={false}
            closeOnClickOutside={false}
            styles={{
              inner: {
                padding: 0,
                margin: 0,
              },
              root: {
                padding: 0,
                margin: 0,
              },
              modal: {
                padding: 0,
                margin: 0,
              },
            }}
            size="auto"
            m={0}
            padding={0}
            lockScroll
            fullScreen
            zIndex={999}
          >
            {playSimulation !== null && (
              <CanvasDraw
                onCloseClick={() => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED
                  );
                  setPlaySimulation(null);
                }}
                simulation={playSimulation}
              >
                <Center
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <ContentSimulation
                    simulationId={playSimulation._id}
                    paramValue={paramValue}
                  />
                </Center>
              </CanvasDraw>
            )}
          </Modal>
          <Modal
            opened={modalSimulation !== null}
            onClose={() => {
              setVideoLoaded(false);
              setModalSimulation(null);
            }}
            centered
            size={"lg"}
            padding={0}
            radius={0}
            withCloseButton={false}
            mt={"sm"}
            style={{ zIndex: 2000 }}
          >
            {modalSimulation !== null && (
              <>
                <div style={{ position: "relative", fontFamily: "Nunito" }}>
                  {!simulation?.thumbnailImageUrl ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "20px",
                      }}
                    >
                      <Loader color="blue" size="md" />
                    </div>
                  ) : (
                    <div>
                      <video
                        controls
                        src={modalSimulation.videoUrl}
                        onLoadedData={handleVideoLoaded}
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        className="video-no-controls"
                        style={{
                          width: `${isMd ? "100%" : "100%"}`,
                          display: videoLoaded ? "block" : "none",
                        }}
                        playsInline
                        preload="auto"
                      />
                      {(!videoLoaded || !modalSimulation.videoUrl) && (
                        <img
                          alt="Tech"
                          style={{
                            width: "100%",
                            marginTop: "-50px",
                            // display: !videoLoaded ? "none" : "block",
                          }}
                          src={simulation?.thumbnailImageUrl}
                        />
                      )}
                      <button
                        style={{
                          position: "absolute",
                          top: "-40px",
                          right: "10px",
                          border: "none",
                          outline: "none",
                          cursor: "pointer",
                          display: "flex",
                          padding: "3px",
                          transitionDelay: "300ms",
                          borderRadius: "50%",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#313131",
                        }}
                        onClick={() => {
                          setVideoLoaded(false);
                          setModalSimulation(null);
                        }}
                      >
                        <IconX color="white" />
                      </button>
                    </div>
                  )}
                  {simulation?.thumbnailImageUrl ? (
                    <button
                      className="modalPlay"
                      style={{
                        border: "none",
                        outline: "none",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        paddingRight: "25px",
                        paddingLeft: "25px",
                        position: "absolute",
                        borderRadius: "2px",
                        bottom: "20px",
                        cursor: "pointer",
                        left: "20px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoLoaded(false);
                        setModalSimulation(null);
                        if (user?.subscriptionModelType === "FREE") {
                          if (
                            modalSimulation &&
                            (modalSimulation.isSimulationPremium ===
                              undefined ||
                              modalSimulation?.isSimulationPremium)
                          ) {
                            Mixpanel.track(
                              WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                              {
                                feature_name: "premium_simulation_accessed",
                                current_page: "all_simulations_page",
                              }
                            );
                            setVideoLoaded(false);
                            setModalSimulation(null);
                          } else {
                            simulationClickHandler(
                              simulation.name,
                              simulation._id
                            );
                          }
                        } else if (
                          user?.subscriptionModelType !== "FREE" ||
                          paramValue === "parent"
                        ) {
                          if (
                            modalSimulation &&
                            (modalSimulation.isSimulationPremium ===
                              undefined ||
                              modalSimulation.isSimulationPremium)
                          ) {
                            simulationClickHandler(
                              simulation.name,
                              simulation._id
                            );
                          } else {
                            simulationClickHandler(
                              simulation.name,
                              simulation._id
                            );
                          }
                        }
                        if (paramValue && paramValue === "parent") {
                          Mixpanel.track(
                            ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                            {
                              simulationName: modalSimulation.name,
                              id: modalSimulation._id,
                            }
                          );
                        } else
                          Mixpanel.track(
                            WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                            {
                              simulationName: modalSimulation.name,
                              id: modalSimulation._id,
                            }
                          );
                      }}
                    >
                      <img
                        src={require("../../../assets/playBtn.png")}
                        alt="Play"
                        style={{ width: "21px", height: "21px" }}
                      />
                      <span style={{ marginLeft: "10px", color: "white" }}>
                        Play
                      </span>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    paddingLeft: "30px",
                    paddingRight: "20px",
                    fontFamily: "Nunito",
                  }}
                >
                  <p style={{ fontWeight: "700", fontSize: "25px" }}>
                    {simulation?.name}
                  </p>
                  <button
                    className="modalPlay2"
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      marginTop: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      paddingRight: "25px",
                      paddingLeft: "25px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoLoaded(false);
                      setModalSimulation(null);
                      if (user?.subscriptionModelType === "FREE") {
                        if (
                          modalSimulation.isSimulationPremium === undefined ||
                          modalSimulation.isSimulationPremium
                        ) {
                          Mixpanel.track(
                            WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                            {
                              feature_name: "premium_simulation_accessed",
                              current_page: "all_simulations_page",
                            }
                          );
                          setVideoLoaded(false);
                          setModalSimulation(null);
                        } else {
                          if (simulation)
                            simulationClickHandler(
                              simulation.name,
                              simulation._id
                            );
                        }
                      } else if (
                        user?.subscriptionModelType !== "FREE" ||
                        paramValue === "parent"
                      ) {
                        if (
                          modalSimulation.isSimulationPremium === undefined ||
                          modalSimulation.isSimulationPremium
                        ) {
                          if (simulation)
                            simulationClickHandler(
                              simulation.name,
                              simulation._id
                            );
                        } else {
                          if (simulation)
                            simulationClickHandler(
                              simulation.name,
                              simulation._id
                            );
                        }
                      }
                      if (paramValue && paramValue === "parent") {
                        Mixpanel.track(
                          ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                          {
                            simulationName: modalSimulation.name,
                            id: modalSimulation._id,
                          }
                        );
                      } else
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                          {
                            simulationName: modalSimulation.name,
                            id: modalSimulation._id,
                          }
                        );
                    }}
                  >
                    <img
                      src={require("../../../assets/playBtn.png")}
                      alt="Play"
                      style={{ width: "21px", height: "21px" }}
                    />
                    <span style={{ marginLeft: "10px", color: "white" }}>
                      Play
                    </span>
                  </button>
                  <p>{simulation?.simulationDescription}</p>
                  {simulation?.simulationfeatures && (
                    <>
                      <p style={{ fontWeight: "700" }}>Key Features:</p>
                      <ol>
                        {simulation.simulationfeatures.map((feature) => (
                          <li>{feature}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              </>
            )}
          </Modal>
        </>
      )}
    </>
  );
}

const WorksheetConatiner = styled.div`
  display: flex;
  width: 100% !important;
`;
