import  {  useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  Text,
  createStyles,
  Flex,
  Stack,
  Loader,
} from "@mantine/core";
import {  useNavigate } from "react-router-dom";
import { IconSearch} from "@tabler/icons";
import {
  IconCross2,
  IconRadiusLeft,
} from "../../components/_Icons/CustonIcons";
import { fetchSearch } from "../../features/search/seaarchTagSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { showNotification } from "@mantine/notifications";
import { RootState } from "../../store/ReduxStore";
import { User1 } from "../../@types/User";
import { useSelector } from "react-redux";

const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));
export default function SearchPage(props: {
  fromMainPage: boolean;
  page: string;
  className?: string;
  subjectName?: string;
  chapterName?: string;
}) {
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearchFailed, setIssearchFailed] = useState<boolean>(false);
  const [topics, setTopics] = useState<
    {
      _id: string;
      name: string;
      chapterId: string;
      subjectId: string;
    }[]
  >([]);
  const [simulations, setSimulations] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  const [isLoading, setLoading] = useState<boolean>(false);

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
    Mixpanel.track(WebAppEvents.TEACHER_APP_SEARCH_CLICKED);
    if (searchValue.trim() !== "") {
      setLoading(true);
      fetchSearch(searchValue)
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
    } else {
      setSearchValue("");
    }
  }

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  function showAuthNotification() {
    showNotification({
      message: "You dont have access to simulation",
    });
  }
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  function handlekeyPress(event: any) {
    if (event.key === "Enter") {
      event.target.blur();
      handleSearch();
    }
  }

  function simulationClickHandler(id: string) {
    setLoading(true);
    navigate(`${mainPath}/teach/simulations?id=${id}`);
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Flex
        sx={{
          padding: `${isMd ? "10px" : "10px"}`,
          paddingLeft: "10px",
          paddingRight: "10px",
          backgroundColor: "#E9ECEF",
          height: "60px",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
        }}
        style={{
          zIndex: "5",
        }}
        justify={"space-between"}
        align={"center"}
      >
        {" "}
        <button
          style={{
            width: "38px",
            height: "38px",
            padding: "0",
            border: "0",
            outline: "0",
            background: "transparent",
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <IconRadiusLeft />
        </button>
        <input
          // autoFocus={true}
          placeholder="Search for chapter, topic, or simulations."
          style={{
            fontSize: "16px",
            border: "0",
            outline: "0",
            background: "transparent",
            width: "80%",
            fontFamily: "Nunito",
            marginLeft: "15px",
            // paddingLeft: "10px",
          }}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          value={searchValue}
          onKeyDown={handlekeyPress}
        />
        <Flex
          h="100%"
          align="center"
          style={{
            cursor: "pointer",
          }}
        >
          {searchValue !== "" && (
            <Flex
              w="40px"
              align="center"
              justify="center"
              onClick={() => {
                setSearchValue("");
              }}
            >
              <IconCross2 size="18" />
            </Flex>
          )}
          <Flex
            w="50px"
            align="center"
            justify="center"
            style={{
              borderLeft: "2px solid #e9ecef",
              // strokeWidth: "1px",
              // stroke: "#000B45",
              // opacity: 0.2,
              // borderRadius: "0px 8px 8px 0px",
              // fill: "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #ECEFFF",
              // opacity: 0.3,
              cursor: "pointer",
            }}
            h="100%"
            onClick={handleSearch}
          >
            {" "}
            <IconSearch
              style={
                {
                  // border:'red solid 1px',
                  // marginLeft:'10px'
                }
              }
              size="24"
            />
          </Flex>
        </Flex>
        {/* </div> */}
      </Flex>
      <Stack mt={props.fromMainPage ? 60 : 60}>
        {!isLoading && isSearchFailed === false && simulations.length > 0 && (
          <Stack px={15} mt={10} spacing={20}>
            <Text
              fz={16}
              color="#000000"
              style={{
                opacity: 0.56,
              }}
              fw={500}
            >
              Simulations({simulations.length})
            </Text>
            {simulations.map((x) => {
              return (
                <Text
                  fz={18}
                  fw={500}
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (user?.featureAccess?.simualtionAccess === false) {
                      showAuthNotification();
                    } else simulationClickHandler(x._id);
                  }}
                >
                  {x.name}
                </Text>
              );
            })}
          </Stack>
        )}
        {!isLoading && isSearchFailed === false && topics.length > 0 && (
          <Stack px={15} mt={20} spacing={20} pb={30}>
            <Text
              fz={16}
              color="#000000"
              style={{
                opacity: 0.56,
              }}
              fw={500}
            >
              Topic({topics.length})
            </Text>
            {topics.map((x) => {
              return (
                <Text
                  fz={18}
                  fw={500}
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(
                      `${mainPath}/teach/study/${x.subjectId}/${x.chapterId}?topicId=${x._id}`
                    );
                  }}
                >
                  {x.name}
                </Text>
              );
            })}
          </Stack>
        )}

        {isLoading && (
          // <Center w="100%" h="100%" mt="150px">
          <Flex
            ta={"center"}
            px={"md"}
            mt={"xl"}
            align={"center"}
            direction={"column"}
          >
            <Loader />
          </Flex>
        )}
        {!isLoading && isSearchFailed && (
          <Flex
            ta={"center"}
            px={"md"}
            mt={"xl"}
            align={"center"}
            direction={"column"}
          >
            <img
              src={require("../../assets/No results.png")}
              alt="No Results"
              style={{ width: "65px", height: "65px", marginBottom: "5px" }}
            />
            <span
              style={{ fontSize: "24px", fontWeight: "800", color: "#465767" }}
            >
              Oops, we haven't got that
            </span>
            <br />
            <span style={{ fontSize: "14px", color: "#465767" }}>
              Try searching for another chapter, topic or simulation.
            </span>
          </Flex>
        )}
      </Stack>
    </div>
  );
}
