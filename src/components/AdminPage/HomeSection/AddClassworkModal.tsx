import { Button, Stack, Text } from "@mantine/core";
import ToggleCard from "./ToggleCard";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useState } from "react";
import { IconArrowDown, IconPhoto, IconX } from "@tabler/icons";
import { useRef } from "react";
import { Menu } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { useEffect } from "react";
import { Loader } from "@mantine/core";
import { Flex } from "@mantine/core";
import { Center } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconGallery } from "../../_Icons/CustonIcons";
import { Box } from "@mantine/core";
import { makeAutoHomework } from "../../../_parentsApp/features/instituteHomeworkSlice";
import { stripHtml } from "../../../utilities/HelperFunctions";
interface AddClassworkModalProps {
  onSubmitClick: (val: string, uploadPhoto?: File) => void;
}

export function AddClassworkModal(props: AddClassworkModalProps) {
  const [editorContent, setEditorContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [homeworkResponse, setHomeworkResponse] = useState<string>("");
  const [switchOption, setSwitchOption] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError,setisError]=useState<string | null>(null)
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      // Check if the selected file is an image
      if (selectedFile.type.startsWith("image/")) {
        // It's an image file
        setisError(null)
        setSelectedImage(selectedFile);
      } else {
        setisError('Invalid Format');
        setSelectedImage(undefined);
        // It's not an image file, you can display an error message or take other actions
        console.log("Selected file is not an image.");
      }
    }
  };
  const handleHomeworkByai = async () => {
    setIsLoading(true);
    try {
      const response = await makeAutoHomework({
        chapterName: selectedChapter,
        topicName: selectedTopic,
      });

      setHomeworkResponse(response as string);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  // Determine if the Submit button should be disabled
  // const isSubmitDisabled = editorContent.trim() === "";
  const isSubmitDisabled = stripHtml(editorContent).trim() === "";
  const isAIsubmitDisabled = homeworkResponse.trim() === "";
  useEffect(() => {
    if (selectedChapter !== "" && selectedTopic !== "") {
      handleHomeworkByai();
    }
  }, [selectedChapter, selectedTopic]);
  return (
    <Stack>
      {/* <Flex justify={"center"}>
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
      </Flex> */}

      <Text fz={14} fw={500} color="#000">
        Type your Homework here
      </Text>
      <SunEditor
        autoFocus={true}
        lang="en"
        setOptions={{
          // showPathLabel: false,
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
       {
        isError &&
        <Text
        fz={16}
        color="red"
        >{isError}</Text>
        }
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
            {/* <IconPhoto
                color="#3174F3"
                style={{ width: "100%", height: "100%" }}
              /> */}
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
          props.onSubmitClick(editorContent, selectedImage);
        }}
      >
        Submit
      </Button>
    </Stack>
  );
}