import {
  Image,
  SimpleGrid,
  createStyles,
  LoadingOverlay,
  Stack,
  Text,
  Card,
  Divider,
  Tooltip,
  Box,
  Center,
  Modal,
} from "@mantine/core";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { useState, useEffect } from "react";
import { ContentSimulation } from "../SimulationPage/ContentSimulation";
import { useLocation, useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons";
import { Pages } from "../_New/Teach";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { CanvasDraw } from "./CanvasDraw";

const useStyles = createStyles((theme) => ({
  simualtioncard: {
    boxShadow: "0px 0px 25px 0px rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    width: 360,
    height: 210,
    background: "#F5F5F5",
    cursor: "pointer",
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
  const { classes } = useStyles();
  function DidClickSimulation(simulation: { _id: string; name: string }) {
    if (props._id != null) {
    }
    props.setPlaySimulation(simulation._id);
  }
  return (
    <Tooltip label={props.name} withArrow>
      <Card
        style={{
          position: "relative",
          width: "min(calc(100vh * (16/9)), 100%)",
          height: "auto",
          aspectRatio: "16/9",
          alignContent: "center",
        }}
        className={classes.simualtioncard}
        p={0}
        onClick={() => {
          DidClickSimulation({
            _id: props._id,
            name: props.name,
          });
        }}
      >
        <img
          src={props.imageUrl}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
        {/* <Text fw={700}>{props.name}</Text> */}
      </Card>
    </Tooltip>
  );
}

interface SimulationPageProps {
  topic?: SingleTopic;
  page: Pages;
  onUpdateTopic: (data: SingleTopic) => void;
  isActivity: boolean;
}
export function SimulationPage(props: SimulationPageProps) {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [playSimulation, setPlaySimulation] = useState<{name:string,_id:string} | null>(null);
  const chapterId = useSelector<RootState, string | null>((state) => {
    return state.currentSelectionSlice.chapterId;
  });
  const subjectId = useSelector<RootState, string | null>((state) => {
    return state.currentSelectionSlice.subjectId;
  });
  const [currentUrl,setCurrentUrl]=useState<string>('');

  const { classes } = useStyles();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("play");
  const navigate = useNavigate();
  useEffect(()=>{
    if(!paramValue){
      setPlaySimulation(null)
    }
  },[paramValue])
  useEffect(()=>{
    setCurrentUrl(location.pathname)
  },[])

  useEffect(() => {
    setPlaySimulation(null);
  }, [props.topic]);

  function AddSimulationCard() {
    return (
      <>
        <Card
          style={{
            position: "relative",
            width: "min(calc(100vh * (16/9)), 100%)",
            height: "auto",
            aspectRatio: "16/9",
            alignContent: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className={classes.simualtioncard}
          onClick={() => {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_LEARN_PAGE_TOPIC_SECTION_ADD_SIMULATION_CLICKED
            );
            navigate(
              `/teacher/simulations/${props.page}/${
                subjectId ?? ""
              }/${chapterId}/${props.topic?._id ?? ""}/add/${
                props.isActivity ? "activity" : "simulation"
              }`
            );
          }}
        >
          <Stack align="center" spacing={1}>
            <Image
              width={60}
              height={60}
              mb={5}
              fit="contain"
              src={require("../../assets/EmptySimulaiton.png")}
            />
            <Divider w={"50%"} />
            <Text c="#767676" fw={700} fz={25} my={-10}>
              +
            </Text>
            <Text c={"#3174F3"} fw={600} fz={20}>
              Add {props.isActivity ? `Activity` : `Simulation`}
            </Text>
          </Stack>
        </Card>
      </>
    );
  }
  
  return (
    <>
      <SimpleGrid
        cols={3}
        verticalSpacing={35}
        breakpoints={[
          { maxWidth: "lg", cols: 3, spacing: "md" },
          { maxWidth: "md", cols: 2, spacing: "sm" },
          { maxWidth: "sm", cols: 1, spacing: "sm" },
        ]}
      >
        <AddSimulationCard />
        {props.topic?.simulations?.map((x) => {
          return (
            <SimulationCard
              key={x._id}
              _id={x._id}
              name={x.name}
              imageUrl={x.thumbnailImageUrl}
              setPlaySimulation={(data: string) => {
                navigate(`${currentUrl}?play=true`)
                setPlaySimulation(x)
                // setPlaySimulation(x);
              }}
              setLoading={setLoadingData}
            />
          );
        })}
      </SimpleGrid>
      <LoadingOverlay visible={loadingData} />
      <Modal
        opened={playSimulation !== null}
        onClose={() => {
          setPlaySimulation(null);
          // navigate('/allsimualtions')
        }}
        withCloseButton={false}
        closeOnClickOutside={false}
        // lockScroll
        styles={{
          inner: {
            padding: 0,
            margin: 0,
            // border:'blue solid 1px'
          },
          root: {
            padding: 0,
            margin: 0,
            // border:'violet solid 1px'
          },
          modal: {
            // border:'violet solid 1px',
            padding: 0,
            margin: 0,
          },
        }}
        // size="xl"
        size="auto"
        m={0}
        padding={0}
        lockScroll
        // centered
        fullScreen
      >
        {/* <div
        style={{
          width:'100%',
          height:'100%',
          border:'red solid 1px'
        }}
        // w="100%"
        // h="100%"
        > */}
        {/* </div> */}

        {playSimulation !== null && (
          <CanvasDraw
            onCloseClick={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED
              );
              // navigate.
              setPlaySimulation(null)
              navigate(-1)  
            }}
            simulation={playSimulation}
          >
            <Center
              style={{
                height: "100%",
                width: "100%",
                // border:'red solid 1px'
              }}
            >
              <ContentSimulation simulationId={playSimulation._id} />
            </Center>
          </CanvasDraw>
        )}
      </Modal>
      {/* <Modal
        opened={playSimulation !== null}
        onClose={() => {
          setPlaySimulation(null);
        }}
        withCloseButton={false}
        closeOnClickOutside={false}
        lockScroll
        styles={{
          inner: {
            padding: 0,
          },
          root: {
            padding: 0,
          },
        }}
        // size="xl"
        size="auto"
        m={0}
        centered
      >
        <>
          {playSimulation !== null && (
            <CanvasDraw
              onCloseClick={()=>{
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED
                );
                setPlaySimulation(null);
              }}
              simulation={}
            >
              <ContentSimulation simulationId={playSimulation} />
            </CanvasDraw>
          )}
        </>
      </Modal> */}
    </>
  );
}
