import {
  Divider,
  Grid,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { SimulationCard } from "./Simulations";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { User1 } from "../../@types/User";
import { useEffect } from "react";

interface MySimulationsProps {
  setModalSimulation: (val: any) => void;
  setVideoLoaded: (val: boolean) => void;
  setPlaySimulation: (
    val: {
      name: string;
      _id: string;
    } | null
  ) => void;
  setShowAuthModal: (val: boolean) => void;
  setSimualtionId: (val: string) => void;
  setSimulation: (val: SimulationData | null) => void;
  paramValue: string | null;
  setMysimualtionId: (val: string | null) => void;
  user: User1 | null;
  megaSimulation: any;
  mySImulations: any;
}

export function MySimulations(props: MySimulationsProps) {
  const navigate = useNavigate();

  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const reversedSimulations = [...props.mySImulations].filter((innerMySimulation)=>{
    return innerMySimulation.simulationId!=null
  }). reverse();

  return (
    <Stack py={30} px={isMd ? 10 : 45} h="calc(100vh - 100px)">
      <Text
        color="#000"
        fw={400}
        fz={16}
        style={{
          opacity: 0.5,
        }}
        pl={isMd ? 10 : 20}
      >
        Create your personalized simulation using customizable templates.
      </Text>
      <SimpleGrid cols={isMd ? 2 : 4}>
        {props.megaSimulation.map((x: any) => {
          return (
            <SimulationCard
              _id={x._id}
              name={x.name}
              lgNo={3}
              imageUrl={x.thumbnailImageUrl}
              setShowAuthModal={(val) => props.setShowAuthModal(val)}
              setSimualtionId={(val) => props.setSimualtionId(val)}
              setPlaySimulation={(id) => {
                navigate({ search: "play=true" });
                props.setPlaySimulation(x);
                props.setModalSimulation(null);
                props.setVideoLoaded(false);
                props.setMysimualtionId(null);
              }}
              simulationTags={x.simulationTags}
              paramValue={props.paramValue}
              userSubscriptionType={props.user?.subscriptionModelType ?? ""}
              isSimulationPremium={x.isSimulationPremium}
              setModalSimulation={(x) => {
                props.setSimulation(null);
                props.setModalSimulation(x);
              }}
              videoUrl={x.videoUrl}
              showInfo={true}
            />
          );
        })}
      </SimpleGrid>
      <Divider color="#E5E5E5" size="md" />
      {props.mySImulations.length > 0 && (
        <Text
          color="#000"
          fw={400}
          fz={16}
          style={{
            opacity: 0.5,
          }}
          pl={isMd ? 10 : 20}
        >
          Saved simulations
        </Text>
      )}
      <SimpleGrid cols={isMd ? 2 : 4}>
        {reversedSimulations.map((x: any) => {

          return (
            <SimulationCard
              _id={x.simulationId._id}
              name={x.name ?? x.simulationId.name ?? ""}
              lgNo={3}
              imageUrl={x.simulationId.thumbnailImageUrl}
              setShowAuthModal={(val) => props.setShowAuthModal(val)}
              setSimualtionId={(val) => props.setSimualtionId(val)}
              setPlaySimulation={(id) => {
                if(x.simulationId.isthreejs){
                  navigate(`${window.location.pathname}/simulation/${x.simulationId._id}`,{state: { data: x }});
                }else{
                  navigate({ search: "play=true" });
                }
                props.setPlaySimulation({
                  name: x.name ?? x.simulationId.name,
                  _id: x.simulationId._id,
                });
                props.setModalSimulation(null);
                props.setVideoLoaded(false);
                props.setMysimualtionId(x._id);
              }}
              simulationTags={x.simulationId.simulationTags}
              paramValue={props.paramValue}
              userSubscriptionType={props.user?.subscriptionModelType ?? ""}
              isSimulationPremium={x.simulationId.isSimulationPremium}
              setModalSimulation={(x) => {
                props.setSimulation(null);
                // props.setModalSimulation(x);
              }}
              videoUrl={x.simulationId.videoUrl}
              showInfo={false}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
