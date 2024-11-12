import { Button, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassAndSubjectList } from "../../features/UserSubject/TeacherSubjectSlice";
import {
  createCourse,
  updateCourseContent,
} from "../../features/course/courseSlice";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { MyCoursesScreen } from "../../pages/_New/MyCoursesPage";
import { validateFile } from "../../pages/_New/PersonalizedTestQuestions";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { subjects } from "../../store/subjectsSlice";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { AddContentForCourses } from "./AddContentForCourses";
import { CourseBasicSettings } from "./CourseBasicSettings";
const subjectsActions = subjects.actions;

export enum AddCourseStep {
  BASIC = "Basic Settings",
  ADDCONTENT = "Add Content",
  INSIDEFOLDER = "Inside Folder",
}

function addMonthsToDate(n: number) {
  var currentDate = new Date();
  var futureDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + n,
    currentDate.getDate()
  );

  if (futureDate.getMonth() > 11) {
    futureDate.setFullYear(
      futureDate.getFullYear() + Math.floor(futureDate.getMonth() / 12)
    );
    futureDate.setMonth(futureDate.getMonth() % 12);
  }

  return futureDate;
}

function addYearsToDate(n: number) {
  var currentDate = new Date();
  var futureDate = new Date(
    currentDate.getFullYear() + n,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return futureDate;
}

export function AddNewTestScreen(props: {
  selectedScreen: MyCoursesScreen;
  isTestSeries: boolean;
  course: Course | null;
  isUpdateCourse: boolean;
  onExit: () => void;
  isCourseEdit: boolean;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [addcourseStep, setAddNewCourseStep] = useState<AddCourseStep>(
    AddCourseStep.BASIC
  );
  const [name, setname] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailFilename, setthumbnailFileName] = useState<string | null>(
    null
  );
  const [thumbnailFileUrl, setThumbnailFileUrl] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<CourseFolder | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [nextButtonDisabled, setNextBtnDisabled] = useState<boolean>(true);

  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (props.course) {
      setname(props.course.name);
      setDescription(props.course.description);
      setThumbnailFileUrl(props.course.thumbnail);
      setthumbnailFileName(props.course.thumbnailname);
      setSelectedPrice(props.course.price);
      setSelectedDiscount(props.course.discount);
      setValue("Set Expiry");
      setDateValue(new Date(props.course.validTill));
      setVideos(props.course.videos);
      setFiles(props.course.files);
      setFolders(props.course.folders);
      setTests(props.course.tests);
      setFreeSelected(props.course.isFree);
    }
  }, [props.course]);

  useEffect(() => {
    if (thumbnailFile)
      validateFile(thumbnailFile)
        .then((validatedFile: any) => {
          setthumbnailFileName(validatedFile.name);
          FileUpload({ file: validatedFile })
            .then((x) => {
              handleFileUpload({ url: x.url });
            })
            .catch((e) => {
              setThumbnailFile(null);
              setLoading(false);
              console.log(e);
            });
        })
        .catch((validationError) => {
          setThumbnailFile(null);
          setLoading(false);
          showNotification({
            message: validationError,
          });
        });
  }, [thumbnailFile]);

  function fetchList() {
    setLoading(true);
    fetchClassAndSubjectList()
      .then((data: any) => {
        const fetchedData: UserSubjectAPI[] = data;
        const segregatedData: UserClassAndSubjects[] = [];
        fetchedData.forEach((subject) => {
          const subjectEntry = {
            _id: subject._id,
            name: subject.name,
            chaptersCount: subject.chaptersCount,
            subjectId: subject.subjectId,
          };
          const found = segregatedData.findIndex(
            (x) => x.classId === subject.classId
          );
          if (found === -1) {
            segregatedData.push({
              classId: subject.classId,
              className: subject.className,
              classSortOrder: subject.classSortOrder,
              subjects: [subjectEntry],
              grade: subject.classgrade,
            });
          } else {
            segregatedData[found].subjects.push(subjectEntry);
          }
        });
        dispatch(
          subjectsActions.setUserSubjects(
            segregatedData.sort((a, b) => a.classSortOrder - b.classSortOrder)
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    if (userSubjects.length < 1) fetchList();
  }, []);

  function backClickHanlder() {
    if (addcourseStep === AddCourseStep.BASIC) {
      props.onExit();
    } else setAddNewCourseStep(AddCourseStep.BASIC);
  }
  function nextClickHandler() {
    if (addcourseStep === AddCourseStep.BASIC) {
      if (props.isTestSeries) {
        Mixpanel.track(WebAppEvents.TEST_SERIES_NEXT_BUTTON_CLICKED, {
          type: props.isCourseEdit ? "edit" : "new",
        });
      } else {
        Mixpanel.track(WebAppEvents.COURSE_NEXT_BUTTON_CLICKED, {
          type: props.isCourseEdit ? "edit" : "new",
        });
      }
      setAddNewCourseStep(AddCourseStep.ADDCONTENT);
    } else {
      if (props.isTestSeries) {
        Mixpanel.track(WebAppEvents.TEST_SERIES_SAVE_AND_CREATE_CLICKED, {
          type: props.isCourseEdit ? "edit" : "new",
        });
      } else {
        Mixpanel.track(WebAppEvents.COURSE_SAVE_AND_CREATE_CLICKED, {
          type: props.isCourseEdit ? "edit" : "new",
        });
      }
      if (!props.isUpdateCourse) {
        if (!props.isTestSeries) createcourse();
        else createTest();
      } else {
        updateCourse();
      }
    }
  }
  const [value, setValue] = useState<string>("Set Validity");
  const [validityValue, setValidityValue] = useState<number>(0);
  const [validityvalue1, setValidityValue1] = useState<string>("Year(s)");

  const today = new Date(Date.now());
  const [dateValue, setDateValue] = useState<Date | null>(today);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [freeSelected, setFreeSelected] = useState<boolean>(false);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [folderIds, setFolderIds] = useState<string[]>([]);
  const [testIds, setTestIds] = useState<string[]>([]);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );

  function createTest() {
    let date = null;
    if (value === "Set Validity") {
      if (validityvalue1 === "Year(s)") date = addYearsToDate(validityValue);
      else date = addMonthsToDate(validityValue);
    } else if (value === "Set Expiry") {
      date = dateValue;
    }
    createCourse({
      name: name,
      description: description,
      thumbnail: thumbnailFileUrl,
      price: selectedPrice,
      discount: selectedDiscount,
      tests: testIds,
      files: fileIds,
      videos: videoIds,
      folders: folderIds,
      date: date,
      createdAt: today,
      thumbnailname: thumbnailFilename ?? "",
      isFree: freeSelected,
      instituteId: instituteDetails?._id!!,
    })
      .then((x) => {
        props.onExit();
      })
      .catch((e) => {
        props.onExit();
        console.log(e);
      });
  }
  function createcourse() {
    let date = null;
    if (value === "Set Validity") {
      if (validityvalue1 === "Year(s)") date = addYearsToDate(validityValue);
      else date = addMonthsToDate(validityValue);
    } else if (value === "Set Expiry") {
      date = dateValue;
    }
    createCourse({
      name: name,
      description: description,
      thumbnail: thumbnailFileUrl,
      price: selectedPrice,
      discount: selectedDiscount,
      tests: testIds,
      files: fileIds,
      videos: videoIds,
      folders: folderIds,
      date: date,
      createdAt: today,
      thumbnailname: thumbnailFilename ?? "",
      isFree: freeSelected,
      instituteId: instituteDetails?._id!!,
    })
      .then((x) => {
        props.onExit();
      })
      .catch((e) => {
        props.onExit();
        console.log(e);
      });
  }

  function updateCourse() {
    if (props.course) {
      let date = null;
      if (value === "Set Validity") {
        if (validityvalue1 === "Year(s)") date = addYearsToDate(validityValue);
        else date = addMonthsToDate(validityValue);
      } else if (value === "Set Expiry") {
        date = dateValue;
      }
      updateCourseContent({
        name: name,
        description: description,
        thumbnail: thumbnailFileUrl,
        price: selectedPrice,
        discount: selectedDiscount,
        tests: testIds,
        files: fileIds,
        videos: videoIds,
        folders: folderIds,
        date: date,
        createdAt: today,
        thumbnailname: thumbnailFilename ?? "",
        courseId: props.course?._id,
        isFree: freeSelected,
      })
        .then((x) => {
          props.onExit();
        })
        .catch((e) => {
          props.onExit();
          console.log(e);
        });
    }
  }

  function CourseDurationValid() {
    if (value === "Set Validity") {
      if (validityValue > 0) return true;
    } else if (value === "Set Expiry") {
      if (dateValue !== null) return true;
    } else if (value === "Lifetime Validity") {
      return true;
    }
    return false;
  }
  const isDiscountInValid = selectedPrice - selectedDiscount < 0;
  const isInputValid =
    name !== "" &&
    description !== "" &&
    CourseDurationValid() &&
    (freeSelected ? true : selectedPrice > 0 && !isDiscountInValid);

  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [tests, setTests] = useState<TestData[]>([]);
  const [folders, setFolders] = useState<CourseFolder[]>([]);
  function handleFileUpload(data: {
    url: string;
    fileName?: string;
    mimeType?: string;
  }) {
    setThumbnailFileUrl(data.url);
    setLoading(false);
    if (data.fileName) setthumbnailFileName(data.fileName);
  }
  return (
    <>
      <Stack>
        <Stack spacing={0} mb={100}>
          <Stack px={isMd ? 20 : 70} pt={30} spacing={1}>
            <Text fz={32} fw={700} color="#454545">
              New {props.isTestSeries ? "Test" : "Course"}
            </Text>
            <Text fz={20} fw={500} color="#5F5F5F">
              Create and share your own {props.isTestSeries ? "Test" : "Course"}
            </Text>
          </Stack>
          <Stack>
            <Stack px={isMd ? 20 : 70} pt={20} spacing={5}>
              <Group spacing={"xs"} align="center">
                <Text
                  c={"white"}
                  w={20}
                  h={20}
                  fz={13}
                  bg={
                    addcourseStep === AddCourseStep.BASIC
                      ? "#3174F3"
                      : "#BABABA"
                  }
                  p={5}
                  style={{
                    display: "inline-flex",
                    borderRadius: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  1
                </Text>
                <Text
                  fw={addcourseStep === AddCourseStep.BASIC ? 600 : 400}
                  fz={isMd ? 12 : 16}
                >
                  {AddCourseStep.BASIC}
                </Text>
                <Divider size={2} c={"#ABABAB"} w={"7%"}></Divider>
                <Text
                  c={"white"}
                  w={20}
                  h={20}
                  fz={13}
                  bg={
                    addcourseStep === AddCourseStep.ADDCONTENT
                      ? "#3174F3"
                      : "#BABABA"
                  }
                  p={5}
                  style={{
                    display: "inline-flex",
                    borderRadius: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  2
                </Text>
                <Text
                  fw={addcourseStep === AddCourseStep.ADDCONTENT ? 600 : 400}
                  fz={isMd ? 12 : 16}
                >
                  {AddCourseStep.ADDCONTENT}
                </Text>
              </Group>
            </Stack>
            <Divider c={"#ABABAB"} size={2} mt={20} />
            {addcourseStep === AddCourseStep.BASIC && (
              <CourseBasicSettings
                dateValue={dateValue}
                description={description}
                isDiscountInValid={isDiscountInValid}
                isTestSeries={props.isTestSeries}
                name={name}
                selectedDiscount={selectedDiscount}
                selectedPrice={selectedPrice}
                setDescription={setDescription}
                setDateValue={setDateValue}
                setLoading={setLoading}
                setSelectedDiscount={setSelectedDiscount}
                setSelectedPrice={setSelectedPrice}
                setThumbnailFile={setThumbnailFile}
                setthumbnailFileName={setthumbnailFileName}
                setThumbnailFileUrl={setThumbnailFileUrl}
                setValidityValue={setValidityValue}
                setValidityValue1={setValidityValue1}
                setValue={setValue}
                setname={setname}
                thumbnailFile={thumbnailFile}
                thumbnailFileUrl={thumbnailFileUrl}
                thumbnailFilename={thumbnailFilename}
                userSubjects={userSubjects}
                validityValue={validityValue}
                validityvalue1={validityvalue1}
                value={value}
                handleFileUpload={handleFileUpload}
                isFreeCourseSelected={freeSelected}
                setfreeCourseSelected={setFreeSelected}
              />
            )}
            {addcourseStep === AddCourseStep.ADDCONTENT && (
              <AddContentForCourses
                setFileIds={setFileIds}
                setTestids={setTestIds}
                setVideoIds={setVideoIds}
                setFolderIds={setFolderIds}
                setSelectedFolder={(courseFolder: CourseFolder) => {
                  setAddNewCourseStep(AddCourseStep.INSIDEFOLDER);
                  setSelectedFolder(courseFolder);
                }}
                setNextBtnDisabled={setNextBtnDisabled}
                isTestSeries={props.isTestSeries}
                setFiles={setFiles}
                setTest={setTests}
                setVideos={setVideos}
                videos={videos}
                files={files}
                folders={folders}
                setFolders={setFolders}
                tests={tests}
                isCourseEdit={props.isCourseEdit}
              />
            )}

            {addcourseStep === AddCourseStep.INSIDEFOLDER &&
              selectedFolder != null && (
                //in this there is no need of set file etc ids as we are already creating them
                <AddContentForCourses
                  setFileIds={(val: string[]) => {}}
                  setTestids={(val: string[]) => {}}
                  setVideoIds={(val: string[]) => {}}
                  setFolderIds={(val: string[]) => {}}
                  setSelectedFolder={(courseFolder: CourseFolder) => {
                    setAddNewCourseStep(AddCourseStep.INSIDEFOLDER);
                    setSelectedFolder(courseFolder);
                  }}
                  setNextBtnDisabled={setNextBtnDisabled}
                  setFiles={setFiles}
                  setTest={setTests}
                  setVideos={setVideos}
                  setFolders={setFolders}
                  isTestSeries={props.isTestSeries}
                  videos={selectedFolder.videos}
                  files={selectedFolder.files}
                  folders={selectedFolder.folders}
                  tests={selectedFolder.tests}
                  isCourseEdit={props.isCourseEdit}
                  parentFolder={selectedFolder}
                  setParentFolder={setSelectedFolder}
                />
              )}
          </Stack>
        </Stack>
        <Flex
          style={{
            position: "fixed",
            bottom: isMd ? 60 : 0,
            width: "100%",
            height: "77px",
            background: "#F7F7FF",
            borderTop: "1px solid #DEDEE5",
            zIndex: 99,
          }}
          align="center"
          justify="center"
        >
          <Button
            leftIcon={<IconArrowNarrowLeft color="black" size={30} />}
            size="lg"
            variant="outline"
            style={{
              border: "1px solid #808080",
              color: "#000000",
            }}
            mr={20}
            px={30}
            fz={18}
            onClick={() => {
              backClickHanlder();
            }}
          >
            Back
          </Button>
          <Button
            size="lg"
            bg="#4B65F6"
            fz={18}
            rightIcon={<IconArrowNarrowRight color="white" size={30} />}
            style={{
              color: "white",
            }}
            px={30}
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              nextClickHandler();
            }}
            disabled={
              addcourseStep === AddCourseStep.BASIC
                ? !isInputValid
                : !isInputValid ||
                  (addcourseStep === AddCourseStep.ADDCONTENT &&
                    testIds.length +
                      fileIds.length +
                      videoIds.length +
                      folderIds.length <=
                      0) ||
                  (addcourseStep === AddCourseStep.INSIDEFOLDER &&
                    nextButtonDisabled)
            }
          >
            {addcourseStep === AddCourseStep.BASIC ? "Next" : "Save & Create"}
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
