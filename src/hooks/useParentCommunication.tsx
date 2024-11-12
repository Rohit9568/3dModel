// type MessageHandler = (data: MessageData) => void;

import { useEffect, useState } from "react";
import { GetUserToken } from "../utilities/LocalstorageUtility";

function useParentCommunication(onMessageReceived?: (data: any) => void) {
  function sendDataToReactnative(commandType: number, values: any) {
    const data = {
      commandType,
      authToken:GetUserToken(),
      ...values,
    };
    const jsonData = JSON.stringify(data);
    //@ts-ignore
    if (window.ReactNativeWebView)
      //@ts-ignore
      window.ReactNativeWebView.postMessage(jsonData);
  }

  function isReactNativeActive() {
    //@ts-ignore
    return window.ReactNativeWebView;
  }
  useEffect(() => {
    const handleMessage = (event: any) => {
      if (onMessageReceived) onMessageReceived(JSON.parse(event.data));
    };
    document.addEventListener("message", handleMessage);
    return () => {
      document.removeEventListener("message", handleMessage);
    };
  }, []);

  return {
    sendDataToReactnative,
    isReactNativeActive,
  };
}

export default useParentCommunication;
