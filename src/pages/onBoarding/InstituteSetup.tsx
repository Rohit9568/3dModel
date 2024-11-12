import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  getAutoGenPassword,
  getUserById,
  getUserDetails,
} from "../../features/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { User1 } from "../../@types/User";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { updateInstituteDetails } from "../../features/institute/institute";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import { IconRightArrow } from "../../components/_Icons/CustonIcons";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

export interface ExtendedDropzoneProps extends Partial<DropzoneProps> {
  onFileAdd: (file: File) => void;
}
export function BaseDemo(props: ExtendedDropzoneProps) {
  const theme = useMantineTheme();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        style={{
          width: 100,
          height: 100,
        }}
      />
    );
  });
  return (
    <Dropzone
      onDrop={(files) => {
        props.onFileAdd(files[0]);
        setFiles(files);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...props}
      multiple={false}
      style={{
        width: "100%",
      }}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 100, pointerEvents: "none", width: "100%" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        {files.length === 0 && (
          <Dropzone.Idle>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Idle>
        )}

        <div>
          {files.length === 0 && (
            <Text size="lg" inline>
              Drag images here or click to select files
            </Text>
          )}

          <Center w="100%">{previews}</Center>

          {/* <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text> */}
        </div>
      </Group>
    </Dropzone>
  );
}
export function InstituteSetup(props: {
  userId: string;
  onClose: (x: any) => void;
  opened: boolean;
}) {
  const [name, setName] = useState<string>("");
  const [instituteName, setInstituteName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const [currentPassword, setcurrentPassword] = useState<boolean>(false);

  const user1 = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  useEffect(() => {
    if (user1) {
      setName(user1?.name);
      setEmail(user1.email);
      setInstituteName(user1.instituteName);
      getAutoGenPassword(user1._id)
        .then((x: any) => {
          setPassword(x);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user1]);

  function submitHandler() {
    if (user1) {
      setIsLoading(true);
      updateInstituteDetails({
        name,
        email,
        password: currentPassword ? password : undefined,
        schoolLogo: fileUrl,
        instituteName,
        instituteId: user1?.instituteId,
      })
        .then((x) => {
          setIsLoading(false);
          props.onClose(x);
        })
        .catch((e) => {
          setIsLoading(false);

          console.log(e);
        });
    }
  }

  const isDisabled = () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      setError({ type: "name", message: "Name is required." });
      return { error: "Name is required." };
    }

    if (!email) {
      setError({ type: "email", message: "Email is required." });
      return { error: "Email is required." };
    }

    if (email.length < 3 || !emailRegex.test(email)) {
      setError({ type: "email", message: "Email is invalid." });
      return { error: "Email is invalid." };
    }

    if (!instituteName) {
      setError({
        type: "instituteName",
        message: "Institute name is required.",
      });
      return { error: "Institute name is required." };
    }

    if (instituteName.length < 3) {
      setError({
        type: "instituteName",
        message: "Institute name must be at least 3 characters long.",
      });
      return { error: "Institute name must be at least 3 characters long." };
    }
    if (fileUrl === "") {
      // setError({ type: "fileUrl", message: "File URL is required." });
      showNotification({
        message: "File is required.",
        color: "red",
        title: "Error",
      });
      return { error: "File URL is required." };
    }

    if (password.length < 4) {
      setError({
        type: "password",
        message: "Password must be at least 4 characters long.",
      });
      return { error: "Password must be at least 4 characters long." };
    }

    if (currentPassword === true && confirmPassword !== password) {
      setError({ type: "confirmPassword", message: "Passwords do not match." });
      return { error: "Passwords do not match." };
    }
    setError(null);
    return { error: null };
  };

  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Modal opened={props.opened} onClose={() => {}} withCloseButton={false}>
      <Stack>
        <Flex align="center">
          <img
            src={require("../../assets/createAcc.png")}
            style={{
              width: "50px",
            }}
          />
          <Text fw={700} ml={10}>
            Create Account
          </Text>
        </Flex>
        <Text fw={400} color="#898989" fz={20}>
          Create new account so that you can enjoy our services
        </Text>
        <Flex justify="center"></Flex>

        <Flex justify="center">
          <BaseDemo
            onFileAdd={(file) => {
              FileUpload({ file })
                .then((x) => {
                  setFileUrl(x.url);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          />
        </Flex>
        <TextInput
          value={instituteName}
          onChange={(e) => {
            setInstituteName(e.currentTarget.value);
          }}
          placeholder="Enter Institute Name"
          required
          label="Institute Name"
          styles={{
            label: {
              fontSize: isMd ? 14 : 16,
              marginBottom: 7,
            },
          }}
          size="md"
          error={error?.type === "instituteName" ? error.message : undefined}
          onClick={() => {
            error?.type === "instituteName" && setError(null);
          }}
        />
        <TextInput
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          placeholder="Your name goes here!"
          label="Your name"
          required
          styles={{
            label: {
              fontSize: isMd ? 14 : 18,
              marginBottom: 7,
            },
          }}
          size="md"
          error={error?.type === "name" ? error.message : undefined}
          onClick={() => {
            error?.type === "name" && setError(null);
          }}
        />
        <TextInput
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
          placeholder="Your email goes here!"
          label="Email"
          required
          styles={{
            label: {
              fontSize: isMd ? 14 : 18,
              marginBottom: 7,
            },
          }}
          size="md"
          type="email"
          error={error?.type === "email" ? error.message : undefined}
          onClick={() => {
            error?.type === "email" && setError(null);
          }}
        />
        <Stack>
          <TextInput
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
            placeholder="Enter Password"
            disabled={!currentPassword}
            label="Password"
            required
            styles={{
              label: {
                fontSize: isMd ? 14 : 18,
                marginBottom: 7,
              },
            }}
            size="md"
            error={error?.type === "password" ? error.message : undefined}
            onClick={() => {
              error?.type === "password" && setError(null);
            }}
          />
          {!currentPassword && (
            <Flex justify="right" mt={-10}>
              <Text
                onClick={() => {
                  setcurrentPassword(true);
                }}
                color="#3177FF"
                fz={15}
                style={{
                  cursor: "pointer",
                }}
              >
                Change Password?
              </Text>
            </Flex>
          )}
        </Stack>
        {currentPassword && (
          <TextInput
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.currentTarget.value);
            }}
            placeholder="Confirm Password"
            label="Confirm Password"
            required
            styles={{
              label: {
                fontSize: isMd ? 14 : 18,
                marginBottom: 7,
              },
            }}
            size="md"
            error={
              error?.type === "confirmPassword" ? error.message : undefined
            }
            onClick={() => {
              error?.type === "confirmPassword" && setError(null);
            }}
          />
        )}
        <Button
          onClick={() => {
            if (isDisabled().error === null) submitHandler();
          }}
          // disabled={error !== null}
          size="lg"
          bg="#4B65F6"
          sx={{
            "&:hover": {
              backgroundColor: "#3C51C5",
            },
          }}
        >
          Submit
          <IconRightArrow />
        </Button>
      </Stack>
    </Modal>
  );
}
