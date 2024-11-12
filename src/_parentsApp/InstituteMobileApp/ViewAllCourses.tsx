import { Card, Flex, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconArrowLeft, IconChevronLeft } from "@tabler/icons";
import { SingleCourseCard } from "./MobileHomePage";
import { useMediaQuery } from "@mantine/hooks";

export function ViewAllCourses(props: {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  onBackClick: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <Stack w={"100%"} mt={36} mx={36}>
      <Flex
        align="center"
        w="100%"
      >
        <IconChevronLeft onClick={props.onBackClick} />
        <Text fz={20} fw={700} ml={16}>
          Courses
        </Text>
      </Flex>

      <SimpleGrid cols={isMd?1:4} mt={30} spacing={isMd?24:15}>
        {props.courses.map((x) => {
          return (
              <SingleCourseCard course={x} />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
