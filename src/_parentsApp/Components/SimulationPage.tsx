import {
  Center,
  Flex,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ContentSimulation } from "../../pages/SimulationPage/ContentSimulation";
import { CanvasDraw } from "../../pages/DetailsPages/CanvasDraw";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function SimulationPage(props: {
  currentChapter: SingleChapter;
  instituteName: string;
  icon: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [playSimulation, setPlaySimulation] = useState<{
    name: string;
    _id: string;
  } | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("type");
  function simulationClickHandler(name: string, _id: string) {
    setPlaySimulation({
      name,
      _id,
    });
  }
  const [simulations, setSimulations] = useState<any[]>([]);
  useEffect(() => {
    if (props.currentChapter) {
      const sortedTopics = props.currentChapter.topics.sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      const simulations1 = props?.currentChapter?.simulations?.filter((x) => {
        const found = props.currentChapter.unselectedSimulations.find(
          (y) => y === x._id
        );
        if (found) {
          return false;
        } else {
          return true;
        }
      });
      setSimulations(simulations1);
    }
  }, [props.currentChapter]);
  return (
    <>
      {simulations.length > 0 && (
        <Stack>
          <Text fz={23} fw={700}>
            Shared Simulations
          </Text>
          <SimpleGrid cols={isMd ? 1 : 3}>
            {simulations.map((x) => {
              return (
                <Stack
                  align="center"
                  style={{
                    borderRadius: "4px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  h="100%"
                  w="100%"
                  pt={10}
                >
                  <img
                    src={x.thumbnailImageUrl}
                    height="100%"
                    width={"100%"}
                    style={{
                      boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.25)",
                      borderRadius: "4px",
                      maxHeight: "100%",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      simulationClickHandler(x.name, x._id);
                    }}
                  ></img>
                  <Flex
                    w={"100%"}
                    style={{
                      // border: "red solid 1px",
                      position: "absolute",
                      bottom: "0%",
                      background: "rgba(0, 0, 0, 0.50)",
                      padding: "4px 8px",
                      borderRadius: "0px 0px 4px 4px",
                      boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation();
                      simulationClickHandler(x.name, x._id);
                    }}
                  >
                    <Center
                      w={36}
                      h={36}
                      style={{
                        borderRadius: "50%",
                        background: "#3174F3",
                      }}
                    >
                      <img
                        src={require("../../assets/playBtn.png")}
                        width="50%"
                        height="50%"
                      />
                    </Center>

                    <Text color="white" ml={10} fz={16} fw={400}>
                      {x.name}
                    </Text>
                  </Flex>
                </Stack>
              );
            })}
          </SimpleGrid>
        </Stack>
      )}
      {simulations.length === 0 && (
        <Center w="100%" h="100vh">
          <Stack>
            <img
              src={require("../../assets/emptysimulation.png")}
              width="70%"
            />
          </Stack>
        </Center>
      )}
      <Modal
        opened={playSimulation !== null}
        onClose={() => {
          // setPlaySimulation(null);
          //   getUserimulation();
          // navigate("/allsimualtions");
        }}
        withCloseButton={false}
        closeOnClickOutside={false}
        styles={{
          inner: {
            padding: 0,
            margin: 0,
          },
          root: {
            padding: 0,
            margin: 0,
          },
          modal: {
            // border:'violet solid 1px',
            padding: 0,
            margin: 0,
          },
        }}
        style={{
          zIndex: 9999,
        }}
        // size="xl"
        size="auto"
        m={0}
        padding={0}
        lockScroll
        // centered
        fullScreen
      >
        {playSimulation !== null && (
          <CanvasDraw
            onCloseClick={() => {
              // navigate.
              // navigate("/allsimualtions");

              setPlaySimulation(null);
              //   navigate(-1);
            }}
            simulation={playSimulation}
            instituteName={props.instituteName}
            icon={props.icon}
          >
            <Center
              style={{
                height: "100%",
                width: "100%",
                // border:'red solid 1px'
              }}
            >
              <ContentSimulation
                simulationId={playSimulation._id}
                paramValue={paramValue}
                mySimulaitonId={""}
              />
            </Center>
          </CanvasDraw>
        )}
      </Modal>
    </>
  );
}
