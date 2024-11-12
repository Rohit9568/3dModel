import {
  Box,
  Center,
  Flex,
  Loader,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconCross2 } from "../_Icons/CustonIcons";
import { IconSearch } from "@tabler/icons";
import { fetchSearch } from "../../features/search/seaarchTagSlice";
import { useNavigate } from "react-router-dom";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { User1 } from "../../@types/User";
import { showNotification } from "@mantine/notifications";

export function SerachBarWeb(props: {
  width: string;
  page: string;
  className?: string;
  subjectName?: string;
  chapterName?: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const [isSearchFailed, setIssearchFailed] = useState<boolean>(false);
  const [inputValue, setInputvalue] = useState<string>("");
  const [topics, setTopics] = useState<
    | {
        _id: string;
        name: string;
        chapterId: string;
        subjectId: string;
      }[]
    | null
  >(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [simulations, setSimulations] = useState<
    | {
        _id: string;
        name: string;
      }[]
    | null
  >(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  useEffect(() => {
    const closeDropdown = (e: any) => {
      if (isOpen && !e.target.closest(".dropdown")) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener("click", closeDropdown);

    return () => {
      document.body.removeEventListener("click", closeDropdown);
    };
  }, [isOpen]);
  function handleSearch() {
    if (props.className && props.subjectName)
      Mixpanel.track(WebAppEvents.TEACHER_APP_SEARCH_CLICKED, {
        location: props.page,
        subjectName: props.subjectName,
        className: props.className,
      });
    else if (props.chapterName && props.className && props.subjectName)
      Mixpanel.track(WebAppEvents.TEACHER_APP_SEARCH_CLICKED, {
        location: props.page,
        subjectName: props.subjectName,
        className: props.className,
      });
    else {
      Mixpanel.track(WebAppEvents.TEACHER_APP_SEARCH_CLICKED, {
        location: props.page,
      });
    }
    setSimulations(null);
    setTopics(null);
    if (inputValue.trim() !== "") {
      setLoading(true);
      fetchSearch(inputValue)
        .then((x: any) => {
          setLoading(false);
          setTopics(x.topics);
          setSimulations(x.simulations);
          if (x.topics.length === 0 && x.simulations.length === 0) {
            setIssearchFailed(true);
          } else {
            setIssearchFailed(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  }

  function simulationClickHandler(id: string) {
    setLoading(true);
    navigate(`${mainPath}/teach/simulations?id=${id}`);
  }

  function handlekeyPress(event: any) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }
  useEffect(() => {
    if (simulations !== null || topics !== null) {
      setIsOpen(true);
    }
  }, [simulations, topics]);

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  function showAuthNotification() {
    showNotification({
      message: "You dont have access to simulation",
    });
  }
  return (
    <>
      {!isMd && (
        <Flex
          style={{
            position: "relative",
            width: props.width,
            // border:'red solid 1px',
            height: "100%",
          }}
          align="center"
        >
          <div
            style={{
              width: "100%",
              background: "#F8F9FA",
              border: "1px solid #ABABAB",
              height: "50px",
              // border:'red solid 1px',
              // backgroundColor: "#ECEFFF",
              borderRadius: "8px",
              // marginTop: "3.8rem",
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              // border: "2px solid #e9ecef",
              position: "absolute",
              paddingLeft: "20px",
            }}
          >
            <input
              // autoFocus={true}
              placeholder="Search for chapter, topic, or simulations."
              style={{
                fontSize: "16px",
                border: "0",
                outline: "0",
                background: "transparent",
                width: "90%",
                fontFamily: "Nunito",
                marginLeft: "10px",
              }}
              onChange={(e) => {
                setInputvalue(e.target.value);
              }}
              value={inputValue}
              onKeyDown={handlekeyPress}
            />
            <Flex
              h="100%"
              align="center"
              style={{
                cursor: "pointer",
              }}
            >
              {inputValue !== "" && (
                <Flex
                  w="50px"
                  align="center"
                  justify="center"
                  onClick={() => {
                    setInputvalue("");
                  }}
                >
                  <IconCross2 size="22" />
                  {/* <img
                        alt="Cross"
                        src={require("../../assets/cross.png")}
                        style={{
                          width: "18px",
                          height: "18px",
                          // marginRight: "10px",
                        }}
                      /> */}
                </Flex>
              )}
              <Flex
                w="70px"
                align="center"
                justify="center"
                style={{
                  borderLeft: "1px solid #00000033",
                  // strokeWidth: "1px",
                  // stroke: "#000B45",
                  // opacity: 0.2,
                  borderRadius: "0px 8px 8px 0px",
                  // fill: "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #ECEFFF",
                  // opacity: 0.3,
                  cursor: "pointer",
                }}
                h="100%"
                onClick={handleSearch}
                sx={{
                  "&:hover": {
                    backgroundColor: "#DEE1F0",
                  },
                }}
              >
                <IconSearch color="black" />
              </Flex>
            </Flex>
          </div>
          {((inputValue !== "" &&
            simulations !== null &&
            topics !== null &&
            isOpen) ||
            isLoading) && (
            <Box
              style={{
                position: "absolute",
                top: props.page === "outer page" ? 60 : 30,
                zIndex: 999,
                width: "100%",
                height: "300px",
                // border: "red solid 1px",
                backgroundColor: "white",
                boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.61)",
                borderRadius: "8px",
              }}
              className="dropdown"
            >
              <ScrollArea h="300px" pb={20}>
                <Stack h="300px" px={10} pt={10}>
                  <Stack spacing={1}>
                    {isSearchFailed === false &&
                      simulations &&
                      simulations.length > 0 && (
                        <Stack px={15} spacing={1} mt={10}>
                          <Text
                            fz={16}
                            color="#000000"
                            style={{
                              opacity: 0.56,
                            }}
                            fw={500}
                            mb={5}
                          >
                            Simulations({simulations.length})
                          </Text>
                          <Stack spacing={1} mx={-8}>
                            {simulations.map((x) => {
                              return (
                                <Text
                                  fz={18}
                                  fw={500}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "#4B65F6",
                                      color: "white",
                                      borderRadius: "8px",
                                    },
                                    cursor: "pointer",
                                    // border:'red solid 1px'
                                  }}
                                  pl={8}
                                  py={8}
                                  onClick={() => {
                                    Mixpanel.track(
                                      WebAppEvents.TEACHER_APP_SEARCH_ITEM_CLICKED,
                                      {
                                        type: "simulation",
                                        name: x.name,
                                      }
                                    );
                                    if (
                                      user?.featureAccess?.simualtionAccess ===
                                      false
                                    ) {
                                      showAuthNotification();
                                    } else simulationClickHandler(x._id);
                                  }}
                                >
                                  {x.name}
                                </Text>
                              );
                            })}
                          </Stack>
                        </Stack>
                      )}
                    {isSearchFailed === false &&
                      topics &&
                      topics.length > 0 && (
                        <>
                          <Stack px={15} mt={5} spacing={1}>
                            <Text
                              fz={16}
                              color="#000000"
                              style={{
                                opacity: 0.56,
                              }}
                              fw={500}
                              mb={5}
                            >
                              Topic({topics.length})
                            </Text>
                            <Stack spacing={1} mx={-8}>
                              {topics.map((x) => {
                                return (
                                  <Text
                                    fz={18}
                                    fw={500}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "#4B65F6",
                                        color: "white",
                                        borderRadius: "8px",
                                      },
                                      cursor: "pointer",
                                      // border:'red solid 1px'
                                    }}
                                    pl={8}
                                    py={8}
                                    onClick={() => {
                                      setIsOpen(false);
                                      Mixpanel.track(
                                        WebAppEvents.TEACHER_APP_SEARCH_ITEM_CLICKED,
                                        {
                                          type: "topic",
                                          name: x.name,
                                        }
                                      );
                                      // if (
                                      //   user?.featureAccess
                                      //     ?.simualtionAccess === false
                                      // ) {
                                      //   showAuthNotification();
                                      // } else {
                                      navigate(
                                        `${mainPath}/teach/study/${x.subjectId}/${x.chapterId}?topicId=${x._id}`
                                      );
                                      // }
                                    }}
                                  >
                                    {x.name}
                                  </Text>
                                );
                              })}
                            </Stack>
                          </Stack>
                        </>
                      )}
                  </Stack>
                  {isSearchFailed && !isLoading && (
                    <Flex
                      ta={"center"}
                      justify="center"
                      align={"center"}
                      direction={"column"}
                      h="100%"
                      // style={{
                      //   border:'red solid 1px'
                      // }}
                    >
                      <img
                        src={require("../../assets/No results.png")}
                        alt="No Results"
                        style={{
                          width: "65px",
                          height: "65px",
                          marginBottom: "5px",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: "800",
                          color: "#465767",
                        }}
                      >
                        Oops, we haven't got that
                      </span>
                      <br />
                      <span style={{ fontSize: "14px", color: "#465767" }}>
                        Try searching for another chapter, topic or simulation.
                      </span>
                    </Flex>
                  )}
                  {isLoading && (
                    <Center w="100%" h="100%">
                      <Loader />
                    </Center>
                  )}
                </Stack>
              </ScrollArea>
            </Box>
          )}
        </Flex>
      )}
    </>
  );
}
