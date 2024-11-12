import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPaperclip, IconX } from "@tabler/icons";
import { Fragment, useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import { IconGallery } from "../../_Icons/CustonIcons";
import { FileDelete } from "../../../features/fileDelete/fileDeleteSlice";
import { showNotification } from "@mantine/notifications";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import { imageExtensions } from "../../../utilities/PreDefinedData";
import { extractFileName } from "../../../utilities/HelperFunctions";

interface NoticeEditorProps {
  intialHeading: string;
  intialDescription: string;
  fileName: string[];
  attachedFiles: AttachFileModel[];
  onSubmit: (
    noticeheading: string,
    noticedescription: string,
    attachedFiles: AttachFileModel[]
  ) => void;
}

export function NoticeEditor(props: NoticeEditorProps) {
  const [noticeHeading, setNoticeHeading] = useState<string>(
    props.intialHeading
  );
  const [editorContent1, setEditorContent] = useState<string>(
    props.intialDescription
  );
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [imgs, setImgs] = useState<File[]>([]);

  const [files, setfiles] = useState<AttachFileModel[]>(props.attachedFiles);
  const [filesTobeUploaded, setFilesUploaded] = useState<
    {
      id: string;
      file: File;
    }[]
  >([]);
  const [deletedFiles, setDeletedFiles] = useState<AttachFileModel[]>([]);

  const [isError, setIsError] = useState<string | null>(null);
  const [headingError, setheadingError] = useState<string | null>(null);

  const [onUpload, setOnUpload] = useState<boolean>(false);

  function deleteHandler(file: AttachFileModel) {
    const found = filesTobeUploaded.find((x) => x.id === file.id);
    if (found) {
      setFilesUploaded((prev) => {
        return prev.filter((x) => x.id !== file.id);
      });
    } else {
      setDeletedFiles((x) => [...x, file]);
    }
    setfiles((prev) => {
      const prev1 = prev.filter((file1) => file1.id !== file.id);
      return prev1;
    });
  }
  useEffect(() => {
    if (pdfs.length !== 0) {
      const validPDFs = pdfs.filter((pdf) => {
        const isPDF = pdf.name.endsWith(".pdf");
        const isSizeValid = pdf.size <= 5 * 1024 * 1024;
        return isPDF && isSizeValid;
      });
      if (validPDFs.length === 0) {
        setIsError("No valid PDF files (maximum size: 5 MB) to upload");
        return;
      }

      const files1: {
        id: string;
        file: File;
      }[] = validPDFs.map((x) => {
        return {
          id: `${x.name}${x.size}${x.type}`,
          file: x,
        };
      });
      setFilesUploaded((prev) => [...prev, ...files1]);
      const files2: AttachFileModel[] = files1.map((x) => {
        return {
          id: x.id,
          name: x.file.name,
          url: null,
          mimetype: x.file.type,
        };
      });
      setfiles((prev) => [...prev, ...files2]);
      setPdfs([]);
    }
  }, [pdfs]);
  useEffect(() => {
    if (imgs.length !== 0) {
      const validImages = imgs.filter((img) => {
        if (!img.name) {
          return false; // Skip files without a name
        }

        const fileNameParts = img.name.split(".");
        if (fileNameParts.length < 2) {
          return false; // Skip files with no extension
        }

        const fileExtension =
          fileNameParts[fileNameParts.length - 1].toLowerCase();
        const isImage = imageExtensions.includes(fileExtension);
        const isSizeValid = img.size <= 5 * 1024 * 1024;

        return isImage && isSizeValid;
      });

      if (validImages.length === 0) {
        console.log("No valid image files to upload.");
        setIsError("No valid images files (maximum size: 5 MB) to upload");
        return;
      }
      const files1: {
        id: string;
        file: File;
      }[] = validImages.map((x) => {
        return {
          id: `${x.name}${x.size}${x.type}`,
          file: x,
        };
      });
      setFilesUploaded((prev) => [...prev, ...files1]);
      const files2: AttachFileModel[] = files1.map((x) => {
        return {
          id: x.id,
          name: x.file.name,
          url: null,
          mimetype: x.file.type,
        };
      });
      setfiles((prev) => [...prev, ...files2]);
      setImgs([]);
    }
  }, [imgs]);

  useEffect(() => {
    if (onUpload && files.filter((x) => x.url === null).length === 0) {
      props.onSubmit(noticeHeading, editorContent1, files);
    }
  }, [onUpload, files]);

  function submithandler() {
    if (filesTobeUploaded.length !== 0) {
      for (let i = 0; i < filesTobeUploaded.length; i++) {
        FileUpload({ file: filesTobeUploaded[i].file })
          .then((x: any) => {
            setfiles((prev) => {
              const prev1 = prev.map((file) => {
                if (file.id === filesTobeUploaded[i].id) {
                  return {
                    ...file,
                    url: x.url,
                    id: extractFileName(x.url),
                  };
                }
                return file;
              });
              return prev1;
            });

            if (i === filesTobeUploaded.length - 1) {
              setOnUpload(true);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      setOnUpload(true);
    }
    for (let i = 0; i < deletedFiles.length; i++) {
      FileDelete({ fileName: deletedFiles[i].id })
        .then((x) => {
          //
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  return (
    <Stack>
      <TextInput
        label="Notice Heading"
        styles={{
          label: {
            fontSize: 14,
            fontWeight: 500,
          },
        }}
        value={noticeHeading}
        onChange={(e) => {
          setheadingError(null);
          setNoticeHeading(e.target.value);
        }}
        error={headingError}
      />
      <Stack spacing={2}>
        <Text fz={14} fw={500}>
          Type your notice here
        </Text>
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
          setContents={editorContent1}
        />
        <ScrollArea h="100px">
          <Fragment>
            {isError !== null && (
              <Text fz={12} fw={500} color="red">
                {" "}
                {isError}
              </Text>
            )}
            {files.map((x) => {
              return (
                <Flex
                  w="100%"
                  px={10}
                  mt={10}
                  py={8}
                  justify="space-between"
                  align="center"
                  style={{
                    border: "1px solid #A7A7A7",
                    borderRadius: "7px",
                  }}
                  key={x.id}
                >
                  <Text>{x.name}</Text>
                  <IconX
                    height="18px"
                    width="18px"
                    color="#A7A7A7"
                    onClick={deleteHandler.bind(null, x)}
                  />
                  {/* )} */}
                </Flex>
              );
            })}
          </Fragment>
        </ScrollArea>
      </Stack>

      <Flex justify="space-between" w="100%">
        <Box
          style={{
            border: "#3174F3 solid 1px",
            width: "48px",
            borderRadius: "10px",
            position: "relative",
            height: "48px",
          }}
        >
          <Center h="100%" w="100%">
            <IconPaperclip height="18px" width="18px" color="#3174F3" />
            <FileInput
              style={{
                position: "absolute",
                top: 4,
                width: "100%",
                height: "100%",
                opacity: 0,
              }}
              accept=".pdf"
              multiple
              value={pdfs}
              onChange={setPdfs}
            />
          </Center>
        </Box>
        <Box
          style={{
            border: "#3174F3 solid 1px",
            width: "48px",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <Center h="100%" w="100%">
            <IconGallery />
          </Center>
          <FileInput
            style={{
              position: "absolute",
              top: 4,
              width: "100%",
              height: "100%",
              opacity: 0,
            }}
            accept="image/*"
            multiple
            value={imgs}
            onChange={setImgs}
          />
        </Box>
        <Button
          style={{
            backgroundColor: "#3174F3",
          }}
          size="lg"
          fw={500}
          fz={16}
          onClick={() => {
            if (noticeHeading === "") {
              setheadingError("heading cannot be empty");
              return;
            }

            submithandler();
          }}
          w="65%"
        >
          Submit
        </Button>
      </Flex>
    </Stack>
  );
}
