import {
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowUp,
  IconBrandWhatsapp,
  IconCircleDashed,
  IconPhone,
} from "@tabler/icons";
import React, { useEffect, useRef, useState } from "react";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";

import Autoplay from "embla-carousel-autoplay";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import useParentCommunication from "../../../hooks/useParentCommunication";
import { getUrlToBeSend } from "../../../utilities/HelperFunctions";
import { probablySupportsClipboardBlob } from "@excalidraw/excalidraw/types/clipboard";
function splitString(inputString: string) {
  // Split the string into an array of words
  const words = inputString.split(" ");

  // Extract the first word
  const firstWord = words[0] || "";

  // Extract the second word

  const secondWord = words.slice(1, 3) || "";

  // Extract the rest of the string
  const restOfString = words.slice(3).join(" ");

  // Return an object with the results
  return {
    firstWord: firstWord,
    secondWord: secondWord,
    restOfString: restOfString,
  };
}
export function HeroSection(props: {
  Layout: string;
  Alignment: string;
  theme: InstituteTheme;
  instituteName: string;
  heading: string;
  heroImage: string[];
  institutePhoneNumber: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const [showScrollToTop, setScrollToTop] = useState<boolean>(false);

  const autoplay = useRef(Autoplay({ delay: 4000 }));
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollToTop(scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const splittedString: {
    firstWord: string;
    secondWord: string[];
    restOfString: string;
  } = splitString(props.heading);
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();
  return (
    <>
      <Flex
        id="parent-hero-section"
        mb={isMd ? 0 : 0}
        style={{
          width: "100%",
          height: isMd ? "75vh" : "100vh",
          position: "relative",
        }}
        align={"center"}
        justify={"center"}
      >
        <Carousel
          plugins={[autoplay.current]}
          getEmblaApi={setEmbla}
          h={isMd ? "75vh" : "100vh"}
          slideSize={"100%"}
          slideGap={0}
          loop
          pos={"absolute"}
          align={"center"}
          w={"100%"}
          draggable={false}
          speed={3}
          styles={{ controls: { display: "none" } }}
        >
          {props.heroImage.map((img) => {
            return (
              <Carousel.Slide h={isMd ? "75vh" : "100vh"}>
                {props.Layout == "Image Background" && (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit:"cover",
                      objectPosition: "center",
                    }}
                    src={img}
                  ></img>
                )}
                {props.Layout == "Half Image and Half text" && isMd && (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src={img}
                  ></img>
                )}
                <Flex justify={props.Alignment === "Left" ? "right" : "left"}>
                  {props.Layout == "Half Image and Half text" && !isMd && (
                    <img
                      style={{
                        marginRight: props.Alignment === "Right" ? "" : "120px",
                        marginLeft: props.Alignment === "Right" ? "120px" : "",
                        marginTop: "90px",
                        padding: "40px",
                        width: "45%",
                        height: "45%",
                        borderRadius: "55px",
                      }}
                      src={img}
                    ></img>
                  )}
                </Flex>
              </Carousel.Slide>
            );
          })}

          {props.heroImage.length === 0 && (
            <Carousel.Slide h={isMd ? "75vh" : "100vh"}>
              {props.Layout == "Image Background" && (
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    background: isMd
                      ? "linear-gradient(to bottom, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.4))"
                      : "linear-gradient(to right, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.3))",
                  }}
                  src={
                    "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg"
                  }
                ></img>
              )}
              {props.Layout == "Half Image and Half text" && isMd && (
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    // border:"4px solid red"
                  }}
                  src={
                    "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg"
                  }
                ></img>
              )}
              <Flex justify={props.Alignment === "Left" ? "right" : "left"}>
                {props.Layout == "Half Image and Half text" && !isMd && (
                  <img
                    style={{
                      marginRight: props.Alignment === "Right" ? "" : "120px",
                      marginLeft: props.Alignment === "Right" ? "120px" : "",
                      marginTop: "90px",
                      padding: "40px",
                      width: "45%",
                      height: "45%",
                      borderRadius: "55px",
                      // background: isMd
                      // ?  "linear-gradient(to bottom, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.4))"
                      // : "linear-gradient(to right, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.3))",
                      // border:"4px solid red",
                      // marginRight:'200px'
                      // objectFit: "cover",
                      // objectPosition: "right",
                    }}
                    src={
                      "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg"
                    }
                  ></img>
                )}
              </Flex>
            </Carousel.Slide>
          )}
        </Carousel>

        {props.Layout == "Image Background" && (
          <div
            style={{
              width: "100%",
              height: isMd ? "75vh" : "100vh",
              objectFit:"contain",
              objectPosition: "center",
              position: "absolute",
              zIndex: 0,

              background: isMd
                ? "linear-gradient(to bottom, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.4))"
                : "linear-gradient(to right, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.3))",
            }}
          ></div>
        )}
        {props.Layout == "Half Image and Half text" && isMd && (
          <div
            style={{
              width: "100%",
              height: isMd ? "75vh" : "100vh",
              objectFit: "cover",
              objectPosition: "center",
              position: "absolute",
              zIndex: 0,

              background: isMd
                ? "linear-gradient(to bottom, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.4))"
                : "linear-gradient(to right, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.3))",
            }}
          ></div>
        )}
        {props.Layout == "Half Image and Half text" && !isMd && (
          <div
            style={{
              width: "100%",
              height: isMd ? "70vh" : "70vh",
              objectFit: "cover",
              objectPosition: "center",
              position: "absolute",
              // background: isMd
              // ?  "linear-gradient(to bottom, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.4))"
              // : "linear-gradient(to right, rgba(0, 0, 0 ,0.6), rgb(0, 0, 0,0.3))",
              zIndex: 0,
            }}
          ></div>
        )}

        {/* <img
          style={{
            color: "red",
            width: "100%",
            height: isMd ? "120px" : "170px",
            objectFit: "cover",
            objectPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          src={props.theme.topCloud}
        ></img>
        <img
          style={{
            width: "100%",
            height: isMd ? "75px" : "170px",
            objectFit: "cover",
            objectPosition: "center",
            position: "absolute",
            bottom: isMd ? -1 : -50,
            left: 0,
          }}
          src={props.theme.bottomCloud}
        ></img> */}
        <Stack
          style={{ position: "absolute", top: 0 }}
          // w={isMd ? "100%" : "40%"}

          w={
            props.Alignment == "Center" && !isMd ? "65%" : isMd ? "100%" : "80%"
          }
          // w={'70%'}
          ml={
            props.Alignment === "Right"
              ? "0%"
              : isMd
              ? 0
              : isXl
              ? "15%"
              : props.Alignment === "Left"
              ? "9%"
              : "0%"
          }
          mr={props.Alignment === "Right" ? "6%" : ""}
          align={
            isMd
              ? "center"
              : props.Alignment === "Left"
              ? "flex-start"
              : props.Alignment == "Center"
              ? "center"
              : "flex-end"
          }
          // align={props.Alignment == 'Center' ? "center" : (isMd ? "center" : "flex-start")}
          // align={"center"}
          // align={'flex-end'}
          h={"100%"}
          justify={"center"}
          px={isMd ? "3%" : 0}
        >
          <Flex
            style={{
              // border:"4px solid red"
              position: "relative",
              bottom: !isMd ? 50 : 0,
            }}
            align={
              props.Alignment === "Center" || isMd
                ? "center"
                : props.Alignment === "Left"
                ? "flex-start"
                : "flex-end"
            }
            justify={"flex-start"}
            direction={"column"}
          >
            <Text
              // align={"center"}
              // align={props.Alignment === "center" ? "center" :props.Alignment === 'left' ? 'left':'right'}
              fz={isMd ? 28 : 50}
              fw={700}
              bg={
                props.Layout === "Image Background"
                  ? ""
                  : props.theme.secondaryColor
              }
              style={{ borderRadius: 50 }}
              py={3}
              px={12}
              my={5}
              c={props.theme.primaryColor}
            >
              <Text
                fw={900}
                style={{ fontSize: isMd ? 25 : 40 }}
                component="span"
                c="white"
              >
                {props.instituteName}
              </Text>{" "}
            </Text>

            {!isMd && (
              <Text
                fw={props.Layout === "Image Background" || isMd ? 300 : 900}
                fz={isMd ? 20 : 42}
                c={
                  props.Layout === "Image Background" || isMd
                    ? "white"
                    : "black"
                }
                // align={props.Alignment == "Center"? "center" : isMd ? "center" : "left"}
                align={
                  props.Alignment === "Center" || isMd
                    ? "center"
                    : props.Alignment === "Left"
                    ? "left"
                    : "right"
                }
                bg={
                  props.Layout === "Image Background" || isMd
                    ? props.theme.textBack
                    : ""
                }
                px={10}
                py={10}
                mb={10}
                style={{
                  lineHeight: "150%",
                  whiteSpace: "pre-line",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    display:
                      props.Layout === "Image Background" || isMd
                        ? "none"
                        : "block",
                  }}
                >
                  {splittedString.firstWord}{" "}
                </Text>

                <Text component="span">
                  {/* {isMd &&  splittedString.firstWord} */}
                  {props.Layout === "Image Background" || isMd
                    ? splittedString.firstWord
                    : ""}{" "}
                  {splittedString.secondWord.map((c, index) => (
                    <React.Fragment key={index}>{c} </React.Fragment>
                  ))}
                  {isMd ? " " + splittedString.restOfString : ""}
                </Text>
                {props.Layout === "Image Background" ? " " : "\n"}
                {!isMd && splittedString.restOfString}
              </Text>
            )}

            {isMd && (
              <Flex
                wrap="wrap"
                fw={props.Layout === "Image Background" || isMd ? 300 : 900}
                fz={isMd ? 20 : 50}
                c={
                  props.Layout === "Image Background" || isMd
                    ? "white"
                    : "black"
                }
                // align={props.Alignment == "Center"? "center" : isMd ? "center" : "left"}
                align={
                  props.Alignment === "Center" || isMd
                    ? "center"
                    : props.Alignment === "Left"
                    ? "left"
                    : "right"
                }
                //bg = {props.Layout === 'Image Background' || isMd ? "rgba(255, 0, 0, 0.75)" :""}
                px={10}
                py={10}
                justify={"center"}
                mb={10}
                style={{
                  lineHeight: "150%",
                  whiteSpace: "pre-line",
                  borderRadius: 4,
                }}
              >
                {props.heading.split(" ").map((x) => {
                  return (
                    <span
                      style={{
                        paddingRight: 4,
                        paddingLeft: 4,
                        backgroundColor: props.theme.textBack,
                      }}
                    >
                      {x}{" "}
                    </span>
                  );
                })}
              </Flex>
            )}

            <Button
              style={{
                borderRadius: 50,
                backgroundColor: props.theme.primaryColor,
              }}
              px={40}
              onClick={() => {
                Mixpanel.track(
                  WebAppEvents.INSTITUTE_WEBSITE_CONTACT_US_CLICKED
                );

                if (isReactNativeActive()) {
                  sendDataToReactnative(
                    4,
                    getUrlToBeSend(`tel:+91${props.institutePhoneNumber}`)
                  );
                } else {
                  window.location.href = `tel:+91${props.institutePhoneNumber}`;
                  if (window.top) {
                    window.top.location.href = `tel:+91${props.institutePhoneNumber}`;
                  }
                }
              }}
              fw={800}
            >
              Contact Us
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
}
