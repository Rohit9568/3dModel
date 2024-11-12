import { Carousel, Embla } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMessage,
  IconTrash,
} from "@tabler/icons";
import { useState } from "react";
import { AddTestimonialInInstitute } from "../../features/websiteBuilder/websiteBuilderSlice";
import { glimpseDescription } from "../../utilities/HelperFunctions";
import { DeleteTestimonial } from "../../_parentsApp/features/instituteSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
export function TestimonialsEdit(props: {
  instituteId: string;
  testimonials: InstituteTestimonial[];
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [seletdeleteTestimonialId, setDeleteTestimonialId] = useState<
    string | null
  >(null);
  const [addTestimonialModal, setAddTestimonialModal] =
    useState<boolean>(false);

  const [newTestimonialData, setNewTestimonialData] = useState<{
    personName: string;
    text: string;
  }>({
    personName: "",
    text: "",
  });

  function addTestimonial() {
    props.setIsLoading(true);
    AddTestimonialInInstitute({
      id: props.instituteId,
      personName: newTestimonialData.personName,
      text: newTestimonialData.text,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_TESTINOMIALS_SUBMIT_BUTTON_CLICKED,
          {
            type: "add",
          }
        );
        setNewTestimonialData({
          personName: "",
          text: "",
        });
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }
  function deleteTestimonial(testimonialId: string) {
    props.setIsLoading(true);
    DeleteTestimonial({
      id: props.instituteId,
      testimonialId: testimonialId,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_TESTINOMIALS_SUBMIT_BUTTON_CLICKED,
          {
            type: "delete",
          }
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
            Testimonials
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => setAddTestimonialModal(true)}
          >
            Add Testimonial
          </Button>
        </Group>
        <Flex
          w={"100%"}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
          py={40}
          align={"center"}
        >
          {props.testimonials.length === 0 && (
            <Center w={"100%"}>
              <Stack align="center">
                <Box
                  w={110}
                  h={110}
                  bg="#F7F7FF"
                  style={{ borderRadius: "50%" }}
                >
                  <Center h={"100%"} p={"25%"}>
                    <IconMessage
                      fill="black"
                      color="white"
                      width={"100%"}
                      height={"100%"}
                    />
                  </Center>
                </Box>
                <Text fz={18} fw={500}>
                  Testimonials not added yet!
                </Text>
                <Button
                  style={{ background: "#4B65F6" }}
                  onClick={() => {
                    setAddTestimonialModal(true);
                  }}
                >
                  Add Testimonial
                </Button>
              </Stack>
            </Center>
          )}
          {props.testimonials.length > 0 && (
            <>
              <Center w={"100%"} mx={"3%"}>
                <Carousel
                  getEmblaApi={setEmbla}
                  slideSize={isMd ? "95%" : "33.3%"}
                  slideGap={10}
                  loop
                  align={
                    isMd
                      ? "center"
                      : props.testimonials.length < 2
                      ? "center"
                      : "start"
                  }
                  px={isMd ? 20 : 50}
                  w={"100%"}
                  my={20}
                  withIndicators
                  nextControlIcon={
                    <Box
                      w={"60%"}
                      h={"100%"}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                      }}
                    >
                      <IconChevronRight size={60} stroke={1} color="#747474" />
                    </Box>
                  }
                  previousControlIcon={
                    <Box
                      w={"60%"}
                      h={"100%"}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                      }}
                    >
                      <IconChevronLeft size={60} stroke={1} color="#747474" />
                    </Box>
                  }
                  styles={{
                    controls: {
                      top: 0,
                      height: "100%",
                      padding: "0px",
                      margin: "0px",
                    },
                    control: {
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      height: "200px",
                      "&[data-inactive]": {
                        opacity: 0,
                        cursor: "default",
                      },
                    },
                    indicator: {
                      width: 8,
                      height: 8,
                      backgroundColor: "red",
                    },
                    indicators: {
                      top: "110%",
                    },
                  }}
                >
                  {props.testimonials.map((testimonial, i) => {
                    const date = new Date(testimonial.createdAt);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    const formattedDate = `${day}.${month}.${year}`;
                    return (
                      <Carousel.Slide>
                        <Flex
                          mih={isXl ? 200 : 150}
                          p={20}
                          h={"100%"}
                          mah={200}
                          direction={"column"}
                          justify="space-between"
                          align="flex-start"
                          style={{
                            border: "1px solid #E9E9E9",
                            borderRadius: 10,
                            backgroundColor: "white",
                          }}
                        >
                          <Flex gap={10} justify={"center"}>
                            <Text fw={700} fz={14} ff={"Inter"} c={"#6F1DF4"}>
                              {testimonial.personName}
                            </Text>
                            <Center>
                              <IconTrash
                                color="#ff0000"
                                onClick={() => {
                                  setDeleteTestimonialId(testimonial._id);
                                  setDeleteModal(true);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </Center>
                          </Flex>
                          <Text fw={400} fz={18} ff={"Inter"}>
                            {glimpseDescription(testimonial.text, 80)}
                          </Text>
                          <Text
                            align="right"
                            w={"100%"}
                            ff={"Inter"}
                            c="#3C3C4380"
                          >
                            {formattedDate}
                          </Text>
                        </Flex>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              </Center>
            </>
          )}
        </Flex>
      </Stack>
      <Modal
        opened={addTestimonialModal}
        onClose={() => setAddTestimonialModal(false)}
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
        <Text>Name</Text>
        <Textarea
          value={newTestimonialData.personName}
          autosize
          onChange={(event) =>
            setNewTestimonialData({
              ...newTestimonialData,
              personName: event.currentTarget.value,
            })
          }
        />
        <Text>Description</Text>
        <Textarea
          value={newTestimonialData.text}
          autosize
          onChange={(event) =>
            setNewTestimonialData({
              ...newTestimonialData,
              text: event.currentTarget.value,
            })
          }
        />
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setAddTestimonialModal(false)}
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
              setAddTestimonialModal(false);
              addTestimonial();
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this testimonial?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setDeleteModal(false);
              setDeleteTestimonialId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              setDeleteModal(false);
              if (seletdeleteTestimonialId)
                deleteTestimonial(seletdeleteTestimonialId);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
