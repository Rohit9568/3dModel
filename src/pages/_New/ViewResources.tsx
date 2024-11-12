import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FileInput,
  Flex,
  Menu,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FileUpload } from "../../features/fileUpload/FileUpload";
import {
  IconBackArrow,
  IconDown,
  IconThreeDots,
} from "../../components/_Icons/CustonIcons";
import { PdfViewer } from "../../components/_New/FileUploadBox";
import {
  addTestResources,
  getTestResources,
  removeTestResources,
} from "../../features/test/TestSlice";
import { set } from "date-fns";
import { IconChevronLeft, IconDotsVertical } from "@tabler/icons";
const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));
interface FileTypeProps {
  fileName: string;
  fileType: string;
  createdAt: string;
}

interface ViewResources {
  testId: string;
  fromTeacherPage: boolean;
  onbackClick: () => void;
}
export default function ViewResources(props: ViewResources) {
  const { theme } = useStyles();
  const navigate = useNavigate();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [file, setFile] = useState<File | null>(null);
  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const fileRef = useRef<any>();
  const [deleteResourceModalOpen, setDeleteResourcesModalOpen] =
    useState(false);
  const [fileToBeDeletedUrl, setFileToBeDeletedUrl] = useState("");
  const [fileToBeDeletedName, setFileToBeDeletedName] = useState("");
  const [allFiles, setAllFiles] = useState<
    {
      fileName: string;
      url: string;
    }[]
  >([]);
  const [testName, setTestname] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onNoteUpload(name: string, url: string) {
    setIsLoading(true);
    addTestResources({
      testId: props.testId,
      fileName: name,
      url: url,
    })
      .then((x: any) => {
        console.log(x);
        setIsLoading(false);
        showNotification({
          message: "File uploaded successfully",
        });
        getAllResources();
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }

  const uploadButtonCLickHandler = () => {
    fileRef.current.click();
  };

  useEffect(() => {
    setCurrentPdf(null);
  }, []);

  useEffect(() => {
    if (file) {
      if (file && file.size > 100 * 1024 * 1024) {
        showNotification({
          message: "File size should be less than 100mb",
        });
      } else if (file && file.type === "application/pdf") {
        FileUpload({ file })
          .then((x) => {
            onNoteUpload(file.name, x.url);
            setFile(null);
          })
          .catch((e) => {
            console.log(e);
            setFile(null);
          });
      } else {
        showNotification({
          message: "Please select a PDF file.",
        });
      }
    }
  }, [file]);

  const carouselScrollRef = useRef<any>(null);
  useEffect(() => {
    if (carouselScrollRef && carouselScrollRef.current)
      carouselScrollRef.current.scrollTo(0, 0);
  }, []);

  function getAllResources() {
    setIsLoading(true);
    getTestResources(props.testId)
      .then((x: any) => {
        setIsLoading(false);
        console.log(x);
        setAllFiles(x.testResources);
        setTestname(x.name);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }

  useEffect(() => {
    getAllResources();
  }, []);

  function deleteResources() {
    setIsLoading(true);
    removeTestResources({
      testId: props.testId,
      fileName: fileToBeDeletedName,
      url: fileToBeDeletedUrl,
    })
      .then((x: any) => {
        setIsLoading(false);
        console.log(x);
        showNotification({
          message: "File deleted successfully",
        });
        getAllResources();
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }

  return (
    <>
      <Stack>
        <Flex align="center" pl={isMd ? 20 : 0}>
          <IconChevronLeft
            onClick={() => {
              props.onbackClick();
            }}
            style={{
              cursor: "pointer",
              width: "20px",
              height: "20px",
            }}
          />
          <Text ml={15} color="black" fw={700} fz={20}>
            {testName}
          </Text>
        </Flex>
        <Divider color="gray" />
      </Stack>
      {allFiles.length === 0 && props.fromTeacherPage && (
        <Center
          style={{
            height: isMd ? "calc(100vh - 165px)" : "calc(100vh - 90px)",
            width: "100%",
            // height:"100%",
            // marginTop: "50%",
          }}
        >
          <Stack justify="center" align="center">
            <img
              src={require("../../assets/EmptyResources.png")}
              height="132px"
              width="132px"
            />
            <Text color="#B5B5B5" fz={15}>
              Your files can be viewed in this section
            </Text>
            <Button
              size="md"
              bg="#4B65F6"
              onClick={() => {
                uploadButtonCLickHandler();
              }}
            >
              Add Resources
            </Button>
            {/* </Group> */}
          </Stack>
        </Center>
      )}
      <FileInput
        accept=".pdf"
        ref={fileRef}
        value={file}
        onChange={setFile}
        display="none"
      />
      <div
        style={{
          width: "100%",
          marginBottom: "30px",
        }}
      >
        <StyledContainer size="lg" fluid={isMd} w="100%">
          {props.fromTeacherPage && (
            <StyledHeader py={isMd ? 10 : 30} size="lg" px={isMd ? 10 : 30}>
              {allFiles.length !== 0 && (
                <Button
                  bg="#4B65F6"
                  size={isMd ? "xs" : "md"}
                  onClick={() => {
                    uploadButtonCLickHandler();
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "",
                    },
                  }}
                  style={{
                    fontSize: isMd ? 14 : 18,
                    borderRadius: "24px",
                    fontFamily: "Nunito",
                    background: "transparent",
                    color: "black",
                    padding: "9px 14px 9px 14px",
                    border: "1px solid black",
                  }}
                >
                  Add Files
                </Button>
              )}
            </StyledHeader>
          )}
          {isMd ? (
            <>
              {allFiles.length > 0 && (
                <SimpleGrid
                  cols={4}
                  verticalSpacing={"sm"}
                  breakpoints={[
                    { maxWidth: "lg", cols: 3, spacing: "md" },
                    { maxWidth: "md", cols: 2, spacing: "sm" },
                    { maxWidth: "sm", cols: 1, spacing: "sm" },
                  ]}
                  pt={30}
                >
                  {allFiles.map((x) => (
                    <div
                      key={x.url}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <Flex
                        justify={"space-between"}
                        px={"lg"}
                        py={"md"}
                        bg={"white"}
                        mx={"sm"}
                        h={"100px"}
                        align={"center"}
                        sx={{
                          borderRadius: "5px",
                          boxShadow: "0px 0px 20px 0px #0000001A",
                          width: "100%",
                        }}
                        onClick={() => {
                          setCurrentPdf(x.url);
                        }}
                      >
                        <Flex gap={"20px"} align={"center"}>
                          <img
                            src={require("../../assets/worksheetType.png")}
                            alt="Icon"
                            style={{
                              width: "40px",
                              aspectRatio: "1",
                              height: "40px",
                            }}
                          />
                          <Flex direction={"column"} py={20} gap={"xs"}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span style={{ fontSize: "14px" }}>
                                {x.fileName.length > 7
                                  ? `${x.fileName.substring(0, 7)}...`
                                  : x.fileName}
                              </span>
                            </div>
                          </Flex>
                        </Flex>
                      </Flex>
                      {props.fromTeacherPage && (
                        <div
                          style={{
                            position: "relative",
                            // bottom: '100px',
                            right: "55px",
                            zIndex: 3,
                          }}
                        >
                          <Menu
                            styles={{
                              dropdown: {
                                marginLeft: 15,
                              },
                            }}
                          >
                            <Menu.Target>
                              <Button
                                // w={"140px"}
                                radius={8}
                                ta={"left"}
                                variant="subtle"
                                rightIcon={<IconThreeDots />}
                                c="#000000"
                                fw={600}
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                                fz={18}
                                sx={{
                                  ":hover": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                              ></Button>
                            </Menu.Target>
                            <StyledMenuDropdown className="menu-dropdown">
                              <Menu.Item
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                                className="menu-item"
                              >
                                <Text
                                  onClick={async (event) => {
                                    event.stopPropagation();
                                    setFileToBeDeletedUrl(x.url);
                                    setFileToBeDeletedName(x.fileName);
                                    setDeleteResourcesModalOpen(true);
                                  }}
                                >
                                  Delete
                                </Text>
                              </Menu.Item>
                            </StyledMenuDropdown>
                          </Menu>
                        </div>
                      )}
                    </div>
                  ))}
                </SimpleGrid>
              )}
            </>
          ) : (
            <Stack>
              <Flex justify={"center"} align={"center"} w={"100%"} pt={20}>
                {allFiles.length !== 0 && (
                  <Carousel
                    withIndicators
                    height={isMd ? "30vh" : "40vh"}
                    loop
                    w={"95%"}
                    slideSize={isMd ? "100%" : "10%"}
                    style={{
                      height: "200px",
                    }}
                    align={"start"}
                    styles={{
                      control: {
                        width: 30,
                        height: 30,
                      },
                    }}
                    ref={carouselScrollRef}
                  >
                    <>
                      {allFiles.map((x, index) => (
                        <Carousel.Slide w={"20%"} key={index} mt={15}>
                          <Flex
                            justify={"space-between"}
                            // px={"lg"}
                            py={"md"}
                            mx={"sm"}
                            h={"160px"}
                            w={"150px"}
                            align={"center"}
                            sx={{
                              borderRadius: "5px",
                              boxShadow: "0px 0px 20px 0px #0000001A",
                              flexDirection: "column",
                              position: "relative",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setCurrentPdf(x.url);
                            }}
                          >
                            <Flex
                              // gap={"20px"}
                              justify={"center"}
                              align={"center"}
                              w={"100%"}
                              direction={"column"}
                            >
                              <img
                                src={require("../../assets/worksheetType.png")}
                                alt="Icon"
                                style={{
                                  width: "50px",
                                  aspectRatio: "1",
                                  height: "50px",
                                }}
                              />
                              <Flex
                                direction={"column"}
                                py={20}
                                gap={"xs"}
                                align={"center"}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Tooltip label={x.fileName} position="bottom">
                                    <span style={{ fontSize: "14px" }}>
                                      {x.fileName.length > 15
                                        ? `${x.fileName.substring(0, 15)}...`
                                        : x.fileName}
                                    </span>
                                  </Tooltip>
                                </div>
                              </Flex>
                              {props.fromTeacherPage && (
                                <div
                                  style={{
                                    position: "relative",
                                    bottom: "80%",
                                    left: "55px",
                                    zIndex: 3,
                                  }}
                                >
                                  <Menu
                                    styles={{
                                      dropdown: {
                                        marginLeft: 15,
                                      },
                                    }}
                                  >
                                    <Menu.Target>
                                      <IconDotsVertical
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      />
                                    </Menu.Target>
                                    <StyledMenuDropdown className="menu-dropdown">
                                      <Menu.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                        }}
                                        className="menu-item"
                                      >
                                        <Text
                                          onClick={async (event) => {
                                            event.stopPropagation();
                                            setFileToBeDeletedUrl(x?.url);
                                            setFileToBeDeletedName(x?.fileName);
                                            setDeleteResourcesModalOpen(true);
                                          }}
                                        >
                                          Delete
                                        </Text>
                                      </Menu.Item>
                                    </StyledMenuDropdown>
                                  </Menu>
                                </div>
                              )}
                            </Flex>
                          </Flex>
                        </Carousel.Slide>
                      ))}
                    </>
                  </Carousel>
                )}
              </Flex>
              {currentPdf && (
                <Box w={"100%"} mt={30}>
                  <PdfViewer url={currentPdf} showOptions={true} />
                </Box>
              )}
            </Stack>
          )}
        </StyledContainer>
      </div>
      <Modal
        opened={currentPdf !== null && isMd}
        onClose={() => {
          setCurrentPdf(null);
        }}
        size="lg"
      >
        {currentPdf !== null && (
          <PdfViewer url={currentPdf} showOptions={true} />
        )}
      </Modal>
      <Modal
        opened={deleteResourceModalOpen}
        onClose={() => setDeleteResourcesModalOpen(false)}
        centered
        title="Delete Resource"
        styles={{
          title: {
            fontWeight: 700,
          },
        }}
      >
        <Content>Are you sure you want to delete this topic?</Content>
        <ButtonContainer>
          <CancelButton
            onClick={() => {
              setDeleteResourcesModalOpen(false);
            }}
            disabled={fileToBeDeletedUrl?.length === 0}
          >
            Cancel
          </CancelButton>
          <SubmitButton
            disabled={fileToBeDeletedName?.length === 0}
            onClick={async () => {
              setDeleteResourcesModalOpen(false);
              deleteResources();
            }}
          >
            Yes
          </SubmitButton>
        </ButtonContainer>
      </Modal>
    </>
  );
}

const StyledContainer = styled(Container)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledHeader = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledMenuDropdown = styled(Menu.Dropdown)`
  top: 30px !important;
  left: 10px !important;
  background-color: white;
  .menu-item {
    padding: 0 5px;
    &:hover {
      background-color: white;
    }
  }
`;

const Content = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;
const Title = styled.span`
  font-family: "Nunito";
  font-weight: 700;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  cursor: pointer;
  background-color: #cccccc;
`;
const SubmitButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  background-color: #4b65f6;
  cursor: pointer;
`;
