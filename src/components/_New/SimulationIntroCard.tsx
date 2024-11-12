import {
  Box,
  Flex,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Text,
  createStyles,
  Button,
  useMantineTheme,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconViewAll } from "../_Icons/CustonIcons";
import { IconPlayerPlay } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { fetchTrendingSimulations } from "../../features/Simulations/TrendingSimulationSlice";
import { getEncyptedSimulation } from "../../features/Simulations/getSimulationSlice";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { isPremiumModalOpened } from "../../store/premiumModalSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

const teachingFacts = [
  "Teaching is the one profession that creates all other professions.",
  "The best teachers teach from the heart, not from the book.",
  "Education is not the filling of a pot but the lighting of a fire.",
  "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.",
  "Teachers affect eternity; no one can tell where their influence stops.",
];

function getRandomTeachingFact() {
  const randomIndex = Math.floor(Math.random() * teachingFacts.length);
  return teachingFacts[randomIndex];
}

const useStyles = createStyles((theme) => ({
  simulationcard: {
    boxShadow: "0px 0px 25px 0px rgba(0, 0, 0, 0.3)",
    height: 180,
    ["@media (min-width: 1000px) and (max-width: 1099px)"]: {
      // width: 350, // Width for screens larger than 1000px and smaller than 1100px
      height: 150,
    },
    ["@media (min-width: 778px) and (max-width: 999px)"]: {
      // width: 190, // Width for screens larger than 778 and smaller than 999
      height: 120,
    },
    ["@media (max-width: 778px) and (min-width: 477px)"]: {
      // width: 190, // Width for screens larger than 778 and smaller than 999
      height: 140,
    },
    ["@media (min-width: 1100px)"]: {
      width: 300, // Width for screens larger than 1100px
      height: 150,
    },
    borderRadius: "10px",
    background: "#F5F5F5",
    cursor: "pointer",
    position: "relative",
  },
  playButton: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    width: "70px",
    height: "30px",
    borderRadius: "2px",
    background: "#3174F3",
  },
  hoverCard: {
    background: "linear-gradient(to right, #000000BA 2%,  #FFFFFF00 98%)",
  },
  simulationIntroImage: {
    ["@media (min-width: 1000px) and (max-width: 1099px)"]: {
      width: 150, // Width for screens larger than 750px and smaller than 1100px
      height: 150,
    },
    ["@media (min-width: 771px) and (max-width: 999px)"]: {
      width: 120, // Width for screens larger than 750px and smaller than 1100px
      height: 120,
    },
    ["@media (min-width: 1100px)"]: {
      width: 200, // Width for screens larger than 1100px
      height: 200,
    },
  },
}));

interface SimulationData1 {
  _id: string;
  name: string;
  thumbnailImageUrl: string;
  userSubscriptionType: string;
  isSimulationPremium: boolean;
}

interface SimulationCardInterface {
  _id: string;
  name: string;
  imageUrl: string | undefined;
  setPlaySimulation: () => void;
  userSubscriptionType: string;
  isSimulationPremium: boolean;
  setLoading: (data: boolean) => void;
}

