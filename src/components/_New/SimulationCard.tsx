import { Box, Flex, Text, createStyles, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlayerPlay } from "@tabler/icons";
import { useState } from "react";
import { getEncyptedSimulation } from "../../features/Simulations/getSimulationSlice";

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

interface SimulationCardInterface {
  _id: string;
  name: string;
  imageUrl: string | undefined;
  setPlaySimulation: (data: string) => void;
  setLoading: (data: boolean) => void;
}
export function SimulationCard(props: SimulationCardInterface) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const { classes } = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = (simulationId: string) => {
    getEncyptedSimulation(simulationId)
      .then((data: any) => {
        window.open(`/simulation/play/${data.encryptedData}`, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    > <Box className={classes.simulationcard}>
     
        <img
          src={props.imageUrl}
          style={{ maxWidth: "300px", height: "100%", borderRadius: "4px" }}
        />
        {isHovered && (
          <Box
            className={classes.hoverCard}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end", // Push content to the bottom
              paddingBottom: "30px", // Space from the bottom (adjust as needed)
            }}
          >
            <Text c={"white"} fw={500}>
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
          }}
          onClick={() => handlePlayClick(props._id)} // Handle play button click
        >
          <IconPlayerPlay size={isMd ? 12 : 14} color="white"></IconPlayerPlay>
          <Text c={"white"} fw={500} fz={isMd ? 10 : 12}>
            Play
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
