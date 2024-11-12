import { Fragment, useEffect, useState } from "react";
import { UnitySimulation } from "./UnitySimulation";
import { useParams } from "react-router-dom";
import {
  getMysimulationwithId,
} from "../../features/Simulations/getSimulationSlice";
import { Center, LoadingOverlay } from "@mantine/core";

export function LoadingMySimulationwithData() {
  const params = useParams();
  const [isFetchSimulation, setisFetchSimulation] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<any>();
  const [loadingData, setLoadingData] = useState<boolean>(true);

  function fetchData(id: string) {
    if (id == null) {
      return;
    }
    setLoadingData(true);
    getMysimulationwithId(id)
      .then((response) => {
        const data = response as SimulationData;
        setSimulationData(data);
        setLoadingData(false);
        setisFetchSimulation(true);
      })
      .catch((error: Error) => {
        console.log(error);
        setLoadingData(false);
      });
  }
  useEffect(() => {
    if (params.id) fetchData(params.id);
  }, []);
  return (
    <Center>
      {isFetchSimulation && (
        <UnitySimulation
          simulationData={simulationData.simulationId}
          data={simulationData.data}
        />
      )}
      {!isFetchSimulation && <LoadingOverlay visible={loadingData} />}
    </Center>
  );
}
