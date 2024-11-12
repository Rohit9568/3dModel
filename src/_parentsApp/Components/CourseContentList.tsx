import { Button, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
import { useEffect, useState } from "react";
import { getCourseFolderById } from "../../features/course/courseSlice";

enum CourseContentType {
  VIDEO,
  NOTES,
  TEST,
  FOLDER,
}

export function FolderViewWithDropdown(props: {
  onClick: (isOpen: boolean) => void;
  hasParentFolder: boolean;
  courseFolder: CourseFolder;
  indexString: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(props.courseFolder.isOpen ? true : false);
  }, []);

  return (
    <Stack
      pl={18}
      style={{
        backgroundColor: isOpen ? "#4b65f61a" : "white",
        cursor: "pointer",
      }}
      spacing={0}
      onClick={() => {
        props.onClick(!isOpen);
        setIsOpen(!isOpen);
      }}
      pb={10}
      w={"100%"}
    >
      <Flex justify="space-between" align="center" pr={20}>
        <Flex align="center" gap={20}>
          <Text>{`${props.indexString} `}</Text>
          <Stack spacing={0} py={10}>
            <Text fz={18} fw={isOpen ? 700 : 400}>
              {props.courseFolder.name}
            </Text>
          </Stack>
        </Flex>

        {!isOpen && (
          <IconChevronDown
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
        {isOpen && (
          <IconChevronUp
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </Flex>
    </Stack>
  );
}

export function FileAndTestView(props: {
  onClick: () => void;
  courseContentType: number;
  indexString: string;
  isSelected?: boolean;
  video?: CourseVideo;
  file?: CourseFile;
  test?: TestWithAnswerSheet;
  testStatus?: string;
}) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [btnText, setBtnText] = useState<string>("");

  useEffect(() => {
    if (props.courseContentType == CourseContentType.VIDEO) {
      setTitle(props.video?.name ?? "");
      setDescription("Video");
      setBtnText("");
    } else if (props.courseContentType == CourseContentType.NOTES) {
      setTitle(props.file?.name ?? "");
      setDescription("Notes");
      setBtnText("View File");
    } else if (props.courseContentType == CourseContentType.TEST) {
      setTitle(props.test?.name ?? "");
      setDescription("Test");
      setBtnText(props.testStatus!!);
    }
  }, []);

  return (
    <Stack
      pl={18}
      style={{
        backgroundColor: props.isSelected == true ? "#00051f4d" : "white",
        cursor: "pointer",
      }}
      spacing={0}
      onClick={() => {
        props.onClick();
      }}
      w={"100%"}
    >
      <Flex justify="space-between" pr={20}>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Text>{`${props.indexString} `}</Text>
            <Stack spacing={0} py={6} ml={20}>
              <Text fz={18} fw={400}>
                {title}
              </Text>
              <Text fz={14} fw={400} color="#00000073">
                {description}
              </Text>
            </Stack>
          </Flex>

          {btnText.length > 0 && (
            <Button
              variant="default"
              styles={(theme) => ({
                root: {
                  borderColor: "#000000",
                  height: 28,
                  fontWeight: 700,
                  borderRadius: 4,
                  paddingLeft: 10,
                  paddingRight: 10,
                },
              })}
            >
              {btnText}
            </Button>
          )}
        </Flex>
      </Flex>
    </Stack>
  );
}

export function CourseContentList(props: {
  course: Course;
  onViewVideoClicked: (courseVideo: CourseVideo) => void;
  onViewNotesClicked: (courseFile: CourseFile) => void;
  onViewOrTakeTestClicked: (courseFile: any, isChecked: boolean) => void;
  studentGivenTests: any;
}) {
  const [refreshView, setRefreshView] = useState<boolean>(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);

  const [courseContentList, setCourseContentList] = useState<
    CourseContentListModel[]
  >([]);

  useEffect(() => {
    makeContentList(0, props.course);
    setRefreshView(true);
  }, [courseContentList, setCourseContentList]);

  function makeContentList(
    level: number,
    course?: Course,
    folder?: CourseFolder,
    parentFolderIndexString?: string
  ) {
    const videos = folder == null ? course!!.videos : folder.videos;
    const folders = folder == null ? course!!.folders : folder.folders;
    const notes = folder == null ? course!!.files : folder.files;
    const tests = folder == null ? course!!.tests : folder.tests;

    const levelWiseCourseContentList: CourseContentListModel[] = [];
    var folderOffset = 0;

    folders.map((item, index) => {
      const listObj: CourseContentListModel = {
        type: CourseContentType.FOLDER,
        indexString: makeIndexString(
          levelWiseCourseContentList.length + index,
          level,
          parentFolderIndexString
        ),
        folder: item,
        parentFolder: folder,
      };
      courseContentList.push(listObj);
      folderOffset++;
      if (
        item != null &&
        item?.hasAllItemsFetched == true &&
        item?.isOpen == true
      ) {
        makeContentList(level + 1, undefined, item, listObj.indexString);
      }
    });

    levelWiseCourseContentList.push(
      ...videos.map((item, index) => {
        const listObj: CourseContentListModel = {
          type: CourseContentType.VIDEO,
          indexString: makeIndexString(
            levelWiseCourseContentList.length + index + folderOffset,
            level,
            parentFolderIndexString
          ),
          video: item,
          parentFolder: folder,
        };
        if (index == 0) setSelectedItemIndex(index);
        return listObj;
      })
    );

    levelWiseCourseContentList.push(
      ...notes.map((item, index) => {
        const listObj: CourseContentListModel = {
          type: CourseContentType.NOTES,
          indexString: makeIndexString(
            levelWiseCourseContentList.length + index + folderOffset,
            level,
            parentFolderIndexString
          ),
          file: item,
          parentFolder: folder,
        };
        return listObj;
      })
    );
    levelWiseCourseContentList.push(
      ...tests.map((item, index) => {
        const listObj: CourseContentListModel = {
          type: CourseContentType.TEST,
          indexString: makeIndexString(
            levelWiseCourseContentList.length + index + folderOffset,
            level,
            parentFolderIndexString
          ),
          test: item,
          parentFolder: folder,
        };
        return listObj;
      })
    );

    if (folder && levelWiseCourseContentList.length > 0) {
      levelWiseCourseContentList[
        levelWiseCourseContentList.length - 1
      ].isLastChildOfParent = true;
    }
    if (levelWiseCourseContentList.length > 0)
      courseContentList.push(...levelWiseCourseContentList);
  }

  function makeIndexString(
    relativeIndexWrtLevel: number,
    level: number,
    parentIndexString?: string
  ): string {
    var indexString = "";
    if (level != 0) {
      indexString = parentIndexString + "" + (relativeIndexWrtLevel + 1) + ".";
    } else {
      indexString = relativeIndexWrtLevel + 1 + ".";
    }

    console.log(indexString);
    return indexString;
  }

  function updateCourseFolderStructure(
    item: CourseContentListModel,
    isOpen: boolean
  ) {
    item.folder!!.isOpen = isOpen;

    if (item.parentFolder == null) {
      props.course.folders = props.course.folders.map((internalItem) => {
        return internalItem._id == item.folder?._id
          ? item.folder
          : internalItem;
      });
    } else {
      item.parentFolder.folders = item.parentFolder.folders.map(
        (internalItem) => {
          return internalItem._id == item.folder?._id
            ? item.folder
            : internalItem;
        }
      );
    }
  }

  return (
    <>
      {refreshView == true && (
        <>
          {courseContentList.map((item, index) => {
            if (item.type == CourseContentType.VIDEO) {
              return (
                <Flex
                  style={{
                    borderBottom: item.isLastChildOfParent
                      ? "solid A3A3A3 1px"
                      : "solid red 0px",
                  }}
                >
                  <FileAndTestView
                    onClick={() => {
                      props.onViewVideoClicked(item.video!!);
                      setSelectedItemIndex(index);
                    }}
                    courseContentType={item.type}
                    indexString={item.indexString}
                    video={item.video}
                    isSelected={selectedItemIndex == index}
                  />
                </Flex>
              );
            } else if (item.type == CourseContentType.NOTES) {
              return (
                <Flex
                  style={{
                    borderBottom: item.isLastChildOfParent
                      ? "solid #A3A3A3 1px"
                      : "solid red 0px",
                  }}
                >
                  <FileAndTestView
                    onClick={() => {
                      setCourseContentList([]);
                      props.onViewNotesClicked(item.file!!);
                    }}
                    courseContentType={item.type}
                    indexString={item.indexString}
                    file={item.file}
                  />
                </Flex>
              );
            } else if (item.type == CourseContentType.TEST) {
              let testStatus = "View Test";
              if (props.studentGivenTests) {
                const found = props.studentGivenTests.find((test: any) => {
                  return test.testId === item.test?._id;
                });
                if (found) {
                  if (found.answerSheetId.isChecked) {
                    testStatus = "View Report";
                  } else {
                    testStatus = "View Response";
                  }
                } else {
                  testStatus = "Take Test";
                }
              }
              return (
                <Flex
                  style={{
                    borderBottom: item.isLastChildOfParent
                      ? "solid A3A3A3 1px"
                      : "solid red 0px",
                  }}
                >
                  <FileAndTestView
                    onClick={() => {
                      props.onViewOrTakeTestClicked(
                        item.test,
                        testStatus == "Take Test" || testStatus === "View Test"
                          ? false
                          : true
                      );
                    }}
                    courseContentType={item.type}
                    indexString={item.indexString}
                    test={item.test}
                    testStatus={testStatus}
                  />
                </Flex>
              );
            } else if (item.type == CourseContentType.FOLDER) {
              return (
                <Flex
                  style={{
                    borderBottom: item.isLastChildOfParent
                      ? "solid A3A3A3 1px"
                      : "solid red 0px",
                  }}
                >
                  <FolderViewWithDropdown
                    onClick={(isOpen) => {
                      if (
                        isOpen &&
                        item.folder != null &&
                        item.folder!!.hasAllItemsFetched != true
                      ) {
                        getCourseFolderById(item.folder!!._id)
                          .then((x: any) => {
                            item.folder = x;
                            item.folder!!.hasAllItemsFetched = true;
                            updateCourseFolderStructure(item, isOpen);
                            setRefreshView(false);
                            setCourseContentList([]);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        updateCourseFolderStructure(item, isOpen);
                        setRefreshView(false);
                        setCourseContentList([]);
                      }
                    }}
                    hasParentFolder={false}
                    courseFolder={item.folder!!}
                    indexString={item.indexString}
                  />
                </Flex>
              );
            }
          })}
        </>
      )}
    </>
  );
}
