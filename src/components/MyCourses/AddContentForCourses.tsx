import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Menu,
  Modal,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconDotsVertical, IconPlus, IconX } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { AddVideoModal } from "./Modals/AddVideoModal";
import { AddNotesModal } from "./Modals/AddNotesModal";
import { AddTestModal } from "./Modals/AddTestModal";
import { IconBook } from "../_Icons/CustonIcons";
import { useMediaQuery } from "@mantine/hooks";
import {
  UpdateCourseVideoName,
  UpdateFileName,
  UpdateTestName,
  createCourseFile,
  createCourseFolder,
  createCoursevideo,
  getCourseFolderById,
  updateCourseFolderContent,
} from "../../features/course/courseSlice";
import { downloadPdf } from "../_New/Test/DownloadSamplePaper";
import { useSelector } from "react-redux";
import { User1 } from "../../@types/User";
import { convertToRomanNumerals } from "../../utilities/HelperFunctions";
import { RootState } from "../../store/ReduxStore";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import useParentCommunication from "../../hooks/useParentCommunication";
import AddFolderModal from "./Modals/AddFolderModal";

enum MenuItems {
  VIDEO = "Video",
  NOTES = "Notes",
  TEST = "Test",
  FOLDER = "Folder",
}
export function scrollToTopLeft() {
  const scrollArea = document.getElementById("your-scroll-area-id");

  if (scrollArea) {
    window.scrollTo(0, 0);
  }
}
function EditMenu(props: {
  onDeleteClick: () => void;
  onRenameClick: () => void;
  onDownloadClick?: () => void;
}) {
  return (
    <Menu>
      <Menu.Target>
        <Box>
          <IconDotsVertical />
        </Box>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={props.onDeleteClick}>
          <Text px={20}>Delete</Text>
        </Menu.Item>
        <Menu.Item onClick={props.onRenameClick}>
          <Text px={20}>Rename</Text>
        </Menu.Item>
        {props.onDownloadClick && (
          <Menu.Item onClick={props.onDownloadClick}>
            <Text px={20}>Download</Text>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
function MenuItem(props: { val: string; onClick: () => void }) {
  return (
    <Menu.Item
      onClick={props.onClick}
      style={{
        borderBottom: "1px solid #ECECEC",
        borderRadius: "0px",
      }}
    >
      <Text ta="center" fz={16} fw={700}>
        {props.val}
      </Text>
    </Menu.Item>
  );
}

export function NameEditor(props: {
  fileName: string;
  setOnRenameClicked: (val: boolean) => void;
  onRenameClick: (val: string) => void;
}) {
  const [value, setValue] = useState<string>(props.fileName);
  return (
    <Flex
      align="center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <TextInput
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        styles={{
          input: {
            fontSize: "22px",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid black",
            borderRadius: "0px",
            "&:focus-within": {
              borderBottom: "1px solid black",
            },
          },
        }}
      />
      <IconCheck
        onClick={() => {
          props.setOnRenameClicked(false);
          props.onRenameClick(value);
        }}
        style={{
          cursor: "pointer",
          width: "10vh",
        }}
      />
      <IconX
        onClick={() => {
          props.setOnRenameClicked(false);
        }}
        style={{
          cursor: "pointer",
          width: "10vh",
        }}
      />
    </Flex>
  );
}

function SingleVideoCard(props: {
  fileName: string;
  description: string;
  onRenameClick: (val: string) => void;
  onDeleteClick: () => void;
}) {
  const [onRenameClick, setOnRenameClicked] = useState<boolean>(false);

  return (
    <Flex
      style={{
        border: "1px solid #CDCEE3",
        background: "#F7F7FF",
        borderRadius: "11px",
      }}
      px={15}
      py={20}
      justify="space-between"
      align="center"
    >
      <Flex align="center">
        <Stack mr={30}>
          <img src={require("../../assets/videocourse.png")} />
        </Stack>
        <Stack spacing={3}>
          {!onRenameClick && (
            <Text fz={16} fw={400}>
              {props.fileName}
            </Text>
          )}
          {onRenameClick && (
            <NameEditor
              fileName={props.fileName}
              setOnRenameClicked={setOnRenameClicked}
              onRenameClick={props.onRenameClick}
            />
          )}
          <Text color="#898989" fw={500} fz={14}>
            {props.description}
          </Text>
        </Stack>
      </Flex>
      <Stack
        justify="center"
        style={{
          cursor: "pointer",
        }}
      >
        <EditMenu
          onDeleteClick={props.onDeleteClick}
          onRenameClick={() => {
            setOnRenameClicked(true);
          }}
        />
      </Stack>
    </Flex>
  );
}
function SingleFileCard(props: {
  fileName: string;
  onRenameClick: (val: string) => void;
  onDeleteClick: () => void;
}) {
  const [onRenameClick, setOnRenameClicked] = useState<boolean>(false);
  return (
    <Flex
      style={{
        border: "1px solid #CDCEE3",
        background: "#F7F7FF",
        borderRadius: "11px",
      }}
      px={15}
      py={20}
      justify="space-between"
      align="center"
    >
      <Flex align="center">
        <Stack mr={30}>
          <img src={require("../../assets/filelogo.png")} />
        </Stack>
        {!onRenameClick && (
          <Text fz={16} fw={400}>
            {props.fileName}
          </Text>
        )}
        {onRenameClick && (
          <NameEditor
            fileName={props.fileName}
            setOnRenameClicked={setOnRenameClicked}
            onRenameClick={props.onRenameClick}
          />
        )}
      </Flex>
      <Stack
        justify="center"
        style={{
          cursor: "pointer",
        }}
      >
        <EditMenu
          onDeleteClick={props.onDeleteClick}
          onRenameClick={() => {
            setOnRenameClicked(true);
          }}
        />
      </Stack>
    </Flex>
  );
}
function SingleFolderCard(props: {
  folderName: string;
  folderId: string;
  onRenameClick: (folder: CourseFolder) => void;
  onDeleteClick: () => void;
  onFolderCardClick: (parentCourseFolder: CourseFolder) => void;
}) {
  const [onRenameClick, setOnRenameClicked] = useState<boolean>(false);

  return (
    <Flex
      style={{
        border: "1px solid #CDCEE3",
        background: "#F7F7FF",
        borderRadius: "11px",
      }}
      px={15}
      py={20}
      justify="space-between"
      align="center"
    >
      <Flex
        w="100%"
        align="center"
        onClick={() => {
          getCourseFolderById(props.folderId)
            .then((x: any) => {
              props.onFolderCardClick(x);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        <Stack mr={30}>
          <img src={require("../../assets/folder.png")} />
        </Stack>

        {!onRenameClick && (
          <Text fz={16} fw={400}>
            {props.folderName}
          </Text>
        )}
        {onRenameClick && (
          <NameEditor
            fileName={props.folderName}
            setOnRenameClicked={setOnRenameClicked}
            onRenameClick={(name: string) => {
              getCourseFolderById(props.folderId)
                .then((x: any) => {
                  x.name = name;
                  props.onRenameClick(x);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          />
        )}
      </Flex>
      <Stack
        justify="center"
        style={{
          cursor: "pointer",
        }}
        onClick={() => {}}
      >
        <EditMenu
          onDeleteClick={props.onDeleteClick}
          onRenameClick={() => {
            setOnRenameClicked(true);
          }}
        />
      </Stack>
    </Flex>
  );
}

function SingleTestCard(props: {
  test: any;
  onRenameClick: (val: string) => void;
  onDeleteClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [onRenameClick, setOnRenameClicked] = useState<boolean>(false);
  const [isLoading, setLaoding] = useState<boolean>(false);
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();
  return (
    <Flex
      style={{
        border: "1px solid #CDCEE3",
        background: "#F7F7FF",
        borderRadius: "11px",
      }}
      px={15}
      py={15}
      justify="space-between"
    >
      <Flex>
        <Stack justify="center">
          <img src={require("../../assets/testcard.png")} />
        </Stack>
        <Stack spacing={2} ml={20}>
          {/* First Row */}
          <Flex style={{ alignItems: "center" }}>
            <IconBook col="#3174F3" />
          </Flex>

          {!onRenameClick && (
            <Text fz={isMd ? 18 : 20} fw={500}>
              {props.test.name}
            </Text>
          )}
          {onRenameClick && (
            <NameEditor
              fileName={props.test.name}
              setOnRenameClicked={setOnRenameClicked}
              onRenameClick={props.onRenameClick}
            />
          )}

          <Flex align={"center"}>
            <Text w={"100%"} fz={isMd ? 11 : 12} fw={500} c={"#898989"}>
              Total Marks: {props.test.maxMarks} | Total Questions:{" "}
              {props.test.maxQuestions}
            </Text>
            <Flex>
              <Flex
                style={{ width: "60px", justifyContent: "space-evenly" }}
              ></Flex>
            </Flex>
          </Flex>
        </Stack>
      </Flex>
      <Stack
        style={{
          cursor: "pointer",
        }}
      >
        <EditMenu
          onDeleteClick={props.onDeleteClick}
          onRenameClick={() => {
            setOnRenameClicked(true);
          }}
          onDownloadClick={() => {
            downloadPdf(
              props.test._id,
              setLaoding,
              user,
              isReactNativeActive(),
              sendDataToReactnative,
              false,
              false,
              false,
              null
            );
          }}
        />
      </Stack>
    </Flex>
  );
}
export function AddContentForCourses(props: {
  setFileIds: (val: string[]) => void;
  setVideoIds: (val: string[]) => void;
  setTestids: (val: string[]) => void;
  setFolderIds: (val: string[]) => void;
  setNextBtnDisabled: (val: boolean) => void;
  setSelectedFolder: (courseFolder: CourseFolder) => void;
  isTestSeries: boolean;
  videos: CourseVideo[];
  folders: CourseFolder[];
  files: CourseFile[];
  tests: TestData[];
  setVideos: (val: any) => void;
  setFiles: (val: any) => void;
  setFolders: (val: any) => void;
  setTest: (val: any) => void;
  isCourseEdit: boolean;
  parentFolder?: CourseFolder;
  setParentFolder?: (val: React.SetStateAction<CourseFolder | null>) => void;
}) {
  const [selectedvalue, setSelectedValue] = useState<MenuItems | null>(null);
  const [state, setState] = useState<number>(0);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    scrollToTopLeft();
  }, []);

  useEffect(() => {
    const testIds = props.tests.map((x) => x._id);
    props.setTestids(testIds);
  }, [props.tests]);

  useEffect(() => {
    const videoIds = props.videos.map((x) => x._id);
    props.setVideoIds(videoIds);
  }, [props.videos]);

  useEffect(() => {
    console.log("hello");
    const fileIds = props.files.map((x) => x._id);
    props.setFileIds(fileIds);
  }, [props.files]);
  useEffect(() => {
    const folderIds = props.folders.map((x) => x._id);
    props.setFolderIds(folderIds);
  }, [props.folders]);

  function addNoteshandler(name: string, url: string) {
    setSelectedValue(null);
    createCourseFile({ name, url })
      .then((x: any) => {
        Mixpanel.track(WebAppEvents.COURSE_NOTES_ADDED, {
          type: props.isCourseEdit ? "edit" : "new",
        });
        if (props.parentFolder == null) {
          props.setFiles((prev: any) => [...prev, x]);
        } else {
          const folderId = props.parentFolder._id;
          const parentFolder = props.parentFolder;
          parentFolder.files.push(x);
          parentFolder.files = [...parentFolder.files];
          props.setFiles(parentFolder.files);
          updateCourseFolderContent({ folderId, parentFolder })
            .then((x: any) => {
              props.setNextBtnDisabled(false);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function addFolderhandler(name: string) {
    setSelectedValue(null);
    const createdAt = new Date(Date.now());
    const parentFolderId = props.parentFolder?._id;
    createCourseFolder({ name, createdAt, parentFolderId })
      .then((x: any) => {
        //mixpanel event need to be added
        if (props.parentFolder == null) {
          props.setFolders((prev: any) => [...prev, x]);
        } else {
          const folderId = props.parentFolder._id;
          const parentFolder = props.parentFolder;
          parentFolder.folders.push(x);
          parentFolder.folders = [...parentFolder.folders];
          props.setFolders(parentFolder.folders);
          updateCourseFolderContent({ folderId, parentFolder })
            .then((x: any) => {
              props.setNextBtnDisabled(false);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function addTestHanlder(test: any) {
    setSelectedValue(null);
    if (props.isTestSeries) {
      Mixpanel.track(WebAppEvents.TEST_SERIES_TEST_ADDED, {
        type: props.isCourseEdit ? "edit" : "new",
      });
    } else {
      Mixpanel.track(WebAppEvents.COURSE_TEST_ADDED, {
        type: props.isCourseEdit ? "edit" : "new",
      });
    }
    if (props.parentFolder == null) {
      props.setTest((prev: any) => [...prev, ...test]);
    } else {
      const folderId = props.parentFolder._id;
      const parentFolder = props.parentFolder;
      if (props.setParentFolder)
        props.setParentFolder((prev: any) => ({
          ...prev,
          tests: [...prev.tests, ...test],
        }));
      // parentFolder.tests.push(...test);

      updateCourseFolderContent({ folderId, parentFolder })
        .then((x: any) => {
          props.setNextBtnDisabled(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  function addVideoshandler(name: string, description: string, url: string) {
    setSelectedValue(null);
    createCoursevideo({ name, url, description })
      .then((x: any) => {
        Mixpanel.track(WebAppEvents.COURSE_VIDEO_ADDED, {
          type: props.isCourseEdit ? "edit" : "new",
        });

        if (props.parentFolder == null) {
          props.setVideos((prev: any) => [...prev, x]);
        } else {
          const folderId = props.parentFolder._id;
          const parentFolder = props.parentFolder;
          parentFolder.videos.push(x);
          parentFolder.videos = [...parentFolder.videos];
          props.setVideos(parentFolder.videos);
          updateCourseFolderContent({ folderId, parentFolder })
            .then((x: any) => {
              props.setNextBtnDisabled(false);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const [totalData, setTotalData] = useState<number>(
    props.files.length +
      props.tests.length +
      props.videos.length +
      props.folders.length
  );

  useEffect(() => {
    if (props.parentFolder != null) {
      props.parentFolder.files = props.files;
      props.parentFolder.videos = props.videos;
      props.parentFolder.tests = props.tests;
      props.parentFolder.folders = props.folders;
    }
    setTotalData(
      props.files.length +
        props.tests.length +
        props.videos.length +
        props.folders.length
    );
  }, [props.files, props.folders, props.videos, props.tests]);
  return (
    <>
      {totalData <= 0 && (
        <Stack h="60vh">
          <Center w="100%" h="100%">
            <Stack>
              <img
                src={require("./../../assets/emptyCourses.png")}
                width="70%"
                style={{
                  margin: "0 auto",
                }}
              />
              <Menu width="250px" position={isMd ? "top" : "bottom"}>
                <Menu.Target>
                  <Button
                    leftIcon={<IconPlus />}
                    bg="white"
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      color: "black",
                      borderRadius: "10px",
                    }}
                    color="black"
                    size={isMd ? "md" : "lg"}
                    sx={{
                      "&:hover": {
                        background: "white",
                      },
                    }}
                    px={isMd ? 5 : 60}
                    onClick={() => {
                      if (props.isTestSeries) {
                        setSelectedValue(MenuItems.TEST);
                      }
                    }}
                  >
                    Add {props.isTestSeries ? "Test" : "Content"}
                  </Button>
                </Menu.Target>
                {!props.isTestSeries && (
                  <Menu.Dropdown>
                    <MenuItem
                      val={MenuItems.FOLDER}
                      onClick={() => {
                        setSelectedValue(MenuItems.FOLDER);
                      }}
                    />
                    <MenuItem
                      val={MenuItems.VIDEO}
                      onClick={() => {
                        setSelectedValue(MenuItems.VIDEO);
                      }}
                    />

                    <MenuItem
                      val={MenuItems.NOTES}
                      onClick={() => {
                        setSelectedValue(MenuItems.NOTES);
                      }}
                    />
                    <MenuItem
                      val={MenuItems.TEST}
                      onClick={() => {
                        setSelectedValue(MenuItems.TEST);
                      }}
                    />
                  </Menu.Dropdown>
                )}
              </Menu>
            </Stack>
          </Center>
        </Stack>
      )}

      {totalData > 0 && (
        <Stack px={isMd ? 30 : 70} w={isMd ? "100%" : "60%"}>
          <Text fz={18} fw={700} color="#404040">
            {props.isTestSeries ? "Test" : "Contents"}
          </Text>
          {props.files.map((x, i) => {
            return (
              <SingleFileCard
                fileName={x.name}
                onDeleteClick={() => {
                  if (props.parentFolder != null) {
                    const folderId = props.parentFolder._id;
                    const parentFolder = props.parentFolder;
                    props.parentFolder.files.splice(i, 1);
                    props.setFiles([...props.parentFolder.files]);
                    updateCourseFolderContent({ folderId, parentFolder })
                      .then((x: any) => {
                        props.setNextBtnDisabled(false);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  } else {
                    props.files.splice(i, 1);
                    props.setFiles([...props.files]);
                    props.setNextBtnDisabled(false);
                  }
                }}
                onRenameClick={(name) => {
                  setisLoading(true);
                  UpdateFileName({ name, id: x._id })
                    .then((x: any) => {
                      if (props.parentFolder != null) {
                        props.parentFolder.files[i] = x;
                        props.setFiles([...props.parentFolder.files]);
                      } else {
                        props.setFiles((prev: any) => {
                          const prev1 = [...prev];
                          prev1[i] = x;
                          return prev1;
                        });
                      }
                      setisLoading(false);
                      props.setNextBtnDisabled(false);
                    })
                    .catch((e) => {
                      setisLoading(false);
                      console.log(e);
                    });
                }}
              />
            );
          })}
          {props.folders.map((x, i) => {
            return (
              <div
                onClick={() => {
                  setState((val) => val + 1);
                }}
              >
                <SingleFolderCard
                  folderName={x.name}
                  folderId={x._id}
                  onFolderCardClick={(courseFolder: CourseFolder) => {
                    props.setSelectedFolder(courseFolder);
                  }}
                  onDeleteClick={() => {
                    if (props.parentFolder != null) {
                      const folderId = props.parentFolder._id;
                      const parentFolder = props.parentFolder;
                      props.parentFolder.folders.splice(i, 1);
                      props.setFolders([...props.parentFolder.folders]);
                      updateCourseFolderContent({ folderId, parentFolder })
                        .then((x: any) => {
                          props.setNextBtnDisabled(false);
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    } else {
                      props.setFolders((prev: any) => {
                        const prev1 = [...prev];
                        prev1.splice(i, 1);
                        return prev1;
                      });
                      props.setNextBtnDisabled(false);
                    }
                  }}
                  onRenameClick={(courseFolder) => {
                    setisLoading(true);
                    updateCourseFolderContent({
                      folderId: x._id,
                      parentFolder: courseFolder,
                    })
                      .then((x: any) => {
                        props.setNextBtnDisabled(false);
                        props.setFolders((prev: any) => {
                          const prev1 = [...prev];
                          prev1[i].name = x.name;
                          return prev1;
                        });
                      })
                      .catch((err) => {});
                  }}
                />
              </div>
            );
          })}
          {props.tests.map((x, i) => {
            return (
              <SingleTestCard
                test={x}
                onDeleteClick={() => {
                  if (props.parentFolder != null) {
                    const folderId = props.parentFolder._id;
                    const parentFolder = props.parentFolder;
                    props.parentFolder.tests.splice(i, 1);
                    props.setTest([...props.parentFolder.tests]);
                    updateCourseFolderContent({ folderId, parentFolder })
                      .then((x: any) => {
                        props.setNextBtnDisabled(false);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  } else {
                    props.setTest((prev: any) => {
                      const prev1 = [...prev];
                      prev1.splice(i, 1);
                      return prev1;
                    });
                  }
                }}
                onRenameClick={(name) => {
                  setisLoading(true);
                  UpdateTestName({ name, id: x._id })
                    .then((x: any) => {
                      setisLoading(false);
                      props.setNextBtnDisabled(false);
                      if (props.parentFolder != null) {
                        props.parentFolder.tests[i] = x;
                        props.setTest([...props.parentFolder.tests]);
                      } else {
                        props.setTest((prev: any) => {
                          const prev1 = [...prev];
                          prev1[i] = x;
                          return prev1;
                        });
                      }
                    })
                    .catch((e) => {
                      setisLoading(false);
                      console.log(e);
                    });
                }}
              />
            );
          })}
          {props.videos.map((x, i) => {
            return (
              <SingleVideoCard
                fileName={x.name}
                description={x.description}
                onDeleteClick={() => {
                  if (props.parentFolder != null) {
                    const folderId = props.parentFolder._id;
                    const parentFolder = props.parentFolder;
                    props.parentFolder.videos.splice(i, 1);
                    props.setVideos([...props.parentFolder.videos]);
                    updateCourseFolderContent({ folderId, parentFolder })
                      .then((x: any) => {
                        props.setNextBtnDisabled(false);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  } else {
                    props.setVideos((prev: any) => {
                      const prev1 = [...prev];
                      prev1.splice(i, 1);
                      return prev1;
                    });
                  }
                }}
                onRenameClick={(name) => {
                  setisLoading(true);
                  UpdateCourseVideoName({ name, id: x._id })
                    .then((x: any) => {
                      setisLoading(false);
                      props.setNextBtnDisabled(false);
                      if (props.parentFolder != null) {
                        props.parentFolder.videos[i] = x;
                        props.setVideos([...props.parentFolder.videos]);
                      } else {
                        const arr = props.videos;
                        arr[i] = x;
                        props.setVideos([...arr]);
                      }
                    })
                    .catch((e) => {
                      setisLoading(false);
                      console.log(e);
                    });
                }}
              />
            );
          })}

          <Flex>
            <Menu width="250px" position={isMd ? "top" : "bottom"}>
              <Menu.Target>
                <Flex
                  align="center"
                  ml={15}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (props.isTestSeries) {
                      setSelectedValue(MenuItems.TEST);
                    }
                  }}
                >
                  <IconPlus color="#4B65F6" size={15} />
                  <Text fz={15} color="#4B65F6" fw={700}>
                    Add {props.isTestSeries ? "Test" : "Content"}
                  </Text>
                </Flex>
              </Menu.Target>
              {!props.isTestSeries && (
                <Menu.Dropdown ml={30}>
                  <MenuItem
                    val={MenuItems.VIDEO}
                    onClick={() => {
                      setSelectedValue(MenuItems.VIDEO);
                    }}
                  />
                  <MenuItem
                    val={MenuItems.NOTES}
                    onClick={() => {
                      setSelectedValue(MenuItems.NOTES);
                    }}
                  />
                  <MenuItem
                    val={MenuItems.FOLDER}
                    onClick={() => {
                      setSelectedValue(MenuItems.FOLDER);
                    }}
                  />
                  <MenuItem
                    val={MenuItems.TEST}
                    onClick={() => {
                      setSelectedValue(MenuItems.TEST);
                    }}
                  />
                </Menu.Dropdown>
              )}
            </Menu>
          </Flex>
          <Divider color="#CDCEE3" w="100%" />
        </Stack>
      )}

      <Modal
        opened={selectedvalue !== null}
        onClose={() => {
          setSelectedValue(null);
        }}
        centered
        title={`Add ${selectedvalue}`}
        size="auto"
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
        style={{
          zIndex: 9999,
        }}
      >
        {selectedvalue === MenuItems.VIDEO && (
          <AddVideoModal addVideo={addVideoshandler} />
        )}
        {selectedvalue === MenuItems.NOTES && (
          <AddNotesModal addNotes={addNoteshandler} />
        )}
        {selectedvalue === MenuItems.FOLDER && (
          <AddFolderModal
            addFolder={addFolderhandler}
            onCancelClick={() => {
              setSelectedValue(null);
            }}
          />
        )}
        {selectedvalue === MenuItems.TEST && (
          <AddTestModal
            addTestHandler={addTestHanlder}
            onCancelClick={() => {
              setSelectedValue(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
