import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons";
import { fetchSharedSubjectsData } from "../../features/UserSubject/TeacherSubjectSlice";
import { ViewSimulationCard } from "../../components/_New/TeacherPage new/SimulationCard";
import SelectClass from "../../components/_New/TeacherPage new/ClassSelection";
import { SubjectCard } from "../../components/_New/TeacherPage new/SubjectCard";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useNavigate } from "react-router-dom";
import SimulationCardBg from "../../assets/SimulationCardBg.png";
import simulationCardSideIcon from "../../assets/simulationCardSideIcon.png";
import simulationcardsGroup from "../../assets/simulationCardsGroup.png";
import testIconOnCard from "../../assets/TestIconOnCard.png";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";

interface SubjectSelectProps {
  studentData: {
    studentId: string;
    className: string;
    studentName: string;
    classId: string;
  }[];
  onSubjectClick: (data: string) => void;
  onBackClick: () => void;
}

export function SubjectSelect(props: SubjectSelectProps) {
  const theme = useMantineTheme();
  const [studentOptions, setStudentOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [allSubjects, setAllSubjects] = useState<UserSubjectAPI[] | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);
  useEffect(() => {
    const found = props.studentData.find(
      (x) => x.classId === selectedStudentId
    );
    if (selectedStudentId !== null && found) {
      setisLoading(true);
      fetchSharedSubjectsData({
        classId: selectedStudentId
      })
        .then((x: any) => {
          setisLoading(false);
          setAllSubjects(x);
        })
        .catch((e) => {
          setisLoading(false);
          console.log(e);
        });
    }
  }, [selectedStudentId]);
  useEffect(() => {
    setStudentOptions(
      props.studentData.map((x) => {
        return {
          label: `${x.studentName}(${x.className})`,
          value: x.classId,
        };
      })
    );
    setSelectedStudentId(props.studentData[0].classId);
  }, [props.studentData]);
  const navigate = useNavigate();

  // const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <>
      <Box
        ml={-10}
        style={{
          position: "relative",
        }}
      >
        <Flex
          style={{
            position: "fixed",
            top: 0,
            background: "#FFF",
            // boxShadow: "0px 7px 14.4px -10px rgba(0, 0, 0, 0.40)",
            zIndex: 999,
            // borderBottom: props.fromTeacherSide ? "2px solid #E9ECEF" : "",
          }}
          pl={-10}
          // pl={-25}
          onClick={() => {
            props.onBackClick();
            // props.onBackClick();
          }}
          w="100%"
          color="white"
          px={20}
          py={15}
        >
          <IconChevronLeft
            style={{
              cursor: "pointer",
            }}
          />
          <Text
            pl={20}
            fz={18}
            style={{
              cursor: "pointer",
            }}
          >
            Home
          </Text>
        </Flex>
      </Box>
      <Stack px={20} mb={50} pb={50}>
        {/* <SimulationIntroCard name={GetUser().name} /> */}
        <Group position="right" pr={10}>
          <Select
            data={studentOptions}
            rightSection={<IconChevronDown color="#3174F3" />}
            w={isMd ? "100%" : "30%"}
            styles={{
              rightSection: { pointerEvents: "none" },
              input: {
                borderRadius: "7px",
                backgroundColor: "#FFFFFF",
                color: "#3174F3",
                "::placeholder": { color: "white" },
                height: "30px",
                fontWeight: 500,
                borderColor: "#3174F3",
              },
              item: {
                "&[data-selected]": {
                  "&, &:hover": {
                    backgroundColor: "#4B65F6",
                    color: "white",
                  },
                },
              },
            }}
            value={selectedStudentId}
            onChange={(value1) => {
              if (value1 !== null) {
                setSelectedStudentId(value1);
              }
            }}
          />
        </Group>

        {allSubjects !== null && allSubjects.length !== 0 && (
          <Paper
            style={{
              // padding: "20px",
              borderRadius: "24px",
              border: "4px solid #C9DFFB",
            }}
          >
            <Stack
              p={10}
              px={20}
              style={{
                borderRadius: isMd ? 8 : 16,
              }}
            >
              <Text fz={24} fw={700} mb={-15}>
                Offline Subjects
              </Text>
              <SimpleGrid
                cols={6}
                breakpoints={[
                  { maxWidth: "xl", cols: 6, spacing: "md" },
                  { maxWidth: "lg", cols: 5, spacing: "md" },
                  { maxWidth: "md", cols: 4, spacing: "md" },
                  { maxWidth: "sm", cols: 3, spacing: "sm" },
                  { maxWidth: "xs", cols: 2, spacing: "sm" },
                ]}
              >
                {allSubjects.map((x) => (
                  <SubjectCard
                    subject={x}
                    onClick={() => {
                      props.onSubjectClick(x._id);
                      // Mixpanel.track(
                      //   WebAppEvents.TEACHER_APP_SUBJECT_CARD_CLICKED,
                      //   {
                      //     subject_id: x.name,
                      //   }
                      // );
                      // dispatch(subjectsActions.setIntialUserChapter());
                      // navigate(`/chapterSelect/${x._id}`);
                    }}
                    key={x._id}
                  />
                ))}
              </SimpleGrid>
            </Stack>

            {/* Third Row */}
            <Stack
              p={isMd ? 15 : 30}
              px={20}
              py={4}
              style={{
                position: "relative",
              }}
            >
              <Box
                style={{
                  width: "165px",
                  height: "37px",
                  flexShrink: 0,
                  borderRadius: "0px 24px 0px 10px",
                  background: "#C9DFFB",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              ></Box>
            </Stack>
          </Paper>
        )}
        {allSubjects?.length === 0 && (
          <Center h="80vh">
            <Stack align="center" justify="center">
              <img
                src={require("../../assets/emptyCourses2.png")}
                style={{
                  width: "50%",
                }}
              />
              <Text fz={18}>No Subjects Found!</Text>
            </Stack>
          </Center>
        )}
        {/* Pass the entire userSubjects array to have class context */}
      </Stack>
    </>
  );
  // return (
  //   <Stack
  //     px={10}
  //   >
  //     <LoadingOverlay visible={isLoading} />
  //     <Group
  //       position="apart"
  //     >
  //     <Text
  //       color="#424242"
  //       fz={20}
  //       fw={600}

  //     >
  //       Study
  //     </Text>
  //     <Select
  //       data={studentOptions}
  //       rightSection={<IconChevronDown color="#3174F3" />}
  //       w={isMd?"100%":"30%"}
  //       styles={{
  //         rightSection: { pointerEvents: "none" },
  //         input: {
  //           borderRadius: "7px",
  //           backgroundColor: "#FFFFFF",
  //           color: "#3174F3",
  //           "::placeholder": { color: "white" },
  //           height: "30px",
  //           fontWeight: 500,
  //           borderColor: "#3174F3",
  //         },
  //       }}
  //       value={selectedStudentId}
  //       onChange={(value1) => {
  //         if (value1 !== null) {
  //           setSelectedStudentId(value1);
  //         }
  //       }}
  //     />
  //     </Group>
  //     <SimpleGrid
  //       cols={3}
  //       breakpoints={[
  //         { maxWidth: "xl", cols: 2, spacing: "md" },
  //         { maxWidth: "lg", cols: 2, spacing: "md" },
  //         { maxWidth: "md", cols: 2, spacing: "md" },
  //         { maxWidth: "sm", cols: 1, spacing: "sm" },
  //         { maxWidth: "xs", cols: 1, spacing: "sm" },
  //       ]}
  //       style={{
  //         // display:'flex',
  //         alignItems: "center",
  //         justifyContent: "center",
  //         border:'2.227px dashed #C7C7C7',
  //         borderRadius:'15px'
  //       }}
  //       px={20}
  //       py={10}
  //     >
  //       {allSubjects?.map((x) => {
  //         return (
  //           <Card
  //             p={10}
  //             shadow="0px 0px 8px 0px rgba(0, 0, 0  , 0.25)"
  //             style={{
  //               borderRadius: 4,
  //               minWidth: "250px",
  //               width: `${isMd ? "290px" : "350px"}`,
  //               cursor: "pointer",
  //             }}
  //             onClick={() => {
  //               props.onSubjectClick(x._id);
  //             }}
  //             key={x._id}
  //           >
  //             <Grid columns={100}>
  //               <Grid.Col span={33}>
  //                 <Box w={"100%"} bg={"#d8e6ff"} style={{ borderRadius: 100 }}>
  //                   <Image
  //                     fit="contain"
  //                     src={require("../../assets/SubjectImage.png")}
  //                   />
  //                 </Box>
  //               </Grid.Col>
  //               <Grid.Col span={66}>
  //                 <Box h={"100%"}>
  //                   <Text fw={500}>
  //                     {x.name}
  //                     <br />
  //                   </Text>
  //                   <Grid align="center">
  //                     <Grid.Col span={6}>
  //                       <Group
  //                         style={{
  //                           borderRadius: 10,
  //                           border: " 1px solid #D9D9D9",
  //                           width: `${isMd ? "80px" : "100px"}`,
  //                           height: "40px",
  //                         }}
  //                         spacing={2}
  //                       >
  //                         <Text
  //                           bg={"#3174F3"}
  //                           c={"white"}
  //                           h={35}
  //                           w={35}
  //                           style={{ borderRadius: 8 }}
  //                           fz={18}
  //                         >
  //                           <Center h={"100%"}>{x.chaptersCount}</Center>
  //                         </Text>
  //                         <Text fw={600} fz={isMd ? 8 : 12} c={"#A6A6A6"}>
  //                           Chapters
  //                         </Text>
  //                       </Group>
  //                     </Grid.Col>
  //                     <Grid.Col span={6}>
  //                       <Button
  //                         fz={isMd ? 8 : 12}
  //                         p={4}
  //                         style={{
  //                           height: "40px",
  //                           width: `100%`,
  //                         }}
  //                         variant="outline"
  //                       >
  //                         Start Lesson
  //                       </Button>
  //                     </Grid.Col>
  //                   </Grid>
  //                 </Box>
  //               </Grid.Col>
  //             </Grid>
  //           </Card>
  //         );
  //       })}
  //     </SimpleGrid>
  //   </Stack>
  // );
}
