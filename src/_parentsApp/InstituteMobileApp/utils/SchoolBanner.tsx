import { Flex, Stack, Text,Image } from "@mantine/core";
import { instituteDetails } from "../../../store/instituteDetailsSlice";
import { useMediaQuery } from "@mantine/hooks";

export function SchoolBanner(props: {
  instituteDetails: InstituteWebsiteDisplay;
}) {

  const isMd = useMediaQuery(`(max-width: 864px)`);

  return (
    <Flex
      w="100%"
      style={{
        backgroundImage: `url(${require("../../../assets/mobileBanner.png")})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        aspectRatio : !isMd?"867/261":"346/210"    
        }}
    >
      <img
        src={require("../../../assets/SchoolBannerImage.png")}
        style={{
          height: "80%",
          objectFit: "cover",
          position: "absolute",
          bottom: "0%",
          right: "2%",
        }}
      />
      <Stack
        p={isMd?20:48}
        spacing={10}
        mt={24}
        justify="center"
        w={"60%"}
        h={"100%"}
      >
          <Flex
            align="center" >
            <Image
              src={props.instituteDetails.schoolIcon}
              height={isMd?20:28}
              width={isMd?20:28}
              fit="contain"
            />
            <Text fz={isMd?18:36} fw={700} mx={8} color="white">
              {props.instituteDetails?.name}
            </Text>
          </Flex>
          <Text color="#FFD904" size={isMd? 14 : 18}>For your growth</Text>

        <Text color="white" size={isMd? 14 : 18}>
          Make your educational journey more interesting with us
        </Text>
        <Flex
          style={{
            backgroundColor: "#FFD904",
            position: "relative",
            transform: "rotate(-5deg)", // Rotate the Flex by -10 degrees
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
          }}
          px={20}
          py={5}
          mt={isMd?24:36}
          mb={36}
          w= {isMd?"90%":"30%"}
        >
          <Text w="40px" fz={20} mt={12} ml={-6}>
            +91{props.instituteDetails.institutePhoneNumber}
          </Text>
          <Text
            style={{
              backgroundColor: "#FF8E00",
              borderRadius: "10px",
              position: "absolute",
              top: -20,
            }}
            px={20}
            py={5}
            color="white"
          >
            Call Now
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
}
