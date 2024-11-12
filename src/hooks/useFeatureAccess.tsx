// type MessageHandler = (data: MessageData) => void;

import { useEffect, useState } from "react";
import { GetUserToken } from "../utilities/LocalstorageUtility";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "../store/ReduxStore";
import { User1 } from "../@types/User";

function useFeatureAccess() {
  
  enum UserFeature {
    ATTENDANCE = "attendance",
    FEEMANAGEMENT = "feemanagement",
    WEBSITEBUILDER = "websitebuilder",
    DAILYDIARY = "dailydiary",
    SIMULATIONS = "simulations",
    CONTENTSHARING = "contentsharing",
    TESTINGPLATFORM = "testingplatform",
    LIVECLASSES = "liveclasses",
    ONLINECOURSES = "onlinecourses",
    ADDREMOVESTAFF = "addremovestaff",
    ADDREMOVESTUDENTS = "addremovestudents",
    ADDREMOVEBATCHES = "addremovebatch",
  }
  const user1 = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  function isFeatureValid(feature: UserFeature) {
    if (
      user1 &&
      user1.userFeatureAccess &&
      user1.userFeatureAccess[feature] === true
    ) {
      return true;
    }
    return false;
  }

  function isFeatureValidwithNotification(feature: UserFeature) {
    if (
      user1 &&
      user1.userFeatureAccess &&
      user1.userFeatureAccess[feature] === true
    ) {
      return true;
    } else if (user1) {
      showNotification({
        message: "You are not authorized to access this feature",
      });
      return false;
    }
  }

  function shownotification() {
    showNotification({
      message: "You are not authorized to access this feature",
    });
  }

  return {
    isFeatureValidwithNotification,
    UserFeature,
    isFeatureValid,
    shownotification,
  };
}

export default useFeatureAccess;
