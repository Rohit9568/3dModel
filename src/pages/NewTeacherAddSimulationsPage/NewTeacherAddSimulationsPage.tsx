import { useEffect, useState } from "react";
import { IsUserLoggedIn } from "../../utilities/AuthUtility";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppShell,
  Group,
  Text,
  createStyles,
  Stack,
  Container,
  SimpleGrid,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { IconCheck, IconSearch } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import {
  fetchCurrentChapter,
  fetchSimulationsByUserId,
} from "../../features/UserSubject/TeacherSubjectSlice";
import { fetchAllSimulationBySubjectId } from "../../features/Simulations/getSimulationSlice";
import { AddSimulationstoUserTopic } from "../../features/UserSubject/chapterDataSlice";
import {
  IconAddSimulationCross
} from "../../components/_Icons/CustonIcons";
import styled from "styled-components";
import { fetchSimulationsByUserChapterId } from "../../features/userChapter/userChapterSlice";
import { chapter } from "../../store/chapterSlice";
const chapterActions = chapter.actions;
const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));

function capitalizeWords(sentence: string) {
  // Split the sentence into an array of words
  const words = sentence.split(" ");

  // Capitalize the first letter of each word and make the rest lowercase
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  // Join the words back into a sentence
  return capitalizedWords.join(" ");
}

