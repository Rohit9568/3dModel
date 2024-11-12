import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  UpdateInstituteBenefits,
  UpdateInstituteFacilities,
  fetchAllFacilities,
  fetchAllInstitueBenefits,
} from "../../features/websiteBuilder/websiteBuilderSlice";
import { IconInfoCircle } from "@tabler/icons";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
export function InstituteBenefitsEdit(props: {
  instituteId: string;
  benefits: InstituteBenefits[];
  instituteBenefitsTagLine: string;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const [benefitsmodal, setbenefitsmodal] = useState<boolean>(false);
  const [selectedbenefits, setselectedbenefits] = useState<string[]>(
    props.benefits.map((fac) => {
      return fac.title;
    })
  );
  const [instituteBenefitsTagLine, setInstituteBenefitsTagLine] =
    useState<string>(props.instituteBenefitsTagLine);

  const [allBenefits, setAllBenefits] = useState<InstituteBenefits[]>([]);
  useEffect(() => {
    fetchAllInstitueBenefits()
      .then((data: any) => {
        setAllBenefits(data.benefits);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  function changeFacilities() {
    props.setIsLoading(true);
    const facIds: string[] = allBenefits
      .filter((fac: any) => selectedbenefits.includes(fac.title))
      .map((fac: any) => fac._id);

    UpdateInstituteBenefits({
      id: props.instituteId,
      benefits: facIds,
      institutionBenefitsTagLine: instituteBenefitsTagLine,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_FACILITIES_SUBMIT_BUTTON_CLICKED
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }
  return (
    <>
      <Stack>
        <Group>
          <Text fz={isMd ? 28 : 40} fw={700}>
            Why Choose Us?
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => setbenefitsmodal(true)}
          >
            Change Benefits
          </Button>
        </Group>
        <Text>{props.instituteBenefitsTagLine}</Text>
        <Flex
          w={"100%"}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
          p={"3%"}
          direction={"column"}
          align={"center"}
        >
          <SimpleGrid cols={isMd ? 1 : 3} w={"100%"}>
            {props.benefits?.map((fac) => {
              return (
                <>
                  <Text align="center" fw={500} fz={24}>
                    {fac.title}
                  </Text>
                </>
              );
            })}
          </SimpleGrid>
          {props.benefits.length === 0 && (
            <Stack align="center" my={20}>
              <Box w={110} h={110} bg="#F7F7FF" style={{ borderRadius: "50%" }}>
                <Center h={"100%"} p={"25%"}>
                  <IconInfoCircle width={"100%"} height={"100%"} stroke={1.2} />
                </Center>
              </Box>
              <Text fz={18} fw={500}>
                Add facilities that you provide!
              </Text>
              <Button
                style={{ background: "#4B65F6" }}
                onClick={() => {
                  setbenefitsmodal(true);
                }}
              >
                Add Benefits
              </Button>
            </Stack>
          )}
        </Flex>
      </Stack>
      <Modal
        opened={benefitsmodal}
        onClose={() => setbenefitsmodal(false)}
        centered
        zIndex={999}
        title={"Add Testimonial"}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <TextInput
          value={instituteBenefitsTagLine}
          onChange={(e) => {
            setInstituteBenefitsTagLine(e.currentTarget.value);
          }}
        />
        <Text>Select Facilities</Text>
        <MultiSelect
          data={
            allBenefits?.map((fac) => {
              return fac.title;
            }) || []
          }
          value={selectedbenefits}
          onChange={setselectedbenefits}
        />
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setbenefitsmodal(false)}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            sx={{
              backgroundColor: "#4B65F6",
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              setbenefitsmodal(false);
              changeFacilities();
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
}
