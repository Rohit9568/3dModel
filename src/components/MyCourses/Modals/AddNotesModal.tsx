import {
  Button,
  FileInput,
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useFileInput } from "../../../hooks/useFileInput";
import { useEffect, useState } from "react";
import { IconUpload } from "@tabler/icons";
import useParentCommunication from "../../../hooks/useParentCommunication";
import { mimeFiles } from "../../../utilities/react_native_communication";

export function AddNotesModal(props: {
  addNotes: (val: string, url: string) => void;
}) {
  const { file, fileInputRef, isLoading, url, setFile, setFileType } =
    useFileInput((progress:number)=>{});
  const [noteName, setNoteName] = useState<string>("");
  const [urlFromReactnative, seturlFromReactNative] = useState<string | null>(
    null
  );

  function handleMessage(data: {
    url: string;
    fileName?: string;
    mimeType?: string;
  }) {
    seturlFromReactNative(data.url);
  }
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication(handleMessage);
  useEffect(() => {
    setFileType("pdf");
  }, []);

  return (
    <>
      {url === null && urlFromReactnative == null && (
        <Stack>
          <Stack align="center">
            <Button
              onClick={() => {
                if (!isReactNativeActive()) {
                  fileInputRef.current?.click();
                }
                else {
                  sendDataToReactnative(0, { mimeTypeArray: [mimeFiles.pdf] });
                }
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
              Upload from your PC
            </Button>
            <Text
              fz={14}
              style={{
                opacity: 0.5,
              }}
              ta="center"
              mx={50}
            >
              Select pdf from your local storage
            </Text>
          </Stack>
        </Stack>
      )}
      {(url !== null || urlFromReactnative !== null) && (
        <Flex>
          <Stack w="100%">
            <Flex w="100%" justify="space-between" pl={10} align="center">
              <Text
                fw={700}
                fz={14}
                style={{
                  opacity: 0.5,
                }}
              >
                File Name*
              </Text>
              <TextInput
                value={noteName}
                onChange={(e) => {
                  setNoteName(e.currentTarget.value);
                }}
                w="70%"
                styles={{
                  input: {
                    minHeight: "40px",
                  },
                }}
                placeholder="Add File"
              />
            </Flex>
            <Flex justify="end">
              {!url && urlFromReactnative === null && <Loader size={20} />}
              {(url || !isLoading || urlFromReactnative !== null) && (
                <Button
                  bg="#4B65F6"
                  onClick={() => {
                    if (urlFromReactnative) {
                      props.addNotes(noteName, urlFromReactnative);
                    } else if (url) props.addNotes(noteName, url);
                  }}
                  disabled={noteName.trim() === ""}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#3C51C5",
                    },
                  }}
                >
                  Submit
                </Button>
              )}
            </Flex>
          </Stack>
        </Flex>
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
