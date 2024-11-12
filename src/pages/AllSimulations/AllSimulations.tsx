import {
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Menu,
  useMantineTheme,
  Button,
  Box,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconDownload,
  IconSearch,
  IconX,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { User1 } from "../../@types/User";
import { MySimulations } from "../../components/Simulations/MySimulations";
import { Simulations } from "../../components/Simulations/Simulations";
import {
  getMegaSimulation,
  getSimulationById,
  getUserSimulations,
} from "../../features/Simulations/getSimulationSlice";
import { fetchClassAndSubjectList } from "../../features/UserSubject/TeacherSubjectSlice";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { isPremiumModalOpened } from "../../store/premiumModalSlice";
import { subjects } from "../../store/subjectsSlice";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { AuthenticationPage } from "../AuthenticationPage/AuthenticationPage";
import { CanvasDraw } from "../DetailsPages/CanvasDraw";
import { ContentSimulation } from "../SimulationPage/ContentSimulation";
import useParentCommunication from "../../hooks/useParentCommunication";
import { IconCross2 } from "../../components/_Icons/CustonIcons";
import filterImg from "../../assets/filterbutimg.png";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;
const subjectsActions = subjects.actions;

function HighlightLine(props: {
  paramValue: string | null;
  typeofSimulation: "ALL" | "MY";
  setTypeofSimulation: (val: "ALL" | "MY") => void;
}) {
  return (
    <Stack spacing={0} px={35} pt={15} sx={{backgroundColor: 'white'}}>
      <Flex>
        <Text
          style={{
            display: 'flex', alignItems: 'center',
            cursor: "pointer",
            borderBottom:
              props.typeofSimulation === "ALL"
                ? "#4B65F6 solid 3px"
                : "inherit",
            marginRight: 20,
            fontFamily: "Nunito",
            opacity: props.typeofSimulation === "ALL" ? 1 : 0.3,
            paddingBottom: 10,
          }}
          onClick={(e) => {
            props.setTypeofSimulation("ALL");
          }}
          fw={700}
          fz={14}
        >
          <Box sx={{background: props.typeofSimulation === "ALL" ? '#DBE0FF':'#eaebd5' , width:40, height: 40, borderRadius:'50%', marginRight: 10 }} />
          All simulations
        </Text>
        {props.paramValue === null && (
          <Text
            style={{
              display: 'flex', alignItems: 'center',
              cursor: "pointer",
              borderBottom:
                props.typeofSimulation === "MY"
                  ? "#4B65F6 solid 3px"
                  : "inherit",
              fontFamily: "Nunito",
              opacity: props.typeofSimulation === "MY" ? 1 : 0.3,
              paddingBottom: 10,
              marginLeft: 18
            }}
            onClick={(e) => {
              props.setTypeofSimulation("MY");
            }}
            fw={700}
            fz={14}
          >
            <Box sx={{background:props.typeofSimulation === "MY" ? '#DBE0FF' : '#eaebd5', width:40, height: 40, borderRadius:'50%', marginRight: 10 }} />
            My simulations
          </Text>
        )}
      </Flex>
      <Divider
        color="#F2F2F2"
        size="md"
        mt={-3}
        style={{
          zIndex: -9999,
        }}
      />
    </Stack>
  );
}
let k = false;

export function checkIfPacakgeIsAvailable(sim: SimulationData | null) {
  if (sim === null) return false;
  return (
    sim.downloadPackages?.windows?.length > 0 ||
    sim.downloadPackages?.mac?.length > 0 ||
    sim.downloadPackages?.linux?.length > 0 ||
    sim.downloadPackages?.android?.length > 0
  );
}
export function Allsimulations() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setisComplete] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [simualtionId, setSimualtionId] = useState<string>("");
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [typeofSimulation, setTypeofSimulation] = useState<"ALL" | "MY">("ALL");
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const navigate = useNavigate();
  const [playSimulation, setPlaySimulation] = useState<{
    name: string;
    _id: string;
  } | null>(null);
  const [mySimulationId, setMysimualtionId] = useState<string | null>(null);
  const [modalSimulation, setModalSimulation] = useState<{
    name: string;
    _id: string;
    isSimulationPremium: boolean;
    videoUrl: string;
    isthreejs: boolean;
  } | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );

  const { sendDataToReactnative } = useParentCommunication();
  function simulationclickHandler(data: { _id: string; name: string, isthreejs?: boolean }) {
    if(data.isthreejs == true){
    navigate(`simulation/${data._id}`)
    }else{
      navigate({ search: "play=true" });
      setModalSimulation(null);
      setPlaySimulation(data);
      setVideoLoaded(false);
      setMysimualtionId(null);
    }
  }

  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );

  function fetchList() {
    setIsLoading(true);
    fetchClassAndSubjectList()
      .then((data: any) => {
        const fetchedData: UserSubjectAPI[] = data;
        const segregatedData: UserClassAndSubjects[] = [];
        fetchedData.forEach((subject) => {
          const subjectEntry = {
            _id: subject._id,
            name: subject.name,
            chaptersCount: subject.chaptersCount,
            subjectId: subject.subjectId,
          };
          const found = segregatedData.findIndex(
            (x) => x.classId === subject.classId
          );
          if (found === -1) {
            segregatedData.push({
              classId: subject.classId,
              className: subject.className,
              classSortOrder: subject.classSortOrder,
              subjects: [subjectEntry],
              grade: subject.classgrade,
            });
          } else {
            segregatedData[found].subjects.push(subjectEntry);
          }
        });
        dispatch(
          subjectsActions.setUserSubjects(
            segregatedData.sort((a, b) => a.classSortOrder - b.classSortOrder)
          )
        );
        // }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }

  useEffect(() => {
    fetchList();
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("type");
  const playValue = queryParams.get("type");

  useEffect(() => {
    if (paramValue && paramValue === "parent") {
      Mixpanel.track(ParentPageEvents.PARENT_APP_SIMULATION_LIST_PAGE_ACCESSED);
    } else
      Mixpanel.track(WebAppEvents.TEACHER_APP_SIMULATION_LIST_PAGE_ACCESSED);
  }, []);
  const handleScroll = () => {
    if (!isComplete && !loadingData && !k) {
      const container = containerRef.current;
      if (container) {
        if (
          container &&
          Math.ceil(container.scrollTop + container.clientHeight) + 50 >=
            container.scrollHeight
        ) {
          k = true;
          setSkip((prev) => {
            return prev + 12;
          });
        }
      }
    }
  };

  function handleVideoLoaded() {
    setVideoLoaded(true);
  }

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

  const [megaSimulation, setMEgaSimulation] = useState<any>([]);
  const [mySImulations, setMySimulations] = useState<any>([]);

  function getUserimulation() {
    getUserSimulations()
      .then((x) => {
        setMySimulations(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    getUserSimulations();
  }, [playValue]);
  useEffect(() => {
    getUserimulation();
    getMegaSimulation()
      .then((x: any) => {
        setMEgaSimulation(x);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, []);

  const videoRef = useRef(null);
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const [isFilterClicked, setFilterClicked] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const [mobileSearchClicked, setMobileSearchClicked] =
    useState<boolean>(false);
  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (inputRef && inputRef.current && inputRef.current.focus)
      inputRef.current.focus();
  }, [mobileSearchClicked]);

  const [filteredSimulations, setFilteredSimulation] = useState<
    SimulationData[]
  >([]);
  const [searchFilterSimulations, setSearchfilterSimulations] = useState<
    SimulationData[]
  >([]);
  const [filteredQuery, setFilteredQuery] = useState<string>("");

  const [downloadSimulationsModal, setDownloadSimulationsModal] =
    useState<boolean>(false);

  useEffect(() => {
    setSearchfilterSimulations(() => {
      const prevState1 = filteredSimulations.filter((x) => {
        if (x.name.toLowerCase().includes(filteredQuery)) return x;
        else {
          for (let i = 0; i < x.simulationTags.length; i++) {
            if (x.simulationTags[i].toLowerCase().includes(filteredQuery))
              return x;
          }
        }
      });
      return prevState1;
    });
    k = false;
  }, [filteredQuery, filteredSimulations]);


  return (
    <>
      <Stack
        w="100%"
        h="100vh"
        spacing={0}
      >
        {!isFilterClicked && (
          <Stack
            spacing={0}
            style={{
              top: 0,
              left: 0,
              zIndex: 999,
              background: "white",
              borderBottom: '1px solid #EDF0FE'
            }}
            w="100%"
          >
            <Flex justify="space-between" align="center" px={27} py={15}
            sx={{background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F5FD 100%)'}}>
              <Flex align="center">
                <Text
                  style={{
                    fontWeight: 700,
                    fontSize: "28px",
                    fontFamily: "Nunito",
                  }}
                  ml={10}
                >
                  Simulations
                </Text>
              </Flex>
              <Group
                sx={{
                  textAlign: "left",
                  borderRadius: 10,
                }}
              >
                {typeofSimulation === "ALL" && (
                  <>
                    {isMd && (
                      <>
                        {!mobileSearchClicked && (
                          <IconSearch
                            size={30}
                            color="#525e7e"
                            onClick={() => {
                              setMobileSearchClicked(true);
                            }}
                          />
                        )}

                        {mobileSearchClicked && (
                          <div
                            style={{
                              border: "1px solid #525E7E",
                              width: "150px",
                              height: "40px",
                              borderRadius: "20px",
                              padding: "1px",
                              paddingLeft: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                            // className="search-bar"
                          >
                            <IconSearch size={25} color="#525e7e" />

                            <input
                              placeholder="Search"
                              value={searchQuery}
                              style={{
                                fontFamily: "Nunito",
                                width: "90%",
                                border: "none",
                                fontSize: "15px",
                                padding: "5px",
                                outline: "none",
                                marginRight: "3px",
                              }}
                              ref={inputRef}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (paramValue && paramValue === "parent") {
                                  Mixpanel.track(
                                    ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SEARCH_TYPED
                                  );
                                } else {
                                  Mixpanel.track(
                                    WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SEARCH_TYPED,
                                    {
                                      query: e.target.value,
                                    }
                                  );
                                }
                              }}
                            />
                            <IconX
                              onClick={() => {
                                setMobileSearchClicked(false);
                              }}
                              style={{
                                marginRight: "3px",
                              }}
                              size={30}
                            />
                          </div>
                        )}
                      </>
                    )}
                    {!isMd && (
                      <div
                        style={{
                          border: "1px solid #525E7E",
                          width: "307px",
                          height: "40px",
                          borderRadius: "20px",
                          padding: "1px",
                          paddingLeft: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                        // className="search-bar"
                      >
                        <IconSearch size={25} color="#525e7e" />

                        <input
                          placeholder="Search for Simulation"
                          value={searchQuery}
                          style={{
                            fontFamily: "Nunito",
                            width: "90%",
                            border: "none",
                            fontSize: "15px",
                            padding: "5px",
                            outline: "none",
                            marginRight: "3px",
                          }}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (paramValue && paramValue === "parent") {
                              Mixpanel.track(
                                ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SEARCH_TYPED
                              );
                            } else {
                              Mixpanel.track(
                                WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SEARCH_TYPED,
                                {
                                  query: e.target.value,
                                }
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </Group>
            </Flex>

            <HighlightLine
              paramValue={paramValue}
              typeofSimulation={typeofSimulation}
              setTypeofSimulation={setTypeofSimulation}
            />
          </Stack>
        )}
        <Stack w="100%"  h="81%" spacing={0}>
          {typeofSimulation === "ALL" && userSubjects.length > 0 && (
            <div
              ref={containerRef}
              style={{
                height: isMd ? "calc(100% - 100px)" : "100%",
                overflowY: "scroll",
                marginTop: "0px",
              }}
              onScroll={handleScroll}
            >
              <Simulations
                setLoadingData={setLoadingData}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                skip={skip}
                loadingData={loadingData}
                isComplete={isComplete}
                setisComplete={setisComplete}
                setSkip={setSkip}
                paramValue={paramValue}
                setModalSimulation={setModalSimulation}
                setPlaySimulation={setPlaySimulation}
                setShowAuthModal={setShowAuthModal}
                setSimualtionId={setSimualtionId}
                setSimulation={setSimulation}
                setVideoLoaded={setVideoLoaded}
                setFilterClicked={setFilterClicked}
                isFilterClicked={isFilterClicked}
                setMysimualtionId={setMysimualtionId}
                userSubjects={userSubjects}
                filteredSimulations={filteredSimulations}
                searchFilterSimulations={searchFilterSimulations}
                setFilteredQuery={setFilteredQuery}
                setFilteredSimulation={setFilteredSimulation}
                setDownloadModal={setDownloadSimulationsModal}
              />
            </div>
          )}
          {typeofSimulation === "MY" && (
            <div
              ref={containerRef}
              style={{
                height: isMd ? "calc(100% - 100px)" : "100%",
                overflowY: "scroll",
                marginTop: isMd ? "100px" : "0px",
                // border: "blue solid 1px",
                // maxHeight: isMd ? "calc(100% - 100px)" : "100%",
              }}
            >
              <MySimulations
                setShowAuthModal={setShowAuthModal}
                setSimualtionId={setSimualtionId}
                setSimulation={setSimulation}
                setVideoLoaded={setVideoLoaded}
                setModalSimulation={setModalSimulation}
                setPlaySimulation={setPlaySimulation}
                user={user}
                paramValue={paramValue}
                setMysimualtionId={setMysimualtionId}
                megaSimulation={megaSimulation}
                mySImulations={mySImulations}
              />
            </div>
          )}
        </Stack>
      </Stack>
      <Modal
        centered
        opened={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
        }}
      >
        <AuthenticationPage
          onLoginSuccess={() => {
            setShowAuthModal(false);
            window.open(`/simulation/${simualtionId}`, "_blank");
          }}
        />
      </Modal>

      <Modal
        opened={playSimulation !== null}
        onClose={() => {
          // setPlaySimulation(null);
          getUserimulation();
          // navigate("/allsimualtions");
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
            // border:'violet solid 1px',
            padding: 0,
            margin: 0,
          },
        }}
        style={{
          zIndex: 9999,
        }}
        // size="xl"
        size="auto"
        m={0}
        padding={0}
        lockScroll
        // centered
        fullScreen
      >
        {playSimulation !== null && (
          <CanvasDraw
            onCloseClick={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED
              );
              // navigate.
              // navigate("/allsimualtions");
              getUserimulation();

              setPlaySimulation(null);
              navigate(-1);
            }}
            simulation={playSimulation}
          >
            <Center
              style={{
                height: "100%",
                width: "100%",
                // border:'red solid 1px'
              }}
            >
              <ContentSimulation
                simulationId={playSimulation._id}
                paramValue={paramValue}
                mySimulaitonId={mySimulationId}
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
                        dispatch(
                          isPremiumModalOpenedActions.setModalValue(true)
                        );
                      } else {
                          simulationclickHandler({
                            _id: simulation._id,
                            name: simulation.name,
                            isthreejs: simulation?.isthreejs
                          });

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
                        simulationclickHandler({
                          _id: simulation._id,
                          name: simulation.name,
                          isthreejs: simulation?.isthreejs
                        });
                      } else {
                        simulationclickHandler({
                          _id: simulation._id,
                          name: simulation.name,
                          isthreejs: simulation?.isthreejs
                        });
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
                    src={require("../../assets/playBtn.png")}
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
              <Flex align={"center"} gap={20}>
                <p style={{ fontWeight: "700", fontSize: "25px" }}>
                  {simulation?.name}
                </p>
              </Flex>
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
                      dispatch(isPremiumModalOpenedActions.setModalValue(true));
                    } else {
                      if (simulation)
                        simulationclickHandler({
                          _id: simulation._id,
                          name: simulation.name,
                          isthreejs: simulation?.isthreejs
                        });
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
                        simulationclickHandler({
                          _id: simulation._id,
                          name: simulation.name,
                          isthreejs: simulation?.isthreejs
                        });
                    } else {
                      if (simulation)
                        simulationclickHandler({
                          _id: simulation._id,
                          name: simulation.name,
                          isthreejs: simulation?.isthreejs
                        });
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
                  src={require("../../assets/playBtn.png")}
                  alt="Play"
                  style={{ width: "21px", height: "21px" }}
                />
                <span style={{ marginLeft: "10px", color: "white" }}>Play</span>
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

      <Modal
        opened={downloadSimulationsModal}
        onClose={() => {
          setDownloadSimulationsModal(false);
        }}
        withCloseButton={false}
        padding={0}
        zIndex={9999}
        styles={{
          modal: {
            padding: 0,
            borderRadius: "14px",
          },
        }}
        size="auto"
        centered
        p={0}
        m={0}
      >
        <Flex
          w={isMd ? "90vw" : "60vw"}
          // h="80vh"
          // h="60vh"
          style={{
            aspectRatio: isMd ? 0.65 : 1.92,
            position: "relative",
            borderRadius: 32,
            // border: "red solid 1px",
          }}
        >
          <img
            src={require("../../assets/premiumBackground.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <Stack
            w="100%"
            h="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            spacing={0}
          >
            <Flex
              w="100%"
              justify="space-between"
              align="center"
              px={isMd ? 20 : 30}
              py={10}
            >
              <Text fz={isMd ? 24 : 28} color="white" fw={600}>
                Grow with Vignam
              </Text>
              <Box
                onClick={() => {
                  setDownloadSimulationsModal(false);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <IconCross2 col="white" />
              </Box>
            </Flex>
            <Flex w="100%" h="100%" direction={isMd ? "column" : "row"}>
              <>
                <Stack
                  h="100%"
                  w={isMd ? "100%" : "40%"}
                  justify="center"
                  pl={isMd ? 0 : 60}
                  spacing={isMd ? 16 : 40}
                  style={{
                    order: isMd ? 2 : 1,
                  }}
                >
                  <Text
                    fz={isMd ? 24 : 32}
                    fw={800}
                    color="white"
                    ta={isMd ? "center" : "left"}
                    w="100%"
                  >
                    Contact Sales
                  </Text>
                  <Text
                    fz={isMd ? 16 : 20}
                    fw={400}
                    color="white"
                    ta={isMd ? "center" : "left"}
                  >
                    This is a premium feature. To access this feature, please
                    contact our sales team.
                  </Text>
                  <Flex justify={isMd ? "center" : "left"}>
                    <Button
                      bg="white"
                      style={{
                        borderRadius: "30px",
                        background: "white",
                      }}
                      size={isMd ? "md" : "xl"}
                      px={isMd ? 50 : 90}
                      onClick={() => {
                        setDownloadSimulationsModal(false);
                      }}
                    >
                      <Text className="gradient-text" fz={18} fw={700}>
                        Okay
                      </Text>
                    </Button>
                  </Flex>
                </Stack>
                {isMd && (
                  <Stack
                    w="100%"
                    h="70%"
                    justify="center"
                    align="center"
                    style={{
                      order: isMd ? 1 : 2,
                    }}
                    mt={30}
                    // pl={50}
                  >
                    <img
                      src={require("../../assets/premiuimBannerPic2.png")}
                      width="90%"

                      // width="80%"
                    />
                  </Stack>
                )}
                {!isMd && (
                  <Stack
                    w="60%"
                    justify="center"
                    align="center"
                    style={{
                      order: isMd ? 1 : 2,
                    }}
                    // pl={50}
                  >
                    <img
                      src={require("../../assets/premiuimBannerPic2.png")}
                      width="80%"
                    />
                  </Stack>
                )}
              </>
            </Flex>
          </Stack>
        </Flex>
      </Modal>
    </>
  );
}
