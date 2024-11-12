import React from "react";
import PropTypes from "prop-types";
import { Box, Center } from "@mantine/core";

interface ProfilePictureProps {
  icon: string;
}
const ProfilePicture = (props: ProfilePictureProps) => {
  return (
    <Box
      h={50}
      w={50}
      style={{
        borderRadius: "50%",
        // border:'red solid 1px',
        cursor: "pointer",
        backgroundColor: "white",
      }}
    >
      <Center w="100%" h="100%">
        <img src={props.icon} height={30} width={30} />
      </Center>
    </Box>
  );
};

export default ProfilePicture;
