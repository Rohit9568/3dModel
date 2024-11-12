import {
  Stack,
  Flex,
  Text,
  Progress,
  Image,
  Badge,
  Table,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";


const SubjectTable = (props: {
  section: string;
  marks: number;
  totalMarks:number;
  data: QuestionWiseTableData[];
}) => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const isMd = useMediaQuery("(max-width:820px)");
  return (
    <Stack
      sx={{
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: "10px",
        height: "100%",
      }}
      w={"100%"}
    >
      <Flex
        justify={"space-between"}
        direction={isMd ? "column" : "row"}
        sx={{
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "1.4rem",
          paddingBottom: "1.4rem",
        }}
      >
        <Text fw={500} fz="sm">
          {props.section}
        </Text>
        <Flex
          sx={{ width: isMd ? "100%" : "50%" }}
          justify={isMd ? "space-between" : "center"}
          gap={5}
          align={"center"}
        >
          <Progress size={16} w={"80%"} value={props.marks*100/props.totalMarks} color="#4b65f6" />
          <Text fw={500} fz="sm">
            {(props.marks*100/props.totalMarks).toFixed(2) + "%"}
          </Text>
          {isCollapse ? (
            <Image
              src={require("../../../assets/downCollapse.png")}
              width={15}
              sx={{ cursor: "pointer" }}
              onClick={() => setIsCollapse(!isCollapse)}
            />
          ) : (
            <Image
              src={require("../../../assets/righcollapse.png")}
              width={8}
              sx={{ cursor: "pointer" }}
              onClick={() => setIsCollapse(!isCollapse)}
            />
          )}
        </Flex>
      </Flex>
      {(props.data && props.data.length>0) && isCollapse ? (
        <Table
          sx={{ width: "100%" }}
          withColumnBorders
          highlightOnHover
          style={{ overflowX: isMd ? "scroll" : "visible" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#E4EDFD" }}>
              <th style={{ borderColor: "#C7DBFF", borderWidth: "2px",textAlign: "center"}}>
                Que.
              </th>
              <th style={{ borderColor: "#C7DBFF", borderWidth: "2px",textAlign: "center" }}>
                Topic
              </th>
              <th style={{ borderColor: "#C7DBFF", borderWidth: "2px",textAlign: "center"}}>
                Score
              </th>
              <th style={{ borderColor: "#C7DBFF", borderWidth: "2px",textAlign: "center" }}>
                Correct %
              </th>
              <th style={{ borderColor: "#C7DBFF", borderWidth: "2px",textAlign: "center" }}>
                Attempt Order
              </th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((row) => (
              <tr key={row.id}>
                <td style={{ borderColor: "#C7DBFF", borderWidth: "2px",  textAlign: "center",}}>
                  <Badge color={row.color} size="lg">
                    {row.id+1}
                  </Badge>
                </td>
                <td style={{ borderColor: "#C7DBFF", borderWidth: "2px" }}>
                  {row.topic}
                </td>
                <td
                  style={{
                    borderColor: "#C7DBFF",
                    borderWidth: "2px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {row.score}
                </td>
                <td
                  style={{
                    borderColor: "#C7DBFF",
                    borderWidth: "2px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {row.percentage}
                </td>
                <td
                  style={{
                    borderColor: "#C7DBFF",
                    borderWidth: "2px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {row.attemptOrder!=-1? row.attemptOrder:"N.A."}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        ""
      )}
    </Stack>
  );
};

export default SubjectTable;
