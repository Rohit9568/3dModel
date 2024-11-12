import {
  Button,
  Divider,
  FileInput,
  Flex,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import {
  generateAllWordQ,
  generateOnlyInteger,
  generateOnlyWordCaseQ,
  generateOnlyWordLong,
  generateOnlyWordMcqs,
  generateOnlyWordShort,
} from "../generateWord";
import { showNotification } from "@mantine/notifications";
import { UploadWordFile } from "../../../features/fileUpload/FileUpload";
import { useMediaQuery } from "@mantine/hooks";

function validateFileFormat(file: File): boolean {
  const allowedExtensions = [".docx", ".doc", ".pdf"];
  const fileNameParts = file.name.split(".");
  const fileExtension = fileNameParts[fileNameParts.length - 1];

  return allowedExtensions.includes(`.${fileExtension}`);
}
export function WordUploadModal(props: {
  isOpened: boolean;
  setIsOpened: (val: boolean) => void;
  testName: string;
  setloading: (val: boolean) => void;
  onClick: (x: any, negativeMarks: number) => void;
  setWordFile: (val: any) => void;
  wordFile: any;
}) {
  const [selectedSectionType, setSelectedSectionType] = useState<string>(
    QuestionType.McqQues.type
  );
  const [wordQuestions, setWordNoofQuestions] = useState<number>(1);
  const [eachQuestionNegativeMarks, setEachQuestionNegativeMarks] =
    useState<number>(0);
  const fileRef = useRef<any>();
  const isMd = useMediaQuery(`(max-width: 820px)`);
  useEffect(() => {
    return () => {
      props.setWordFile(null);
    };
  }, []);
  function handleDownloadWordClicked() {
    switch (selectedSectionType) {
      case QuestionType.McqQues.type:
        generateOnlyWordMcqs(wordQuestions, props.testName);
        break;
      case QuestionType.ShortQues.type:
        generateOnlyWordShort(wordQuestions, props.testName);
        break;
      case QuestionType.LongQues.type:
        generateOnlyWordLong(wordQuestions, props.testName);
        break;
      case QuestionType.CaseQues.type:
        generateOnlyWordCaseQ(wordQuestions, props.testName);
        break;
      case QuestionType.IntegerQues.type:
        generateOnlyInteger(wordQuestions, props.testName);
        break;
    }
  }

  const onFileUpload = (event: any) => {
    props.setIsOpened(false);
    props.setloading(true);
    UploadWordFile({ file: event })
      .then((x: any) => {
        props.onClick(x, eachQuestionNegativeMarks);
        props.setloading(false);
      })
      .catch((e) => {
        props.setloading(false);
        console.log(e);
      });
  };

  return (
    <>
      <Modal
        onClose={() => {
          props.setIsOpened(false);
        }}
        opened={props.isOpened}
        centered
        title="Add Word File"
        styles={{
          title: {
            fontSize: 20,
            fontweight: 800,
          },
        }}
      >
        <Stack>
          <Flex align="center" justify="space-between">
            <Text>Select Question Type:</Text>
            <Select
              value={selectedSectionType}
              data={[
                {
                  value: QuestionType.McqQues.type,
                  label: QuestionType.McqQues.name,
                },
                {
                  value: QuestionType.LongQues.type,
                  label: QuestionType.LongQues.name,
                },
                {
                  value: QuestionType.ShortQues.type,
                  label: QuestionType.ShortQues.name,
                },
                {
                  value: QuestionType.CaseQues.type,
                  label: QuestionType.CaseQues.name,
                },
                {
                  value: QuestionType.IntegerQues.type,
                  label: QuestionType.IntegerQues.name,
                },
              ]}
              onChange={(val) => {
                if (val) setSelectedSectionType(val);
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>No of Questions:</Text>
            <NumberInput
              value={wordQuestions}
              onChange={(val) => {
                setWordNoofQuestions(val ?? 0);
              }}
              min={1}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>Each Negative Marks :</Text>
            <NumberInput
              value={eachQuestionNegativeMarks}
              onChange={(val) => {
                setEachQuestionNegativeMarks(val ?? 0);
              }}
              min={1}
            />
          </Flex>
          <Button
            style={{ borderRadius: "24px" }}
            size="lg"
            onClick={() => {
              handleDownloadWordClicked();
            }}
            variant="outline"
            color="white"
            my={10}
          >
            Download Word
          </Button>
          <Divider variant="dotted" size="md" />
          <Button
            bg="#4B65F6"
            style={{ borderRadius: "24px" }}
            size="lg"
            onClick={() => {
              fileRef.current.click();
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            my={10}
          >
            Upload File
          </Button>
          <Flex justify="center">
            <Text
              fz={14}
              style={{
                opacity: 0.5,
              }}
              ta="center"
              mx={50}
              // my={20}
            >
              Select multiple videos from your local storage{" "}
              {!isMd ? <br></br> : ""}
              Max upto 20mb per pdf
            </Text>
          </Flex>
        </Stack>
      </Modal>
      <FileInput
        accept=".docx,.pdf,.doc"
        ref={fileRef}
        onChange={(val) => {
          if (val && validateFileFormat(val)) {
            props.setWordFile(val);
            onFileUpload(val);
          } else {
            showNotification({
              message:
                "Invalid .docx format. Please provide a valid .docx file.",
            });
          }
        }}
        value={props.wordFile}
        display="none"
      />
    </>
  );
}
