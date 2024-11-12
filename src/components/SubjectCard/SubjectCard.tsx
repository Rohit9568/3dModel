import {
  createStyles,
  Paper,
  useMantineTheme,
  Text,
  Stack,
  Card,
  Image,
  Flex,
  Box,
  Group,
  Button,
  Grid,
  Center,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface SubjectCardProps {
  subject: UserSubject;
  onClick: () => void;
}

const useStyles = createStyles((theme) => ({
  root: {
    width: 300,
    border: "0.1px solid #C4C4C4",
    padding: 20,
    borderRadius: 20,
    background: " rgba(49, 116, 243, 0.05)",
    transition: "transform 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: theme.shadows.xl,
      background: " rgba(49, 116, 222, 0.09)",
    },
  },
  innerContainer: {},
  title: {
    fontWeight: 900,
    fontSize: 32,
    color: "#3174F3",
  },
  chapterNumber: {
    fontWeight: 900,
    fontSize: 24,
  },
  subtitle: {
    fontWeight: 400,
    fontSize: 20,
    color: "dimgray",
  },
}));

export function SubjectCard(props: SubjectCardProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <>
      <Card
        p={10}
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
        style={{
          borderRadius: 4,
          minWidth: "250px",
          width: `${ isMd ? "290px" : "350px"}`,
          cursor:'pointer'
        }}
        onClick={props.onClick}
      >
        <Grid columns={100}>
          <Grid.Col span={33}>
            <Box w={"100%"}  bg={"#d8e6ff"} style={{ borderRadius: 100 }}>
              <Image
                fit="contain"
                src={require("../../assets/SubjectImage.png")}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={66}>
            <Box h={"100%"}>
              <Text fw={500}>
                {props.subject.name}
                <br />
              </Text>
              <Grid align="center">
                <Grid.Col span={6}>
                  <Group
                    style={{
                      borderRadius: 10,
                      border: " 1px solid #D9D9D9",
                      width: `${ isMd ? "80px" : "100px"}`,
                      height:"40px",
                    }}
                    spacing={2}
                  >
                    <Text
                      bg={"#3174F3"}
                      c={"white"}
                      h={35}
                      w={35}
                      style={{ borderRadius: 8 }}
                      fz={18}
                    >
                      <Center h={"100%"}>{props.subject.chaptersCount}</Center>
                    </Text>
                    <Text fw={600} fz={isMd ? 8 : 12} c={"#A6A6A6"}>
                      Chapters
                    </Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Button
                    fz={isMd ? 8 : 12}
                    p={4}
                    style={{
                      height: "40px",
                      width: `100%`,
                    }}
                    variant="outline"
                    
                  >
                    Start Lesson
                  </Button>
                </Grid.Col>
              </Grid>
            </Box>
          </Grid.Col>
        </Grid>
      </Card>

    </>
  );
}
