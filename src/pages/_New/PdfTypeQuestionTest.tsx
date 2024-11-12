import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons";
import { useEffect, useState } from "react";
import { QuestionType, findQuestionType } from "../../@types/QuestionTypes.d";
import { IconPlusQuestions } from "../../components/_Icons/CustonIcons";
import { PdfViewer } from "../../components/_New/FileUploadBox";
import { EditAndDeleteSection } from "./PersonalizedTestQuestions";

enum SectionTypes {
  MCQ = "Multiple Choice",
  LONG = "Long Answer Type Question",
  SHORT = "Short Answer Type Question",
  CASE = "Case Based Questions",
}

interface NewTypeQuestionProps {
  sections: TestPdfSection[];
  setsections: (state: React.SetStateAction<TestPdfSection[]>) => void;
  pdfLink: string;
  scrollToId: (id: string) => void;
}

interface SingleSectionProps {
  index: number;
  type: QuestionType;
  sectionName: string;
  questionNo: number;
  totalMarks: number;
  setTotalMarks: (val: number) => void;
  setQuestionNo: (val: number) => void;
  onDeleteClick: () => void;
}

function SingleSection(props: SingleSectionProps) {
  const [isEdit, setisEdit] = useState<boolean>(true);
  return (
    <Card
      py={25}
      px={30}
      shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
      style={{ borderRadius: "10px" }}
      withBorder
      id={`section-${props.index}`}
    >
      <Stack>
        <Flex justify="space-between" align="center">
          <Text fz={20} fw={700}>
            Section {props.index}. {props.sectionName}
          </Text>
          <Text>Each Question Marks:{props.totalMarks}</Text>
        </Flex>
        {isEdit && (
          <Flex align="center">
            <Text mr={20}>No of Questions-</Text>
            <NumberInput
              value={props.questionNo}
              onChange={(val) => {
                if (val) props.setQuestionNo(val);
              }}
            />
          </Flex>
        )}
        {!isEdit && (
          <Flex align="center">
            <Text mr={20} fz={20}>
              No of Questions-
            </Text>
            <Text fz={20}>{props.questionNo}</Text>
          </Flex>
        )}

        <Flex justify="center">
          {isEdit && (
            <Box
              bg={props.questionNo > 0 ? "#3174F3" : "#BDBDBD"}
              // bg="#3174F3"
              w={35}
              h={35}
              style={{ borderRadius: 10, cursor: "pointer" }}
              onClick={() => {
                //   props.onClick();
                setisEdit(false);
              }}
            >
              <Center h={"100%"}>
                <IconCheck color="white" stroke={2} />
              </Center>
            </Box>
          )}
          {!isEdit && (
            <EditAndDeleteSection
              canBeDeleted={true}
              onDeleteClick={props.onDeleteClick}
              onEditClick={() => {
                setisEdit(true);
              }}
              questionMark={props.totalMarks * props.questionNo}
              hideMarks={false}
              negativeMarks={"0"}
            />
          )}
        </Flex>
      </Stack>
    </Card>
  );
}
export function PdfTypeQuestionTest(props: NewTypeQuestionProps) {
  const [isAddNewSection, setIsAddNewSection] = useState<boolean>(false);
  const [sectionType, setSectionType] = useState<string>(
    QuestionType.McqQues.type
  );
  const [sectionMarks, setSectionMarks] = useState<number>(4);
  const [eachSectionNegativemarks, setEachSectionNegativeMarks] =
    useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.sections]);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <Stack
        style={{
          position: "relative",
          backgroundColor: "#F7F7FF",
        }}
      >
        <Stack
          style={{
            position: "relative",
          }}
        >
          {props.sections.map((x, i) => {
            return (
              <SingleSection
                questionNo={x.questionNo}
                sectionName={x.sectionName}
                type={x.type}
                setQuestionNo={(val) => {
                  props.setsections((prev) => {
                    const prev1 = [...prev];
                    const findIndex = prev1.findIndex((x, j) => j === i);
                    prev1[findIndex].questionNo = val;
                    return prev1;
                  });
                }}
                index={i + 1}
                onDeleteClick={() => {
                  props.setsections((prev) => {
                    const prev1 = [...prev];
                    const prev2 = prev1.filter((x, index) => index !== i);
                    return prev2;
                  });
                }}
                totalMarks={x.totalMarks}
                setTotalMarks={(val) => {
                  props.setsections((prev) => {
                    const prev1 = [...prev];
                    const findIndex = prev1.findIndex((x, j) => j === i);
                    prev1[findIndex].totalMarks = val;
                    return prev1;
                  });
                }}
              />
            );
          })}
          <Card
            style={{
              //   border: "red solid 1px",
              height: "60px",
              width: "100%",
              border: "2px dashed black",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
            }}
            withBorder
          >
            <Button
              variant="white"
              size="md"
              onClick={() => {
                setIsAddNewSection(true);
              }}
              mt={-10}
            >
              <Text color="black" mr={20} fz={isMd ? 16 : 20}>
                Add New Section
              </Text>
              <IconPlusQuestions />
            </Button>
          </Card>

          <Card
            py={25}
            px={30}
            shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
            style={{ borderRadius: "10px" }}
            withBorder
          >
            <PdfViewer url={props.pdfLink} showOptions={true} />
          </Card>
          {/* <Card
              style={{
                //   boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px",
                //   background: "#FFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              py={10}
              withBorder
            > */}

          {/* </Card> */}
        </Stack>
      </Stack>
      <Modal
        opened={isAddNewSection}
        onClose={() => {
          setIsAddNewSection(false);
        }}
        centered
      >
        <Stack>
          <Flex align="center" justify="space-between">
            <Text>Section Type:</Text>
            <Select
              data={[
                {
                  value: QuestionType.McqQues.type,
                  label: QuestionType.McqQues.name,
                },
                {
                  value: QuestionType.ShortQues.type,
                  label: QuestionType.ShortQues.name,
                },
                {
                  value: QuestionType.LongQues.type,
                  label: QuestionType.LongQues.name,
                },
                {
                  value: QuestionType.CaseQues.type,
                  label: QuestionType.CaseQues.name,
                },
              ]}
              value={sectionType}
              onChange={(val) => {
                if (val) {
                  setSectionType(val);
                }
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>Each Section Marks:</Text>
            <NumberInput
              value={sectionMarks}
              onChange={(val) => {
                if (val) setSectionMarks(val);
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>Each Section Negative Marks:</Text>
            <NumberInput
              value={eachSectionNegativemarks}
              onChange={(val) => {
                if (val) setEachSectionNegativeMarks(val);
              }}
            />
          </Flex>
          <Flex justify="right">
            <Button
              onClick={() => {
                const found = findQuestionType(sectionType);
                props.scrollToId(`section-${props.sections.length - 1}`);
                if (found)
                  props.setsections((prev) => {
                    return [
                      ...prev,
                      {
                        questionNo: 0,
                        totalMarks: sectionMarks,
                        sectionName: found.name,
                        type: found.type,
                        negativeMarks: eachSectionNegativemarks,
                      },
                    ];
                  });
                setIsAddNewSection(false);
              }}
              bg="#3174F3"
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
