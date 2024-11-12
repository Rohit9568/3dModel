import { useDispatch, useSelector } from "react-redux";
import {
  GetUser,
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../utilities/LocalstorageUtility";

import { ReactNode, useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { currentLoginUser } from "../../store/userSlice";
import { isPremiumModalOpened } from "../../store/premiumModalSlice";
import { instituteDetails } from "../../store/instituteDetailsSlice";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowNarrowRight, IconX } from "@tabler/icons";
import { User1 } from "../../@types/User";
import { getUserDetails } from "../../features/user/userSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { isGapMoreThanOneWeek } from "../../utilities/HelperFunctions";
import { IconCross2, IconRightArrow } from "../_Icons/CustonIcons";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import useParentCommunication from "../../hooks/useParentCommunication";

const currentLoginUserActions = currentLoginUser.actions;
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;
const instituteDetailsActions = instituteDetails.actions;
export function UserDetails(props: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [isFreeTrialExpired, setIsFreeTrialExpired] = useState<boolean>(false);
  const [isGopremiumClicked, setIsGoPremiumClicked] = useState<boolean>(false);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const { sendDataToReactnative } = useParentCommunication();
  function changeFavicon(newFaviconURL: string) {
    const head = document.head || document.getElementsByTagName("head")[0];
    const existingFavicon = document.querySelector('link[rel="icon"]');
    const favicon: any = existingFavicon || document.createElement("link");

    favicon.rel = "icon";
    favicon.href = newFaviconURL;

    if (!existingFavicon) {
      head.appendChild(favicon);
    } else if (existingFavicon instanceof Element) {
      head.replaceChild(favicon, existingFavicon);
    }
  }
  function changeTitle(name: string) {
    document.title = name;
  }

  const updateOGPTags = (name: string) => {
    const ogTitleTag = document.querySelector('meta[property="og:title"]');

    if (ogTitleTag) {
      ogTitleTag.setAttribute("content", name);
    } else {
      // If the og:title tag doesn't exist, create it
      const newOgTitleTag = document.createElement("meta");
      newOgTitleTag.setAttribute("property", "og:title");
      newOgTitleTag.setAttribute("content", name);
      document.head.appendChild(newOgTitleTag);
    }
  };
  useEffect(() => {
    const user = GetUser();
    if (user) {
      getUserDetails()
        .then((x: any) => {
          document.title = x.instituteName;
          dispatch(
            instituteDetailsActions.setDetails({
              name: x.instituteName,
              iconUrl: x.schoolIcon,
              _id: x.instituteId,
              address: x.Address,
              secondPhoneNumber: x.secondInstituteNumber,
              phoneNumber: x.institutePhoneNumber,
              featureAccess: x.featureAccess,
              paymentDetailsImageUrl: x.paymentDetailsImageUrl
            })
          );
          changeFavicon(x.schoolIcon);
          changeTitle(x.instituteName);
          updateOGPTags(x.instituteName);
          dispatch(currentLoginUserActions.setUserDetails(x));
          sendDataToReactnative(3, {
            userId: x._id,
          });
          Mixpanel.register(x);
          if (x) {
            if (x.subscriptionModelType === "FREE") {
              setIsFreeTrialExpired(true);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          RemoveValueFromLocalStorage(LocalStorageKey.Token);
          RemoveValueFromLocalStorage(LocalStorageKey.User);
          RemoveValueFromLocalStorage(LocalStorageKey.UserType);
          Mixpanel.logout();
          window.location.href = "/";
        });
    } else {
      dispatch(currentLoginUserActions.setuserInitialState());
    }
  }, []);

  const isPremiumModalOpened = useSelector<RootState, boolean>((state) => {
    return state.premiumModalSlice.value;
  });
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  return (
    <>
      {props.children}
      <Modal
        opened={isFreeTrialExpired}
        onClose={() => {}}
        styles={{
          modal: {
            padding: 0,
            borderRadius: "14px",
            // border: "red solid 5px",

            // zIndex: -9999999,
          },
          overlay: {
            // zIndex: 99999,
            // border: "red solid 5px",
          },
        }}
        withCloseButton={false}
        size="auto"
        centered
        p={0}
        m={0}
        padding={0}
        // zIndex={-9999999999}
      >
        <Flex
          w={isMd ? "90vw" : "60vw"}
          // h="80vh"
          // h="60vh"
          style={{
            aspectRatio: isMd ? 0.65 : 1.92,
            position: "relative",
            borderRadius: 32,
            // border: "red solid 1px",
          }}
        >
          <img
            src={require("../../assets/premiumBackground.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          <Stack>
            <Flex justify="right" w="100%" mr={-200} mt={30}>
              <Button
                onClick={() => {
                  RemoveValueFromLocalStorage(LocalStorageKey.Token);
                  RemoveValueFromLocalStorage(LocalStorageKey.User);
                  RemoveValueFromLocalStorage(LocalStorageKey.UserType);
                  window.location.href = "/";
                }}
                fz={20}
                style={{
                  zIndex: 99999,
                }}
                // variant="outline"
              >
                Logout
              </Button>
            </Flex>
            <Flex
              w="100%"
              h="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
              direction={isMd ? "column" : "row"}
            >
              {isGopremiumClicked === false && (
                <>
                  <Stack
                    h="100%"
                    w={isMd ? "100%" : "60%"}
                    justify="center"
                    pl={isMd ? 0 : 60}
                    spacing={isMd ? 16 : 40}
                    style={{
                      order: isMd ? 2 : 1,
                    }}
                    mt={isMd ? -40 : 0}
                    // align={isMd?"center":"left"}
                  >
                    <Text
                      fz={isMd ? 24 : 32}
                      fw={800}
                      color="white"
                      ta={isMd ? "center" : "left"}
                      w="100%"
                    >
                      Your Free Trial has expired!
                    </Text>
                    <Text
                      fz={isMd ? 16 : 20}
                      fw={400}
                      color="white"
                      ta={isMd ? "center" : "left"}
                    >
                      Upgrade your subscription to continue surfing through the
                      app
                    </Text>
                    <Flex justify={isMd ? "center" : "left"}>
                      <Button
                        bg="white"
                        style={{
                          borderRadius: "30px",
                          background: "white",
                        }}
                        size={isMd ? "md" : "xl"}
                        px={isMd ? 30 : 50}
                        onClick={() => {
                          setIsGoPremiumClicked(true);
                          Mixpanel.track(
                            WebAppEvents.VIGNAM_APP_GO_PREMIUM_CLICKED,
                            {
                              subscription: "FREE",
                            }
                          );
                        }}
                      >
                        <Text className="gradient-text" fz={18} fw={700}>
                          Go Premium
                        </Text>
                        <IconArrowNarrowRight
                          color="#7B4AFA"
                          size={30}
                          // className="gradient-text"
                        />
                      </Button>
                    </Flex>
                  </Stack>
                  {isMd && (
                    <Stack
                      h="65%"
                      justify="end"
                      align="end"
                      style={{
                        order: isMd ? 1 : 2,
                      }}
                      // pl={50}
                    >
                      <img
                        src={require("../../assets/premiuimBannerPic1.png")}
                        height="100%"
                        // style={{
                        //   aspectRatio:1.39
                        // }}
                        // width="80%"
                      />
                    </Stack>
                  )}
                  {!isMd && (
                    <Stack
                      w="40%"
                      justify="end"
                      align="end"
                      style={{
                        order: isMd ? 1 : 2,
                      }}
                      // pl={50}
                    >
                      <img
                        src={require("../../assets/premiuimBannerPic1.png")}
                        width="100%"
                      />
                    </Stack>
                  )}
                </>
              )}
              {isGopremiumClicked === true && (
                <>
                  <Stack
                    h="100%"
                    w={isMd ? "100%" : "40%"}
                    justify="center"
                    pl={isMd ? 0 : 60}
                    spacing={isMd ? 16 : 40}
                    style={{
                      order: isMd ? 2 : 1,
                    }}
                  >
                    <Text
                      fz={isMd ? 24 : 32}
                      fw={800}
                      color="white"
                      ta={isMd ? "center" : "left"}
                      w="100%"
                    >
                      Thankyou, {user?.name}
                    </Text>
                    <Text
                      fz={isMd ? 16 : 20}
                      fw={400}
                      color="white"
                      ta={isMd ? "center" : "left"}
                    >
                      Our sales team will contact you shortly.
                    </Text>
                  </Stack>
                  {isMd && (
                    <Stack
                      w="100%"
                      h="70%"
                      justify="center"
                      align="center"
                      style={{
                        order: isMd ? 1 : 2,
                      }}
                      mt={30}
                      // pl={50}
                    >
                      <img
                        src={require("../../assets/premiuimBannerPic2.png")}
                        width="90%"
                        // width="80%"
                      />
                    </Stack>
                  )}
                  {!isMd && (
                    <Stack
                      w="60%"
                      justify="center"
                      align="center"
                      style={{
                        order: isMd ? 1 : 2,
                      }}
                      // pl={50}
                    >
                      <img
                        src={require("../../assets/premiuimBannerPic2.png")}
                        width="80%"
                      />
                    </Stack>
                  )}
                </>
              )}
            </Flex>
          </Stack>
        </Flex>
      </Modal>
      <Modal
        opened={isPremiumModalOpened}
        onClose={() => {
          dispatch(isPremiumModalOpenedActions.setModalValue(false));
        }}
        withCloseButton={false}
        padding={0}
        styles={{
          modal: {
            padding: 0,
            borderRadius: "14px",
          },
        }}
        size="auto"
        centered
        p={0}
        m={0}
      >
        <Flex
          w={isMd ? "90vw" : "60vw"}
          // h="80vh"
          // h="60vh"
          style={{
            aspectRatio: isMd ? 0.65 : 1.92,
            position: "relative",
            borderRadius: 32,
            // border: "red solid 1px",
          }}
        >
          <img
            src={require("../../assets/premiumBackground.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <Stack
            w="100%"
            h="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            spacing={0}
          >
            <Flex
              w="100%"
              justify="space-between"
              align="center"
              px={isMd ? 20 : 30}
              py={10}
            >
              <Text fz={isMd ? 24 : 28} color="white" fw={600}>
                Grow with Vignam
              </Text>
              <Box
                onClick={() => {
                  dispatch(isPremiumModalOpenedActions.setModalValue(false));
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <IconCross2 col="white" />
              </Box>
            </Flex>
            <Flex w="100%" h="100%" direction={isMd ? "column" : "row"}>
              <>
                <Stack
                  h="100%"
                  w={isMd ? "100%" : "40%"}
                  justify="center"
                  pl={isMd ? 0 : 60}
                  spacing={isMd ? 16 : 40}
                  style={{
                    order: isMd ? 2 : 1,
                  }}
                >
                  <Text
                    fz={isMd ? 24 : 32}
                    fw={800}
                    color="white"
                    ta={isMd ? "center" : "left"}
                    w="100%"
                  >
                    Thankyou, {user?.name}
                  </Text>
                  <Text
                    fz={isMd ? 16 : 20}
                    fw={400}
                    color="white"
                    ta={isMd ? "center" : "left"}
                  >
                    Our sales team will contact you shortly.
                  </Text>
                  <Flex justify={isMd ? "center" : "left"}>
                    <Button
                      bg="white"
                      style={{
                        borderRadius: "30px",
                        background: "white",
                      }}
                      size={isMd ? "md" : "xl"}
                      px={isMd ? 50 : 90}
                      onClick={() => {
                        dispatch(
                          isPremiumModalOpenedActions.setModalValue(false)
                        );
                        Mixpanel.track(
                          WebAppEvents.VIGNAM_APP_GO_PREMIUM_CLICKED,
                          {
                            subscription: "FREE",
                          }
                        );
                      }}
                    >
                      <Text className="gradient-text" fz={18} fw={700}>
                        Okay
                      </Text>
                    </Button>
                  </Flex>
                </Stack>
                {isMd && (
                  <Stack
                    w="100%"
                    h="70%"
                    justify="center"
                    align="center"
                    style={{
                      order: isMd ? 1 : 2,
                    }}
                    mt={30}
                    // pl={50}
                  >
                    <img
                      src={require("../../assets/premiuimBannerPic2.png")}
                      width="90%"

                      // width="80%"
                    />
                  </Stack>
                )}
                {!isMd && (
                  <Stack
                    w="60%"
                    justify="center"
                    align="center"
                    style={{
                      order: isMd ? 1 : 2,
                    }}
                    // pl={50}
                  >
                    <img
                      src={require("../../assets/premiuimBannerPic2.png")}
                      width="80%"
                    />
                  </Stack>
                )}
              </>
            </Flex>
          </Stack>
        </Flex>
      </Modal>
    </>
  );
}
