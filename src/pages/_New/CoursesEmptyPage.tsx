import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TopBarTeacher } from "../../components/NavbarTeacher/TopBarTeacher";
import {
  GetCourseFeatureOrderData,
  GetVideoCallOrderData,
} from "../../_parentsApp/features/paymentSlice";
import { showNotification } from "@mantine/notifications";
import {
  GetCourseAccess,
  GetVideoAccess,
} from "../../_parentsApp/features/instituteSlice";
import { useState } from "react";
import { displayRazorpay } from "../../utilities/Payment";
import { IconCross2 } from "../../components/_Icons/CustonIcons";

enum AppFeatures {
  COURSE,
  TEST,
  SIMULATION,
  CONTENT,
  VIDEO,
}

export function CoursesEmptyPage(props: {
  instituteId: string;
  heading: string;
  subheading: string;
  img: any;
  onClick: () => void;
  onLogout: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false);
  return (
    <>
      {isMd && (
        <Box h={70}>
          <TopBarTeacher
            disableSearch={true}
            onLogout={() => {
              props.onLogout();
            }}
          ></TopBarTeacher>
        </Box>
      )}

      <Flex
        w="100%"
        h={isMd ? "88dvh" : "100dvh"}
        align="center"
        style={{
          backgroundColor: "#F7F7FF",
          overflow: "hidden",
        }}
        px={50}
        justify={"center"}
        direction={isMd ? "column" : "row"}
        gap={isMd ? 25 : 0}
      >
        <Stack
          w={isMd ? "100%" : "40%"}
          justify="center"
          align={isMd ? "center" : "left"}
          style={{
            order: isMd ? 2 : 1,
          }}
        >
          <Text fz={isMd ? 24 : 32} fw={700} ta={isMd ? "center" : "left"}>
            {props.heading}
          </Text>
          <Text fz={isMd ? 16 : 20} fw={400} ta={isMd ? "center" : "left"}>
            {props.subheading}
          </Text>
          <Flex>
            <Button
              size={isMd ? "md" : "xl"}
              bg="#4B65F6"
              style={{
                borderRadius: "12px",
              }}
              fz={isMd ? 18 : 24}
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              onClick={() => {
                props.onClick();
                //setUpgradeModal(true);
              }}
            >
              Upgrade
            </Button>
          </Flex>
        </Stack>
        <img
          src={props.img}
          width={isMd ? "100%" : "60%"}
          style={{
            order: isMd ? 1 : 2,
          }}
        />
      </Flex>
      <Modal
        opened={upgradeModal}
        onClose={() => {
          setUpgradeModal(false);
        }}
        padding={0}
        withCloseButton={false}
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
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setUpgradeModal(false);
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
                    Contact our sales team to get Upgraded.
                  </Text>
                  <Text
                    fz={isMd ? 16 : 20}
                    fw={400}
                    color="white"
                    ta={isMd ? "center" : "left"}
                  ></Text>
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
                        setUpgradeModal(false);
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
