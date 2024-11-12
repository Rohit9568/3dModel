import {
  Box,
  Card,
  Center,
  Grid,
  Group,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconPlayerPlay, IconX, IconCheck } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  fetchCurrentSharedSubjectData,
  fetchCurrentSubjectData,
} from "../../features/UserSubject/TeacherSubjectSlice";

function ChapterCard(props: {
  chapter: ChapterData;
  index: number;
  subjectId: string;
  onChapterClick: (data: string) => void;
}) {
  const [isHovered, setHovered] = useState(false);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };
  return (
    <>
      <Card
        bg="#F8F9FA"
        p={3}
        withBorder
        shadow="0px 0px 10px 0px rgba(0, 0, 0, 0.25)"
        style={{ borderRadius: 20, cursor: "pointer" }}
        onClick={() => {
          props.onChapterClick(props.chapter._id);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Grid columns={11} justify="center" align="center" gutter="md">
          <Grid.Col span={3}>
            <Box
              bg={isHovered ? "#3174F3" : "rgba(144, 147, 149, 0.27)"}
              p={8}
              w={"100%"}
              h={"100%"}
              style={{
                borderRadius: 20,
                transition: "background-color 0.6s ease",
              }}
            >
              <Text
                w={"100%"}
                bg={"white"}
                c={isHovered ? "#3174F3" : "rgba(144, 147, 149, 0.27)"}
                fz={35}
                fw={600}
                style={{ borderRadius: "50%", aspectRatio: 1 }}
              >
                <Center h={"100%"}>
                  {isHovered ? (
                    <IconPlayerPlay fill="#3174F3" size={"75%"} />
                  ) : (
                    props.index
                  )}
                </Center>
              </Text>
            </Box>
          </Grid.Col>
          <Grid.Col span={8} fw={500} pl={5}>
            <>
              <Text
                ml={isHovered ? 10 : 0}
                m={0}
                p={0}
                fz={isMd ? 14 : 16}
                style={{ transition: "margin-left 0.5s ease" }}
              >
                {props.chapter.name}
              </Text>
              <Text fz={isMd ? 12 : 14} my={2}>
                Topics: {props.chapter.topicsCount}
              </Text>
            </>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}

interface ChapterSelectProps {
  subjectId: string;
  onChapterClick: (data: string) => void;
}
export function ChapterSelect(props: ChapterSelectProps) {
  const theme = useMantineTheme();
  const [currentSubject, setCurrentSubject] = useState<SingleSubject | null>(
    null
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: 450px)`);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  useEffect(() => {
    setLoading(true);
    fetchCurrentSharedSubjectData({ subject_id: props.subjectId })
      .then((data: any) => {
        setLoading(false);
        setCurrentSubject(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [props.subjectId]);
  return (
    <>
      <Box w={"100%"}>
        <Box
          px={isMd ? 5 : 15}
          py={10}
          ml={isSm ? 10 : isLg ? 12 : 50}
          bg={"#3174F3"}
          w={200}
          my={10}
          style={{ borderRadius: isMd ? 10 : 18 }}
        >
          <Center>
            <Text c={"white"} fw={500} fz={isMd ? 12 : isLg ? 16 : 20}>
              Chapters({currentSubject?.userChapters.length})
            </Text>
          </Center>
        </Box>
      </Box>

      <SimpleGrid
        cols={isMd ? 1 : isLg ? 2 : 3}
        mx={isSm ? 10 : isLg ? 12 : 50}
        my={20}
        spacing={isSm ? 10 : isMd ? 20 : 30}
      >
        {currentSubject &&
          currentSubject.userChapters.map((chapter, index) => {
            return (
              <ChapterCard
                key={chapter._id}
                chapter={chapter}
                index={index + 1}
                subjectId={currentSubject._id}
                onChapterClick={props.onChapterClick}
              />
            );
          })}
      </SimpleGrid>
    </>
  );
}
