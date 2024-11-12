import { Box, Center, Divider, Flex, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { UserType } from "../DashBoard/InstituteBatchesSection";
import ProfilePicture2 from "../../ProfilePic/ProfillePic2";

const topperCardColors = [
  "linear-gradient(90deg, #9393FF 0%, #EA93FF 50%, #FF93BE 100%)",
  "linear-gradient(90deg, #BEFF93 0%, #93E9FF 50%, #9393FF 100%)",
  "linear-gradient(90deg, #FF93BE 0%, #FFBE93 50%, #E9FF93 100%)",
];
const topperBorderColors = ["#FEE291", "#D1D8E0", "#B59970"];

function TopperCard(props: {
  name: string;
  points: number;
  noOfTest: number;
  rank: number;
  profilePic: string;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <Stack
      w="100%"
      style={{
        boxShadow: "0px 0px 24px 0px #00000024",
        border: "1px solid #FFFFFF",
        borderRadius: "10px",
      }}
      pb={20}
    >
      <Flex
        style={{
          background: topperCardColors[props.rank - 1],
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          position: "relative",
        }}
        h={isMd ? "70px" : "80px"}
        w="100%"
      >
        <Text
          fz={isMd ? 30 : 40}
          color="#0000004D"
          fw={700}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {props.rank}
          <sup>
            {props.rank === 1
              ? "st"
              : props.rank === 2
              ? "nd"
              : props.rank === 3
              ? "rd"
              : "th"}
          </sup>
        </Text>
      </Flex>
      <Stack
        style={{
          marginTop: isMd ? "-50px" : "-70px",
          zIndex: 100,
        }}
        px={20}
        spacing={10}
      >
        <ProfilePicture2
          name={props.name}
          size={isMd ? 60 : 100}
          profilePic={props.profilePic}
          isInitialFullName={false}
        />
        <Text
          fz={isMd ? 18 : 22}
          fw={700}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
          }}
        >
          {props.name}
        </Text>
        <Flex gap={20}>
          <Stack spacing={0}>
            <Text fz={20} fw={700}>
              {props.noOfTest}
            </Text>
            <Text color="#888888" fw={400} fz={isMd ? 16 : 18}>
              Tests
            </Text>
          </Stack>
          <Divider orientation="vertical" />
          <Stack spacing={0}>
            <Text fz={20} fw={700}>
              {props.points}
            </Text>
            <Text color="#888888" fw={400} fz={isMd ? 16 : 18}>
              Points
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Stack>
  );
}

