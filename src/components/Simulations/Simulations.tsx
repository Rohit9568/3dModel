import {
  Box,
  Button,
  Center,
  Checkbox,
  Drawer,
  Flex,
  Group,
  Loader,
  Menu,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useClickOutside, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconAdjustments, IconDownload, IconPlus, IconX } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SideBarItems } from "../../@types/SideBar.d";
import { User1 } from "../../@types/User";
import "../../App.css";
import "../../assets/css/Simulations.css";
import { fetchAllSimulationfilters } from "../../features/Simulationfilters/getSimulationFilterSlice";
import {
  fetchAllSimulationWithPaginationAndFilters,
  getSimulationById,
} from "../../features/Simulations/getSimulationSlice";
import useParentCommunication from "../../hooks/useParentCommunication";
import { checkIfPacakgeIsAvailable } from "../../pages/AllSimulations/AllSimulations";
import { RootState } from "../../store/ReduxStore";
import { isPremiumModalOpened } from "../../store/premiumModalSlice";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import MobileFilterMain from "./MobileFilterMain";
import filterImg from "../../assets/filterbutimg.png";
import { showNotification } from "@mantine/notifications";
export const useStyles = createStyles((theme) => ({
  innerCard: {
    width: "100%",
    height: "auto",
    backgroundSize: "cover",
  },
  hoverBtn: {
    background: "white",
  },

  innerCard1: {
    [theme.fn.largerThan("xl")]: {
      height: 240,
    },
    [theme.fn.largerThan("md") && theme.fn.smallerThan("xl")]: {
      height: 240,
    },
    [theme.fn.largerThan("xs") && theme.fn.smallerThan("md")]: {
      height: 300,
    },
    cursor: "pointer",
    borderRadius: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    // backgroundSize: "cover",
    backgroundPosition: "center",
    // background: theme.fn.linearGradient(
    //   180,
    //   "transparent",
    //   "transparent",
    //   theme.colors.dark[5]
    // ),
  },
  title: {
    fontFamily: `Greycliff CF ${theme.fontFamily}`,
    fontWeight: 900,
    color: "black",
    fontSize: 25,
    marginTop: theme.spacing.xs,
    marginBottom: 10,
  },
  scrollArea: {
    padding: 20,
    maxHeight: 600,
    [theme.fn.smallerThan("sm")]: { paddingLeft: 0, paddingRight: 0 },
  },
  onHover: {
    cursor: "pointer",
    border: "solid 2px #3174F3",
  },
}));

function generateLightColorHsl() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * (100 + 1)) + "%";
  const lightness = Math.floor((1 + Math.random()) * (100 / 2 + 1)) + "%";
  return "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
}

interface SimulationCardInterface {
  _id: string;
  name: string;
  lgNo?: number;
  isthreejs?:boolean;
  imageUrl: string | undefined;
  simulationTags: string[];
  setShowAuthModal: (val: boolean) => void;
  setSimualtionId: (val: string) => void;
  setPlaySimulation: (id: string, isthreejs?: boolean) => void;
  paramValue: string | null;
  userSubscriptionType: string;
  isSimulationPremium: boolean;
  setModalSimulation: (
    val: {
      name: string;
      _id: string;
      isSimulationPremium: boolean;
      videoUrl: string;
      isthreejs?: boolean;
    } | null
  ) => void;
  videoUrl: string;
  showInfo: boolean;
  simulationClickHandler?: (name: string, _id: string, isthreejs?: boolean) => void;
  setDownloadModal?: (val: boolean) => void;
  simulation?: SimulationData;
}
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

