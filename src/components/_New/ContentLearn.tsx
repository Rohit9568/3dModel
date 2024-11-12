import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
import { marked } from "marked";
import { SimulationPage } from "../../pages/DetailsPages/SimulationPage";
import { VideoPage } from "../../pages/DetailsPages/VideoPage";
import { Pages, Tabs } from "../../pages/_New/Teach";
import { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import TurndownService from "turndown";
import "suneditor/dist/css/suneditor.min.css";
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  lineHeight,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  image,
  link,
} from "suneditor/src/plugins";
import { FileUploadAndViewCard } from "./FileUplaodCard";
import { Introduction } from "./Introduction";
import { AddTheorytoUserTopic } from "../../features/UserSubject/chapterDataSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { MindMap } from "./MindMap";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import {
  addStylingToImage,
  addTableBorder,
  base64StringToBlob,
  convertClassToClassName,
  extractBase64Images,
  extractBase64StringsFromString,
  isHTML,
  reduceImageScaleAndAlignLeft,
} from "../../utilities/HelperFunctions";
import { EditIcon } from "../_Icons/CustonIcons";
import { IconChevronDown, IconChevronRight } from "@tabler/icons";
import {
  fetchEasyTheoryByTopicId,
  fetchExamplesByTopicId,
  fetchHardTheoryByTopicId,
} from "../../features/topic/topicSlice";
import { isLoading } from "../../store/loadingStateSlice";

const useStyles = createStyles((theme) => ({
  heading: {
    color: "#3174F3",
    fontSize: "30px",
    fontWeight: 600,
  },
  modal: {
    background: "white",
  },
}));

enum TheoryLevel {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}
interface HtmlEditProps {
  topicDetail: SingleTopic;
  onClose: () => void;
  onUpdateTopic: (id: string, data: SingleTopic) => void;
  chapterId: string;
  setloadingData: (val: boolean) => void;
  examples: string;
  isLoading: boolean;
  setAddMoreExamplesPressed: (val: boolean) => void;
  setonCloseClick: (val: boolean) => void;
  editorContent: string;
  setEditorContent: (val: string) => void;
}