export function SimulationCard(props: SimulationCardInterface) {
  const { classes } = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  // const handlePlayClick = (simulationId: string) => {
  //   const newWindow = window.open("", "_blank"); // open a blank window immediately

  //   if (!newWindow) {
  //     console.error("Failed to open a new window.");
  //     return;
  //   }

  //   getEncyptedSimulation(simulationId)
  //     .then((data: any) => {
  //       newWindow.location.href = `/simulation/play/${data.encryptedData}`;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       newWindow.close(); // close the window if there's an error
  //     });
  // };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: "90%",
        aspectRatio: 1.8,
      }}
    >
      {props.isSimulationPremium === undefined || props.isSimulationPremium ? (
        <img
          src={require("../../assets/premiumImg.png")}
          alt="Premium"
          style={{
            position: "absolute",
            right: "3px",
            top: "0",
          }}
        />
      ) : (
        ""
      )}

      <img
        src={props.imageUrl}
        style={{
          maxWidth: "100%",
          height: "100%",
          borderRadius: "4px",
        }}
      />
      {isHovered && (
        <Box
          className={classes.hoverCard}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end", // Push content to the bottom
            paddingBottom: "30px", // Space from the bottom (adjust as needed)
          }}
        >
          <Text c={"white"} fw={500} ml={10} mb={10}>
            {props.name}
          </Text>
        </Box>
      )}
      <Flex
        bg={"#3174F3"}
        justify={"space-evenly"}
        align={"center"}
        style={{
          position: "absolute",
          left: 3,
          bottom: 3,
          width: "60px",
          height: "23px",
          borderRadius: "2px",
          cursor: "pointer",
        }}
        onClick={() => {
          if (props.userSubscriptionType === "FREE") {
            if (
              props.isSimulationPremium === undefined ||
              props.isSimulationPremium
            ) {
              Mixpanel.track(WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED, {
                feature_name: "premium_simulation_accessed",
                current_page: "all_simulations_page",
              });
              dispatch(isPremiumModalOpenedActions.setModalValue(true));
            } else {
              props.setPlaySimulation();
            }
          } else if (props.userSubscriptionType !== "FREE") {
            if (
              props.isSimulationPremium === undefined ||
              props.isSimulationPremium
            ) {
              props.setPlaySimulation();
            } else {
              props.setPlaySimulation();
            }
          }
        }}
        ml={25}
        my={10}
      >
        <Button
          variant="filled"
          color="white"
          leftIcon={<IconPlayerPlay />}
          size="xs"
        >
          Play
        </Button>
      </Flex>
    </Box>
  );
}

export function SimulationIntroCard(props: { name: string }) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <>
      {isMd ? (
        <SimulationCardForMobileView name={props.name} />
      ) : (
        <SimulationIntroCardForComputerView name={props.name} />
      )}
    </>
  );
}

