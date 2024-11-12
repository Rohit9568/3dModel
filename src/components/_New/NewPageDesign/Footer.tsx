import {
  Divider,
  Flex,
  Stack,
  Text,
  useMantineTheme,
  Footer,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconTeach,
  IconTeach2,
  IconTest,
  IconTest2,
} from "../../_Icons/CustonIcons";
import { Pages } from "./ModifiedOptionsSim";
import { IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";

interface FooterProps {
  currentPage: Pages;
  onPageChange: (page: Pages) => void;
}

export function Footer1(props: FooterProps) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const navigate = useNavigate();

  return (
    <Flex
      sx={{
        padding: `${isMd ? "10px" : "10px"}`,
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: "#fff",
        height: "60px",
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        boxShadow: "0px 0px 16px 0px #00000040",
        // zIndex:9999
      }}
      justify={"space-evenly"}
      align={"center"}
    >
      {" "}
      <Stack
        style={{
          height: "100%",
          // padding: "0",
          // border: "0",
          // outline: "0",
          background: "transparent",
          // marginBottom: "5px",
          width: "70px",
          // border:'red solid 1px',
          // borderBottom: "2px solid #4B65F6",
          cursor: "pointer",
        }}
        spacing={0}
        justify="space-between"
        align="center"
        onClick={() => {
          props.onPageChange(Pages.teach);
        }}
      >
        <Stack
          spacing={0}
          // pt={5}
        >
          <IconTeach2
            // size="32"
            col={props.currentPage === Pages.teach ? "#4B65F6" : "#666666"}
          />
          <Text
            style={{
              color: props.currentPage === Pages.teach ? "#4B65F6" : "#666666",
            }}
            ta="center"
            fz={12}
          >
            Teach
          </Text>
        </Stack>
        {/* {props.currentPage === Pages.teach && (
                <Divider size="xl" color="#4B65F6" w="100%" />
              )} */}
      </Stack>
      <Stack
        style={{
          height: "100%",
          // padding: "0",
          // border: "0",
          // outline: "0",
          background: "transparent",
          // marginBottom: "5px",
          width: "70px",
          // border:'red solid 1px',
          // borderBottom: "2px solid #4B65F6",
          cursor: "pointer",
        }}
        spacing={0}
        justify="space-between"
        align="center"
        onClick={() => {
          props.onPageChange(Pages.search);
          // props.onPageChange(Pages.teach);
        }}
      >
        <Stack
          spacing={0}
          // pt={5}
        >
          <IconSearch
            size={32}
            color={props.currentPage === Pages.search ? "#4B65F6" : "#666666"}

            // size="32"
            // col={props.currentPage === Pages.teach ? "#4B65F6" : "#666666"}
          />
          <Text
            style={{
              color: props.currentPage === Pages.search ? "#4B65F6" : "#666666",
            }}
            ta="center"
            fz={12}
          >
            Search
          </Text>
        </Stack>
        {/* {props.currentPage === Pages.teach && (
                <Divider size="xl" color="#4B65F6" w="100%" />
              )} */}
      </Stack>
      <Stack
        style={{
          height: "100%",
          // padding: "0",
          // border: "0",
          // outline: "0",
          background: "transparent",
          // marginBottom: "5px",
          width: "70px",
          // border: "red solid 1px",
          // borderBottom: "2px solid #4B65F6",
          cursor: "pointer",
        }}
        spacing={0}
        justify="space-between"
        align="center"
        onClick={() => {
          props.onPageChange(Pages.test);
        }}
      >
        <Stack spacing={0} align="center" w="100%">
          <IconTest2
            col={props.currentPage === Pages.test ? "#4B65F6" : "#666666"}
          />
          <Text
            style={{
              color: props.currentPage === Pages.test ? "#4B65F6" : "#666666",
            }}
            ta="center"
            w="100%"
            fz={12}
          >
            Test
          </Text>
        </Stack>
        {/* {props.currentPage === Pages.test && (
                <Divider size="xl" color="#4B65F6" w="100%" />
              )} */}
      </Stack>
    </Flex>
  );
}
