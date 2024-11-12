import {
  Button,
  FileInput,
  Flex,
  Loader,
  Modal,
  Progress,
  Stack,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons";
import { useFileInput } from "../../../hooks/useFileInput";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import useParentCommunication from "../../../hooks/useParentCommunication";
import { mimeFiles } from "../../../utilities/react_native_communication";
import io from "socket.io-client";


const validateYouTubeUrl = (url: string) => {
  // Regular expression to validate YouTube video links
  const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  if (youtubeRegex.test(url)) {
    return true;
  } else {
    return false;
  }
};


export function AddVideoModal(props: {
  addVideo: (name: string, description: string, url: string) => void;
}) {

  const [uploadProgressPercentage, setUploadProgressPercentage] = useState<number>(0);

  const { file, fileInputRef, isLoading, url, setFile, setFileType } =
    useFileInput(setUploadProgressPercentage);
  const [videoName, setVideoName] = useState<string>("");
  const [urlFromReactnative, seturlFromReactnative] = useState<null | string>(
    null
  );
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [youtubeVideoLink, setYoutubeVideoLink] = useState<string>("");
  const [finalVideoLink, setFinalVideoLink] = useState<string>("");
  useEffect(() => {
    setFileType("video");
  }, []);

  


  const theme = useMantineTheme();
  function handleMessage(data: {
    url: string;
    fileName?: string;
    mimeType?: string;
  }) {
    seturlFromReactnative(data.url);
  }
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication(handleMessage);

  return (
    <>
      {file === null &&
        finalVideoLink === "" &&
        urlFromReactnative === null && (
          <Stack w={isMd ? "70vw" : "30vw"}>
            <Flex justify="space-between" align="center">
              <Text
                fz={14}
                style={{
                  opacity: 0.5,
                }}
                fw={700}
                w="20%"
              >
                Video Link
              </Text>
              <TextInput
                placeholder=" Video Link"
                w="80%"
                value={youtubeVideoLink}
                onChange={(e) => {
                  setYoutubeVideoLink(e.currentTarget.value);
                }}
              />
            </Flex>
            <Flex justify="right">
              <Button
                onClick={() => {
                  if (validateYouTubeUrl(youtubeVideoLink))
                    setFinalVideoLink(youtubeVideoLink);
                  else {
                    showNotification({
                      message: "Enter a valid Youtube Video url",
                    });
                  }
                }}
                size="xs"
                variant="outline"
              >
                Submit
              </Button>
            </Flex>
            <Text color="#000000" fz={34} ta="center">
              OR
            </Text>

            <Stack spacing={5} align="center">
              <Button
                onClick={() => {
                  if (isReactNativeActive()) {
                    sendDataToReactnative(0, {
                      mimeTypeArray: [mimeFiles.video],
                    });
                  } else fileInputRef.current?.click();
                }}
                variant="outline"
                leftIcon={<IconUpload />}
                color="#4B65F6"
                style={{
                  border: "1px solid #4B65F6",
                  borderRadius: 24,
                  color: "#4B65F6",
                }}
                size="md"
              >
                Upload from your {isMd ? "Phone" : "PC"}
              </Button>
              <Text
                fz={14}
                style={{
                  opacity: 0.5,
                }}
                ta="center"
                mx={50}
                my={20}
              >
                Select multiple videos from your local storage{" "}
                {!isMd ? <br></br> : ""}
                Max upto 200Mb per video
              </Text>
            </Stack>
          </Stack>
        )}
      {(file !== null ||
        finalVideoLink !== "" ||
        urlFromReactnative !== null) && (
        <Stack>
          <Flex w={isMd ? "80vw" : "30vw"}>
            <Stack w="100%">
              <Flex w="100%" justify="space-between" pl={10} align="center">
                <Text
                  fw={700}
                  fz={14}
                  style={{
                    opacity: 0.5,
                  }}
                >
                  Video Name
                </Text>
                <TextInput
                  value={videoName}
                  onChange={(e) => {
                    setVideoName(e.currentTarget.value);
                  }}
                  w="70%"
                />
              </Flex>
              <Flex w="100%" justify="space-between" pl={10}>
                <Text
                  fw={700}
                  fz={14}
                  style={{
                    opacity: 0.5,
                  }}
                >
                  Desciption
                </Text>
                <Textarea
                  value={videoDescription}
                  onChange={(e) => {
                    setVideoDescription(e.currentTarget.value);
                  }}
                  autosize
                  minRows={4}
                  w="70%"
                />
              </Flex>
            </Stack>
          </Flex>
          <Flex justify="center">
            {!url && finalVideoLink === "" && urlFromReactnative === null && (
              <Flex w={"100%"} align={"center"}>
                 <Progress w = {"85%"} radius="md" value={uploadProgressPercentage} striped animate />
                <Text ml={5} >{uploadProgressPercentage+"%"}</Text>
              </Flex>
            )}
            {(url || finalVideoLink !== "" || urlFromReactnative !== null) && (
              <Button
                color="#4B65F6"
                onClick={() => {
                  if (finalVideoLink === "") {
                    if (
                      !isReactNativeActive() &&
                      urlFromReactnative === null &&
                      url
                    )
                      props.addVideo(videoName, videoDescription, url);
                    else {
                      props.addVideo(
                        videoName,
                        videoDescription,
                        urlFromReactnative ?? ""
                      );
                    }
                  } else
                    props.addVideo(videoName, videoDescription, finalVideoLink);
                }}
                bg="#4B65F6"
                sx={{
                  "&:hover": {
                    backgroundColor: "#3C51C5",
                  },
                }}
                disabled={
                  videoName.trim() === "" || videoDescription.trim() === ""
                }
              >
                Submit
              </Button>
            )}
          </Flex>
        </Stack>
      )}
      <FileInput
        value={file}
        onChange={setFile}
        ref={fileInputRef}
        display="none"
      />
    </>
  );
}
