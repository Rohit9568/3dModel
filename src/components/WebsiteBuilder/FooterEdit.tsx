import {
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons";
import { useEffect, useState } from "react";
import { UpdateFooterSection } from "../../features/websiteBuilder/websiteBuilderSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};
function validatePhoneNumber(phoneNumber: string) {
  const isValidLength = phoneNumber.length === 10;
  const containsOnlyDigits = /^\d+$/.test(phoneNumber);
  return isValidLength && containsOnlyDigits;
}

export function isValidYouTubeLink(url: string) {
  if (url.trim() === "") return true;
  const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  if (youtubeRegex.test(url)) {
    return true;
  } else {
    return false;
  }
}

export function FooterEdit(props: {
  footerDescription: string;
  phoneNumber: string;
  secondPhoneNumber: string;
  email: string;
  instituteAddress: string;
  secondinstituteAddress: string;
  instituteId: string;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
  instagramLink: string;
  facebookLink: string;
  youtubeLink: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const [footerModal, setfooterModal] = useState<boolean>(false);
  const [footerData, setFooterData] = useState<{
    description: string;
    address: string;
    email: string;
    phone: string;
    youtubeLink: string;
    instagramLink: string;
    facebookLink: string;
    secondAddress: string;
    secondInstituteNumber: string;
  }>({
    description: props.footerDescription,
    address: props.instituteAddress,
    email: props.email,
    phone: props.phoneNumber,
    youtubeLink: props.youtubeLink,
    instagramLink: props.instagramLink,
    facebookLink: props.facebookLink,
    secondAddress: props.secondinstituteAddress,
    secondInstituteNumber: props.secondPhoneNumber,
  });

  useEffect(() => {
    if (footerModal)
      setFooterData({
        description: props.footerDescription,
        address: props.instituteAddress,
        email: props.email,
        phone: props.phoneNumber,
        facebookLink: props.facebookLink,
        instagramLink: props.instagramLink,
        youtubeLink: props.youtubeLink,
        secondAddress: props.secondinstituteAddress,
        secondInstituteNumber: props.secondPhoneNumber,
      });
  }, [footerModal]);
  function updateFooterData() {
    props.setIsLoading(true);
    UpdateFooterSection({ id: props.instituteId, footerData: footerData })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_FOOTER_SUBMIT_BUTTON_CLICKED
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }
  return (
    <>
      <Stack>
        <Group>
          <Text fz={isMd ? 28 : 40} fw={700}>
            Footer
          </Text>
          <IconEdit
            width={30}
            height={30}
            style={{ cursor: "pointer" }}
            onClick={() => setfooterModal(true)}
          />
        </Group>
        <Flex
          w={"100%"}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
          p={30}
          direction={isMd ? "column" : "row"}
          justify={"space-between"}
          gap={20}
        >
          <Stack w={isMd ? "96%" : "48%"}>
            <Text>Description</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              h={"100%"}
              onClick={() => setfooterModal(true)}
            >
              {props.footerDescription}
            </Text>
          </Stack>
          <Stack w={isMd ? "96%" : "48%"} h={"100%"}>
            <Text>Phone Number</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.phoneNumber}
            </Text>
            <Text>Second Phone Number</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.secondPhoneNumber}
            </Text>
            <Text>Address</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.instituteAddress}
            </Text>
            <Text>2nd Address</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.secondinstituteAddress}
            </Text>
            <Text>Email</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.email}
            </Text>
            <Text>Youtube</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.youtubeLink}
            </Text>
            <Text>Instagram</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.instagramLink}
            </Text>
            <Text>Facebook</Text>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              mih={40}
              onClick={() => setfooterModal(true)}
            >
              {props.facebookLink}
            </Text>
          </Stack>
        </Flex>
      </Stack>
      <Modal
        opened={footerModal}
        onClose={() => setfooterModal(false)}
        centered
        zIndex={999}
        title={"Change Footer Data"}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Stack>
          <Text>Description</Text>
          <Textarea
            value={footerData.description}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                description: event.currentTarget.value,
              })
            }
          />
          <Text>Phone Number</Text>
          <Textarea
            error={!validatePhoneNumber(footerData.phone)}
            value={footerData.phone}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                phone: event.currentTarget.value,
              })
            }
          />
          <Text>Second Phone Number</Text>
          <Textarea
            error={!validatePhoneNumber(footerData.phone)}
            value={footerData.secondInstituteNumber}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                secondInstituteNumber: event.currentTarget.value,
              })
            }
          />
          <Text>Address</Text>
          <Textarea
            value={footerData.address}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                address: event.currentTarget.value,
              })
            }
          />
          <Text>Second Address</Text>
          <Textarea
            value={footerData.secondAddress}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                secondAddress: event.currentTarget.value,
              })
            }
          />
          <Text>Email</Text>
          <Textarea
            error={!isValidEmail(footerData.email)}
            value={footerData.email}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                email: event.currentTarget.value,
              })
            }
          />
          <Text>Youtube</Text>
          <Textarea
            error={!isValidYouTubeLink(footerData.youtubeLink)}
            value={footerData.youtubeLink}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                youtubeLink: event.currentTarget.value,
              })
            }
          />
          <Text>Instagram</Text>
          <Textarea
            // error={!isValidInstagramLink(footerData.instagramLink)}
            value={footerData.instagramLink}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                instagramLink: event.currentTarget.value,
              })
            }
          />
          <Text>Facebook</Text>
          <Textarea
            // error={!isValidFacebookLink(footerData.facebookLink)}
            value={footerData.facebookLink}
            autosize
            onChange={(event) =>
              setFooterData({
                ...footerData,
                facebookLink: event.currentTarget.value,
              })
            }
          />
        </Stack>
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setfooterModal(false)}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            sx={{
              backgroundColor: "#4B65F6",
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              updateFooterData();
              setfooterModal(false);
            }}
            disabled={
              !(
                validatePhoneNumber(footerData.phone) &&
                isValidEmail(footerData.email) &&
                isValidYouTubeLink(footerData.youtubeLink)
              )
            }
          >
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
}