interface SingleSimulationProps {
  _id: string;
  name: string;
  thumbnail: string;
  selectedSimulations: { id: string; value: boolean }[];
  onSimulationClick: (id: string) => void;
  simulationTags: string[];
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
        border: "1px #707070 solid",
        paddingBottom: "15px",
        borderRadius: "6px",
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
          borderRadius: "6px 6px 0 0",
        }}
        alt="Thumbnail"
      />
      <Text
        fw={700}
        style={{ fontSize: `${isMd ? "10px" : ""}`, padding: "5px" }}
      >
        {props.name}
      </Text>
      <div
        style={{
          border: `${!isSelected ? "gray solid 5px" : ""}`,
          height: "60px",
          width: "60px",
          borderRadius: "50%",
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
          // zIndex: 999,
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

interface IProps {
  setShowAddSimulationPage: (s: boolean) => void;
  chapterId:string;
  subjectId:string;
  // setOuterSimulations: (s: ISimulation[]) => void
}
export const NewTeacherAddSimulationPage: React.FC<IProps> = ({
  setShowAddSimulationPage,
  chapterId,
  subjectId
}) => {

  const navigate = useNavigate();
  const [selectedSimulations, setSelectedSimulations] = useState<
    { id: string; value: boolean }[]
  >([]);
  const [fetchSimulalations, setFetchSimulations] = useState<
    { _id: string; name: string; thumbnailImageUrl: string }[]
  >([]);
  const [topicSimulations, setTopicSimulations] = useState<
    { _id: string; name: string; thumbnailImageUrl: string }[]
  >([]);
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [filterName, setFilterName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilterSimulations, setSearchfilterSimulations] = useState<any[]>(
    []
  );
  const { classes, theme } = useStyles();
  const [eventFired, setEventFired] = useState(false);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [currentChapter,setCurrentChapter] = useState<SingleChapter>();

  useEffect(() => {
    setSearchfilterSimulations(() => {
      if (searchQuery === "") return simulations;
      const prevState1 = simulations.filter((x) => {
        return x.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      return prevState1;
    });
  }, [searchQuery]);

  useEffect(()=>{
     fetchChapter(chapterId);
  },[])

  useEffect(() => {
    let intialState = simulations.map((x) => ({
      id: x._id,
      value: false,
      ...x,
    }));
    intialState = intialState.map((x) => {
      const isSelected = fetchSimulalations.find((y) => y._id === x.id);
      const isSelected2 = topicSimulations.find((y) => y._id === x.id);
      if (isSelected || isSelected2) {
        return {
          ...x,
          value: true,
        };
      }
      return x;
    });
    intialState.sort((a, b) => {
      return a.value === b.value ? 0 : a.value ? -1 : 1;
    });
    setSelectedSimulations(intialState);
    setSearchfilterSimulations(intialState);
  }, [simulations, fetchSimulalations, topicSimulations]);

  function fetchChapter(chapter_id: string) {

    fetchCurrentChapter({ chapter_id: chapter_id })
      .then((data: any) => {
        setCurrentChapter(data);
        fetchSimulations();
      })
      .catch((error) => {
        console.log(error);
      });
  };



  function fetchSimulations() {
    setisLoading(true);
    fetchSimulationsByUserChapterId(chapterId)
      .then(async (x: any) => {
        const simulations: {
          _id: string;
          name: string;
          thumbnailImageUrl: string;
        }[] = x.userSimulaitons;
        const simulations1: {
          _id: string;
          name: string;
          thumbnailImageUrl: string;
        }[] = currentChapter!!.simulations.filter((k: any) => {
          const found = currentChapter!!.unselectedSimulations.find(
            (y) => y === k._id
          );
          if (found) {
            return false;
          } else {
            return true;
          }
        });
        setFetchSimulations(simulations);
        setTopicSimulations(simulations1);
        if (subjectId) {
          await fetchAllSimulationBySubjectId(subjectId)
            .then((x: any) => {
              setisLoading(false);
              setFilterName(x.name);
              setSimulations(x?.simulations);
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

  const headerTitle: string = "Select Simulation that you want to add";


  const onSubmitClick = async () => {
    Mixpanel.track(
      WebAppEvents.TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_DONE_BUTTON_CLICKED
    );
    setisLoading(true);
    const data: string[] = selectedSimulations
      .filter((x) => x.value === true)
      .map((x) => x.id);
    const response = await AddSimulationstoUserTopic({
      id: "xyz",
      formObj: data,
      chapterId: chapterId ?? "",
    })
      .then(async (data: any) => {
       fetchChapter(chapterId);
        setisLoading(false);
        setShowAddSimulationPage(false);
      })
      .catch((error: any) => {
        setisLoading(false);
        console.log(error);
        setShowAddSimulationPage(false);
      });
    // }
  };

  useEffect(() => {
    if(currentChapter){
      fetchSimulations();
    }
  }, [currentChapter]);

  useEffect(() => {
    if (IsUserLoggedIn() === false) navigate("/teacher");
  }, []);

  return (
    <StyledAppShell style={{ padding: 0 }}>
      <NavBarContainer>
        <div
          style={{
            display: "fixed",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Box
            w="fit-content"
            // h='100%'
            h="fit-content"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowAddSimulationPage(false);
            }}
          >
            <div
              style={{
                border: "1px black solid",
                borderRadius: "99px",
                padding: "5px 5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconAddSimulationCross />
            </div>
            <Text
              fz={!isMd ? 20 : 14}
              color="#000000"
              fw={600}
              style={{ marginLeft: "10px" }}
            >
              {headerTitle}
            </Text>
          </Box>
        </div>
        <ButtonContainer>
          <StyledButtonDone onClick={onSubmitClick}>Done</StyledButtonDone>
        </ButtonContainer>
      </NavBarContainer>
      <Container
        size={isMd ? "sm" : isLg ? "lg" : "xl"}
        mt={isMd ? "10px" : "20px"}
        className="this one"
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
            cols={3}
            spacing={"lg"}
            verticalSpacing={"xl"}
            breakpoints={[
              { maxWidth: "lg", cols: 3, spacing: "md" },
              { maxWidth: "md", cols: 2, spacing: "sm" },
              { maxWidth: "sm", cols: 2, spacing: "sm" },
            ]}
            mr="20px"
            ml="20px"
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
                  simulationTags={x.simulationTags}
                  key={x._id}
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>
    </StyledAppShell>
  );
};

const StyledAppShell = styled(AppShell)`
  .mantine-AppShell-main {
    padding: 0;
  }
`;

const NavBarContainer = styled.div`
  /* width: 100%; */
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  border-bottom: 2px #cccccc solid;
  height: fit-content;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  margin: 0 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

const StyledButton = styled.button`
  background-color: transparent;
  margin: 5px 12px;
  border: 0;
  cursor: pointer;
`;
const StyledButtonDone = styled.button`
  background-color: transparent;
  /* margin: 5px 12px; */
  border: 0;
  cursor: pointer;
  color: #808080;
  font-family: "Nunito";
  font-weight: 400;
  font-size: 16px;
  border: 1px #808080 solid;
  border-radius: 24px;
  padding: 7px 14px;
  margin-bottom: 5px;
  margin-top: 5px;
`;
