import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
  IconPalette,
  IconShare,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import {
  UpdateInstituteTheme,
  fetchAllThemes,
} from "../../features/websiteBuilder/websiteBuilderSlice";
import { InstituteTheme } from "../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { DashBoardSection } from "../AdminPage/DashBoard/DashBoard";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { convertToHyphenSeparated } from "../../utilities/HelperFunctions";
import { Icon } from "../../pages/_New/Teach";

export function TopBar(props: {
  instituteId: string;
  theme: InstituteTheme;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
  setSelectedSection: (val: DashBoardSection) => void;
}) {
  const [themeModal, setThemeModal] = useState<boolean>(false);
  const [allThemes, setAllThemes] = useState<InstituteTheme[]>();
  const [currentTheme, setCurrentTheme] = useState<InstituteTheme>(props.theme);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isShareLink, setIsShareLink] = useState<boolean>(false);
  const modifiedURL = getParentURL();

  useEffect(() => {
    fetchAllThemes()
      .then((data: any) => {
        setAllThemes(data.themes);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  async function onThemeChangeSubmitClick(themeId: string) {
    props.setIsLoading(true);
    UpdateInstituteTheme({ id: props.instituteId, themeId: themeId })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_APPLY_NEW_THEME_SUBMIT_BUTTON_CLICKED
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        props.setIsLoading(false);
      });
  }
  function getParentURL() {
    const currentUrl = window.location.href;
    const urlParts = new URL(currentUrl);
    const user = GetUser();
    const base = urlParts.origin;
    const modifiedUrl = `${base}/${convertToHyphenSeparated(
      user.instituteName
    )}/${user.instituteId}/home`;
    return modifiedUrl;
  }

  const sendMessage = (url: string) => {
    const messageText = encodeURIComponent(url);
    const messageUrl = `sms:?body=${messageText}`; // You can use other URL schemes for different messaging apps
    window.open(messageUrl);
  };

  return (
    <>
      <Flex
        pt={20}
        align={"center"}
        justify={"space-between"}
        style={{ zIndex: 99 }}
        pl={"5%"}
        pr={isMd ? 10 : "20%"}
        bg={"white"}
      >
        <Button
          variant="outline"
          color="dark"
          leftIcon={<IconPalette />}
          onClick={() => setThemeModal(true)}
        >
          Change Theme
        </Button>
        {isMd && <Group></Group>}
        <Group>
          {!isMd && (
            <>
              <Button
                variant="outline"
                color="dark"
                leftIcon={<IconShare />}
                onClick={() => {
                  setIsShareLink(true);
                }}
              >
                Share
              </Button>
            </>
          )}
          {isMd && (
            <>
              <IconShare
                onClick={() => {
                  setIsShareLink(true);
                }}
              />
            </>
          )}
        </Group>
      </Flex>
      <Modal
        opened={themeModal}
        onClose={() => setThemeModal(false)}
        centered
        zIndex={999}
        title={"Change Theme"}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Flex align="center" justify={"space-between"}>
          {allThemes?.map((theme: InstituteTheme) => {
            return (
              <>
                <Box
                  w={75}
                  h={75}
                  p={"1%"}
                  style={{
                    border:
                      currentTheme._id === theme._id ? "2px solid #263238" : "",
                    borderRadius: "50%",
                  }}
                  onClick={() => {
                    setCurrentTheme(theme);
                  }}
                >
                  <Box
                    w={"100%"}
                    h={"100%"}
                    bg={theme.primaryColor}
                    style={{ borderRadius: "50%" }}
                  ></Box>
                </Box>
              </>
            );
          })}
        </Flex>
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setThemeModal(false)}
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
              onThemeChangeSubmitClick(currentTheme._id);
              setThemeModal(false);
            }}
          >
            Apply new theme
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={isShareLink}
        onClose={() => {
          setIsShareLink(false);
        }}
        zIndex={999}
        title="Share Website Link"
        centered
      >
        <Stack>
          <Flex>
            <FacebookShareButton url={modifiedURL}>
              <Icon
                name="Facebook"
                icon={<IconBrandFacebook color="white" />}
                onClick={() => {}}
                color="#1776F1"
              />
            </FacebookShareButton>

            <WhatsappShareButton url={modifiedURL}>
              <Icon
                name="Whatsapp"
                icon={<IconBrandWhatsapp color="white" />}
                onClick={() => {}}
                color="#43C553"
              />
            </WhatsappShareButton>

            <EmailShareButton url={modifiedURL}>
              <Icon
                name="Email"
                icon={<IconMail color="white" />}
                onClick={() => {}}
                color="#E0534A"
              />
            </EmailShareButton>
            <Icon
              name="Message"
              icon={<IconMessage2 color="white" />}
              onClick={() => {
                sendMessage(modifiedURL);
              }}
              color="#0859C5"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <TextInput
              style={{
                // border: "gray solid 1px",
                marginRight: "5px",
                // borderRadius: "10px",
                // padding: "7px",
                height: "40px",
                width: "95%",
              }}
              value={modifiedURL}
            >
              {/* {!isMd && modifiedURL.slice(0, 30).concat("...")}
              {isMd && modifiedURL.slice(0, 20).concat("...")} */}
            </TextInput>
            <CopyToClipboard text={modifiedURL}>
              <Button
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
