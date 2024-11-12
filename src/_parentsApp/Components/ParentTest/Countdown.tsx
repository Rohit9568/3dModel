import { Text } from "@mantine/core";
import { formatTimewithSecondsFormatting } from "../../../utilities/HelperFunctions";
import { useEffect, useState } from "react";
import { time } from "console";

export function CountDown(props:{duration:number[],onTimerFinished:()=>void}) {

  const [timer, setTimer] = useState<number[]>(props.duration);

  useEffect(() => {
    let intervalId: any;
    if (timer[0] > 0) {
      intervalId = setInterval(() => setTimer([timer[0] - 1]), 1000);
    }
    else{
      props.onTimerFinished();
    }
    return () => clearInterval(intervalId);
  }, [timer]);
  useEffect(()=>{
    setTimer(props.duration)
  },[props.duration])

  return (
    <Text fz={16} fw={700} mt={0} ml={12}>
      Time Left : {formatTimewithSecondsFormatting(timer[0])}
    </Text>
  );
}