export function SimulationCard(props: SimulationCardInterface) {
  const { classes } = useStyles();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const matches = useMediaQuery("(min-width: 56.25em)");
  const [opened, { open, close }] = useDisclosure(false);
  const [modalHover, setModalHover] = useState(false);
  const [freeUserModal, setFreeUserModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<SideBarItems>(
    SideBarItems.NULL
  );
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

  const navigate = useNavigate();

  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );
  const { sendDataToReactnative } = useParentCommunication();
  const handleDownload = (fileUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    //@ts-ignore
    if (window.ReactNativeWebView)
      sendDataToReactnative(1, {
        url: fileUrl,
        name,
      });
    else link.click();
    document.body.removeChild(link);
  };
  const [downloadMenuOpened, setDownloadMenuOpened] = useState(false);
  const ref = useClickOutside(() => setDownloadMenuOpened(false));
  return (
    <>
      <Box
        style={{
          cursor: "pointer",
          padding: matches ? "30px 20px" : "15px 10px",
        }}
        onClick={() => {
          props.setModalSimulation({
            name: props.name,
            _id: props._id,
            isSimulationPremium: props.isSimulationPremium,
            videoUrl: props.videoUrl,
            isthreejs: props.isthreejs
          });
          // console.log("clicked card", props._id)
          // console.log("props are: ", props)
          // let currentPath = window.location.pathname;
          // if(props._id == "SIM-vc123"){
          //   // navigate(`${currentPath}/${props._id}`)
          // }
        }}
      >
        <div className="simulation-card" style={{ position: "relative" }}>
          <img
            src={props.imageUrl}
            alt="Props"
            style={{
              width: "100%",
              cursor: "pointer",
              aspectRatio: 1.8,
              // height: matches ? "170px" : "102px",
            }}
            onClick={(e) => {
              // e.stopPropagation();
              // if (props.userSubscriptionType === "FREE") {
              //   if (
              //     props.isSimulationPremium === undefined ||
              //     props.isSimulationPremium
              //   ) {
              //     setModalOpened(false);
              //     dispatch(isPremiumModalOpenedActions.setModalValue(true));
              //   } else {
              //     simulationclickHandler(props._id);
              //   }
              // } else if (props.userSubscriptionType !== "FREE") {
              //   if (
              //     props.isSimulationPremium === undefined ||
              //     props.isSimulationPremium
              //   ) {
              //     simulationclickHandler(props._id);
              //   } else {
              //     simulationclickHandler(props._id);
              //   }
              // }
              props.setModalSimulation({
                name: props.name,
                _id: props._id,
                isSimulationPremium: props.isSimulationPremium,
                videoUrl: props.videoUrl,
                isthreejs: props.isthreejs
              });
              if (props.paramValue && props.paramValue === "parent") {
                Mixpanel.track(
                  ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                  {
                    simulationName: props.name,
                    id: props._id,
                  }
                );
              } else
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                  {
                    simulationName: props.name,
                    id: props._id,
                  }
                );
            }}
            className="simulation-img"
          />

          <Button
            variant="light"
            size="xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              width: "50px",
              height: "50px",
              transform: "translate(-50%, -50%)",
              padding: "10px",
              border: "3px solid white",
              borderColor: "white",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "18px",
              transition: "background-color 0.3s",
              opacity: hovered ? 0.8 : 1,
              backgroundColor: hovered ? "lightgrey" : "transparent",
            }}
            onClick={(e) => {
              e.stopPropagation();

              if (props.userSubscriptionType === "FREE") {
                if (
                  props.isSimulationPremium === undefined ||
                  props.isSimulationPremium
                ) {
                  Mixpanel.track(
                    WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                    {
                      feature_name: "premium_simulation_accessed",
                      current_page: "all_simulations_page",
                    }
                  );
                  dispatch(isPremiumModalOpenedActions.setModalValue(true));
                } else {
                  props.setPlaySimulation(props._id);
                  if (props.simulationClickHandler) {
                    props.simulationClickHandler(props.name, props._id, props.isthreejs);
                  }
                }
              } else if (props.userSubscriptionType !== "FREE") {
                if (
                  props.isSimulationPremium === undefined ||
                  props.isSimulationPremium
                ) {
                  props.setPlaySimulation(props._id);
                  if (props.simulationClickHandler) {
                    props.simulationClickHandler(props.name, props._id, props.isthreejs);
                  }
                } else {
                  props.setPlaySimulation(props._id);
                  if (props.simulationClickHandler) {
                    props.simulationClickHandler(props.name, props._id, props.isthreejs);
                  }
                }
              }
              if (props.paramValue && props.paramValue === "parent") {
                Mixpanel.track(
                  ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                  {
                    simulationName: props.name,
                    id: props._id,
                  }
                );
              } else
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                  {
                    simulationName: props.name,
                    id: props._id,
                  }
                );
            }}
          >
            <img
              src={require("../../assets/playBtn.png")}
              alt="Play"
              style={{ width: "18px", height: "18px" }}
            />
          </Button>
          {/* {props.isSimulationPremium === undefined ||
          props.isSimulationPremium ? (
            <img
              src={require("../../assets/premiumImg.png")}
              alt="Premium"
              style={{
                position: "absolute",
                right: "0",
                top: "0",
              }}
            />
          ) : (
            ""
          )} */}

          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                padding: "0.7rem",
                height: isMd ? "80px" : "75px",
                position: "relative",
                width: "100%",
                wordWrap: "break-word",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    className={classes.title}
                    style={{
                      fontSize: "16px",
                      fontFamily: "Nunito",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (props.userSubscriptionType === "FREE") {
                        if (
                          props.isSimulationPremium === undefined ||
                          props.isSimulationPremium
                        ) {
                          Mixpanel.track(
                            WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                            {
                              feature_name: "premium_simulation_accessed",
                              current_page: "all_simulations_page",
                            }
                          );
                          dispatch(
                            isPremiumModalOpenedActions.setModalValue(true)
                          );
                        } else {
                          props.setPlaySimulation(props._id);
                        }
                      } else if (props.userSubscriptionType !== "FREE") {
                        if (
                          props.isSimulationPremium === undefined ||
                          props.isSimulationPremium
                        ) {
                          props.setPlaySimulation(props._id);
                        } else {
                          props.setPlaySimulation(props._id);
                        }
                      }
                      if (props.paramValue && props.paramValue === "parent") {
                        Mixpanel.track(
                          ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                          {
                            simulationName: props.name,
                            id: props._id,
                          }
                        );
                      } else
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED,
                          {
                            simulationName: props.name,
                            id: props._id,
                          }
                        );
                    }}
                  >
                    {isMd ? (
                      props.name.length > 15 ? (
                        <>{props.name.slice(0, 15)}...</>
                      ) : (
                        <>{props.name}</>
                      )
                    ) : (
                      <>{props.name}</>
                    )}
                  </span>
                </div>
                <Box>
                  <Flex>
                    {props.showInfo === true && (
                      <img
                        alt="Info"
                        src={require(`../../assets/infoBtn${
                          modalHover ? "2" : ""
                        }.png`)}
                        onClick={() => {
                          props.setModalSimulation({
                            name: props.name,
                            _id: props._id,
                            isSimulationPremium: props.isSimulationPremium,
                            videoUrl: props.videoUrl,
                            isthreejs: props.isthreejs
                          });
                        }}
                        style={{
                          cursor: "pointer",
                          width: "30px",
                          aspectRatio: 1,
                        }}
                        onMouseEnter={() => setModalHover(true)}
                        onMouseLeave={() => setModalHover(false)}
                      />
                    )}
                  </Flex>
                </Box>
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-end",
                  gap: "7px",
                  alignItems: "center",
                  color: "#707070",
                  // position: "absolute",
                  left: "10px",
                  marginTop: "-15px",
                  overflow: "hidden",
                  width: "100%",
                  // wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {props.simulationTags
                  .slice(0, isMd ? 2 : 2)
                  .map((tag, index) => (
                    <React.Fragment key={index}>
                      {index !== 0 && (
                        <span
                          style={{
                            height: "4px",
                            width: "4px",
                            backgroundColor: "#707070",
                            borderRadius: "3px",
                          }}
                        ></span>
                      )}
                      <p style={{ fontSize: "12px" }} className="simu-tag">
                        {isMd ? (
                          tag.length > 17 ? (
                            <>{tag.slice(0, 17)}...</>
                          ) : (
                            <>{tag}</>
                          )
                        ) : (
                          <>{tag.split(" ")[0]}</>
                        )}
                      </p>
                      {isMd ? <br></br> : <></>}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
interface FilterComponentProps {
  filteredParameters: FilterParameters;
  setFilteredParametes: (val: any) => void;
  typeFilter: string[];
  settypeFilter: (val: string[]) => void;
  labels: Simulationfilters[];
  gradeFilter: string[];
  setGradeFilter: (val: React.SetStateAction<string[]>) => void;
  userSubjects: UserClassAndSubjects[];
  miscellaneous: boolean;
  setMiscellaneous: (val: React.SetStateAction<boolean>) => void;
}

export function isPrimary(grade: number) {
  return grade > 0 && grade <= 5;
}
export function isSecondary(grade: number) {
  return grade > 5 && grade <= 12;
}
const FilterComponent = (props: FilterComponentProps) => {
  const [toggleItems, setToggleItems] = useState([true, true, true]);
  const [isPrimaryCheck, setPrimaryCheck] = useState<boolean>(false);
  const [isSecondaryCheck, setSecondaryCheck] = useState<boolean>(false);

  const gradesOnly = props.userSubjects.filter((x) => {
    if (x.grade !== -1) return true;
    return false;
  });

  function handleToggle(index: number) {
    setToggleItems((prev) => {
      const prev1 = [...prev];
      prev1[index] = !prev1[index];
      return prev1;
    });
  }

  const primaryClasses = gradesOnly.filter((x) => {
    return isPrimary(x.grade);
  });

  const primaryClassesArray = primaryClasses.map((x) => x.classId);

  const secondaryClasses = gradesOnly.filter((x) => {
    return isSecondary(x.grade);
  });
  const secondaryClassesArray = secondaryClasses.map((x) => x.classId);

  useEffect(() => {
    if (props.gradeFilter.length !== 0) {
      if (
        props.gradeFilter.filter((x) => {
          return primaryClassesArray.includes(x);
        }).length === primaryClasses.length
      ) {
        setPrimaryCheck(true);
      } else {
        setPrimaryCheck(false);
      }
    }
  }, [props.gradeFilter]);
  useEffect(() => {
    if (props.gradeFilter.length !== 0) {
      if (
        props.gradeFilter.filter((x) => {
          return secondaryClassesArray.includes(x);
        }).length === secondaryClasses.length
      ) {
        setSecondaryCheck(true);
      } else {
        setSecondaryCheck(false);
      }
    }
  }, [props.gradeFilter]);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Flex
        justify="space-between"
        onClick={() => {
          handleToggle(0);
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: "24px" }}>Subjects</Text>
        {toggleItems[0] ? (
          <IconX
            style={{
              fontWeight: "600",
              color: "#808080",
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        ) : (
          <IconPlus
            style={{
              fontWeight: "600",
              color: "#808080",
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        )}
      </Flex>
      {toggleItems[0] && (
        <Checkbox.Group
          style={{ fontSize: "18px", fontWeight: 400 }}
          onChange={(val) => {
            props.setFilteredParametes((prev: any) => {
              return {
                ...prev,
                labelids: val,
              };
            });
          }}
          value={props.filteredParameters.labelids}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 400,
              fontSize: "18px",
            }}
          >
            {props.labels.map((subItem, subIndex: number) => (
              <label
                key={subIndex}
                style={{
                  display: "block",
                  marginBottom: "0.6rem",
                  fontSize: "18px",
                  fontWeight: 400,
                }}
              >
                <Checkbox
                  size="lg"
                  label={subItem.subject}
                  style={{
                    fontWeight: 400,
                    fontSize: "18px",
                    height: "24px",
                    width: "24px",
                  }}
                  styles={{
                    label: { fontSize: "18px" },
                  }}
                  value={subItem._id}
                />
              </label>
            ))}
          </div>
        </Checkbox.Group>
      )}

      <Flex
        justify="space-between"
        onClick={() => {
          handleToggle(1);
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: "24px" }}>Type</Text>
        {toggleItems[1] ? (
          <IconX
            style={{
              fontWeight: "600",
              color: "#808080",
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        ) : (
          <IconPlus
            style={{
              fontWeight: "600",
              color: "#808080",
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        )}
      </Flex>
      {toggleItems[1] && (
        <Checkbox.Group
          onChange={props.settypeFilter}
          value={props.typeFilter}
          mb={10}
        >
          <div style={{ flexDirection: "column", fontWeight: 400 }}>
            <div style={{ marginBottom: "0.6rem" }}>
              <Checkbox
                size="sm"
                label="3D simulations"
                style={{ fontSize: "12px" }}
                value="FREE"
                styles={{
                  label: { fontSize: "18px" },
                }}
              />
            </div>
            <div>
              <Checkbox
                size="sm"
                label="Interactive simulations"
                style={{ fontSize: "12px" }}
                value="PREMIUM"
                styles={{
                  label: { fontSize: "18px" },
                }}
              />
            </div>
          </div>
        </Checkbox.Group>
      )}

      <Flex
        onClick={() => {
          handleToggle(2);
        }}
        justify="space-between"
      >
        <Text style={{ fontWeight: 600, fontSize: "24px" }}>Grades</Text>
        {toggleItems[2] ? (
          <IconX
            style={{
              fontWeight: "600",
              color: "#808080",
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        ) : (
          <IconPlus
            style={{
              fontWeight: "600",
              color: "#808080",
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        )}
      </Flex>
      {toggleItems[2] && (
        <Stack mt={20} spacing={10}>
          <Flex>
            {primaryClasses.length > 0 && (
              <Checkbox
                checked={isPrimaryCheck}
                onChange={(e) => {
                  if (isPrimaryCheck) {
                    props.setGradeFilter((prev) => {
                      const prev1 = prev.filter((x) => {
                        return !primaryClassesArray.includes(x);
                      });
                      return prev1;
                    });
                    setPrimaryCheck(false);
                  } else {
                    props.setGradeFilter((prev) => {
                      const prev1 = prev.filter((x) => {
                        return !primaryClassesArray.includes(x);
                      });
                      const prev2 = prev1.concat(primaryClassesArray);
                      return prev2;
                    });
                  }
                }}
                label="Primary School"
                styles={{
                  label: {
                    fontSize: "18px",
                  },
                }}
              />
            )}
          </Flex>
          <Checkbox.Group
            value={props.gradeFilter}
            onChange={props.setGradeFilter}
            ml={20}
            spacing={10}
          >
            {primaryClasses.map((x) => {
              return (
                <Flex w="100%">
                  <Checkbox
                    value={x.classId}
                    label={"Grade " + x.grade}
                    styles={{
                      label: {
                        fontSize: "18px",
                      },
                    }}
                  ></Checkbox>
                </Flex>
              );
            })}
          </Checkbox.Group>
          {secondaryClasses.length > 0 && (
            <Checkbox
              label="Secondary School"
              checked={isSecondaryCheck}
              styles={{
                label: {
                  fontSize: "18px",
                },
              }}
              mt={10}
              onChange={(e) => {
                if (isSecondaryCheck) {
                  props.setGradeFilter((prev) => {
                    const prev1 = prev.filter((x) => {
                      return !secondaryClassesArray.includes(x);
                    });
                    return prev1;
                  });
                  setSecondaryCheck(false);
                } else {
                  props.setGradeFilter((prev) => {
                    const prev1 = prev.filter((x) => {
                      return !secondaryClassesArray.includes(x);
                    });
                    const prev2 = prev1.concat(secondaryClassesArray);
                    return prev2;
                  });
                }
              }}
            >
              Secondary School
            </Checkbox>
          )}

          <Checkbox.Group
            value={props.gradeFilter}
            onChange={props.setGradeFilter}
            ml={20}
            spacing={10}
          >
            {secondaryClasses.map((x) => {
              return (
                <Flex w="100%">
                  <Checkbox
                    value={x.classId}
                    label={"Grade " + x.grade}
                    styles={{
                      label: {
                        fontSize: "16px",
                      },
                    }}
                  ></Checkbox>
                </Flex>
              );
            })}
          </Checkbox.Group>
          <Checkbox
            // checked={isPrimaryCheck}
            checked={props.miscellaneous}
            onChange={(e) => {
              props.setMiscellaneous((prev) => !prev);
              // if (isPrimaryCheck) {
              //   props.setGradeFilter((prev) => {
              //     const prev1 = prev.filter((x) => {
              //       return !primaryClassesArray.includes(x);
              //     });
              //     return prev1;
              //   });
              // } else {
              //   props.setGradeFilter((prev) => {
              //     const prev1 = prev.filter((x) => {
              //       return !primaryClassesArray.includes(x);
              //     });
              //     const prev2 = prev1.concat(primaryClassesArray);
              //     return prev2;
              //   });
              // }
            }}
            label="Miscellaneous "
            styles={{
              label: {
                fontSize: "18px",
              },
            }}
          />
        </Stack>
      )}
    </div>
  );
};

interface SimulationInterface {
  skip: number;
  searchQuery: string;
  setLoadingData: (val: boolean) => void;
  loadingData: boolean;
  setSearchQuery: (val: string) => void;

  isComplete: boolean;
  setisComplete: (val: boolean) => void;
  setSkip: (val: any) => void;
  paramValue: string | null;
  setModalSimulation: (val: any) => void;
  setVideoLoaded: (val: boolean) => void;
  setPlaySimulation: (
    val: {
      name: string;
      _id: string;
      isthreejs?: boolean;
    } | null
  ) => void;
  setShowAuthModal: (val: boolean) => void;
  setSimualtionId: (val: string) => void;
  setSimulation: (val: SimulationData | null) => void;
  setFilterClicked: (val: boolean) => void;
  isFilterClicked: boolean;
  setMysimualtionId: (val: string | null) => void;
  userSubjects: UserClassAndSubjects[];
  searchFilterSimulations: SimulationData[];
  filteredSimulations: SimulationData[];
  setFilteredQuery: (val: any) => void;
  setFilteredSimulation: (val: any) => void;
  setDownloadModal: (val: boolean) => void;
}
function cleanString(inputString: string) {
  // Remove extra spaces
  let cleanedString = inputString.replace(/\s+/g, " ");

  // Remove special characters
  cleanedString = cleanedString.replace(/[^\w\s]/gi, "");

  return cleanedString;
}

export function Simulations(props: SimulationInterface) {
  const { classes } = useStyles();
  const [labels, setlabels] = useState<Simulationfilters[]>([]);
  const [simulations, setSimulations] = useState<SimulationData[]>([]);

  const [filteredParameters, setfilteredParameters] =
    useState<FilterParameters>({
      labelids: [],
      type: null,
      subjectIds: [],
      miscellaneous: true,
    });

  useEffect(() => {
    console.log(props.userSubjects);
  }, [props.userSubjects]);

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [gradeFilter, setGradeFilter] = useState<string[]>([]);
  const [miscellaneousFilter, setMiscellaneousFilter] =
    useState<boolean>(false);

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  const [parameterLoading, setParameterLoading] = useState<boolean>(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("play");
  const simulationId = queryParams.get("id");
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: 1200px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isFirstTime, setisForstTime] = useState<boolean>(true);
  let mySet = new Set<string>();
  props.userSubjects.map((x) => {
    x.subjects.map((y) => {
      mySet.add(y.subjectId);
    });
  });
  let myArray = Array.from(mySet);
  useEffect(() => {
    const searchQuery1 = props.searchQuery.toLowerCase();
    props.setFilteredQuery(cleanString(searchQuery1));
  }, [props.searchQuery]);
  useEffect(() => {
    if (props.skip > 0 && !props.isComplete) {
      props.setLoadingData(true);
      fetchAllSimulationWithPaginationAndFilters(props.skip, filteredParameters)
        .then((data) => {
          props.setLoadingData(false);
          const simulations = data as SimulationData[];
          setSimulations((curr) => [...curr, ...simulations]);
        })
        .catch((error) => {
          console.log(error);
          props.setisComplete(true);
          props.setLoadingData(false);
        });
    }
  }, [props.skip]);

  useEffect(() => {
    console.log(props.userSubjects.length, "userSubjects");
    if (props.userSubjects.length !== 0) {
      props.setLoadingData(true);
      setParameterLoading(true);
      let data = { ...filteredParameters };
      if (isFirstTime) {
        data = { ...data, subjectIds: myArray, miscellaneous: true };
        setisForstTime(false);
      }
      fetchAllSimulationWithPaginationAndFilters(0, {
        ...data,
      })
        .then((data) => {
          setParameterLoading(false);
          props.setLoadingData(false);
          props.setSkip(0);
          const simulations = data as SimulationData[];
          setSimulations(simulations);
          props.setisComplete(false);
        })
        .catch((error) => {
          console.log(error);
          setParameterLoading(false);
          props.setLoadingData(false);
          setSimulations([]);
        });
    }
  }, [filteredParameters, props.userSubjects]);

  useEffect(() => {
    props.setLoadingData(true);
    fetchAllSimulationfilters()
      .then((data) => {
        props.setLoadingData(false);
        const simulationsfilters = data as Simulationfilters[];
        const findLabel = simulationsfilters.find(
          (x) => x.subject === "All Simulations"
        );
        const labels = simulationsfilters.filter(
          (x) => findLabel?._id !== x._id
        );
        setlabels(labels);
      })
      .catch((error) => {
        props.setLoadingData(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (simulationId)
      getSimulationById({ id: simulationId })
        .then((x: any) => {
          props.setModalSimulation({
            _id: x._id,
            name: x.name,
            isSimulationPremium: x.isSimulationPremium,
            videoUrl: x.videoUrl,
            isthreejs: x.isthreejs
          });
        })
        .catch((e) => {
          console.log(e);
        });
  }, [simulationId]);

  useEffect(() => {
    if (!paramValue) {
      props.setPlaySimulation(null);
      props.setSimulation(null);
    }
  }, [paramValue]);

  useEffect(() => {
    props.setFilteredSimulation(simulations);
  }, [simulations]);

  useEffect(() => {
    if (props.searchFilterSimulations.length <= 8 && simulations.length !== 0) {
      props.setSkip((prev: any) => {
        return prev + 12;
      });
    }
  }, [props.searchFilterSimulations]);

  const navigate = useNavigate();

  useEffect(() => {
    setfilteredParameters((prev) => {
      if (typeFilter.length === 1) {
        if (typeFilter[0] === "FREE") {
          return { ...prev, type: "FREE" };
        }
        if (typeFilter[0] === "PREMIUM") {
          return { ...prev, type: "PREMIUM" };
        }
      }
      if (typeFilter.length === 0) return { ...prev, type: null };
      else {
        return { ...prev, type: "BOTH" };
      }
    });
  }, [typeFilter]);

  // useEffect(() => {
  //   let mySet = new Set<string>();
  // }, [props.userSubjects]);

  function getSubjectsFromSelectedGrades(gradeFilter: string[]) {
    let mySet = new Set<string>();

    if (gradeFilter.length === 0) {
      props.userSubjects.map((x) => {
        x.subjects.map((y) => {
          mySet.add(y.subjectId);
        });
      });
    } else {
      gradeFilter.map((x) => {
        const found = props.userSubjects.find((y) => y.classId === x);
        if (found) {
          found.subjects.forEach((subject) => {
            mySet.add(subject.subjectId);
          });
        }
      });
    }
    let myArray = Array.from(mySet);
    return myArray;
  }

  useEffect(() => {
    const myArray = getSubjectsFromSelectedGrades(gradeFilter);
    setfilteredParameters((prev) => {
      return {
        ...prev,
        subjectIds:
          gradeFilter.length === 0 && miscellaneousFilter === true
            ? []
            : myArray,
        miscellaneous:
          (gradeFilter.length !== 0 && miscellaneousFilter) ||
          (gradeFilter.length === 0 && !miscellaneousFilter) ||
          (gradeFilter.length === 0 && prev.miscellaneous)
            ? true
            : false,
        // miscellaneous:gradeFilter.length===0 && !prev.miscellaneous?true
      };
    });
  }, [gradeFilter]);

  function calculateFilters() {
    let noooffilters = 0;
    if (mobilegradeFilter.length > 0) {
      noooffilters += 1;
    }
    if (filteredParameters.labelids.length > 0) {
      noooffilters += 1;
    }
    if (filteredParameters.type !== null || mobileMiscellaneous) {
      noooffilters += 1;
    }
    return noooffilters;
  }

  useEffect(() => {
    if (miscellaneousFilter === true) {
      setfilteredParameters((prev) => {
        return {
          ...prev,
          miscellaneous: true,
          subjectIds: gradeFilter.length === 0 ? [] : prev.subjectIds,
        };
      });
    } else {
      setfilteredParameters((prev) => {
        return {
          ...prev,
          miscellaneous: gradeFilter.length === 0 ? true : false,
          subjectIds: gradeFilter.length === 0 ? myArray : prev.subjectIds,
        };
      });
    }
  }, [miscellaneousFilter]);

  const [mobilegradeFilter, setMobileGradeFilter] = useState<string[]>([]);
  const [mobileMiscellaneous, setMobileMiscellaneous] =
    useState<boolean>(false);

    const [shownsubs, setshownsubs] = useState<string[]>([]);
    const [shownfilters, setshowfilters] = useState<string[]>([]);
    const handleFilteredDisplay = (sub: any, grade: any, labels: any) => {
      setshowfilters([]);
      setshownsubs([]);
      grade.forEach((eachgrade: any) => {
        const filteredSubjects = props.userSubjects.filter((subs: any) => subs.classId === eachgrade);
        const classNames = filteredSubjects.map((subs: any) => subs.className);
        setshowfilters(prevFilters => [...prevFilters, ...classNames]);
      });
      sub.forEach((eachsub: any) => {
        const filteredSubjects = labels.filter((subs: any) => subs._id === eachsub);
        const classNames = filteredSubjects.map((subs: any) => subs.labels);
        setshownsubs(prevFilters => [...prevFilters, ...classNames]);
      });
    }

  return (
    <>     
    <Flex pl={35} pt={20} pb={5} pr={10} sx={{backgroundColor: 'white',  width: '100%', overflowX: 'auto', scrollbarWidth: 'thin', scrollBehavior:'smooth',}} >
    <Button onClick={open} variant="outline" sx={{borderColor: '#B3B3B3'}}>
      <img src={filterImg} /> 
      <Text ml={10}  color="#B3B3B3">Filters</Text>
    </Button>
    {shownsubs.map((subs)=>(
          <Button onClick={open} variant="outline" sx={{borderColor: '#B3B3B3'}} ml={15}> 
          <Text size={13} color="#B3B3B3">{subs}</Text>
        </Button>   
    ))}
    {shownfilters.map((grades)=>(
          <Button onClick={open} variant="outline" sx={{borderColor: '#B3B3B3'}} ml={15}> 
          <Text size={13} color="#B3B3B3">{grades}</Text>
        </Button>   
    ))}
    </Flex> 
    <Flex w="100%">
      <div
        style={{
          height: "calc(100vh - 100px)",
          marginLeft: isMd ? "0px" : "0px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 15px",
            marginBottom: "15px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 400,
            }}
          >
            {props.searchQuery.trim().length !== 0 && (
              <>Search Results for "{props.searchQuery}"</>
            )}
          </span>
          {(
            <>
              <Drawer
                size= {isMd ? "100%" : "30%"}
                opened={opened}
                onClose={close}
                withCloseButton={false}
              >
                <MobileFilterMain
                  labels={labels}
                  setfilterclicked={props.setFilterClicked}
                  onSubmit={(filteredParameters1, grades) => {
                    close();
                    handleFilteredDisplay(filteredParameters1.labelids, grades, labels);
                    let filter1: any = null;
                    if (filteredParameters1.type.length === 1) {
                      if (filteredParameters1.type[0] === "FREE") {
                        filter1 = "FREE";
                      }
                      if (filteredParameters1.type[0] === "PREMIUM") {
                        filter1 = "PREMIUM";
                      }
                    } else if (filteredParameters1.type.length === 2) {
                      filter1 = "BOTH";
                    }
                    const subjects1 = getSubjectsFromSelectedGrades(grades);
                    setfilteredParameters((prev) => {
                      return {
                        ...filteredParameters1,
                        type: filter1,
                        subjectIds:
                          grades.length === 0 && mobileMiscellaneous
                            ? []
                            : subjects1,
                        miscellaneous:
                          grades.length === 0 || mobileMiscellaneous
                            ? true
                            : false,
                      };
                    });
                  }}
                  onClose={close}
                  currentFilter={filteredParameters}
                  userSubjects={props.userSubjects}
                  myArray={myArray}
                  mobilegradeFilter={mobilegradeFilter}
                  setMobileGradeFilter={setMobileGradeFilter}
                  miscellaneous={mobileMiscellaneous}
                  setmiscellaneous={setMobileMiscellaneous}
                />
              </Drawer>
            </>
          )}
        </div>
        <SimpleGrid w="100%" px={10} cols={isMd || isLg ? 2 : 3}>
          {!parameterLoading &&
            props.searchFilterSimulations.map((x, i) => {
              return (
                <>
                  <SimulationCard
                    _id={x._id}
                    name={x.name}
                    isthreejs={x.isthreejs}
                    lgNo={4}
                    imageUrl={x.thumbnailImageUrl}
                    setShowAuthModal={(val) => props.setShowAuthModal(val)}
                    setSimualtionId={(val) => props.setSimualtionId(val)}
                    setPlaySimulation={(id) => {
                      props.setMysimualtionId(null);
                      if(x.isthreejs){
                         navigate(`simulation/${x._id}`)
                      }else{
                        navigate({ search: "play=true" });
                      }
                      props.setPlaySimulation(x);
                      props.setModalSimulation(null);
                      props.setVideoLoaded(false);
                    }}
                    simulationTags={x.simulationTags}
                    paramValue={props.paramValue}
                    userSubscriptionType={
                      props.paramValue === "parent"
                        ? "PREMIUM"
                        : user?.subscriptionModelType ?? ""
                    }
                    isSimulationPremium={x.isSimulationPremium}
                    setModalSimulation={(x) => {
                      props.setSimulation(null);
                      props.setModalSimulation(x);
                    }}
                    videoUrl={x.videoUrl}
                    showInfo={true}
                    setDownloadModal={props.setDownloadModal}
                    simulation={x}
                  />
                </>
              );
            })}
        </SimpleGrid>
        {props.loadingData && (
          <Group position="center">
            <Loader />
          </Group>
        )}
      </div>
    </Flex>
    </>
  );
}
