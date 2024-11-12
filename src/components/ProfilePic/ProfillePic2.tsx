import React from "react";
import PropTypes from "prop-types";
import { Center } from "@mantine/core";

interface ProfilePictureProps {
  name: string;
  size: number;
  profilePic: string;
  isInitialFullName: boolean;
}
const ProfilePicture2 = (props: ProfilePictureProps) => {
  const initials = props.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("");
  const colors = ["#4A90E2", "#50E3C2", "#FF8A65", "#9B51E0", "#FFB900"];
  const colorIndex = initials.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];
  return (
    <>
      {props.profilePic === "" && (
        <Center
          style={{
            borderRadius: "50%",
            fontWeight: "bold",
            textTransform: "uppercase",
            cursor: "pointer",
            border: "3px solid #FFFFFF",
          }}
          h={props.size}
          w={props.size}
          fz={props.size / 2}
          color="#FFFFFF"
          bg="#FFFFFF"
        >
          {props.isInitialFullName ? initials : initials[0]}
        </Center>
      )}
      {props.profilePic !== "" && (
        <img
          src={props.profilePic}
          style={{
            width: props.size,
            borderRadius: "50%",
            height: props.size,
            cursor: "pointer",
          }}
        />
      )}
    </>
  );
};

ProfilePicture2.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

ProfilePicture2.defaultProps = {
  size: 50,
};

export default ProfilePicture2;
