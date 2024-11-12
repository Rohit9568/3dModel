import {
  Anchor,
  BackgroundImage,
  Box,
  Button,
  Center,
  Flex,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconCircleDot,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons";
import { scrollToElement } from "./TopBar";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import useParentCommunication from "../../../hooks/useParentCommunication";
import { getUrlToBeSend } from "../../../utilities/HelperFunctions";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Line } from "@react-pdf/renderer";

function DashedLine() {
  return (
    <>
      <Group spacing={6} my={10}>
        <Box w={12} h={2} bg={"#FE4B7B"}></Box>
        <Box w={30} h={2} bg={"#FE4B7B"}></Box>
      </Group>
    </>
  );
}

function ensureHttpsUrl(inputUrl: string) {
  try {
    const url = new URL(inputUrl);
    // If the protocol is not 'http' or 'https', default to 'https'
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `https://${url.hostname}${url.pathname}${url.search}${url.hash}`;
    }
    return inputUrl; // Return the original URL if it already has 'http' or 'https'
  } catch (error) {
    // If the input is not a valid URL, return an empty string or handle the error accordingly
    console.error("Invalid URL:", error);
    return "";
  }
}

export function Footer(props: {
  onClick: (course: Course) => void;
  instituteId: string;
  course: Course[];
  logo: string;
  footerDescription: string;
  phoneNumber: string;
  email: string;
  instituteAddress: string;
  admissionUrl: string;
  mapUrl: string;
  youtubeLink: string;
  instagramLink: string;
  facebookLink: string;
  secondinstituteAddress: string;
  secondphoneNumber: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const defaultText =
    "We are a renowned educational institution dedicated to providing quality education and holistic development for all students.";
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();
  const [search, setSearch] = useSearchParams();
  const [scrolled, setScrolled] = useState<boolean>(false);
  let s = search.get("tab");
  useEffect(() => {
    if (s == "hero") {
      scrollToElement("parent-topBanner", "footer");
    }
    if (s == "about") {
      scrollToElement("parent-topBanner", "footer");
    }
    if (s == "facilities") {
      scrollToElement("parent-topBanner", "footer");
    }
    if (s == "gallery") {
      scrollToElement("parent-topBanner", "footer");
    }
  }, [s]);

  return (
    <>
      <Flex bg={"#2C4073"} p={isMd ? 25 : ""}>
        <Box w={"100%"}>
          <Center mx={5} my={50}>
            <SimpleGrid
              w={isXl ? "100%" : "80%"}
              cols={isMd ? 1 : props.mapUrl.length > 0 ? 4 : 4}
              verticalSpacing={10}
            >
              <Box>
                {props.instituteId !==
                  "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
                  <img
                    src={props.logo}
                    width={"70px"}
                    style={{ aspectRatio: 1 }}
                  ></img>
                )}
                {props.instituteId ===
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
                {props.footerDescription.length === 0
                  ? defaultText
                  : props.footerDescription.split("\n").map((line, index) => {
                      return (
                        <Text
                          ff={"Roboto"}
                          c={"white"}
                          fz={16}
                          fw={400}
                          mt={20}
                          style={{}}
                        >
                          {line}
                        </Text>
                      );
                    })}
              </Box>
              <Box>
                <Text c={"white"} fz={24} fw={800}>
                  Courses
                </Text>
                <DashedLine />
                <List
                  ff={"Roboto"}
                  fw={400}
                  fz={16}
                  c="white"
                  spacing={10}
                  mb={20}
                  mt={30}
                  styles={{
                    itemWrapper: {
                      alignItems: "center !important",
                      cursor: "pointer",
                    },
                  }}
                  icon={
                    <Center h={"100%"}>
                      <IconCircleDot
                        color="#FE4B7B"
                        width={14}
                        height={14}
                        stroke={3}
                      />
                    </Center>
                  }
                >
                  {props.course.map((c) => (
                    <List.Item
                      onClick={() => {
                        props.onClick(c);
                      }}
                      //  onClick={()=>{
                      //   setSearch({"tab":"course"})
                      //  }}
                      // onClick={() => {
                      //  window.location.href =
                      // }}
                    >
                      {c.name}
                    </List.Item>
                  ))}
                </List>
              </Box>
              <Box>
                <Text c={"white"} fz={24} fw={800}>
                  Quick Links
                </Text>
                <DashedLine />
                <List
                  ff={"Roboto"}
                  fw={400}
                  fz={16}
                  c="white"
                  spacing={10}
                  mb={20}
                  mt={30}
                  styles={{
                    itemWrapper: {
                      alignItems: "center !important",
                      cursor: "pointer",
                    },
                  }}
                  icon={
                    <Center h={"100%"}>
                      <IconCircleDot
                        color="#FE4B7B"
                        width={14}
                        height={14}
                        stroke={3}
                      />
                    </Center>
                  }
                >
                  <List.Item
                    onClick={() => {
                      setSearch({ tab: "hero" });
                      scrollToElement("parent-topBanner", "footer");
                    }}
                  >
                    Home
                  </List.Item>
                  <List.Item
                    onClick={() => {
                      setSearch({ tab: "about" });
                      scrollToElement("parent-topBanner", "footer");
                    }}
                  >
                    About Us
                  </List.Item>
                  {/* <List.Item
                    onClick={() => {
                      scrollToElement("");
                    }}
                  >
                    Contact
                  </List.Item> */}
                  <List.Item
                    onClick={() => {
                      setSearch({ tab: "facilities" });
                      scrollToElement("parent-topBanner", "footer");
                    }}
                  >
                    Facilities
                  </List.Item>
                  {props.admissionUrl && (
                    <List.Item>
                      <Anchor
                        href={props.admissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline={false}
                        variant="text"
                      >
                        <Text>Admission Form</Text>
                      </Anchor>
                    </List.Item>
                  )}
                  <List.Item
                    onClick={() => {
                      setSearch({ tab: "gallery" });
                      scrollToElement("parent-topBanner", "footer");
                    }}
                  >
                    Gallery
                  </List.Item>
                </List>
              </Box>

              <Box>
                <Text c={"white"} fz={24} fw={800}>
                  Contact Us
                </Text>
                <DashedLine />
                <List
                  ff={"Roboto"}
                  fw={400}
                  fz={16}
                  c="white"
                  spacing={20}
                  mt={30}
                  icon={<IconCircleDot color="#FE4B7B" width={14} stroke={3} />}
                  styles={{
                    itemWrapper: {
                      alignItems: "center !important",
                    },
                  }}
                >
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                        {
                          value: "phone",
                        }
                      );
                      window.location.href = `tel:+91${props.phoneNumber}`;
                      if (window.top) {
                        window.top.location.href = `tel:+91${props.phoneNumber}`;
                      }
                    }}
                    icon={
                      <Box
                        bg={"#FE4B7B"}
                        style={{ borderRadius: "20%" }}
                        w={30}
                        h={30}
                      >
                        <Center w={"100%"} h={"100%"} p={5}>
                          <IconPhone />
                        </Center>
                      </Box>
                    }
                  >
                    {props.phoneNumber}
                    {props.secondphoneNumber.length > 0 &&
                      `, ${props.secondphoneNumber}`}
                  </List.Item>
                  {props.instituteAddress.length > 0 && (
                    <List.Item
                      icon={
                        <Box
                          bg={"#FE4B7B"}
                          style={{ borderRadius: "20%" }}
                          w={30}
                          h={30}
                        >
                          <Center w={"100%"} h={"100%"} p={5}>
                            <IconMapPin />
                          </Center>
                        </Box>
                      }
                    >
                      {props.instituteAddress}
                    </List.Item>
                  )}
                  {props.secondinstituteAddress.length > 0 && (
                    <List.Item
                      icon={
                        <Box
                          bg={"#FE4B7B"}
                          style={{ borderRadius: "20%" }}
                          w={30}
                          h={30}
                        >
                          <Center w={"100%"} h={"100%"} p={5}>
                            <IconMapPin />
                          </Center>
                        </Box>
                      }
                    >
                      {props.secondinstituteAddress}
                    </List.Item>
                  )}
                  {props.email.length > 0 && (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (isReactNativeActive()) {
                          sendDataToReactnative(
                            4,
                            getUrlToBeSend(`mailto:${props.email}`)
                          );
                        }
                        window.location.href = `mailto:${props.email}`;
                        if (window.top) {
                          window.top.location.href = `mailto:${props.email}`;
                        }
                        Mixpanel.track(
                          WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                          {
                            value: "mail",
                          }
                        );
                      }}
                      icon={
                        <Box
                          bg={"#FE4B7B"}
                          style={{ borderRadius: "20%" }}
                          w={30}
                          h={30}
                        >
                          <Center w={"100%"} h={"100%"} p={5}>
                            <IconMail />
                          </Center>
                        </Box>
                      }
                    >
                      <Box>{props.email}</Box>
                    </List.Item>
                  )}
                  {props.youtubeLink.length > 0 && (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(props.youtubeLink, "_blank");
                        // if (window.top) {
                        //   window.top.location.href = `mailto:${props.email}`;
                        // }
                        Mixpanel.track(
                          WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                          {
                            value: "youtube",
                          }
                        );
                      }}
                      icon={
                        <Box
                          bg={"#FE4B7B"}
                          style={{ borderRadius: "20%" }}
                          w={30}
                          h={30}
                        >
                          <Center w={"100%"} h={"100%"} p={5}>
                            <IconBrandYoutube />
                          </Center>
                        </Box>
                      }
                    >
                      <Box>Youtube</Box>
                    </List.Item>
                  )}
                  {props.instagramLink.length > 0 && (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(props.instagramLink, "_blank");
                        // if (window.top) {
                        //   window.top.location.href = `mailto:${props.email}`;
                        // }
                        Mixpanel.track(
                          WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                          {
                            value: "instagram",
                          }
                        );
                      }}
                      icon={
                        <Box
                          bg={"#FE4B7B"}
                          style={{ borderRadius: "20%" }}
                          w={30}
                          h={30}
                        >
                          <Center w={"100%"} h={"100%"} p={5}>
                            <IconBrandInstagram />
                          </Center>
                        </Box>
                      }
                    >
                      <Box>Instagram</Box>
                    </List.Item>
                  )}
                  {props.facebookLink.length > 0 && (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                          {
                            value: "facebook",
                          }
                        );
                        window.open(props.facebookLink, "_blank");
                        // window.location.href = props.facebookLink;
                        // if (window.top) {
                        //   window.top.location.href = `mailto:${props.email}`;
                        // }
                      }}
                      icon={
                        <Box
                          bg={"#FE4B7B"}
                          style={{ borderRadius: "20%" }}
                          w={30}
                          h={30}
                        >
                          <Center w={"100%"} h={"100%"} p={5}>
                            <IconBrandFacebook />
                          </Center>
                        </Box>
                      }
                    >
                      <Box>Facebook</Box>
                    </List.Item>
                  )}
                </List>
              </Box>

              {/* {props.mapUrl.length > 0 && (
                <Box>
                  <Text c={"white"} fz={24} fw={800}>
                    Location
                  </Text>
                  <DashedLine />
                  <>
                    <iframe
                      src={props.mapUrl}
                      style={{
                        width: "100%",
                        borderRadius: 20,
                      }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </>
                    </Box>
                  )} */}
            </SimpleGrid>
          </Center>
        </Box>
      </Flex>
      <Button
        size="md"
        style={{
          height: 50,
          width: isMd ? 50 : "",
          borderRadius: isMd ? "50px" : "50px",
          // backgroundColor: props.theme.primaryColor,
          position: "fixed",
          bottom: isMd ? "17%" : "2%",
          right: "5%",
          boxShadow: "0 0 20px 2px rgba(30, 30, 30, 0.4)",
          zIndex: "999",
        }}
        onClick={() => {
          if (isReactNativeActive()) {
            sendDataToReactnative(
              4,
              getUrlToBeSend(`tel:+91${props.phoneNumber}`)
            );
          } else {
            window.location.href = `tel:+91${props.phoneNumber}`;
            if (window.top) {
              window.top.location.href = `tel:+91${props.phoneNumber}`;
            }
          }
        }}
        p={isMd ? 0 : 15}
      >
        <IconPhone fill="white" stroke={0.5} width={20}></IconPhone>
        {/* {!isMd && (
          <Text mx={5} fw={400} fz={17}>
            Enquire Now
          </Text>
        )} */}
      </Button>

      {
        <div
          style={{
            position: "fixed",
            bottom: isMd ? "10%" : "2%",
            right: isMd ? "5%" : "10%",
            zIndex: 99,
            cursor: "pointer",
          }}
          onClick={() => {
            window.open(`https://wa.me/+91${props.phoneNumber}`, "_blank");
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              height: isMd ? "50px" : "50px",
              width: isMd ? "50px" : "50px",
              backgroundColor: "#1CD762",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 20px 2px rgba(30, 30, 30, 0.4)",
            }}
          >
            <IconBrandWhatsapp color="white" height="70%" width="70%" />
          </div>
        </div>
      }

      <Box id="parent-footer"></Box>
    </>
  );
}
