import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Paper,
  Text,
  createStyles,
  Button,
  Flex,
  Stack,
  Container,
  SimpleGrid,
  LoadingOverlay,
  Overlay,
  Header,
  Menu,
  Box,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArrowNarrowRight, IconCheck, IconSearch } from "@tabler/icons";
import {
  BackButtonWithCircle,
  IconRight,
  IconRightArrow,
} from "../../_Icons/CustonIcons";
const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));
export default function SearchPage() {
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Flex
        sx={{
          padding: `${isMd ? "10px" : "10px"}`,
          paddingLeft: "10px",
          paddingRight: "10px",
          backgroundColor: "#E9ECEF",
          height: "60px",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
        }}
        style={{
          zIndex: "5",
        }}
        justify={"space-between"}
        align={"center"}
      >
        {" "}
        <button
          style={{
            width: "38px",
            height: "38px",
            padding: "0",
            border: "0",
            outline: "0",
            background: "transparent",
          }}
          onClick={() => {
            navigate("/tryingForModify");
          }}
        >
          <BackButtonWithCircle />
        </button>
      </Flex>
      <div
        style={{
          width: "100%",
          background: "#F8F9FA",
          height: "65px",
          marginTop: "3.8rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #e9ecef",
        }}
      >
        <img
          alt="Search"
          src={require("../../../assets/search-normal.png")}
          style={{ width: "32px", height: "32px", marginRight: "10px" }}
        />
        <input
          autoFocus={true}
          placeholder="Search for chapter, topic, or simulations."
          style={{
            fontSize: "14px",
            border: "0",
            outline: "0",
            background: "transparent",
            width: "80%",
            fontFamily: "Nunito",
          }}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          value={searchValue}
        />
      </div>

      <Flex
        ta={"center"}
        px={"md"}
        mt={"xl"}
        align={"center"}
        direction={"column"}
      >
        <img
          src={require("../../../assets/No results.png")}
          alt="No Results"
          style={{ width: "65px", height: "65px", marginBottom: "5px" }}
        />
        <span style={{ fontSize: "24px", fontWeight: "800", color: "#465767" }}>
          Oops, we haven't got that
        </span>
        <br />
        <span style={{ fontSize: "14px", color: "#465767" }}>
          Try searching for another chapter, topic or simulation.
        </span>
      </Flex>
    </div>
  );
}
