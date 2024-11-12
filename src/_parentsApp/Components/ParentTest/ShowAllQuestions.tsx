import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";
import { QuestionParentType, findQuestionType } from "../../../@types/QuestionTypes.d";

const ShowAllQuestions = (props: { allFilteredQuestions: any }) => {
  
  return (
    <Stack>
      {props.allFilteredQuestions.map((question: any, index: number) => {
        switch (findQuestionType(question.type).parentType) {
          case QuestionParentType.MCQQ:
            return <MCQReportQuestionCard index={index + 1}
              question={question.text}
              answers={question.answers}
            />;
          case QuestionParentType.SUBQ:
            return <SubjectiveQuestionCard index={index} question={question.text}  />;
          case QuestionParentType.CASEQ:
            return <CASEReportQuestionCard index={index} 
            question={question}
            />
          default:
            return null; 
        }
      })}
    </Stack>
  );
};

export default ShowAllQuestions;

export function MCQReportQuestionCard(props:{
  index:number,
  question:string,
  answers:string[]
}) {
  const isMd = useMediaQuery("(max-width:820px)");
  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl="5%">
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.index}.</Grid.Col>
            <Grid.Col span={11}>
              <Stack>
                <Flex
                  justify="space-between"
                  align="flex-start"
                  direction="column"
                >
                  <DisplayHtmlText text={props.question} />
                </Flex>
                {props.answers.map((x:any, index) => {
                  
                  return (
                    <Flex key={index}>
                      <Checkbox
                        radius={50}
                        styles={{
                          input: {
                            backgroundColor: "#D9D9D9",
                            borderColor: "#D9D9D9",
                          },
                        }}
                      />
                      <DisplayHtmlText text={x?.text} />
                    </Flex>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </>
  );
}

export function SubjectiveQuestionCard(props:{question:string,index:number}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl="5%">
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.index}.</Grid.Col>
            <Grid.Col span={11}>
              <Stack>
                <DisplayHtmlText text={props.question} />
                {/* <Flex>
                  <Text>Ans.</Text>
                  <DisplayHtmlText text={"Here is my answer"} />
                </Flex> */}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </>
  );
}

export function CASEReportQuestionCard(props:{
  question:any,
  index:number,
}) {
  
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl={"5%"}>
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.index}.</Grid.Col>
            <Grid.Col
              span={11}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Stack w="100%">
                <DisplayHtmlText text={props.question.type} />
                {props.question.questions.map((y:any, i:number) => {
                  
                  return (
                    <Stack key={i} w="100%">
                      <Flex>
                        <Text>{`${i + 1}.`}</Text>
                        <DisplayHtmlText text={y.text} />
                      </Flex>
                      {y.answers.map((x:any, index:number) => {
                        return (
                          <Group key={index} w="100%">
                            <Checkbox
                              radius={50}
                              styles={{
                                input: {
                                  backgroundColor: "#D9D9D9",
                                  borderColor: "#D9D9D9",
                                },
                              }}
                              w="10px"
                              
                            />
                            <DisplayHtmlText text={x.text} />
                          </Group>
                        );
                      })}
                    </Stack>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </>
  );
}