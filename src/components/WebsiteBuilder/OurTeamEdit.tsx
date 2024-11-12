import { Carousel, Embla } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { AddTeamMemberInInstitute } from "../../features/websiteBuilder/websiteBuilderSlice";
import { isHEIC } from "../../utilities/HelperFunctions";
import { showNotification } from "@mantine/notifications";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { DeleteTeamMember } from "../../_parentsApp/features/instituteSlice";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";

export enum TeamMemberstype {
  TeamMembers = "Your Team",
  CoreTeamMembers = "Director's Corner",
  TopperStudents = "Your Students",
}
export function OurTeamEdit(props: {
  teamMembers: TeamMember[];
  instituteId: string;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
  teamMemberType: TeamMemberstype;
  title: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [seleteDeleteTeamMemberId, setDeleteTeamMemberId] = useState<
    string | null
  >(null);
  const [addTeamMemberModal, setAddTeamMemberModal] = useState<boolean>(false);
  const [newTeamMemberData, setNewTeamMemberData] = useState<{
    name: string;
    profileImage: string;
    desgination: string;
    description: string;
  }>({ name: "", profileImage: "", desgination: "", description: " " });

  const fileRef = useRef<any>();
  const [imageUploadFile, setImageUploadFile] = useState<File | null>(null);
  const isAddTeamMemberValid =
    newTeamMemberData.name.length > 0 &&
    newTeamMemberData.desgination.length &&
    newTeamMemberData.description.length > 0 &&
    imageUploadFile !== null;
  async function submitHandler(file: File) {
    props.setIsLoading(true);
    await FileUpload({ file })
      .then((data: any) => {
        Mixpanel.track(WebAppEvents.WEBSITE_BUILDER_IMAGE_ADDED, {
          section: "team member",
        });
        setNewTeamMemberData({ ...newTeamMemberData, profileImage: data.url });
        props.setIsLoading(false);
      })

      .catch((err) => {
        props.setIsLoading(false);

        console.log(err);
      });
  }
  useEffect(() => {
    if (imageUploadFile !== null) {
      const isError = isHEIC(imageUploadFile);
      const isSizeValid = imageUploadFile.size <= 5 * 1024 * 1024;
      if (isError) {
        showNotification({ message: "File Format not supported" });
      } else if (!isSizeValid) {
        showNotification({
          message: "Maximum Size should be 5mb",
          color: "red",
        });
      } else {
        submitHandler(imageUploadFile);
      }
    }
  }, [imageUploadFile]);
  useEffect(() => {
    setImageUploadFile(null);
  }, [addTeamMemberModal]);
  function addTeamMember() {
    AddTeamMemberInInstitute({
      id: props.instituteId,
      name: newTeamMemberData.name,
      profileImage:
        newTeamMemberData.profileImage ||
        "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-01-02T14-40-09-342Z.jpg",
      desgination: newTeamMemberData.desgination ?? " ",
      description: newTeamMemberData.description,
      teamMembersType: props.teamMemberType,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_TEAM_MEMBER_SUBMIT_BUTTON_CLICKED,
          {
            type: "add",
          }
        );
        setImageUploadFile(null);
        setNewTeamMemberData({
          name: "",
          profileImage: "",
          desgination: "",
          description: " ",
        });
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        setImageUploadFile(null);
        props.setIsLoading(false);
        console.log(e);
      });
  }
  function deleteTeamMember(teamMemberId: string) {
    props.setIsLoading(true);
    DeleteTeamMember({
      id: props.instituteId,
      teamMemberId: teamMemberId,
      teamMembersType: props.teamMemberType,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_TEAM_MEMBER_SUBMIT_BUTTON_CLICKED,
          {
            type: "delete",
          }
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        setImageUploadFile(null);
        props.setIsLoading(false);
        console.log(e);
      });
  }

  return (
    <>
      <Stack w={"100%"}>
        <Group>
          <Text fz={isMd ? 28 : 40} fw={700}>
            {props.teamMemberType}
          </Text>
          {props.teamMembers.length !== 0 && (
            <Button
              variant={"outline"}
              color="dark"
              radius={50}
              onClick={() => setAddTeamMemberModal(true)}
            >
              {props.title}
            </Button>
          )}
        </Group>
        <Flex
          w={"100%"}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
          direction={"column"}
          align={"center"}
        >
          {props.teamMembers.length > 0 && (
            <Center w={"100%"}>
              <Carousel
                getEmblaApi={setEmbla}
                slideSize={"100%"}
                slideGap={10}
                loop
                align={
                  isMd
                    ? "center"
                    : props.teamMembers.length < 2
                    ? "center"
                    : "start"
                }
                px={isMd ? 20 : 30}
                w={isMd ? "100%" : "85%"}
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
                    "&[data-active]": {},
                  },
                  indicators: {
                    top: "100%",
                    alignItems: "center",
                  },
                }}
              >
                {props.teamMembers.map((teamMember, i) => {
                  return (
                    <Carousel.Slide>
                      <Flex
                        p={20}
                        direction={isMd ? "column" : "row"}
                        gap={20}
                        align="center"
                      >
                        <Box h={"100%"}>
                          <img
                            src={teamMember.profileImage}
                            style={{
                              width: 224,
                              height: 224,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          ></img>
                          <Center mt={10}>
                            <Text
                              bg={"#E9E9FF"}
                              style={{ borderRadius: "50px" }}
                              c={"#000574"}
                              py={5}
                              px={15}
                              fz={20}
                              fw={700}
                            >
                              {teamMember.desgination}
                            </Text>
                          </Center>
                        </Box>
                        <Box ml={isMd ? 0 : 20}>
                          <Flex gap={20} justify={"center"}>
                            <Text
                              c={"#000574"}
                              fz={28}
                              fw={700}
                              align={isMd ? "center" : "left"}
                              py={isMd ? 15 : 0}
                            >
                              {teamMember.name}
                            </Text>
                            <Center>
                              <IconTrash
                                color="#ff0000"
                                onClick={() => {
                                  setDeleteTeamMemberId(teamMember._id);
                                  setDeleteModal(true);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </Center>
                          </Flex>
                          <Text
                            fz={18}
                            fw={400}
                            align={isMd ? "center" : "left"}
                          >
                            {teamMember.description}
                          </Text>
                        </Box>
                      </Flex>
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </Center>
          )}
          {props.teamMembers.length === 0 && (
            <Center>
              <Stack align="center" my={20}>
                <Box
                  w={110}
                  h={110}
                  bg="#F7F7FF"
                  style={{ borderRadius: "50%" }}
                >
                  <Center h={"100%"} p={"25%"}>
                    <img
                      src={
                        "https://vignam-content-images.s3.amazonaws.com/2024-01-02T11-07-58-818Z.png"
                      }
                    ></img>
                  </Center>
                </Box>
                <Text fz={18} fw={500}>
                  Details not added yet!
                </Text>
                <Button
                  style={{ background: "#4B65F6" }}
                  onClick={() => {
                    setAddTeamMemberModal(true);
                  }}
                >
                  Add Team Member
                </Button>
              </Stack>
            </Center>
          )}
        </Flex>
      </Stack>
      <Modal
        opened={addTeamMemberModal}
        onClose={() => setAddTeamMemberModal(false)}
        centered
        zIndex={999}
        title={props.title}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Stack>
          <Text>Name</Text>
          <Textarea
            value={newTeamMemberData.name}
            autosize
            onChange={(event) =>
              setNewTeamMemberData({
                ...newTeamMemberData,
                name: event.currentTarget.value,
              })
            }
          />
          <Text>Designation</Text>
          <Textarea
            value={newTeamMemberData.desgination}
            autosize
            onChange={(event) =>
              setNewTeamMemberData({
                ...newTeamMemberData,
                desgination: event.currentTarget.value,
              })
            }
          />
          <Text>Add Thumbnail</Text>
          {imageUploadFile === null && (
            <Button
              variant="outline"
              fw={700}
              radius={50}
              leftIcon={<IconUpload></IconUpload>}
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Upload Image
            </Button>
          )}
          {imageUploadFile !== null && (
            <Group>
              <Text>{imageUploadFile.name}</Text>
              <IconX
                color="red"
                onClick={() => {
                  setImageUploadFile(null);
                }}
              ></IconX>
            </Group>
          )}
          {props.teamMemberType !== TeamMemberstype.TopperStudents && (
            <>
              <Text>Description</Text>
              <Textarea
                value={newTeamMemberData.description}
                autosize
                onChange={(event) =>
                  setNewTeamMemberData({
                    ...newTeamMemberData,
                    description: event.currentTarget.value,
                  })
                }
              />
            </>
          )}

          <Group position="right" mt={20}>
            <Button
              variant="outline"
              color="dark"
              fw={700}
              radius={50}
              onClick={() => setAddTeamMemberModal(false)}
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
                setAddTeamMemberModal(false);
                addTeamMember();
              }}
              disabled={!isAddTeamMemberValid}
            >
              Submit
            </Button>
          </Group>
          <FileInput
            ref={fileRef}
            value={imageUploadFile}
            accept="image/*"
            onChange={(x) => {
              setImageUploadFile(x);
            }}
            style={{ display: "none" }}
          />
        </Stack>
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
          Are you sure you want to delete this team member?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setDeleteModal(false);
              setDeleteTeamMemberId(null);
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
              if (seleteDeleteTeamMemberId)
                deleteTeamMember(seleteDeleteTeamMemberId);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
