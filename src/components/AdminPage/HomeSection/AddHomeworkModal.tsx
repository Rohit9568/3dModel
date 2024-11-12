import { Button, Select, Stack, Text } from "@mantine/core";
import ToggleCard from "./ToggleCard";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useState } from "react";
import { IconX } from "@tabler/icons";
import { useRef } from "react";
import { useEffect } from "react";
import { Box, Center } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import { Flex } from "@mantine/core";
import { IconCross, IconGallery } from "../../_Icons/CustonIcons";
import { LoadingOverlay } from "@mantine/core";
import { stripHtml } from "../../../utilities/HelperFunctions";
const OpenAi = require("openai");

interface AddHomeworkProps {
  onSubmitClick: (description: string, uploadPhoto?: File) => void;
}
const openai = new OpenAi({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function AddHomeworkModal(props: AddHomeworkProps) {
  const [editorContent, setEditorContent] = useState<string>("");
  const [switchOption, setSwitchOption] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [homeworkResponse, setHomeworkResponse] = useState<string>("");
  const [isREsponseLoading,setResponseLoading]=useState<boolean>()
  const [selectedImage, setSelectedImage] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isoverlayvisible, setisoverlayvisible] = useState<boolean>(false);
  const [isError, setisError] = useState<string | null>(null);
  const [aIGeneratedHomework, setAiGeneratedHomework] = useState<string>("");
  const [chapters, setChapters] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [topics, setTopics] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  async function generateMessage(data: {
    chapterName: string;
    topicName: string;
  }) {
    try {
      setResponseLoading(true);
      const { response } = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a teacher Assistant, you will make homework in 70 words only on the chapter name : ${data.chapterName} and the topic name : ${data.topicName}`,
          },
        ],
        stream: true,
      });
      setIsLoading(false);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const chunk = await reader.read();
        const { done, value } = chunk;
        if (done) {
          setResponseLoading(false);
          break;
        }
        const decoderChunk = decoder.decode(value);
        const lines = decoderChunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));

        for (const parsedLine of parsedLines) {
          // console.log(parsedLine)
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            setAiGeneratedHomework((prev) => `${prev}${content}`);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }


  const handleIconClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      // Check if the selected file is an image
      if (selectedFile.type.startsWith("image/")) {
        // It's an image file
        setisError(null);
        setSelectedImage(selectedFile);
      } else {
        setisError("Invalid Format");

        setSelectedImage(undefined);
        // It's not an image file, you can display an error message or take other actions
        console.log("Selected file is not an image.");
      }
    }
  };

  const isSubmitDisabled = stripHtml(editorContent).trim() === "";
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    const textarea: any = textareaRef.current;
    if (textarea) textarea.scrollTop = textarea.scrollHeight;
  }, [aIGeneratedHomework]);

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      {chapters.length !== 0 && (
        <Flex justify={"center"}>
          <ToggleCard
            firstButton="Input"
            secondButton="Generate"
            textColor="#4A4A4A"
            cardTextColor="#FFF"
            cardColor="#3174F3"
            onChange={() => {}}
            onFirstButtonClick={() => {
              setSwitchOption(true);
            }}
            onSecondButtonClick={() => {
              setSwitchOption(false);
            }}
          />
        </Flex>
      )}
        <>
          <Text fz={14} fw={500} color="#000">
            Type your Homework here
          </Text>
          <SunEditor
            autoFocus={true}
            lang="en"
            setOptions={{
              showPathLabel: false,
              minHeight: "30vh",
              maxHeight: "30vh",
              maxWidth: "100%",
              placeholder: "Enter your text here!!!",
              buttonList: [["bold", "underline", "italic"]],
            }}
            onChange={setEditorContent}
            setContents={editorContent}
          />
          <input
            type="file"
            accept="image/"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          {isError && (
            <Text fz={16} color="red">
              {isError}
            </Text>
          )}
          <Flex align={"center"} gap={"md"}>
            <Box
              style={{
                border: "#3174F3 solid 1px",
                width: "50px",
                borderRadius: "10px",
                position: "relative",
                height: "50px",
                cursor: "pointer",
              }}
              onClick={handleIconClick}
            >
              <Center h="100%" w="100%">
                <IconGallery />
              </Center>
            </Box>

            {selectedImage ? (
              <Flex
                w={"60%"}
                sx={{ border: "1px solid black", padding: "5px" }}
                align={"center"}
                justify={"space-between"}
              >
                {selectedImage.name}
                <IconX onClick={() => setSelectedImage(undefined)} />
              </Flex>
            ) : (
              ""
            )}
          </Flex>
          <Button
            style={{
              backgroundColor: "#3174F3",
            }}
            size="lg"
            color="#FFF"
            fz={14}
            fw={500}
            disabled={isSubmitDisabled}
            onClick={() => {
              setisoverlayvisible(true);
              props.onSubmitClick(editorContent, selectedImage);
            }}
          >
            Submit
            {isoverlayvisible && <Loader size={"xs"} ml={"md"} color="white" />}
          </Button>
        </>
    </Stack>
  );
}
