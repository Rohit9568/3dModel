import {
  Box,
  Button,
  Flex,
  Menu,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { getColorForPercentage } from "../../../utilities/HelperFunctions";
import { IconEdit } from "../../_Icons/CustonIcons";
import { IconDotsVertical } from "@tabler/icons";
import { useEffect, useState } from "react";
import { DatePicker } from "@mantine/dates";
import { NameEditor } from "../../MyCourses/AddContentForCourses";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { User1 } from "../../../@types/User";
import { LoginUsers } from "../../Authentication/Login/Login";
import { useMediaQuery } from "@mantine/hooks";

interface ClassCardProps {
  averageScore: number;
  name: string;
  studentsCount: number;
  teachersCount: number;
  totalFeesPaid?: number;
  totalClassFees?: number;
  isTeacher?: boolean;
  onClick: () => void;
  onEditCourseFees?: () => void;
  onEditClassName?: (val: string) => void;
  onMonthlyCardDetailsCardClick?: () => void;
  isFeeFeature?: boolean;
  isReceiptFeature?: boolean;
}

export const ClassCard = (props: ClassCardProps) => {
  const [nameValue, setNameValue] = useState<string>(props.name);
  const [isnameEdit, setIsnameEdit] = useState<boolean>(false);
  const date = Date.now();

  useEffect(() => {
    setNameValue(props.name);
  }, [props.name]);

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <>
      <Box
        style={{
          cursor: "pointer",
          position: "relative",
          width: "100%",
          height: "82px",
          flexShrink: 0,
          borderRadius: "8px",
          background: "#FFF",
          boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
          paddingLeft: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "11px",
            borderRadius: "8px 0px 0px 8px",
            background: getColorForPercentage(props.averageScore),
          }}
        />
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            props.onClick();
          }}
        >
          {!isnameEdit && (
            <Text fz={16} weight={600}>
              {props.name}
            </Text>
          )}

          {isnameEdit && (
            <NameEditor
              fileName={nameValue}
              setOnRenameClicked={setIsnameEdit}
              onRenameClick={(val: string) => {
                if (props.onEditClassName) props.onEditClassName(val);
              }}
            />
          )}
          {props.isTeacher === undefined && (
            <Stack spacing={1}>
              <Text size="md" fz={12} style={{ color: "#929292" }}>
                Total Students: {props.studentsCount}
              </Text>
            </Stack>
          )}
          {props.isTeacher === false && (
            <Text size="md" fz={14} style={{ color: "#929292" }}>
              Total Students: {props.studentsCount}
            </Text>
          )}
        </Box>

        <Flex>
          {!props.isTeacher &&
            props.totalClassFees !== null &&
            props.totalClassFees !== 0 &&
            props.isReceiptFeature &&
            props.isReceiptFeature === true && (
              <Stack
                w="100%"
                spacing={1}
                onClick={() => {
                  props.onClick();
                }}
              >
                <Text
                  style={{
                    minWidth: isMd ? 100 : 150,
                  }}
                  fz={isMd ? 12 : 16}
                >
                  Total Fees Paid:
                </Text>
                <Text fz={isMd ? 12 : 16}>
                  <span
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {props.totalFeesPaid}
                  </span>
                  /{props.totalClassFees}
                </Text>
              </Stack>
            )}
          {!props.isTeacher &&
            props.isFeeFeature &&
            user &&
            user.role !== LoginUsers.TEACHER && (
              <Menu>
                <Menu.Target>
                  <Flex
                    style={{ cursor: "pointer" }}
                    align="center"
                    justify="center"
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    // }}
                    mr={20}
                    // mx={10}
                  >
                    <IconDotsVertical />
                  </Flex>
                </Menu.Target>
                <Menu.Dropdown px={0}>
                  <Menu.Item
                    onClick={(e) => {
                      setIsnameEdit(true);
                      // e.stopPropagation();
                    }}
                  >
                    <Flex align="center">
                      <Text fz={15} fw={600} ml={10}>
                        Rename
                      </Text>
                    </Flex>
                  </Menu.Item>
                  <Menu.Item
                    onClick={(e) => {
                      // e.stopPropagation();
                      if (props.onEditCourseFees) props.onEditCourseFees();
                    }}
                  >
                    <Flex align="center">
                      <Text fz={15} fw={600} ml={10}>
                        Edit Course Fees
                      </Text>
                    </Flex>
                  </Menu.Item>
                  <Menu.Item
                    onClick={(e) => {
                      // e.stopPropagation();
                      if (props.onMonthlyCardDetailsCardClick)
                        props.onMonthlyCardDetailsCardClick();
                    }}
                  >
                    <Flex align="center">
                      <Text fz={15} fw={600} ml={10}>
                        View Monthly Details
                      </Text>
                    </Flex>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
        </Flex>
      </Box>
    </>
  );
};

export default ClassCard;
