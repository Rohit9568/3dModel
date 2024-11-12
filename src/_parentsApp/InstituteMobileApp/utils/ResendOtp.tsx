import { Text } from "@mantine/core";
import React, { useState, useEffect } from "react";

function ResendOTP(props: { onResendClick: () => void }) {
  const resendTime = 90;
  const [timer, setTimer] = useState<number>(resendTime);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (timer !== 0) {
      // if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendClick = () => {
    setIsTimerActive(true);
    setTimer(resendTime); // Reset timer to 90 seconds
    props.onResendClick();
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div>
      {timer === 0 ? (
        <Text onClick={handleResendClick} color="#0D61FF" fw={700}>
          Resend OTP
        </Text>
      ) : (
        <span>Resend OTP in {formatTime(timer)}</span>
      )}
    </div>
  );
}

export default ResendOTP;