function SimulationIntroCardForComputerView(props: { name: string }) {
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const [trendingSimulations, setTrendingSimulations] = useState<
    SimulationData1[]
  >([]);
  useEffect(() => {
    fetchTrendingSimulations()
      .then((data: any) => {
        const simulations = data as SimulationData1[];
        setTrendingSimulations(simulations.slice(0, 2)); // Only take the first two simulations
      })
      .catch((error) => {
        console.error(
          "There was a problem fetching trending simulations:",
          error
        );
      });
  }, []);
  const navigate = useNavigate();
  return (
    <Box
      mx={20}
      maw={1140}
      my={20}
      style={{
        borderRadius: "16px",
        boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Grid>
        <Grid.Col
          span={isLg ? 8 : 6}
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <Flex>
            <Box
              ml={10}
              style={{ display: "flex", alignItems: "flex-end" }}
              w={"33%"}
            >
              <Image
                style={{ display: "flex", alignItems: "flex-end" }}
                src={require("../../assets/IntroSimulationImage.png")}
              />
            </Box>
            <Box w={"60%"} ml={20} fz={20} fw={500}>
              <Text c={"blue"}>Hi {props.name}</Text>
              <Text
                mt={5}
                fz={20}
                fw={500}
                style={{
                  fontStyle: "italic",
                }}
              >
                “{getRandomTeachingFact()}”{" "}
              </Text>
            </Box>
          </Flex>
        </Grid.Col>
        <Grid.Col span={isLg ? 4 : 6}>
          <Box>
            <Group position="right" mr={14}>
              <Group
                onClick={() => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_SHOW_ALL_SIMULATIONS_CLICKED
                  );
                  navigate("/allsimulations");
                }}
                mb={10}
                mt={10}
                style={{ cursor: "pointer" }}
              >
                <Text fz={12}>View All</Text>
                <IconViewAll />
              </Group>
            </Group>
            <SimpleGrid mb={10} mr={10} cols={isLg ? 1 : 2}>
              <SimulationCard
                _id={trendingSimulations[0]?._id}
                name={trendingSimulations[0]?.name}
                imageUrl={trendingSimulations[0]?.thumbnailImageUrl}
                setPlaySimulation={() => {}}
                setLoading={() => {}}
                isSimulationPremium={
                  trendingSimulations[0]?.isSimulationPremium
                }
                userSubscriptionType={
                  trendingSimulations[0]?.userSubscriptionType
                }
              />
              {!isLg && (
                <SimulationCard
                  _id={trendingSimulations[1]?._id}
                  name={trendingSimulations[1]?.name}
                  imageUrl={trendingSimulations[1]?.thumbnailImageUrl}
                  setPlaySimulation={() => {}}
                  setLoading={() => {}}
                  isSimulationPremium={
                    trendingSimulations[0]?.isSimulationPremium
                  }
                  userSubscriptionType={
                    trendingSimulations[0]?.userSubscriptionType
                  }
                />
              )}
            </SimpleGrid>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

function SimulationCardForMobileView(props: { name: string }) {
  const theme = useMantineTheme();
  const [trendingSimulations, setTrendingSimulations] = useState<
    SimulationData1[]
  >([]);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const { classes } = useStyles();

  useEffect(() => {
    fetchTrendingSimulations()
      .then((data: any) => {
        const simulations = data as SimulationData1[];
        setTrendingSimulations(simulations.slice(0, 2));
      })
      .catch((error) => {
        console.error(
          "There was a problem fetching trending simulations:",
          error
        );
      });
  }, []);
  const navigate = useNavigate();
  return (
    <div>
      <Box
        mx={20}
        my={20}
        style={{
          borderRadius: "8px",
          boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Grid>
          <Grid.Col
            span={12}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Flex style={{ display: "flex", alignItems: "flex-end" }}>
              <Box w={isSm ? "50%" : "30%"} style={{ alignSelf: "flex-end" }}>
                <Image
                  className={classes.simulationIntroImage}
                  src={require("../../assets/IntroSimulationImage.png")}
                />
              </Box>
              <Box
                w={isSm ? "50%" : "70%"}
                ml={20}
                fz={isSm ? 14 : 20}
                fw={500}
                style={{ alignSelf: "center" }}
              >
                <Text c={"blue"}>Hi {props.name}</Text>
                <Text
                  mt={5}
                  fz={isSm ? 12 : 18}
                  fw={500}
                  mr={10}
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  “{getRandomTeachingFact()}”{" "}
                  {/* Display a random teaching fact */}
                </Text>
              </Box>
            </Flex>
          </Grid.Col>
        </Grid>
      </Box>
      <Box>
        <Group position="right" mr={23}>
          <Group
            onClick={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_SHOW_ALL_SIMULATIONS_CLICKED
              );
              navigate("/allsimulations");
            }}
            mb={10}
            style={{ cursor: "pointer" }} // Add this line
          >
            <Text fz={12}>View All</Text>
            <IconViewAll />
          </Group>
        </Group>
        <SimpleGrid cols={isSm ? 1 : 2} w="100%">
          <Center w="100%">
            {!isSm && (
              <SimulationCard
                _id={trendingSimulations[1]?._id}
                name={trendingSimulations[1]?.name}
                imageUrl={trendingSimulations[1]?.thumbnailImageUrl}
                setPlaySimulation={() => {}}
                setLoading={() => {}}
                isSimulationPremium={
                  trendingSimulations[0]?.isSimulationPremium
                }
                userSubscriptionType={
                  trendingSimulations[0]?.userSubscriptionType
                }
              />
            )}
          </Center>
          <Center w="100%">
            <SimulationCard
              _id={trendingSimulations[0]?._id}
              name={trendingSimulations[0]?.name}
              imageUrl={trendingSimulations[0]?.thumbnailImageUrl}
              setPlaySimulation={() => {}}
              setLoading={() => {}}
              isSimulationPremium={trendingSimulations[0]?.isSimulationPremium}
              userSubscriptionType={
                trendingSimulations[0]?.userSubscriptionType
              }
            />
          </Center>
        </SimpleGrid>
      </Box>
    </div>
  );
}
