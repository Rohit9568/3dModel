import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { glimpseDescription } from "../../../utilities/HelperFunctions";
import { useState } from "react";
import { IconCircle, IconDotsCircleHorizontal } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";

function AboutUsPoint(props: { text: string; index: number }) {
  return (
    <>
      <Flex align={"center"}>
        <Box
          w={30}
          h={30}
          bg={"#2D556E"}
          style={{ borderRadius: "50%" }}
          mr={10}
        >
          <Center
            w={"100%"}
            h="100%"
            c={"white"}
            ff={"Roboto"}
            fw={500}
            fz={16}
          >
            {props.index + 1}
          </Center>
        </Box>
        <Text fz={16} ff={"Catamaran"} fw={600}>
          {props.text}
        </Text>
      </Flex>
    </>
  );
}
export function AboutUs(props: {
  id:any
  instituteId: string;
  theme: InstituteTheme;
  heading: string;
  description: string;
  points: string[];
  imageHub: string[];
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const [readMore, setReadMore] = useState(false);
  const defaultDesc =
    "We're a dedicated educational hub committed to cultivating inquisitive minds and empowering individuals to thrive in a rapidly changing world. With expert faculty, cutting-edge facilities, and a dynamic curriculum, we foster an environment where education goes beyond boundaries. Join us to transform knowledge into success, and every student is equipped for a future of endless opportunities.";
  return (
    <>
    
    {props.imageHub.length > 0 &&  <Flex
      id="parent-about-us"
      w={isXl ? "100%" : "75%"}
      mx={isXl ? "auto" : "12.5%"}
      direction={isMd ? "column" : "row"}
      mt={isMd ? 0 : 20}
      px={"3%"}
      justify={"space-between"}
      pb={10}
    >
      <Box
        w={isMd ? "100%" : "40%"}
        mt={isMd ? 15 : 0}
        style={{ order: isMd ? 1 : 0 }}
        >
        <Center w="100%" h="100%">
          <>
            <Box
              w={isMd ? "90%" : "100%"}
              h={isMd ? 400 : "100%"}
              maw={"450px"}
              mah={"400px"}
              >
              {!isMd && (
                <>
                  {/* {props.imageHub.length === 0 && (
                    <Center h={"100%"}>
                      <Image
                        src={
                          "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg"
                        }
                        radius={15}
                        maw={335}
                      ></Image>
                    </Center>
                  )} */}
                  {props.imageHub.length >= 1 && (
                    <Center h={"100%"}>
                      <Image
                        src={props.imageHub[0]}
                        radius={15}
                        maw={335}
                      ></Image>
                    </Center>
                  )}
                  {/* {props.imageHub.length === 2 && (
                    <>
                    <Box pos={"relative"} h={"100%"} w={"100%"}>
                        <img
                        src={props.imageHub[0]}
                        style={{
                          position: "absolute",
                          top: "10%",
                            left: "0%",
                            borderRadius: 15,
                            maxWidth: 335,
                            border: "1px black solid",
                          }}
                        ></img>
                        <img
                        src={props.imageHub[1]}
                        style={{
                            position: "absolute",
                            borderRadius: 15,
                            maxWidth: 335,
                            maxHeight: 250,
                            top: "40%",
                            left: "20%",
                            border: "1px black solid",
                          }}
                        ></img>
                      </Box>
                      </>
                  )} */}
                  {/* {props.imageHub.length === 3 && (
                    <>
                    <Box pos={"relative"} h={"100%"} w={"100%"}>
                    <img
                          src={props.imageHub[0]}
                          style={{
                            position: "absolute",
                            top: "0%",
                            objectFit: "cover",
                            left: "0%",
                            aspectRatio: 1.4,
                            borderRadius: 15,
                            maxWidth: 275,
                            border: "1px black solid",
                          }}
                        ></img>
                        <img
                        src={props.imageHub[1]}
                        style={{
                          position: "absolute",
                          top: "20%",
                          right: "0%",
                            borderRadius: 15,
                            aspectRatio: 1.4,
                            maxWidth: 275,
                            objectFit: "cover",
                            zIndex: 2,
                            border: "1px black solid",
                          }}
                        ></img>
                        <img
                          src={props.imageHub[2]}
                          style={{
                            position: "absolute",
                            bottom: "10%",
                            left: "10%",
                            borderRadius: 15,
                            aspectRatio: 1.5,
                            maxWidth: 300,
                            objectFit: "cover",
                            border: "1px black solid",
                          }}
                        ></img>
                      </Box>
                      </>
                  )} */}
                </>
              )}
              {isMd && (
                <>
                  <Carousel
                    slideSize={"95%"}
                    slideGap={10}
                    align={"center"}
                    w={"100%"}
                    px={"5%"}
                    py={"4%"}
                    loop
                    styles={{
                      root: {
                        maxWidth: "100%",
                        margin: 0,
                      },
                      controls: {
                        top: 0,
                        height: "100%",
                        padding: "0px",
                        margin: "0px",
                      },
                      control: {
                        "&[data-inactive]": {
                          opacity: 0,
                          cursor: "default",
                        },
                      },
                    }}
                    m={0}
                    >
                    {props.imageHub.map((x) => {
                      return (
                        <Carousel.Slide>
                          <img
                            src={x}
                            style={{
                              width: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          ></img>
                        </Carousel.Slide>
                      );
                    })}
                  </Carousel>
                </>
              )}
            </Box>
          </>
        </Center>
      </Box>
      <Box w={isMd ? "full" : "50%"} px={10} style={{ order: isMd ? 0 : 1 }}>
        <Stack mt={10} mb={30}>
          <Text
            ff="Catamaran"
            c={"red"}
            fw={700}
            fz={isMd ? 28 : 30}
            align={isMd ? "center" : "left"}
            >
            {props.id == ""?"ABOUT US":""}
          </Text>
          <Text
            ff="Catamaran"
            fw={600}
            fz={isMd ? 32 : 40}
            align={isMd ? "center" : "left"}
            style={{ whiteSpace: "pre-line" }}
          >
            {props.heading}
          </Text>
          <Text ff="Roboto" c={"#6B6B84"} fz={16} style={{ lineHeight: 1.6 }}>
            {readMore
              ? props.description
              : props.description.length === 0
              ? defaultDesc
              : glimpseDescription(props.description, 700)}
          </Text>
          {props.instituteId !==
            "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
            <SimpleGrid
            cols={
              !isMd
                  ? 2
                  : props.points.some((x) => x.split(" ").length > 3)
                  ? 1
                  : 2
              }
            >
              {props.points.map((x, index) => {
                return <AboutUsPoint text={x} index={index} />;
              })}
            </SimpleGrid>
          )}
          {props.instituteId ===
            "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
            <>
              <Text fw={800} fz={18}>
                • Dental Services
              </Text>
              <SimpleGrid cols={2}>
                {props.points.slice(0, 8).map((x, index) => {
                  return <AboutUsPoint text={x} index={index} />;
                })}
              </SimpleGrid>
              <Text fw={800} fz={18} mt={10}>
                • ENT Services
              </Text>
              <SimpleGrid cols={2}>
                {props.points.slice(8).map((x, index) => {
                  return <AboutUsPoint text={x} index={index} />;
                })}
              </SimpleGrid>
            </>
          )}
          {!readMore && props.description.length > 700 && (
            <Button
            w={150}
              h={48}
              px={5}
              ff={"Catamaran"}
              fw={500}
              style={{
                backgroundColor: props.theme.primaryColor,
                borderRadius: 10,
              }}
              onClick={() => {
                setReadMore(true);
              }}
              >
              Read More
            </Button>
          )}
          {readMore && (
            <Button
            w={150}
            h={48}
            px={5}
            ff={"Catamaran"}
            fw={500}
            style={{
              backgroundColor: props.theme.primaryColor,
              borderRadius: 10,
            }}
            onClick={() => {
              setReadMore(false);
            }}
            >
              Read Less
            </Button>
          )}
        </Stack>
      </Box>
    </Flex> 
    }

    {props.imageHub.length === 0 &&  <Flex
      id="parent-about-us"
      w={isXl ? "100%" : "75%"}
      mx={isXl ? "auto" : "12.5%"}
      direction={isMd ? "column" : "row"}
      mt={isMd ? 0 : 20}
      px={"3%"}
      justify={"space-between"}
    >
    
      <Box w={isMd ? "full" : "100%"} px={10} style={{ order: isMd ? 0 : 1 }}>
        <Stack mb={30}>
          <Text
            ff="Catamaran"
            c={"red"}
            fw={700}
            fz={isMd ? 28 : 30}
            align={isMd ? "center" : "left"}
            >
            {props.id == ""?"ABOUT US":""}
          </Text>
          <Text
            ff="Catamaran"
            fw={600}
            fz={isMd ? 32 : 40}
            align={isMd ? "center" : "left"}
            style={{ whiteSpace: "pre-line" }}
          >
            {props.heading}
          </Text>
          <Text ff="Roboto" c={"#6B6B84"} fz={16} style={{ lineHeight: 1.6 }}>
            {readMore
              ? props.description
              : props.description.length === 0
              ? defaultDesc
              : glimpseDescription(props.description, 700)}
          </Text>
          {props.instituteId !==
            "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
            <SimpleGrid
            cols={
              !isMd
                  ? 2
                  : props.points.some((x) => x.split(" ").length > 3)
                  ? 1
                  : 2
              }
            >
              {props.points.map((x, index) => {
                return <AboutUsPoint text={x} index={index} />;
              })}
            </SimpleGrid>
          )}
          {props.instituteId ===
            "INST-34812f50-d08a-4829-917b-15d4468d7fa7" && (
            <>
              <Text fw={800} fz={18}>
                • Dental Services
              </Text>
              <SimpleGrid cols={2}>
                {props.points.slice(0, 8).map((x, index) => {
                  return <AboutUsPoint text={x} index={index} />;
                })}
              </SimpleGrid>
              <Text fw={800} fz={18} mt={10}>
                • ENT Services
              </Text>
              <SimpleGrid cols={2}>
                {props.points.slice(8).map((x, index) => {
                  return <AboutUsPoint text={x} index={index} />;
                })}
              </SimpleGrid>
            </>
          )}
          {!readMore && props.description.length > 700 && (
            <Button
            w={150}
              h={48}
              px={5}
              ff={"Catamaran"}
              fw={500}
              style={{
                backgroundColor: props.theme.primaryColor,
                borderRadius: 10,
              }}
              onClick={() => {
                setReadMore(true);
              }}
              >
              Read More
            </Button>
          )}
          {readMore && (
            <Button
            w={150}
            h={48}
            px={5}
            ff={"Catamaran"}
            fw={500}
            style={{
              backgroundColor: props.theme.primaryColor,
              borderRadius: 10,
            }}
            onClick={() => {
              setReadMore(false);
            }}
            >
              Read Less
            </Button>
          )}
        </Stack>
      </Box>
    </Flex> 
    }
    </>
   



  );
}
