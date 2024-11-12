import { Box, Center, Stack, Text, useMantineTheme } from "@mantine/core";
import { useEffect } from "react";
import { toProperCase } from "../../../utilities/HelperFunctions";
import ProfilePicture2 from "../../ProfilePic/ProfillePic2";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons";

export function MainUserModal(props: {
  aspectRatio: number;
  userName: string;
  user: AgoraRtcUserInfo | null;
  onCloseClick: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  useEffect(() => {
    if (props.user && props.user.videoTrack && props.user.videoTrack.play) {
      props.user.videoTrack.play("main-2");
    }
  }, [props.user]);
  return (
    <Stack
      style={{
        position: "relative",
        alignItems: "center",
        overflow: "hidden",
      }}
      h={"100vh"}
      w="100%"
      align="center"
      justify="center"
    >
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
          top: 0,
        }}
        mx={10}
      >
        <IconX color="white" />
      </Center>
      <Box
        id="main-2"
        style={{
          aspectRatio: props.aspectRatio,
          width: `min(calc(${"100vh"} * ${props.aspectRatio}), 100%)`,
          height: "auto",
          position: "relative",
        }}
      >
        <Text
          px={10}
          py={2}
          style={{
            backgroundColor: "#181818",
            color: "white",
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 9999,
            width: "100%",
          }}
          fz={16}
        >
          {toProperCase(props.userName.toLowerCase())}
        </Text>
      </Box>
      <Stack
        w="100%"
        h="100%"
        style={{
          position: "absolute",
          aspectRatio: props.aspectRatio,
          width: `min(calc(${isMd ? "50vh" : "70vh"} * ${
            props.aspectRatio
          }), 100%)`,
          height: "auto",
        }}
        justify="end"
      >
        <Center
          w="100%"
          h="100%"
          style={{
            zIndex: -99,
            backgroundColor: "white",
          }}
        >
          <ProfilePicture2
            name={props.userName}
            size={80}
            profilePic=""
            isInitialFullName={true}
          />
        </Center>
      </Stack>
    </Stack>
  );
}
