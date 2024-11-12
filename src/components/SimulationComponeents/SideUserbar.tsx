import { useState } from "react";
import {
  IconErasor,
  IconHighlighter,
  IconLeftArrow,
  IconPen,
  IconRightArrow,
  IconWhiteBoard,
} from "../_Icons/CustonIcons";
import { Box, Stack, Text, Tooltip } from "@mantine/core";
import React from "react";
import { SideBarItems } from "../../@types/SideBar.d";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Pages, Tabs } from "../../pages/_New/Teach";
interface SideBarIconProps {
  icon: any;
  onClick: () => void;
  isErasor?: boolean;
  name: SideBarItems;
  itemSelected: SideBarItems;
}
function SideBarIcon(props: SideBarIconProps) {
  const [isHover, setisHover] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <>
      <Tooltip label={props.name}>
        <Box
          style={{
            cursor: "pointer",
            position: "relative",
            height: isMd ? 28 : 52,
            width: isMd ? 28 : 52,
            border: "#3174F3 solid 1px",
            borderRadius: "5px",
            backgroundColor:
              props.itemSelected === props.name || (props.isErasor && isHover)
                ? "#3174F3"
                : "white",
            padding: "2px 2px",
          }}
          onClick={props.onClick}
          onMouseEnter={() => {
            setisHover(true);
          }}
          onMouseLeave={() => {
            setisHover(false);
          }}
        >
          <Box w={isMd ? 25 : 46} h={isMd ? 25 : 46}>
            {props.isErasor &&
              React.cloneElement(props.icon, {
                col: isHover ? "white" : "#3174F3",
              })}
            {!props.isErasor && props.icon}
          </Box>
        </Box>
      </Tooltip>
    </>
  );
}

interface SideUserBarProps {
  itemSelected: SideBarItems;
  setItemSelected: (x: SideBarItems) => void;
  currentTab: Tabs;
  currentPage: Pages;
}
export function SideUserBar(props: SideUserBarProps) {
  const [isSideBarOpen, setisSideBarOpen] = useState<boolean>(true);
  const [isHover, setIsHover] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 880px)`);
  return (
    <>
      {props.itemSelected !== SideBarItems.WhiteBoard  && (
        <Box
          style={{
            position: "fixed",
            right: isMd ? 0 : 20,
            top: "28%",
            zIndex: 197,
            cursor: "default",
          }}
        >
          <Box
            style={{
              position: "relative",
              zIndex: 500,
            }}
          >
            <Box
              style={{
                position: "absolute",
                height: "35px",
                width: "30px",
                left: "-29px",
                top: 0,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                paddingTop: "8px",
                background: "white",
                borderRadius: "5px 0px 0px 5px",
                boxShadow: "-5px -5px 18px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                zIndex: 9999,
              }}
              onClick={() => {
                setisSideBarOpen((prev) => !prev);
              }}
            >
              <Box
                style={{
                  width: "9px",
                  height: "18px",
                }}
              >
                {isSideBarOpen && <IconRightArrow col="#909395" />}
                {!isSideBarOpen && <IconLeftArrow col="#909395" />}
              </Box>
            </Box>
          </Box>
          <Stack
            style={{
              background: "white",
              padding: "10px 5px",
              zIndex: 98,
              position: "relative",
              borderRadius: "0px 0px 0px 10px",
            }}
            hidden={isSideBarOpen ? false : true}
            py="4px"
            px="4px"
          >
            <SideBarIcon
              icon={
                <IconHighlighter
                  col={
                    props.itemSelected === SideBarItems.Highlighter
                      ? "white"
                      : "#3174F3"
                  }
                />
              }
              onClick={() => {
                props.setItemSelected(SideBarItems.Highlighter);
                Mixpanel.track(WebAppEvents.TEACHER_APP_HIGHLIGHTER_CLICKED, {
                  tab: props.currentTab,
                  page: props.currentPage,
                });
              }}
              name={SideBarItems.Highlighter}
              itemSelected={props.itemSelected}
            />
            <SideBarIcon
              icon={
                <IconPen
                  col={
                    props.itemSelected === SideBarItems.Pen
                      ? "white"
                      : "#3174F3"
                  }
                />
              }
              onClick={() => {
                props.setItemSelected(SideBarItems.Pen);
                Mixpanel.track(WebAppEvents.TEACHER_APP_MARKER_CLICKED, {
                  tab: props.currentTab,
                  page: props.currentPage,
                });
              }}
              name={SideBarItems.Pen}
              itemSelected={props.itemSelected}
            />
            <SideBarIcon
              icon={
                <IconErasor
                  col={
                    props.itemSelected === SideBarItems.Erasor
                      ? "white"
                      : "#3174F3"
                  }
                />
              }
              onClick={() => {
                props.setItemSelected(SideBarItems.Erasor);
                Mixpanel.track(WebAppEvents.TEACHER_APP_ERASER_CLICKED, {
                  tab: props.currentTab,
                  page: props.currentPage,
                });
              }}
              isErasor={true}
              name={SideBarItems.Erasor}
              itemSelected={props.itemSelected}
            />
            <span
              style={{
                content: '""',
                position: "absolute",
                top: "17%",
                left: "-1px",
                width: "100%",
                height: "83%",
                boxShadow: "-5px 5px 18px rgba(0, 0, 0, 0.1)",
                borderRadius: "0px 0px 0px 10px",
                zIndex: -9,
              }}
            />
          </Stack>
        </Box>
      )}

      <Box
        style={{
          position: "fixed",
          top: "66%",
          right: isMd ? 0 : 20,
          borderRadius: "10px 0px 0px 10px",
          cursor: "default",
          zIndex: 197,
          padding: "0 5px",
          boxShadow: "-5px 5px 18px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#3174F3",
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Box
          onClick={() => {
            props.setItemSelected(SideBarItems.WhiteBoard);
            Mixpanel.track(WebAppEvents.TEACHER_APP_WHITEBOARD_ACCESSED, {
              tab: props.currentTab,
              page: props.currentPage,
            });
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            height: isMd ? 40 : 52,
            width:
              isHover && props.itemSelected !== SideBarItems.WhiteBoard && !isMd
                ? 180
                : isMd
                ? 30
                : 52,
            transition: "all ease-in-out 0.3s",
          }}
        >
          <Box
            style={{
              marginLeft: "5px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              paddingTop: "1px",
              width: isMd ? "30px" : "39px",
              height: isMd ? "30px" : "39px",
              // zIndex: 9999
            }}
          >
            <IconWhiteBoard col={"white"} />
          </Box>
          {!isMd && isHover && (
            <Text color="white" mx={5} fz={20}>
              Whiteboard
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
}
