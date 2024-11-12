import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Drawer,
  Flex,
  Group,
  List,
  Menu,
  Modal,
  Popover,
  Stack,
  Text,
  TextInput,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconMenu2 } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { useSearchParams } from "react-router-dom";
import { TopBanner } from "./TopBanner";
import { CourseItems } from "../../Components/SingleCoursePage";

const useStyles = createStyles(() => ({
  txt: {
    fontFamily: "Roboto",
    cursor: "pointer",
    fontWeight: 500,
  },
}));
export const scrollToElement = (
  elementId: any,
  location: "header" | "footer"
) => {
  if (location === "header")
    Mixpanel.track(WebAppEvents.INSTITUTE_WEBSITE_HEADER_ITEM_CLICKED, {
      value: elementId,
    });
  else
    Mixpanel.track(WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED, {
      value: elementId,
    });
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
export function TopBar(props: {
  onClick: (course: Course) => void;
  course: Course[];
  about: any;
  theme: InstituteTheme;
  instituteDetails: InstituteWebsiteDisplay;
  logo: string;
  admissionUrl?: string;
  loggedIn: boolean;
  onLoginSubmit: (val: string, password?: string) => void;
  error: string | null;
  onLoginClicked: () => void;
}) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneDrawer, setPhoneDrawer] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const navigate = useNavigate();

  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );
  const [searchParam, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuOpen1, setIsMenuOpen1] = useState<boolean>(false);
  useEffect(() => {
    if (phoneDrawer === false && isMd) {
      setIsMenuOpen(false);
      setIsMenuOpen1(false);
    }
  }, [phoneDrawer]);
  return (
    <>
      <TopBanner
        theme={props.theme}
        phoneNo={props.instituteDetails.institutePhoneNumber}
      />
      <Flex
        // pos={"fixed"}i
        id="parent-topBar"
        h={"60px"}
        w={"100%"}
        align={"center"}
        bg={props.theme.backGroundColor}
        justify={"space-between"}
        px={isMd ? 20 : "15%"}
        style={{ zIndex: 99 }}
      >
        <Box>
          {props.instituteDetails._id !==
            "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
            <>
              <Flex align={"center"} gap={10}>
                {props.instituteDetails.websiteLogo === "" && (
                  <img src={props.logo} width={"50px"} height={"50px"}></img>
                )}
                {props.instituteDetails.websiteLogo !== "" && (
                  <img
                    src={props.instituteDetails.websiteLogo}
                    width={"150px"}
                    style={{
                      maxHeight: "50px",
                    }}
                  ></img>
                )}

                {props.instituteDetails.featureAccess.secondLogoAccess &&
                  !isMd && (
                    <img
                      src={props.instituteDetails.secondLogo}
                      width={"50px"}
                      height={"50px"}
                    ></img>
                  )}
                {isMd &&
                  !props.instituteDetails.featureAccess.secondLogoAccess && (
                    <Text fw={700} fz={20} color={props.theme.primaryColor}>
                      {props.instituteDetails.name}
                    </Text>
                  )}
                {isMd &&
                  props.instituteDetails.featureAccess.secondLogoAccess && (
                    <Flex align="center">
                      <Stack spacing={0}>
                        <Text fw={700} fz={27}>
                          {props.instituteDetails.name}
                        </Text>
                        <Text fw={700} fz={10} mt={-5} align="center">
                          {props.instituteDetails.nameSubheading}
                        </Text>
                      </Stack>
                      <img
                        src={props.instituteDetails.secondLogo}
                        width={"50px"}
                        height={"50px"}
                      ></img>
                    </Flex>
                  )}
              </Flex>
            </>
          )}
          {props.instituteDetails._id ===
            "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
            <>
              <img src={props.logo} width={60}></img>
              <img
                src={
                  "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2023-12-20T16-41-03-422Z.png"
                }
                width={"75px"}
              ></img>
            </>
          )}
        </Box>
        {!isMd && (
          <>
            <Text
              className={classes.txt}
              onClick={() => setSearchParams({ tab: "hero" })}
            >
              Home
            </Text>

            <div
              onMouseEnter={() => setIsMenuOpen(true)} // Open dropdown on hover
              onMouseLeave={() => setIsMenuOpen(false)} // Close dropdown on mouse leave
            >
              <Menu opened={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <Menu.Target>
                  <Flex align="center">
                    <Text
                      style={{
                        cursor: "pointer",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      About
                    </Text>{" "}
                    {/* Your text here */}
                    <ActionIcon color="dark" size={36}>
                      <IconChevronDown
                        style={{ width: "16", height: "16" }}
                        // stroke={1.5}
                      />
                    </ActionIcon>
                  </Flex>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item onClick={() => setSearchParams({ tab: `about` })}>
                    About us
                  </Menu.Item>
                  {props.about.map((item: any, id: any) => (
                    <Menu.Item
                      key={id}
                      onClick={() =>
                        setSearchParams({ tab: `about_${item.heading}` })
                      }
                    >
                      {item.heading}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </div>

            <Flex justify={"center"} align={"center"} wrap={"nowrap"} gap={0}>
              <div
                onMouseEnter={() => setIsMenuOpen1(true)} // Open dropdown on hover
                onMouseLeave={() => setIsMenuOpen1(false)} // Close dropdown on mouse leave
              >
                <Menu
                  opened={isMenuOpen1}
                  onClose={() => setIsMenuOpen1(false)}
                >
                  <Menu.Target>
                    {props.course.length > 0 ? (
                      <Flex align="center">
                        <Text
                          style={{
                            cursor: "pointer",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          Course
                        </Text>{" "}
                        {/* Your text here */}
                        <ActionIcon color="dark" size={36}>
                          <IconChevronDown
                            style={{ width: "16", height: "16" }}
                          />
                        </ActionIcon>
                      </Flex>
                    ) : (
                      <Text
                        style={{
                          cursor: "pointer",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Course
                      </Text>
                    )}
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => setSearchParams({ tab: "courses" })}
                    >
                      All Courses
                    </Menu.Item>
                    {props.course.map((item: any, id: any) => (
                      <Menu.Item key={id} onClick={() => props.onClick(item)}>
                        {item.name}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              </div>
            </Flex>
            {props.admissionUrl && (
              <Anchor
                href={props.admissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline={false}
                variant="text"
              >
                <Text className={classes.txt}>Admission Form</Text>
              </Anchor>
            )}

            <Text
              className={classes.txt}
              onClick={() => setSearchParams({ tab: "gallery" })}
            >
              Gallery
            </Text>

            {!props.loggedIn &&
              props.instituteDetails._id !==
                "INST-34812f50-d08a-4829-917b-15d4468d7fa7" &&
              props.instituteDetails._id !==
                "INST-80b15ee3-88cc-4157-8363-eada9f3fa465" && (
                <Button
                  px={50}
                  style={{
                    backgroundColor: props.theme.primaryColor,
                  }}
                  onClick={() => {
                    props.onLoginClicked();
                  }}
                >
                  Login
                </Button>
              )}
          </>
        )}
        {isMd && (
          <>
            <Box
              onClick={() => {
                setPhoneDrawer(true);
              }}
            >
              <IconMenu2 color={props.theme.primaryColor}></IconMenu2>
            </Box>
          </>
        )}
      </Flex>

      <Drawer
        style={{
          zIndex: 99999999999,
        }}
        size={"50%"}
        opened={phoneDrawer}
        onClose={() => {
          setPhoneDrawer(false);
        }}
        position="right"
      >
        <Stack ml={10}>
          {!props.loggedIn &&
            props.instituteDetails._id !==
              "INST-34812f50-d08a-4829-917b-15d4468d7fa7" &&
            props.instituteDetails._id !==
              "INST-80b15ee3-88cc-4157-8363-eada9f3fa465" && (
              <Text
                className={classes.txt}
                onClick={() => {
                  props.onLoginClicked();
                  setPhoneDrawer(false);
                }}
              >
                Login
              </Text>
            )}

          <Text
            className={classes.txt}
            onClick={() => {
              onclick = () => setSearchParams({ tab: "hero" });
              setPhoneDrawer(false);
            }}
          >
            Home
          </Text>
          <Flex direction={"column"} wrap={"nowrap"} gap={0}>
            <Text style={{ fontWeight: "bold" }}>About</Text>
            <List listStyleType="disc">
              <List.Item
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSearchParams({ tab: "about" });
                  setPhoneDrawer(false);
                }}
              >
                About us
              </List.Item>
              {props.about.map((item: any, id: any) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  key={id}
                  onClick={() => {
                    setSearchParams({ tab: `about_${item.heading}` });
                    setPhoneDrawer(false);
                  }}
                >
                  {item.heading}
                </List.Item>
              ))}
            </List>
          </Flex>

          {props.admissionUrl && (
            <Anchor
              href={props.admissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline={false}
              variant="text"
            >
              <Text className={classes.txt}>Admission Form</Text>
            </Anchor>
          )}
          <Text
            className={classes.txt}
            onClick={() => {
              onclick = () => setSearchParams({ tab: "gallery" });
              // scrollToElement("parent-gallery", "header");
              setPhoneDrawer(false);
            }}
          >
            Gallery
          </Text>

          <Flex direction={"column"} wrap={"nowrap"} gap={0}>
            <Text style={{ fontWeight: "bold" }}>Course</Text>
            <List listStyleType="disc">
              <List.Item
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSearchParams({ tab: "courses" });
                  setPhoneDrawer(false);
                }}
              >
                All course
              </List.Item>
              {props.course.map((item: any, id: any) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  key={id}
                  onClick={() => {
                    props.onClick(item);
                    setPhoneDrawer(false);
                  }}
                >
                  {item.name}
                </List.Item>
              ))}
            </List>
          </Flex>
          <Text
            className={classes.txt}
            onClick={() => {
              onclick = () => setSearchParams({ tab: "contact" });
              setPhoneDrawer(false);
            }}
          >
            Contact
          </Text>
        </Stack>
      </Drawer>
    </>
  );
}
