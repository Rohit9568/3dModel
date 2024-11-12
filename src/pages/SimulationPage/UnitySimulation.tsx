import { Center, Container, Title } from "@mantine/core";
import { useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { CanvasDraw2 } from "./CanvasDraw2";
import { GetUserToken } from "../../utilities/LocalstorageUtility";

interface UnitySimulationProps {
  simulationData: SimulationData | undefined;
  data?: any;
}

export function UnitySimulation(props: UnitySimulationProps) {
  const navigate = useNavigate();
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    sendMessage,
    unload,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: props?.simulationData?.loaderUrl,
    dataUrl: props.simulationData?.dataUrl ?? "",
    frameworkUrl: props.simulationData?.frameworkUrl ?? "",
    codeUrl: props.simulationData?.wasmUrl ?? "",
  });
  function handleMessage(event: any) {
    if (event.origin !== "your-unity-origin") {
      return;
    }

    const data = JSON.parse(event.data);
    alert(data);
    if (data.backgroundColor) {
      document.body.style.backgroundColor = data.backgroundColor;
    }
  }
  const data = JSON.stringify({
    simulationID: props.simulationData?._id,
    token: GetUserToken(),
    source: process.env.REACT_APP_SOURCE,
    data: props.data ?? null,
    saveData: props.data ?? null,
  });


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("type");
  const dispatch = useDispatch();
  const backgroundColor = useSelector<RootState, string>((state) => {
    return state.currentSimulationColor.color;
  });
  
  useEffect(()=>{
    if(props?.simulationData?.loaderUrl == null){
          let currentPath = window.location.pathname;
          navigate(`/simulation/${props?.simulationData?._id}`)
    }
  },[])

  const loadingPercentage = Math.round(loadingProgression * 100);

  useEffect(() => {
    if (isLoaded) {
      Mixpanel.track("Teacher_App_Simulation_Loading_Completed", {
        name: props.simulationData?.name,
        id: props.simulationData?._id,
      });
      sendMessage("BrowserCommunicationController", "SetBrowserData", data);
    }
  }, [isLoaded]);
  const viewport = useRef<HTMLDivElement>(null);
  return (
    <>
      <Center
        w={"100%"}
        h={"100%"}
        style={{
          backgroundColor: props.simulationData?.simulationBackgroundColor,        }
      }
      >
        {
          <Container
            p={0}
            m={0}
            w={"100%"}
            h={"100%"}
            fluid={true}
            ref={viewport}
            onClick={() => {
              if (paramValue && paramValue === "parent") {
                Mixpanel.track(
                  ParentPageEvents.PARENT_APP_ACTIVE_SIMULATION_CLICKED,
                  {
                    name: props.simulationData?.name,
                    id: props.simulationData?._id,
                  }
                );
              } else {
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_ACTIVE_SIMULATION_CLICKED,
                  {
                    name: props.simulationData?.name,
                    id: props.simulationData?._id,
                  }
                );
              }
            }}
          >
            {" "}
            {isLoaded === false && (
              <Center
                h="100%"
                w="100%"
                style={{
                  position: "absolute",
                }}
              >
                <Title
                  style={{
                    fontSize: "2vw",
                    textAlign: "center",
                  }}
                >
                  Loading... ({loadingPercentage}%)
                </Title>
              </Center>
              // </div>
            )}
            <Unity
              unityProvider={unityProvider}
              style={{ height: "98%", width: "100%", }}
            />
          </Container>
        }
      </Center>
    </>
  );
}
