import { Fragment, useEffect, useState } from "react";
import { UnitySimulation } from "./UnitySimulation";
import { useParams } from "react-router-dom";
import { getSimulationwithDecryptedId } from "../../features/Simulations/getSimulationSlice";
import { Box, Center, LoadingOverlay } from "@mantine/core";

export function LoadingSimulation() {
  const params = useParams();
  const [isFetchSimulation, setisFetchSimulation] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<SimulationData>();
  const [loadingData, setLoadingData] = useState<boolean>(true);

  function fetchData(id: string) {
    if (id == null) {
      return;
    }
    setLoadingData(true);
    getSimulationwithDecryptedId(id)
      .then((response) => {
        const data = response as SimulationData;
        setSimulationData(data);
        setLoadingData(false);
        setisFetchSimulation(true);
      })
      .catch((error: Error) => {
        setLoadingData(false);
      });
  }
  useEffect(() => {
    if (params.id) fetchData(params.id);
  }, []);
  return (
    <Center     
    h={"100%"}
    w={"100%"}
    >
      {isFetchSimulation && <UnitySimulation simulationData={simulationData} />}
      {!isFetchSimulation && <Box><LoadingOverlay visible={loadingData} /> </Box>}
    </Center>
  );
}
