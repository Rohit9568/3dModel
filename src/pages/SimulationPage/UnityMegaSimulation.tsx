import { Center, Container, LoadingOverlay, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useLocation, useParams } from "react-router-dom";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { useDispatch, useSelector } from "react-redux";
import { GetUser, GetUserToken } from "../../utilities/LocalstorageUtility";

export function UnityMegaSimulation() {
  const params = useParams();
  const chapterId = params.chapterId;

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
      loaderUrl:
        "https://vignam-simulations-stage.s3.ap-south-1.amazonaws.com/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4.loader.js",
      dataUrl:
        "https://vignam-simulations-stage.s3.ap-south-1.amazonaws.com/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4.data.unityweb",
      frameworkUrl:
        "https://vignam-simulations-stage.s3.ap-south-1.amazonaws.com/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4.framework.js.unityweb",
      codeUrl:
        "https://vignam-simulations-stage.s3.ap-south-1.amazonaws.com/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4/SIM-50022f43-6b5f-4592-846f-74d5d0690cc4.wasm.unityweb",
    });
  const token = GetUserToken();
  const data = JSON.stringify({
    simulationID: "",
    chapterId: chapterId,
    token: token,
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("type");
  const dispatch = useDispatch();

  const loadingPercentage = Math.round(loadingProgression * 100);
  useEffect(() => {
    if (isLoaded) {
      sendMessage("BrowserCommunicationController", "SetBrowserData", data);
    }
  }, [isLoaded, chapterId]);
  const viewport = useRef<HTMLDivElement>(null);
  return (
    <>
      <Center
        h="100vh"
        w="100vw"
        style={{
          backgroundColor: "",
        }}
      >
        <Container
          p={0}
          m={0}
          fluid={true}
          style={{
            width: "min(calc(100vh * (16/9)), 100vw)",
            height: "auto",
            aspectRatio: "16/9",
            alignContent: "center",
            margin: "0px auto",
            position: "relative",
            // border: "red solid 1px",
          }}
          ref={viewport}
          onClick={() => {
            if (paramValue && paramValue === "parent") {
              Mixpanel.track(
                ParentPageEvents.PARENT_APP_ACTIVE_SIMULATION_CLICKED,
                {
                  name: "Mega Simulation",
                  id: "",
                }
              );
            } else {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_ACTIVE_SIMULATION_CLICKED,
                {
                  name: "Mega Simulation",
                  id: "",
                }
              );
            }
          }}
        >
          {isLoaded === false && (
            <Center
              h="100%"
              w="100%"
              style={{
                position: "absolute",
                // border:'blue solid 1px'
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
            style={{ height: "98%", width: "100%" }}
            devicePixelRatio={window.devicePixelRatio}
          />
          {/* </CanvasDraw2> */}
        </Container>
      </Center>
    </>
  );
}
