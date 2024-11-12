import {  Center,  LoadingOverlay } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { getEncyptedSimulation } from "../../features/Simulations/getSimulationSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useMediaQuery } from "@mantine/hooks";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
interface UnitySimulationProps {
  simulationId?: string;
  paramValue?: string | null;
  chapterId?: string;
  mySimulaitonId?: string | null;
}
export function ContentSimulation(props: UnitySimulationProps) {
  const iframeRef = useRef(null);
  const [isFirst, setisFirst] = useState<boolean>(true);
  const isMd = useMediaQuery(`(max-width: 800px)`);
  const [encryptedId, setEncyptedId] = useState<string>("");
  const [loadingData, setLoadingData] = useState<boolean>(true);

  function unloadSimulation() {
    if (!isFirst) {
      const iframe: any = iframeRef.current;
      if (iframe) {
        iframe.parentNode.removeChild(iframe);
      }
    } else {
      setisFirst(false);
    }
  }
  useEffect(() => {
    return () => {
      unloadSimulation();
    };
  }, []);


  function fetchData(id: string) {
    if (id == null) {
      return;
    }
    setLoadingData(true);
    getEncyptedSimulation(id)
      .then((data: any) => {
        setLoadingData(false);
        setEncyptedId(data.encryptedData);
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }
  function fetchSimulation() {
    if (props.simulationId) fetchData(props.simulationId);
  }
  useEffect(() => {
    if (!props.chapterId) fetchSimulation();
  }, [props.simulationId, props.mySimulaitonId]);

  return (
    <Center w={"100%"} h={"95vh"}
      onClick={() => {
        if (props.paramValue && props.paramValue === "parent") {
          Mixpanel.track(ParentPageEvents.PARENT_APP_ACTIVE_SIMULATION_CLICKED);
        } else
          Mixpanel.track(
            WebAppEvents.TEACHER_APP_LEARN_PAGE_ACTIVE_SIMULATION_CLICKED
          );
      }}
    >
      <Center w={"98%"}>
        {encryptedId === "" && !props.chapterId && (
          <LoadingOverlay visible={loadingData} />
        )}
        {encryptedId !== "" && !props.chapterId && !props.mySimulaitonId && (
          <iframe
            src={`/simulation/play/${encryptedId}`}
            style={{
              width: "100%",
              height:"90vh",
              border: "none",
            }}
            ref={iframeRef}
            title="Simulation"
          ></iframe>
        )}
        {props.chapterId && !props.mySimulaitonId && (
          <iframe
            src={`/megasimulation/${props.chapterId}`}
            style={{
              width: "100%",
              height: "80vh",
              aspectRatio:"16/9",
              border: "none",
            }}
            ref={iframeRef}
            title="Simulation"
          ></iframe>
        )}
        {props.mySimulaitonId && (
          <iframe
            src={`/mysimulation/play/${props.mySimulaitonId}`}
            style={{
              width: "100%",
              height: "80vh",
              aspectRatio:"16/9",
              border: "none",
            }}
            ref={iframeRef}
            title="Simulation"
          ></iframe>
        )}
      </Center>
    </Center>
  );
}
