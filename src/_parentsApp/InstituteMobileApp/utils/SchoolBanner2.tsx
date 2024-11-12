import { Flex, Stack, Text } from "@mantine/core";

export function SchoolBanner2(props: {
  instituteDetails: InstituteWebsiteDisplay;
}) {
  return (
    <Flex
      w="100%"
      style={{
        position: "relative",
        height: "28vh",
        backgroundImage: `url(${require("../../../assets/SchoolBanner2.png")})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={require("../../../assets/SchoolBanner2Person.png")}
        style={{
          height: "23vh",
          objectFit: "cover",
          position: "absolute",
          bottom: "0%",
          left: "2%",
        }}
      />
      <Stack
        w="57%"
        style={{
          right: 0,
          bottom: 0,
          position: "absolute",
          padding: "20px",
        }}
        fz={14}
        spacing={10}
        mb={10}
      >
        <Stack spacing={4}>
          <Flex
            align="center"
            justify="right"
            style={{
              width: "80vw",
              position: "absolute",
              left: "-50%",
            }}
            mt={-20}
          >
            <img
              src={props.instituteDetails.schoolIcon}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <Text fz={13} fw={700} color="white">
              {props.instituteDetails?.name}
            </Text>
          </Flex>
          <Text color="#FFD904" ta="right">
            For Classes 1 to 12
          </Text>
        </Stack>
        <Text color="white" ta="right">
          Make your educational journey more interesting with us
        </Text>
        <Flex
          style={{
            backgroundColor: "#FFD904",
            position: "relative",
            transform: "rotate(-5deg)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
          }}
          px={20}
          py={5}
          mt={15}
          w="90%"
        >
          <Text w="30px" fz={19} mt={4} ml={-6}>
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
