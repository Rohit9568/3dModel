import { Button, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import { useRef } from "react";
import { Box } from "@mantine/core";
import { IconPhoto, IconX } from "@tabler/icons";
import { Flex } from "@mantine/core";
import { Center } from "@mantine/core";
import { IconGallery } from "../../_Icons/CustonIcons";
import { showNotification } from "@mantine/notifications";
import { stripHtml } from "../../../utilities/HelperFunctions";
interface EditDiaryModalProps {
  diaryContent: string;
  uploadedPhoto?: string;
  onSubmitClick: (data: string, uploadPhoto: string | undefined) => void;
  onPicUpload:(data: string,file:File)=>void
}
function textToHtml(text:string) {
  // Replace line breaks with <br> tags
  const htmlText = text.replace(/\n/g, '<br>');
  return htmlText;
}
export function EditDiaryModal(props: EditDiaryModalProps) {
  const [editorContent, setEditorContent] = useState<string>(
    textToHtml(props.diaryContent)
  );

  const [photoUploaded, setPhotoUploaded] = useState<string>(
    props.uploadedPhoto as string
  );
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [isError,setisError]=useState<string | null>(null)

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  // const stripHtml = (html:string) => {
  //   const tempElement = document.createElement('div');
  //   tempElement.innerHTML = html;
  //   return tempElement.textContent || tempElement.innerText || '';
  // };

  const uploadPdf = async (file?: File) => {
    if (file) {
      try {
        const response = await FileUpload({ file });
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("File is not found!");
    }
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

  // useEffect(() => {
  //   const isBtnDisabled2 = editorContent.trim() === "<p><br></p>";
  //   setIsBtnDisabled(isBtnDisabled2);
  // }, [editorContent]);

  // useEffect(()=>{
  //   const ff=stripHtml(editorContent)
  //   console.log(ff)
  //   // const hh=editorContent.trim().length
  //   // console.log(hh)
  // },[editorContent])

  return (
    <Stack>
      <SunEditor
        autoFocus={true}
        lang="en"
        setOptions={{
          showPathLabel: false,
          minHeight: "30vh",
          maxHeight: "30vh",
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
          <Flex
            w={"70%"}
            sx={{
              border: "1px solid black",
              padding: "5px",
              display: `${!photoUploaded ? "none" : "flex"}`,
              fontSize: "10px",
            }}
            align={"center"}
            justify={"space-between"}
          >
            {photoUploaded && photoUploaded?.slice(50)}
            {photoUploaded && photoUploaded?.length !== 0 ? (
              <>
                <IconX
                  onClick={() => {
                    setSelectedImage(undefined);
                    setPhotoUploaded("");
                  }}
                />
              </>
            ) : (
              ""
            )}
          </Flex>
        )}
        {/* <span style={{ fontSize: "10px" }}>
          {selectedImage ? selectedImage.name : photoUploaded.slice(50)}
        </span> */}
      </Flex>
      <Button
        style={{
          backgroundColor: "#3174F3",
        }}
        size="lg"
        color="#FFF"
        fz={14}
        fw={500}
        disabled={stripHtml(editorContent).trim().length===0}
        onClick={() => {
          if (photoUploaded && photoUploaded.length !== 0) {
            props.onSubmitClick(editorContent, photoUploaded);
          } else if (selectedImage) {
            props.onPicUpload(editorContent,selectedImage)
          } else {
            // props.onSubmitClick(editorContent, selectedImage);
            props.onSubmitClick(editorContent, undefined);
          }
        }}
      >
        Submit
      </Button>
    </Stack>
  );
}
