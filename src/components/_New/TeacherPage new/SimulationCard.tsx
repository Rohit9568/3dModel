import {
  Box,
  Center,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  useMantineTheme,
  Image,
  Text,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { IconViewAll } from "../../_Icons/CustonIcons";
import { useEffect, useState } from "react";
import { fetchTrendingSimulations } from "../../../features/Simulations/TrendingSimulationSlice";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import SimulationCardBg from "../../../assets/SimulationCardBg.png";
import TestCardBg from "../../../assets/TestCardBackground.png";
import simulationCardSideIcon from "../../../assets/simulationCardSideIcon.png";
import simulationcardsGroup from "../../../assets/simulationCardsGroup.png";
import testIconOnCard from "../../../assets/TestIconOnCard.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { User1 } from "../../../@types/User";
import { isGapMoreThanOneWeek } from "../../../utilities/HelperFunctions";
// import 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap';
import { isPremiumModalOpened } from "../../../store/premiumModalSlice";
import useFeatureAccess from "../../../hooks/useFeatureAccess";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

interface SimulationData1 {
  _id: string;
  name: string;
  thumbnailImageUrl: string;
}

interface SimulationCardInterface {
  _id: string;
  name: string;
  imageUrl: string | undefined;
  setPlaySimulation: (data: string) => void;
  setLoading: (data: boolean) => void;
}

export function ViewSimulationCard() {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 1020px)`);
  const isXl = useMediaQuery(`(max-width: 1300px)`);
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });

  const navigate = useNavigate();
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const dispatch = useDispatch();
  const { isFeatureValidwithNotification, UserFeature } = useFeatureAccess();

  function createTestHandler() {
    Mixpanel.track(WebAppEvents.TEACHER_APP_HOME_PAGE_CREATE_TEST_CLICKED);

    if (
      user?.subscriptionModelType === "PREMIUM" ||
      (user?.testRecords && user.testRecords.length < 5) ||
      (user?.testRecords && isGapMoreThanOneWeek(user.testRecords))
    ) {
      navigate(`${mainPath}/test?isCreateTest=true`);
    } else {
      Mixpanel.track(WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED, {
        feature_name: "premium_simulation_accessed",
        current_page: "all_simulations_page",
      });
      dispatch(isPremiumModalOpenedActions.setModalValue(true));
    }
  }

  return (
    <Box mt={isMd ? "60px" : "30px"} w="100%">
      <div
        style={{
          display: "flex",
          flexDirection: isSm ? "column" : "row",
          justifyContent: isSm ? "center" : "space-around",
          alignItems: isSm ? "center" : "start",
          width: "100%",
        }}
      >
        <Box
          style={{
            height: isSm ? "170px" : isMd ? "200px" : isLg ? "230px" : "280px",
            position: "relative",
            width: "100%",
            borderRadius: "24px",
            marginBottom: isSm ? "12px" : "0",
            // marginRight: !isSm ? "12px" : "0",
          }}
          onClick={() => {
            if (isFeatureValidwithNotification(UserFeature.SIMULATIONS)) {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_SHOW_ALL_SIMULATIONS_CLICKED
              );
              navigate(`${mainPath}/teach/simulations`);
            }
          }}
        >
          <Box h={"90%"}>
            <img
              src={SimulationCardBg}
              alt="Simulation Card Background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "24px",
              }}
            />
            <img
              src={simulationCardSideIcon}
              alt="Simulation Card Side Icon"
              style={{
                position: "absolute",
                bottom: "10%",
                right: "10px",
                width: "auto",
                height: "auto",
                maxWidth: isMd ? "200px" : "240px",
                maxHeight: isMd ? "200px" : "240px",
              }}
            />
            {!isLg && (
              <img
                src={simulationcardsGroup}
                alt="Simulation Card Group"
                style={{
                  position: "absolute",
                  bottom: "50%",
                  right: "50%",
                  transform: "translate(50%, 50%)",
                  width: isXl ? "auto" : "35%",
                  height: "auto",
                  minWidth: isXl ? "0px" : "400px",
                  maxWidth: isXl ? "280px" : "500px",
                  maxHeight: isXl ? "220px" : "800px",
                }}
              />
            )}
            <Box
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                height: "95%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingLeft: "16px",
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: isSm
                    ? "20px"
                    : isMd
                    ? "24px"
                    : isLg
                    ? "30px"
                    : "36px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                  letterSpacing: "-0.72px",
                }}
              >
                3D Simulations
              </Text>
              <Text
                mt={6}
                mb={20}
                style={{
                  color: "#FFF",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: isSm
                    ? "12px"
                    : isMd
                    ? "12px"
                    : isLg
                    ? "14px"
                    : "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  letterSpacing: "-0.72px",
                }}
              >
                Interactive Teaching Experience
              </Text>
              <Button
                variant="outline"
                style={{ color: "#FFF", marginTop: "8px", borderColor: "#FFF" }}
                onClick={() => {
                  if (isFeatureValidwithNotification(UserFeature.SIMULATIONS)) {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_SHOW_ALL_SIMULATIONS_CLICKED
                    );
                    navigate(`${mainPath}/teach/simulations`);
                  }
                  // navigate("/allsimulations");
                }}
              >
                View All
              </Button>{" "}
            </Box>
          </Box>
          <Box
            h={"5%"}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              style={{
                background:
                  "linear-gradient(90deg, #3174F3 0%, #AC2FFF 59.54%)",
                borderRadius: "0px 0px 24px 24px",
                width: isMd ? "85%" : "93%",
                height: "100%",
                opacity: 0.3,
              }}
            >
              {" "}
            </Box>
          </Box>
        </Box>

        {/* <Box
          style={{
            position: "relative",
            height: isSm ? "190px" : isMd ? "180px" : isLg ? "220px" : "260px",
            width: isSm ? "100%" : "60%",
            borderRadius: "24px",
            boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.25)",
            marginBottom: isSm ? "12px" : "0",
            marginLeft: !isSm ? "12px" : "0",
          }}
        >
          <img
            src={TestCardBg}
            alt="Test Card Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "24px",
            }}
          />
          <Flex
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: "100%",
            }}
          >
            <Box
              style={{
                width: isMd ? "80%" : "70%",
                padding: "16px",
              }}
            >
              <Flex
                direction="column"
                style={{ height: "100%", justifyContent: "center" }}
              >
                <Text
                  style={{
                    color: "#FFF",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: isSm
                      ? "18px"
                      : isMd
                      ? "20px"
                      : isLg
                      ? "22px"
                      : "28px",
                    fontWeight: 700,
                  }}
                >
                  Streamlined Test {isMd ? "" : <br />}Management
                </Text>
                <Text
                  mt={0}
                  mb={20}
                  style={{
                    color: "#FFF",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: isSm
                      ? "12px"
                      : isMd
                      ? "14px"
                      : isLg
                      ? "15px"
                      : "16px",
                    fontWeight: 400,
                  }}
                >
                  Create, Share and Analyse Tests Seamlessly
                </Text>
                <Flex style={{ justifyContent: "flex-start" }}>
                  <Button
                    variant="outline"
                    style={{
                      color: "#FFF",
                      borderColor: "#FFF",
                      marginRight: "8px",
                    }}
                    onClick={createTestHandler}
                  >
                    Create Test
                  </Button>
                  <Button
                    variant="outline"
                    style={{ color: "#FFF", borderColor: "#FFF" }}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_HOME_PAGE_VIEW_TEST_CLICKED
                      );
                      navigate(`${mainPath}/test`);
                    }}
                  >
                    View Test
                  </Button>
                </Flex>
              </Flex>
            </Box>
            <Box
              style={{
                width: isMd ? "20%" : "40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={testIconOnCard}
                alt="iconTest"
                style={{
                  width: "100%",
                  minHeight: "140px",
                  objectFit: "contain",
                  objectPosition: "center",
                  borderRadius: "0 24px 24px 0",
                }}
              />
            </Box>
          </Flex>
        </Box> */}
      </div>
    </Box>
  );
}
