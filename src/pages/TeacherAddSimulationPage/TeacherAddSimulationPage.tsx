import { useEffect, useState } from "react";
import { IsUserLoggedIn } from "../../utilities/AuthUtility";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppShell,
  Group,
  Paper,
  Text,
  createStyles,
  Button,
  Flex,
  Stack,
  Container,
  SimpleGrid,
  LoadingOverlay,
  Overlay,
  Header,
} from "@mantine/core";
import { IconCheck, IconSearch } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { fetchSimulationsByUserId } from "../../features/UserSubject/TeacherSubjectSlice";
import { fetchAllSimulationBySubjectId } from "../../features/Simulations/getSimulationSlice";
import { AddSimulationstoUserTopic } from "../../features/UserSubject/chapterDataSlice";
import { IconCross } from "../../components/_Icons/CustonIcons";
const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));

interface SingleSimulationProps {
  _id: string;
  name: string;
  thumbnail: string;
  selectedSimulations: { id: string; value: boolean }[];
  onSimulationClick: (id: string) => void;
}
function SingleSimulaiton(props: SingleSimulationProps) {
  const { classes, theme } = useStyles();

  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isSelected = props.selectedSimulations.find(
    (x) => x.id === props._id && x.value === true
  )
    ? true
    : false;
  return (
    <div
      style={{
        marginTop: "10px",
        position: "relative",
        width: "min(calc(100vh * (16/9)), 100%)",
        height: "auto",
        aspectRatio: "16/9",
        cursor: "pointer",
        alignContent: "center",
      }}
      onClick={() => {
        props.onSimulationClick(props._id);
      }}
    >
      <img
        src={props.thumbnail}
        style={{
          height: "100%",
          width: "100%",
        }}
        alt="Thumbnail"
      />
      <Text fw={700} style={{ fontSize: `${isMd ? "10px" : ""}` }}>
        {props.name}
      </Text>
      <Overlay color="white" />
      <div
        style={{
          border: `${!isSelected ? "gray solid 5px" : ""}`,
          height: "60px",
          width: "60px",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        {isSelected && (
          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconCheck
              style={{
                height: "90%",
                width: "90%",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export function TeacherAddSimulationPage() {
  const navigate = useNavigate();
  const [selectedSimulations, setSelectedSimulations] = useState<
    { id: string; value: boolean }[]
  >([]);
  const [fetchSimulalations, setFetchSimulations] = useState<
    { _id: string; name: string; thumbnailImageUrl: string }[]
  >([]);
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [filterName, setFilterName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilterSimulations, setSearchfilterSimulations] = useState<
    SimulationData[]
  >([]);
  const [simulationType, setSimulationType] = useState<"ACT" | "SIM" | null>(
    null
  );
  const params = useParams<any>();
  const { classes, theme } = useStyles();
  const [eventFired, setEventFired] = useState(false);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  useEffect(() => {
    setSearchfilterSimulations(() => {
      if (searchQuery === "") return simulations;
      const prevState1 = simulations.filter((x) => {
        return x.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      return prevState1;
    });
  }, [searchQuery]);

  useEffect(() => {
    if (params && params.type === "simulation") setSimulationType("SIM");
    else if (params && params.type === "activity") setSimulationType("ACT");
  }, [params]);
  useEffect(() => {
    let intialState = simulations.map((x) => ({ id: x._id, value: false }));
    intialState = intialState.map((x) => {
      const isSelected = fetchSimulalations.find((y) => y._id === x.id);
      if (isSelected) {
        return {
          id: x.id,
          value: true,
        };
      }
      return x;
    });
    setSelectedSimulations(intialState);
    setSearchfilterSimulations(simulations);
  }, [simulations]);

  const fetchTeacherTopic = async (id: string) => {
    setisLoading(true);
    await fetchSimulationsByUserId({ topic_id: id })
      .then(async (x: any) => {
        const simulations: {
          _id: string;
          name: string;
          thumbnailImageUrl: string;
        }[] = x;
        setFetchSimulations(simulations);
        if (params.subjectId) {
          await fetchAllSimulationBySubjectId(params.subjectId)
            .then((x: any) => {
              setisLoading(false);
              setFilterName(x.name);
              if (simulationType === "SIM") {
                const filtered = x.simulations.filter(
                  (y: any) => y.isSimulation === true
                );
                setSimulations(filtered);
              } else if (simulationType === "ACT") {
                const filtered = x.simulations.filter(
                  (y: any) => y.isActivity === true
                );
                setSimulations(filtered);
              }
            })
            .catch((e) => {
              setisLoading(false);
              console.log(e);
            });
        } else {
          setisLoading(false);
        }
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  };

  const onSubmitClick = async () => {
    Mixpanel.track(
      WebAppEvents.TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_DONE_BUTTON_CLICKED
    );
    setisLoading(true);
    if (params.topicId) {
      const data: string[] = selectedSimulations
        .filter((x) => x.value === true)
        .map((x) => x.id);
      await AddSimulationstoUserTopic({
        id: params.topicId,
        formObj: data,
        chapterId: params.chapterId ?? "",
      })
        .then((data: any) => {
          setisLoading(false);
          navigate(
            `/teach/${params.page}/${params.subjectId}/${params.chapterId}/${data._id}`
          );
        })
        .catch((error: any) => {
          setisLoading(false);
          console.log(error);
          navigate(
            `/teach/${params.page}/${params.subjectId}/${params.chapterId}/${params.topicId}`
          );
        });
    }
  };
  useEffect(() => {
    if (params.topicId && simulationType !== null) {
      fetchTeacherTopic(params.topicId);
    }
  }, [params.topicId, simulationType]);

  useEffect(() => {
    if (IsUserLoggedIn() === false) navigate("/teacher");
  }, []);

  return (
    <AppShell
      header={
        <Header
          height={isMd ? "130px" : "70px"}
          style={{
            zIndex: 9999,
          }}
          ff="Poppins"
        >
          {isMd ? (
            <Flex direction="column" align="center" mt={10} mx={10}>
              <Flex
                align="center"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <div
                    style={{
                      borderRadius: "50%",
                      height: "40px",
                      width: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      padding: "5px",
                      backgroundColor: "#EFEFEF",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(
                        `/teach/${
                          params.type === "simulation" ? "Teach" : "Exercise"
                        }/${params.subjectId}/${params.chapterId}/${
                          params.topicId
                        }`
                      );
                    }}
                  >
                    <IconCross />
                  </div>
                </div>

                <Group>
                  <Text>Select Simulations To Topic</Text>
                </Group>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Button onClick={onSubmitClick}>Done</Button>
                </div>
              </Flex>

              <Flex
                align="center"
                justify="center"
                style={{ width: "100%", marginTop: "10px" }}
              >
                <Paper
                  shadow="sm"
                  radius="sm"
                  style={{
                    filter: "blur(0px)",
                    width: "70%",
                  }}
                >
                  <div className={classes.headerSearch2}>
                    <IconSearch
                      size="20px"
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    <input
                      placeholder="Search "
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        fontSize: "15px",
                        outline: "none",
                        fontStyle: "Poppins",
                      }}
                      value={searchQuery}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_LEARN_PAGE_TOPIC_SECTION_SIMULATION_SELECTION_PANEL_SEARCH_TAB_CLICKED
                        );
                      }}
                      onChange={(e) => {
                        if (!eventFired) {
                          Mixpanel.track(
                            WebAppEvents.TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_SEARCH_QUERY_TYPED
                          );
                          setSearchQuery(e.target.value);
                        }
                      }}
                      onBlur={() => {}}
                      onMouseLeave={() => {
                        setEventFired(true);
                      }}
                    ></input>
                  </div>
                </Paper>
              </Flex>
            </Flex>
          ) : (
            <Flex align="center" mt={10}>
              <div
                style={{
                  width: "10%",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    height: "50px",
                    width: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    padding: "5px",
                    backgroundColor: "#EFEFEF",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(
                      `/teach/${
                        params.type === "simulation" ? "Teach" : "Exercise"
                      }/${params.subjectId}/${params.chapterId}/${
                        params.topicId
                      }`
                    );
                  }}
                >
                  <IconCross />
                </div>
              </div>
              <Flex
                style={{
                  width: "100%",
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <Group mr={10}>
                  <Text style={{}}>Select Simulations To Topic</Text>
                </Group>
                <Paper
                  shadow="sm"
                  radius="sm"
                  style={{
                    filter: "blur(0px)",
                    width: "70%",
                  }}
                >
                  <div className={classes.headerSearch2}>
                    <IconSearch
                      size="20px"
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    <input
                      placeholder="Search "
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        fontSize: "15px",
                        outline: "none",
                        fontStyle: "Poppins",
                      }}
                      value={searchQuery}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_LEARN_PAGE_TOPIC_SECTION_SIMULATION_SELECTION_PANEL_SEARCH_TAB_CLICKED
                        );
                      }}
                      onChange={(e) => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_SEARCH_QUERY_TYPED
                        );
                        setSearchQuery(e.target.value);
                      }}
                      onBlur={() => {}}
                    ></input>
                  </div>
                  {/* <div
                    style={{
                      width: "100%",
                      background: "#F8F9FA",
                      height: "65px",
                      marginTop: "3.8rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <img
                      alt="Search"
                      src={require("../../assets/search-normal.png")}
                      style={{
                        width: "32px",
                        height: "32px",
                        marginRight: "10px",
                      }}
                    />
                    <input
                      autoFocus={true}
                      placeholder="Search for chapter, topic, or simulations."
                      style={{
                        fontSize: "14px",
                        border: "0",
                        outline: "0",
                        background: "transparent",
                        width: "80%",
                        fontFamily: "Nunito",
                      }}
                      value={searchQuery}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_LEARN_PAGE_TOPIC_SECTION_SIMULATION_SELECTION_PANEL_SEARCH_TAB_CLICKED
                        );
                      }}
                      onChange={(e) => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_SEARCH_QUERY_TYPED
                        );
                        setSearchQuery(e.target.value);
                      }}
                      onBlur={() => {}}
                    />
                  </div> */}
                </Paper>
              </Flex>

              <div
                style={{
                  width: "10%",

                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Button onClick={onSubmitClick}>Done</Button>
              </div>
            </Flex>
          )}
        </Header>
      }
    >
      <Container
        size={isMd ? "sm" : isLg ? "lg" : "xl"}
        mt={isMd ? "150px" : "90px"}
      >
        <LoadingOverlay visible={isLoading} />
        <Stack mt={10}>
          <Group>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#D9D9D9",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                padding: "5px",
              }}
            >
              <IconCheck color="black" />
            </div>
            <Text fz={20} fw={600}>
              {filterName}
            </Text>
          </Group>
          <SimpleGrid
            cols={4}
            verticalSpacing={"xl"}
            breakpoints={[
              { maxWidth: "lg", cols: 3, spacing: "md" },
              { maxWidth: "md", cols: 2, spacing: "sm" },
              { maxWidth: "sm", cols: 2, spacing: "sm" },
            ]}
          >
            {searchFilterSimulations.map((x) => {
              return (
                <SingleSimulaiton
                  _id={x._id}
                  name={x.name}
                  thumbnail={x.thumbnailImageUrl ?? ""}
                  selectedSimulations={selectedSimulations}
                  onSimulationClick={(id) => {
                    setSelectedSimulations((prev) => {
                      const prev1 = prev.map((x) => {
                        if (x.id === id) {
                          return {
                            id: id,
                            value: !x.value,
                          };
                        }
                        return x;
                      });
                      return prev1;
                    });
                  }}
                  key={x._id}
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>
    </AppShell>
  );
}
