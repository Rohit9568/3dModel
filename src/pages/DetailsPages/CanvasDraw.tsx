import { Button, Center, Flex, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons";
import { ReactNode, useEffect, useRef, useState } from "react";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { SidePenBar } from "../../components/Simulations/SidePenBar";
import { User1 } from "../../@types/User";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";

export function CanvasDraw(props: {
  children: ReactNode;
  onCloseClick: () => void;
  simulation: {
    name: string;
    _id: string;
  };
  instituteName?: string;
  icon?: string;
}) {
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  const [time, setTime] = useState(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 1;
        timeRef.current = newTime; // Update ref with latest value
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      Mixpanel.track(WebAppEvents.SIMULATION_TIME_SPEND, {
        time: timeRef.current,
      });
    };
  }, []);

  return (
    <div
      style={{
        // border:'violet solid 2px',
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "white",
        // backgroundColor:'white',
      }}
      id="all-content-II"
    >
      {/* <SidePenBar
         itemSelected={itemSelected}
         setItemSelected={setItemSelected}
      /> */}
      {/* <Flex 
      style={{
        border:'red solid 1px',
        height:'40px',
        position:'fixed',
        top:0,
        width:'100%',
      }}
      justify="right"
      align="center"
      > */}
      <Center
        w={35}
        h={35}
        onClick={() => {
          props.onCloseClick();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: "red",
          zIndex: 9999,
          position: "fixed",
          right: 0,
        }}
        mx={10}
      >
        <IconX color="white" />
      </Center>
      {/* </Flex> */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 25px)",
          // backgroundColor:simulationColor,
          backgroundColor: "white",
          // border:'blue solid 1px'
          // marginTop:'40px'
          // border:'blue solid 1px'
        }}
        id="simulation-content"
      >
        {/* <div
        style={{
          position: "relative",
          width: "100%",
        }}
        // id="all-content"
      > */}

        {props.children}
        {/* </div> */}
      </div>
      <Flex
        style={{
          height: "40px",
          backgroundColor: "black",
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
        justify="space-between"
        px={20}
        align="center"
      >
        <Text color="white" fz={16} fw={700}>
          {props.simulation.name}
        </Text>
        <Group>
          <img
            src={props.icon ? props.icon : user?.schoolIcon}
            height={30}
            width={30}
          />
          <Text color="white" fz={18} fw={700}>
            {props.instituteName ? props.instituteName : user?.instituteName}
          </Text>
        </Group>
      </Flex>
    </div>
  );
}
