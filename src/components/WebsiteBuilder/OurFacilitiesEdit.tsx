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
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  UpdateInstituteFacilities,
  fetchAllFacilities,
} from "../../features/websiteBuilder/websiteBuilderSlice";
import { IconInfoCircle } from "@tabler/icons";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
export function OurFacilitiesEdit(props: {
  instituteId: string;
  facilities: InstituteFacilities[];
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  

  const [facilitiesModal, setfacilitiesModal] = useState<boolean>(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    props.facilities.map((fac) => {
      return fac.name;
    })
  );

  const [allFacilities, setAllFacilities] = useState<InstituteFacilities[]>([]);
  useEffect(() => {
    fetchAllFacilities()
      .then((data: any) => {
        setAllFacilities(data.facilities);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  function changeFacilities() {
    props.setIsLoading(true);
    const facIds: string[] = allFacilities
      .filter((fac: any) => selectedFacilities.includes(fac.name))
      .map((fac: any) => fac._id);

    UpdateInstituteFacilities({ id: props.instituteId, facilities: facIds })
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
            Facilities
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => setfacilitiesModal(true)}
          >
            Change Facilities
          </Button>
        </Group>
        <Flex
          w={"100%"}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
          p={"3%"}
          direction={"column"}
          align={"center"}
        >
          <SimpleGrid cols={isMd ? 1 : 3} w={"100%"}>
            {props.facilities?.map((fac) => {
              return (
                <>
                  <Text align="center" fw={500} fz={24}>
                    {fac.name}
                  </Text>
                </>
              );
            })}
          </SimpleGrid>
          {props.facilities.length === 0 && (
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
                  setfacilitiesModal(true);
                }}
              >
                Add Facilities
              </Button>
            </Stack>
          )}
        </Flex>
      </Stack>
      <Modal
        opened={facilitiesModal}
        onClose={() => setfacilitiesModal(false)}
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
        <Text>Select Facilities</Text>
        <MultiSelect
          data={
            allFacilities?.map((fac) => {
              return fac.name;
            }) || []
          }
          value={selectedFacilities}
          onChange={setSelectedFacilities}
        />
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setfacilitiesModal(false)}
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
              setfacilitiesModal(false);
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
