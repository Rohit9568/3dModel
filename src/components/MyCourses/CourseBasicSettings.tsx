import {
  Button,
  Divider,
  FileInput,
  Flex,
  Loader,
  NumberInput,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useParentCommunication from "../../hooks/useParentCommunication";
import { IconCurrencyRupee, IconX } from "@tabler/icons";
import { mimeFiles } from "../../utilities/react_native_communication";
import { IconDown2, IconUpload } from "../_Icons/CustonIcons";
import { useRef } from "react";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";

function TextInputLabel(props: {
  text: string;
  children: any;
  withoutDivider?: boolean;
  withoutStar?: boolean;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <Stack spacing={5} w="100%">
      <Text fz={isMd ? 16 : 18} color="#404040" fw={500}>
        {props.text}
        {(props.withoutStar === undefined ||
          (props.withoutStar !== undefined && props.withoutStar === false)) && (
          <span
            style={{
              color: "red",
            }}
          >
            *
          </span>
        )}
      </Text>
      {props.children}
      {!props.withoutDivider && <Divider color="#DEDEE5" mt={10} />}
    </Stack>
  );
}

const handleImageChange = (file: File) => {
  if (file) {
    const fileSize = file.size;
    const fileType = file.type;

    // Check if the file type is an image and size is within 10 MB (10 * 1024 * 1024 bytes)
    if (fileType.includes("image/") && fileSize <= 10 * 1024 * 1024) {
      return true;
    } else {
      showNotification({
        message:
          "The file is either not an image or exceeds the size limit (10 MB).",
      });
      return false;
    }
  } else {
    showNotification({ message: "Please select an image file." });
    return false;
  }
};

interface CourseBasicSettingsProps {
  isTestSeries: boolean;
  name: string;
  setname: (val: string) => void;
  setDescription: (val: string) => void;
  description: string;
  thumbnailFile: File | null;
  setThumbnailFile: (val: File | null) => void;
  setthumbnailFileName: (val: string | null) => void;
  setThumbnailFileUrl: (val: string) => void;
  setLoading: (val: boolean) => void;
  selectedPrice: number;
  setSelectedPrice: (val: number) => void;
  setSelectedDiscount: (val: number) => void;
  selectedDiscount: number;
  validityValue: number;
  setValidityValue: (val: number) => void;
  validityvalue1: string;
  setValidityValue1: (val: string) => void;
  userSubjects: UserClassAndSubjects[];
  thumbnailFilename: string | null;
  value: string;
  setValue: (val: string) => void;
  dateValue: Date | null;
  setDateValue: (val: Date | null) => void;
  thumbnailFileUrl: string;
  isDiscountInValid: boolean;
  handleFileUpload: (data: {
    url: string;
    fileName?: string;
    mimeType?: string;
  }) => void;
  setfreeCourseSelected: (val: boolean) => void;
  isFreeCourseSelected: boolean;
}
export function CourseBasicSettings(props: CourseBasicSettingsProps) {
  const { sendDataToReactnative } = useParentCommunication(
    props.handleFileUpload
  );
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const fileInputRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Stack
      px={isMd ? 20 : 70}
      style={{
        width: isMd ? "100%" : "50%",
      }}
      spacing={20}
    >
      <TextInputLabel text="Name">
        <TextInput
          placeholder={`Enter ${props.isTestSeries ? "Test" : "Course"} Name`}
          value={props.name}
          onChange={(e) => {
            props.setname(e.currentTarget.value);
          }}
          styles={{
            input: {
              border: "1px solid #808080",
              borderRadius: "5px",
              "&:focus-within": {
                border: "1px solid #808080",
              },
            },
            label: {
              fontSize: 16,
              fontWeight: 500,
            },
          }}
          withAsterisk
        />
      </TextInputLabel>

      <TextInputLabel text="Description">
        <Textarea
          autosize
          placeholder={`Enter ${
            props.isTestSeries ? "Test" : "Course"
          } Description`}
          value={props.description}
          onChange={(e) => {
            props.setDescription(e.currentTarget.value);
          }}
          styles={{
            input: {
              border: "1px solid #808080",
              borderRadius: "5px",
            },
            label: {
              fontSize: 16,
              fontWeight: 500,
            },
          }}
          minRows={5}
          withAsterisk
        />
      </TextInputLabel>
      <TextInputLabel text="Add Thumbnail" withoutStar={true}>
        <Flex>
          <Button
            style={{
              borderRadius: 24,
              border: "1px solid #4B65F6",
            }}
            variant="outline"
            onClick={() => {
              //@ts-ignore
              if (window.ReactNativeWebView) {
                sendDataToReactnative(0, {
                  mimeTypeArray: [mimeFiles.images],
                });
              } else fileInputRef.current?.click();
            }}
            leftIcon={<IconUpload />}
          >
            Upload thumbnail image
          </Button>
        </Flex>
        {props.thumbnailFilename !== null && props.thumbnailFileUrl === "" && (
          <Loader size={10} />
        )}
        {props.thumbnailFilename !== null && props.thumbnailFileUrl !== "" && (
          <Flex
            justify="space-between"
            style={{
              border: "black solid 1px",
              borderRadius: "20px",
            }}
            w={isMd ? "100%" : "50%"}
            px={10}
            py={5}
            mt={10}
            align="center"
          >
            <Text>{props.thumbnailFilename}</Text>
            <IconX
              onClick={() => {
                props.setThumbnailFileUrl("");
                props.setthumbnailFileName(null);
                props.setThumbnailFile(null);
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </Flex>
        )}
        <Text fz={14} fw={400}>
          Recommended Size:
          <span
            style={{
              fontWeight: 700,
            }}
          >
            240px 145px, PNG or JPEG file
          </span>
        </Text>
      </TextInputLabel>

      <TextInputLabel
        text={`${props.isTestSeries ? "Test" : "Course"} Duration`}
        withoutDivider={true}
      >
        <Radio.Group value={props.value} onChange={props.setValue}>
          <Stack>
            <Stack>
              <Radio value="Set Validity" label="Set Validity" />
              {props.value === "Set Validity" && (
                <Flex>
                  <NumberInput
                    value={props.validityValue}
                    onChange={(val) => {
                      if (val !== undefined) props.setValidityValue(val);
                    }}
                    mx={10}
                  />
                  <Select
                    value={props.validityvalue1}
                    onChange={(val) => {
                      if (val) props.setValidityValue1(val);
                    }}
                    data={["Year(s)", "Month(s)"]}
                  />
                </Flex>
              )}
            </Stack>
            <Stack>
              <Radio value="Set Expiry" label="Set Expiry" />
              {props.value === "Set Expiry" && (
                <DatePicker
                  value={props.dateValue}
                  onChange={props.setDateValue}
                  mx={20}
                />
              )}
            </Stack>

            <Radio value="Lifetime Validity" label="Lifetime Validity" />
          </Stack>
        </Radio.Group>
      </TextInputLabel>
      <Divider color="#DEDEE5" mt={20} />
      <Radio.Group
        value={props.isFreeCourseSelected ? "Free" : "Paid"}
        onChange={(val) => {
          if (val === "Free") props.setfreeCourseSelected(true);
          else props.setfreeCourseSelected(false);
        }}
      >
        <Stack>
          <Radio value="Free" label="Free" />
          <Radio value="Paid" label="Paid" />
        </Stack>
      </Radio.Group>
      {!props.isFreeCourseSelected && (
        <Stack>
          <Flex w="100%" justify="space-between">
            <Flex w="45%">
              <TextInputLabel text="Price" withoutDivider={true}>
                <NumberInput
                  value={props.selectedPrice}
                  onChange={(val) => {
                    if (val !== undefined) props.setSelectedPrice(val);
                    else props.setSelectedPrice(0);
                  }}
                  icon={<IconCurrencyRupee />}
                ></NumberInput>
              </TextInputLabel>
            </Flex>
            <Flex w="45%">
              <TextInputLabel
                text="Discount"
                withoutDivider={true}
                withoutStar={false}
              >
                <NumberInput
                  value={props.selectedDiscount}
                  onChange={(val) => {
                    if (val !== undefined) props.setSelectedDiscount(val);
                    else props.setSelectedDiscount(0);
                  }}
                  icon={<IconCurrencyRupee />}
                  min={0}
                  max={props.selectedPrice}
                  error={props.isDiscountInValid ? "Invalid Discount" : ""}
                ></NumberInput>
              </TextInputLabel>
            </Flex>
          </Flex>
          <Text fz={14} color="gray">
            {`(Total Price that will be shown to students(inclusive of 5%
                  platform fee)=${Math.floor(
                    props.selectedPrice -
                      props.selectedDiscount +
                      (5 / 100) * (props.selectedPrice - props.selectedDiscount)
                  )})`}
          </Text>
        </Stack>
      )}

      <FileInput
        style={{
          borderRadius: 24,
        }}
        value={props.thumbnailFile}
        onChange={props.setThumbnailFile}
        display="none"
        ref={fileInputRef}
      />
    </Stack>
  );
}
