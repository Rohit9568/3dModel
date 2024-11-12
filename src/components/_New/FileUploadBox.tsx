import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import {
  IconArrowGuide,
  IconArrowRightSquare,
  IconArrowsCross,
  IconCloudUpload,
  IconNavigation,
  IconTopologyFull,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { FileRejection } from "react-dropzone";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { Tabs } from "../../pages/_New/Teach";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { useMediaQuery } from "@mantine/hooks";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import { getFilePlugin } from "@react-pdf-viewer/get-file";

// Import styles
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import { IconExpand } from "../_Icons/CustonIcons";

const errorReject = (errorRejection: FileRejection | null) => {
  if (errorRejection === null) {
    return "";
  }
  switch (errorRejection.errors[0].code) {
    case "file-too-large":
      return "*File should not exceed 1mb";
    case "too-many-files":
      return "*Only 1 pdf is allowed";
    case "file-invalid-type":
      return "*File type must be pdf";
    default:
      return "Error in Uploading file.Try different file";
  }
};

export function FileUploadBox(props: {
  setisLoading: (val: boolean) => void;
  OnSucessfullUpload: (name: string, url: string) => void;
  tab: Tabs;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [rejectError, setRejectError] = useState<FileRejection | null>(null);
  useEffect(() => {
    submitHandler();
  }, [file]);
  const submitHandler = async () => {
    if (file === null) return;
    else {
      props.setisLoading(true);
      await FileUpload({ file: file })
        .then((data: any) => {
          props.OnSucessfullUpload(file.name, data.url);
          setFile(null);
          if (props.tab === Tabs.LessonPlan) {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_FILE_ADDED
            );
          } else if (props.tab === Tabs.Worksheets) {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_FILE_ADDED
            );
          } else if (props.tab === Tabs.Notes) {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_LEARN_PAGE_NOTES_SECTION_FILE_ADDED
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
      props.setisLoading(false);
    }
  };
  return (
    <Box h={183} w={"100%"}>
      <Dropzone
        w={"100%"}
        h={"100%"}
        onClick={() => {
          if (props.tab === Tabs.LessonPlan) {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_BROWSE_CLICKED
            );
          } else if (props.tab === Tabs.Worksheets) {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_BROWSE_CLICKED
            );
          } else if (props.tab === Tabs.Notes) {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_LEARN_PAGE_NOTES_SECTION_BROWSE_CLICKED
            );
          }

          setFile(null);
        }}
        onDrop={(files) => {
          setFile(files[0]);
          setRejectError(null);
        }}
        onReject={(files) => {
          setRejectError(files[0]);
        }}
        maxSize={1024 ** 2}
        accept={PDF_MIME_TYPE}
        maxFiles={1}
        style={{ background: "rgba(255, 0, 0, 0)" }}
      >
        <Stack align="center" style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload size={50} stroke={1.5} color="blue" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={50} stroke={1.5} color="red" />
          </Dropzone.Reject>

          <Center h={"100%"}>
            <Stack spacing={0}>
              <Center>
                <IconCloudUpload color="#3174F3" size={100} stroke={1} />
              </Center>
              <Text size="xl" c={"#737373"}>
                Drag and drop, or
                {
                  <Text c={"#3174F3"} span>
                    {" browse "}
                  </Text>
                }
                your files
              </Text>
            </Stack>
            {<Text color="red">{errorReject(rejectError)}</Text>}
          </Center>
        </Stack>
      </Dropzone>
    </Box>
  );
}

interface PdfViewerProps {
  url: string | undefined;
  showOptions: boolean;
  showDownloadButton?: boolean;
  hideFullScreenButton?: boolean;
}

export const PdfViewer = (props: PdfViewerProps) => {
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [enterFullScreen, setEnterFullScreen] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  
  const renderPage = (props: any) => (
    <>
      {instituteDetails != null && (
        <>
          {props.canvasLayer.children}
          <div
            style={{
              alignItems: "center",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
          >
            <div
              style={{
                color: "rgba(0, 0, 0, 0.2)",
                fontSize: `${4 * props.scale}rem`,
                fontWeight: "bold",
                textTransform: "uppercase",
                transform: "rotate(-45deg)",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              {instituteDetails.name}
            </div>
          </div>
          {props.annotationLayer.children}
          {props.textLayer.children}
        </>
      )}
    </>
  );
  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const getFilePluginInstance = getFilePlugin();

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const { EnterFullScreenButton } = fullScreenPluginInstance;
  const { DownloadButton } = getFilePluginInstance;

  const plugins = [
    zoomPluginInstance,
    fullScreenPluginInstance,
    getFilePluginInstance,
  ];

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />
            { props.hideFullScreenButton != true && (
              <Group position="center">
                <Tooltip label="FullScreen">
                  <Button
                    ml={10}
                    variant="default"
                    bg={"#eeeeee"}
                    onClick={() => {
                      setEnterFullScreen(true);
                    }}
                    sx={{ "&[data-disabled]": { pointerEvents: "all" } }}
                  >
                    <IconArrowsCross color="black" />
                  </Button>
                </Tooltip>
              </Group>
            )
            }
            {props.showDownloadButton == true && <DownloadButton />}
          </div>
        </>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          {props.url &&
            props.url != null &&
            instituteDetails &&
            instituteDetails.featureAccess.pdfWaterMark && (
              <Viewer
                fileUrl={props.url}
                plugins={plugins}
                renderPage={renderPage}
              />
            )}
          {props.url &&
            props.url != null &&
            instituteDetails &&
            !instituteDetails.featureAccess.pdfWaterMark && (
              <Viewer fileUrl={props.url} plugins={plugins} />
            )}
          {/* )} */}
        </div>
      </div>
      <Modal
        opened={enterFullScreen}
        onClose={() => {
          setEnterFullScreen(false);
        }}
        zIndex={9999}
        fullScreen
      >
        <PdfViewer
          url={props.url}
          showOptions={false}
          hideFullScreenButton={true}
        />
      </Modal>
    </Worker>
  );
};