export function HtmlEdit(props: HtmlEditProps) {
  const [onDataUpload, setUpload] = useState(false);

  const [firstTime, setFirstTime] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(()=>{
  //   props.setonCloseClick(false)
  // },[])

  useEffect(() => {
    if (onDataUpload === true) {
      var string1;
      string1 = addTableBorder(props.editorContent);
      string1 = addStylingToImage(string1);
      string1 = convertClassToClassName(string1);
      uploadData(string1);
    }
  }, [onDataUpload, props.editorContent]);

  async function uploadData(htmlString: string) {
    if (props.topicDetail) {
      props.setloadingData(true);
      await AddTheorytoUserTopic({
        id: props.topicDetail._id,
        chapterId: props.chapterId,
        theory: htmlString,
      })
        .then((data: any) => {
          props.setloadingData(false);
          Mixpanel.track(
            WebAppEvents.TEACHER_APP_LEARN_PAGE_EDIT_THEORY_DIALOG_BOX_SUBMIT_CLICKED
          );
          if (props.examples !== "") props.setAddMoreExamplesPressed(true);
          props.onUpdateTopic(props.topicDetail._id, data);
          setUpload(false);
        })
        .catch((error) => {
          props.setloadingData(false);
          console.log(error);
          props.setloadingData(false);
        });
    }
  }
  async function formHandler(event: any) {
    setIsLoading(true);

    showNotification({ message: "Theory Edited SuccessFully" });
    event.preventDefault();
    const images = extractBase64StringsFromString(props.editorContent);
    props.setloadingData(true);
    for (let i = 0; i < images.length; i++) {
      const blob = base64StringToBlob(images[i], "image.png");
      await FileUpload({ file: blob })
        .then((data) => {
          const prev1 = props.editorContent.replace(images[i], data.url);
          props.setloadingData(false);
          props.setEditorContent(prev1);
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        })
        .catch((error) => {
          props.setloadingData(false);
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
          console.error(error);
        });
    }
    setUpload(true);
    props.onClose();
  }
  function handleChange(content: any) {
    if (firstTime) {
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_LEARN_PAGE_EDIT_THEORY_DIALOG_BOX_NEW_THEORY_TYPED
      );
      setFirstTime(false);
    }
    props.setEditorContent(content);
  }
  return (
    <Flex direction="column" w="100%">
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={formHandler}>
        <Stack>
          <div
            style={{
              height: "100%",
              // border:'red solid 1px'
            }}
          >
            <SunEditor
              autoFocus={true}
              lang="en"
              setOptions={{
                showPathLabel: false,
                minHeight: "40vh",
                maxHeight: "40vh",
                width: "100%",
                placeholder: "Enter your text here!!!",
                plugins: [
                  align,
                  font,
                  fontColor,
                  fontSize,
                  formatBlock,
                  hiliteColor,
                  horizontalRule,
                  lineHeight,
                  list,
                  paragraphStyle,
                  table,
                  template,
                  textStyle,
                  image,
                  link,
                ],
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize", "formatBlock"],
                  ["paragraphStyle"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  ["fontColor", "hiliteColor"],
                  ["removeFormat"],
                  "/",
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["table", "link", "image"],
                ],
                formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
                font: [
                  "Arial",
                  "Calibri",
                  "Comic Sans",
                  "Courier",
                  "Garamond",
                  "Georgia",
                  "Impact",
                  "Lucida Console",
                  "Palatino Linotype",
                  "Segoe UI",
                  "Tahoma",
                  "Times New Roman",
                  "Trebuchet MS",
                ],
                imageResizing: true,
              }}
              onChange={handleChange}
              setContents={props.editorContent}

              // getSunEditorInstance={}
            />
          </div>
          <Flex justify="center">
            <Button
              disabled={props.editorContent == null || props.isLoading}
              type="submit"
              my={15}
              ta="center"
              size="lg"
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Flex>
  );
}
interface MarkdownEditProps {
  topicDetail: SingleTopic;
  onClose: () => void;
  onUpdateTopic: (id: string, data: SingleTopic) => void;
  chapterId: string;
  setloadingData: (val: boolean) => void;
}
export function MarkdownEdit(props: MarkdownEditProps) {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [onDataUpload, setUpload] = useState(false);
  const [editorContent1, setEditorContent1] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  useEffect(() => {
    if (onDataUpload === true && editorContent1 !== null) {
      uploadData(editorContent1);
    }
  }, [onDataUpload, editorContent1]);
  useEffect(() => {
    if (markdownContent !== null) {
      setEditorContent1(markdownContent);
    }
  }, [markdownContent]);
  useEffect(() => {
    if (props.topicDetail !== undefined)
      setMarkdownContent(props.topicDetail.theory);
  }, [props.topicDetail.theory]);

  function handleChange(content: any) {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(content);
    setMarkdownContent(markdown);
  }
  async function uploadData(htmlString: string) {
    if (props.topicDetail) {
      await AddTheorytoUserTopic({
        id: props.topicDetail._id,
        chapterId: props.chapterId,
        theory: htmlString,
      })
        .then((data: any) => {
          setLoadingData(false);
          props.onUpdateTopic(props.topicDetail._id, data);
          setUpload(false);
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
    }
  }
  async function formHandler(event: any) {
    event.preventDefault();
    const images = extractBase64Images(markdownContent ?? "");
    setLoadingData(true);
    for (let i = 0; i < images.length; i++) {
      const blob = base64StringToBlob(images[i], "image.png");
      await FileUpload({ file: blob })
        .then((data) => {
          setMarkdownContent((prev) => {
            if (prev !== null) {
              const prev1 = prev.replace(images[i], data.url);
              return prev1;
            }
            return "";
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setUpload(true);
    props.onClose();
  }

  return (
    <Flex direction="column">
      <Text fz={20} fw={700} mb={10}>
        Edit Theory :
      </Text>

      <form onSubmit={formHandler}>
        <Stack>
          {editorContent1 !== "" && editorContent1 !== null && (
            <SunEditor
              autoFocus={true}
              lang="en"
              setOptions={{
                showPathLabel: false,
                minHeight: "50vh",
                maxHeight: "50vh",
                width: "100%",
                placeholder: "Enter your text here!!!",
                plugins: [
                  align,
                  font,
                  fontColor,
                  fontSize,
                  formatBlock,
                  hiliteColor,
                  horizontalRule,
                  lineHeight,
                  list,
                  paragraphStyle,
                  table,
                  template,
                  textStyle,
                  image,
                  link,
                ],
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize", "formatBlock"],
                  ["paragraphStyle"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  ["fontColor", "hiliteColor"],
                  ["removeFormat"],
                  "/",
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["table", "link", "image"],
                ],
                formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
                font: [
                  "Arial",
                  "Calibri",
                  "Comic Sans",
                  "Courier",
                  "Garamond",
                  "Georgia",
                  "Impact",
                  "Lucida Console",
                  "Palatino Linotype",
                  "Segoe UI",
                  "Tahoma",
                  "Times New Roman",
                  "Trebuchet MS",
                ],
                imageResizing: true,
              }}
              onChange={handleChange}
              setContents={editorContent1}
            />
          )}

          <Flex justify="center">
            <Button type="submit" my={15} ta="center" size="lg">
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Flex>
  );
}

interface ContentLearnProps {
  topicDetail: SingleTopic | null;
  currentTab: Tabs;
  currentChapter: SingleChapter;
  onUpdateTopic: (id: string, data: SingleTopic) => void;
  OnNotesUplaod: (name: string, url: string) => void;
  OnLessonPlanUpload: (name: string, url: string) => void;
  OnUpdateTestStatus: (testTaken: boolean, isFirstTime: boolean) => void;
  OnTopicClick: (topicId: string) => void;
  currentSubject: SingleSubject;
  setLoadingData: (data: boolean) => void;
  introductionSelected: boolean;
}
export function ContentLearn(props: ContentLearnProps) {
  const { classes } = useStyles();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>(
    props?.topicDetail?.videos ?? []
  );
  const [animatedVideos, setanimatedVideos] = useState<string[]>(
    props?.topicDetail?.animatedVideos ?? []
  );
  const [theoryToBeShown, setTheoryTobeShown] = useState<string>("");
  const isMd = useMediaQuery(`(max-width: 500px)`);

  const chapterId = useSelector<RootState, string | null>((state) => {
    return state.currentSelectionSlice.chapterId;
  });
  const currentChapter = useSelector<RootState, SingleChapter>((state) => {
    return state.chapterSlice.currentChapter;
  });

  const markdownText = `${theoryToBeShown ?? ""}`;
  const htmlText = marked(markdownText);
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlText;
  const images = tempElement.querySelectorAll("img");
  images.forEach((image) => {
    image.setAttribute("width", "300");
    image.setAttribute("height", "250");
  });
  const modifiedHtml = tempElement.innerHTML;

  useEffect(() => {
    if (props.topicDetail !== null) {
      setYoutubeVideos(props.topicDetail?.videos);
      setanimatedVideos(props.topicDetail?.animatedVideos);
      currentChapter.topics.map((x) => {
        if (x._id !== props.topicDetail?._id) {
          if (x.videos && x.videos.length !== 0) {
            setYoutubeVideos((prev) => [...prev, ...x.videos]);
          }
          if (x.animatedVideos && x.animatedVideos.length !== 0) {
            setanimatedVideos((prev) => [...prev, ...x.animatedVideos]);
          }
        }
      });
    }
  }, [props.topicDetail]);

  const TheoryEdit = (
    <>
      <Modal
        opened={showEdit}
        onClose={() => setShowEdit(false)}
        style={{ padding: 0 }}
        withCloseButton={false}
        classNames={{
          modal: classes.modal,
        }}
        size={isMd ? "lg" : "xl"}
      >
        {/* {props.topicDetail !== null && isHTML(theoryToBeShown) && chapterId && (
          <HtmlEdit
            topicDetail={props.topicDetail}
            onClose={() => {
              setShowEdit(false);
            }}
            onUpdateTopic={props.onUpdateTopic}
            chapterId={chapterId}
          />
        )}
        {props.topicDetail !== null &&
          !isHTML(theoryToBeShown) &&
          chapterId && (
            <MarkdownEdit
              topicDetail={props.topicDetail}
              onClose={() => {
                setShowEdit(false);
              }}
              onUpdateTopic={props.onUpdateTopic}
              chapterId={chapterId}
              setloadingData={}
            />
          )} */}
      </Modal>
    </>
  );
  const [theoryLevels, setTheoryLevels] = useState<string | null>(
    TheoryLevel.MEDIUM
  );
  const [examples, setExamples] = useState<string | null>(null);
  const data = [TheoryLevel.EASY, TheoryLevel.MEDIUM, TheoryLevel.HARD];

  useEffect(() => {
    setExamples(null);
    if (theoryLevels === TheoryLevel.MEDIUM && props.topicDetail?.theory) {
      setTheoryTobeShown(props.topicDetail.theory);
    } else setTheoryLevels(TheoryLevel.MEDIUM);
  }, [props.topicDetail]);

  useEffect(() => {
    if (props.topicDetail) {
      if (theoryLevels === TheoryLevel.EASY) {
        props.setLoadingData(true);
        fetchEasyTheoryByTopicId({
          _id: props.topicDetail.topicId,
          subjectName: props.currentSubject.name,
          className: props.currentSubject.className,
          chapterName: props.currentChapter.name,
        })
          .then((x: any) => {
            props.setLoadingData(false);
            setTheoryTobeShown(x);
          })
          .catch((e) => {
            props.setLoadingData(false);
            console.log(e);
          });
      } else if (theoryLevels === TheoryLevel.MEDIUM) {
        setTheoryTobeShown(props.topicDetail.theory);
      } else if (theoryLevels === TheoryLevel.HARD) {
        props.setLoadingData(true);
        fetchHardTheoryByTopicId({
          _id: props.topicDetail.topicId,
          subjectName: props.currentSubject.name,
          className: props.currentSubject.className,
          chapterName: props.currentChapter.name,
        })
          .then((x: any) => {
            props.setLoadingData(false);
            setTheoryTobeShown(x);
          })
          .catch((e) => {
            props.setLoadingData(false);
            console.log(e);
          });
      }
    }
  }, [theoryLevels]);

  function addMoreExamplesHandler() {
    props.setLoadingData(true);
    Mixpanel.track(
      WebAppEvents.TEACHER_APP_LEARN_PAGE_ADD_MORE_EXAMPLES_CLICKED
    );
    if (props.topicDetail)
      fetchExamplesByTopicId({
        _id: props.topicDetail.topicId,
        subjectName: props.currentSubject.name,
        className: props.currentSubject.className,
        chapterName: props.currentChapter.name,
      })
        .then((x: any) => {
          props.setLoadingData(false);
          setExamples(x);
        })
        .catch((e) => {
          props.setLoadingData(false);
          console.log(e);
        });
  }

  return (
    <Box w={"95%"} pl={10} h="100%">
      {props.currentTab === Tabs.Topics && !props.introductionSelected && (
        <>
          {TheoryEdit}
          <Text className={classes.heading} mb={30}>
            Simulations
          </Text>
          {props.topicDetail && (
            <SimulationPage
              page={Pages.Teach}
              topic={props.topicDetail}
              onUpdateTopic={() => {}}
              isActivity={false}
            />
          )}

          <Divider size={2} mt={40} mb={35} />
          <>
            <Group>
              <Text fw={700} fz={"1.2em"}>
                {props.topicDetail?.name}
              </Text>
              <Select
                rightSection={
                  <IconChevronDown
                    size="20px"
                    style={{
                      cursor: "pointer",
                    }}
                    color="#3174F3"
                  />
                }
                styles={{
                  rightSection: { pointerEvents: "none" },
                  input: {
                    border: "#3174F3 1px solid",
                    color: "#3174F3",
                    fontWeight: 600,
                    fontSize: 16,
                  },
                }}
                w="120px"
                value={theoryLevels}
                onChange={(x) => {
                  setTheoryLevels(x);
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_LEARN_PAGE_THEORY_LEVEL_CHANGED,
                    {
                      level: x,
                    }
                  );
                }}
                data={data}
              />
              <Button
                variant="outline"
                style={{
                  border: "#3174F3 1px solid",
                  color: "#3174F3",
                }}
                onClick={addMoreExamplesHandler}
                fz={16}
              >
                Add More Examples
              </Button>
              <Button
                style={{
                  border: "#3174F3 1px solid",
                  color: "#3174F3",
                }}
                onClick={() => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_LEARN_PAGE_EDIT_THEORY_CLICKED
                  );
                  setShowEdit(true);
                }}
                leftIcon={<EditIcon col="#3174F3" />}
                variant="outline"
                fz={16}
              >
                Edit Theory
              </Button>
            </Group>
          </>
          {isHTML(theoryToBeShown ?? "") && isMd && (
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: reduceImageScaleAndAlignLeft(theoryToBeShown) ?? "",
                }}
              />
            </Text>
          )}
          {isHTML(theoryToBeShown ?? "") && !isMd && (
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: theoryToBeShown ?? "",
                }}
              />
            </Text>
          )}

          {!isHTML(theoryToBeShown ?? "") && (
            <div dangerouslySetInnerHTML={{ __html: modifiedHtml }} />
          )}
          {examples !== null && (
            <>
              <Text fz={20} fw={600}>
                Examples
              </Text>
              {examples.split("\n").map((line, index) => (
                <Text key={index} fz={16}>
                  {line}
                </Text>
              ))}
            </>
          )}

          {props.topicDetail &&
            props.topicDetail.animatedVideos.length !== 0 && (
              <>
                <Divider size={2} my={20} />
                <Text className={classes.heading}>Our Videos</Text>
                <VideoPage
                  topic={props.topicDetail}
                  onUpdateTopic={props.onUpdateTopic}
                  isAnimatedVideos={true}
                  videos={animatedVideos}
                />
              </>
            )}

          <Divider size={2} my={20} />
          <Text className={classes.heading}>Youtube Videos</Text>
          {props.topicDetail && (
            <VideoPage
              topic={props.topicDetail}
              onUpdateTopic={props.onUpdateTopic}
              isAnimatedVideos={false}
              videos={youtubeVideos}
            />
          )}
        </>
      )}
      {props.currentTab === Tabs.Notes && (
        <FileUploadAndViewCard
          OnFileDrop={props.OnNotesUplaod}
          files={props.currentChapter.chapterNotes}
          tab={props.currentTab}
        />
      )}
      {props.currentTab === Tabs.LessonPlan && (
        <FileUploadAndViewCard
          files={props.currentChapter.chapterLessonPlan}
          OnFileDrop={props.OnLessonPlanUpload}
          tab={props.currentTab}
        />
      )}

      {props.currentTab === Tabs.Topics && props.introductionSelected && (
        <Introduction
          topics={props?.currentChapter?.topics ?? []}
          OnUpdateTestStatus={props.OnUpdateTestStatus}
          OnTopicClick={props.OnTopicClick}
          currentChapter={props.currentChapter}
        />
      )}
      {props.currentTab === Tabs.MindMap && (
        <MindMap mindmaps={props.currentChapter.chapterMindmaps} />
      )}
    </Box>
  );
}