function SingleStudentCard(props: {
  student: {
    name: string;
    totalRewardpoints: number;
    noofGivenTests: number;
    profilePic: string;
  };
  index: number;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <Flex
      style={{
        border: `2px solid ${
          props.index < 3 ? topperBorderColors[props.index] : "#E7E7E7"
        }`,
        borderRadius: "15px",
      }}
      pl={isMd ? 20 : 30}
      py={10}
      align="center"
      justify="space-between"
      pr={isMd ? 20 : 50}
      w="100%"
    >
      <Flex align="center">
        <Text
          mr={isMd ? 10 : 40}
          fz={24}
          color={props.index < 3 ? topperBorderColors[props.index] : "#B9C0C8"}
        >
          {props.index + 1}
        </Text>
        <ProfilePicture2
          name={props.student.name}
          size={isMd ? 40 : 50}
          profilePic={props.student.profilePic}
          isInitialFullName={false}
        />
        <Text ml={10} fz={isMd ? 16 : 18} fw={700}>
          {props.student.name}
        </Text>
      </Flex>
      <Flex gap={isMd ? 10 : 30} fz={20} fw={700}>
        <Text>{props.student.noofGivenTests}</Text>
        <Divider orientation="vertical" />
        <Text>{props.student.totalRewardpoints}</Text>
      </Flex>
    </Flex>
  );
}
export function LeaderBoard(props: {
  students: StudentsDataWithBatch[];
  userType: UserType;
  studentId: string | null;
}) {
  const [students, setStudents] = useState<StudentsDataWithBatch[]>(
    props.students
  );
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<null | {
    name: string;
    totalRewardpoints: number;
    noofGivenTests: number;
    rank: number;
    profilePic: string;
  }>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const isEmptyLeaderBoard =
    students.filter((student) => student.totalRewardpoints !== 0).length > 0
      ? false
      : true;
  useEffect(() => {
    if (props.studentId && props.userType === UserType.STUDENT) {
      const studentIndex = students.findIndex(
        (student) => student._id === props.studentId
      );
      if (studentIndex !== -1) {
        setSelectedStudent({
          ...students[studentIndex],
          rank: studentIndex,
          profilePic: students[studentIndex].profilePic!!,
        });
      }
    }
  }, []);
  useEffect(() => {
    const sortedStudents = [...props.students];
    sortedStudents.sort((a, b) => {
      return b.totalRewardpoints - a.totalRewardpoints;
    });

    setStudents(sortedStudents);
  }, [props.students]);
  return (
    <Stack align="center" pt={isMd ? 10 : 40} w="100%">
      {isEmptyLeaderBoard && (
        <Center w="100%" h="80vh">
          <Stack justify="center" align="center">
            <img src={require("../../../assets/emptyLeaderBoard.png")} />
            <Text fz={24} fw={700} color="#606060">
              Leaderboard not generated yet!
            </Text>
            <Text fz={18} fw={400} color="#BABABA" align="center">
              Start taking test today to get <br></br>your batch leaderboard.
            </Text>
          </Stack>
        </Center>
      )}
      {!isEmptyLeaderBoard && (
        <>
          {!isMd && (
            <Flex justify="space-between" w="60%">
              {students.slice(0, 3).map((student, i) => {
                return (
                  <Flex
                    w="30%"
                    style={{
                      order:
                        i + 1 === 1 ? 2 : i + 1 === 2 ? 1 : i + 1 === 3 ? 3 : 4,
                    }}
                  >
                    <TopperCard
                      name={student.name}
                      points={student.totalRewardpoints}
                      noOfTest={student.noofGivenTests}
                      rank={i + 1}
                      profilePic={student.profilePic!!}
                    />
                  </Flex>
                );
              })}
            </Flex>
          )}
          {isMd && (
            <Carousel
              getEmblaApi={setEmbla}
              // draggable={false}
              // speed={1}
              slideSize={isMd ? "60%" : "25%"}
              slideGap={25}
              loop
              align={"center"}
              px={isMd ? 20 : 50}
              w={"100%"}
              withIndicators
              nextControlIcon={
                <Box
                  w={"60%"}
                  h={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <IconChevronRight size={60} stroke={1} color="#747474" />
                </Box>
              }
              previousControlIcon={
                <Box
                  w={"60%"}
                  h={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <IconChevronLeft size={60} stroke={1} color="#747474" />
                </Box>
              }
              styles={{
                controls: {
                  top: 0,
                  height: "100%",
                  padding: "0px",
                  margin: "0px",
                },
                control: {
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  height: "200px",
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
                indicator: {
                  width: 8,
                  height: 8,
                  backgroundColor: "red",
                },
                indicators: {
                  top: "110%",
                },
              }}
            >
              {students.slice(0, 3).map((student, i) => {
                return (
                  <Carousel.Slide w="100%" py={20}>
                    <TopperCard
                      name={student.name}
                      points={student.totalRewardpoints}
                      noOfTest={student.noofGivenTests}
                      rank={i + 1}
                      profilePic={student.profilePic!!}
                    />
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          )}
          <Stack
            w={isMd ? "100%" : "80%"}
            mt={20}
            pb={selectedStudent !== null ? (isMd ? 100 : 200) : 0}
          >
            <Flex
              pl={isMd ? 20 : 80}
              justify="space-between"
              fz={isMd ? 14 : 16}
            >
              <Text>Name</Text>
              <Flex gap={isMd ? 10 : 20}>
                <Text>Test Attempts</Text>
                <Divider orientation="vertical" />
                <Text>Total Points</Text>
              </Flex>
            </Flex>
            {students.map((student, i) => {
              return (
                <SingleStudentCard
                  student={{
                    name: student.name,
                    totalRewardpoints: student.totalRewardpoints,
                    noofGivenTests: student.noofGivenTests,
                    profilePic: student.profilePic!!,
                  }}
                  index={i}
                />
              );
            })}
          </Stack>
          {selectedStudent !== null && (
            <Flex
              style={{
                position: "fixed",
                bottom: isMd ? 60 : 0,
                width: "100%",
                boxShadow: "0px 0px 16px 0px #00000040",
                background: "#FFFFFF",
                zIndex: 100,
              }}
              w="100%"
              px={isMd ? 10 : 150}
              py={isMd ? 15 : 20}
            >
              <SingleStudentCard
                student={selectedStudent}
                index={selectedStudent?.rank}
              />
            </Flex>
          )}
        </>
      )}
    </Stack>
  );
}
