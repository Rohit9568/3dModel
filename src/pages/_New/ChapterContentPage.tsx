import {
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconLeftArrow } from "../../components/_Icons/CustonIcons";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { SingleCard } from "../../components/AdminPage/DashBoard/DashBoardCards";
import UploadResources from "../../components/_New/NewPageDesign/UploadResources";
import { fetchCurrentChapter } from "../../features/UserSubject/TeacherSubjectSlice";
import TestPage2 from "../../components/_New/NewPageDesign/TestPage2";
import ViewSimulations from "../../components/TeachPage/ViewSimulations";
import ViewVideos from "../../components/TeachPage/ViewVideos";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
  IconShare,
} from "@tabler/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GetUser } from "../../utilities/LocalstorageUtility";
import {
  convertToHyphenSeparated,
  sendMessage,
} from "../../utilities/HelperFunctions";
import { UpdateShareStatus } from "../../features/UserSubject/chapterDataSlice";
import { Icon } from "./Teach";
import { UserType } from "../../components/AdminPage/DashBoard/InstituteBatchesSection";
import { showNotification } from "@mantine/notifications";

interface ChapterContentPageProps {
  userChapterId: string;
  userChapterName: string;
  userSubjectId: string;
  userType: UserType;
  batchId: string;
  onBackClick: () => void;
}

enum ChapterContentPageSection {
  HOME,
  SIMULATIONS,
  VIDEOS,
  QUESTIONBANK,
}

export function ChapterContentPage(props: ChapterContentPageProps) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [currentChapter, setCurrentChapter] = useState<SingleChapter>();
  const [contentPageSection, setContentPageSection] =
    useState<ChapterContentPageSection>(ChapterContentPageSection.HOME);
  const [openShareModal, setShareModalOpen] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const modifiedURL =
    props.userType == UserType.OTHERS ? appendParentToBaseUrl() : "";

  function appendParentToBaseUrl() {
    const currentUrl = window.location.href;
    const user = GetUser();
    const urlParts = new URL(currentUrl);
    const base = urlParts.origin;
    const modifiedUrl = `${base}/${convertToHyphenSeparated(
      user.instituteName
    )}/${user.instituteId}/parent`;
    return modifiedUrl;
  }

  const [chapterInfoCards, setChapterInfoCards] = useState<
    {
      heading: string;
      iconPath: string;
      displayNumber: number;
      dashColor: string;
      OnCardClick: () => void;
    }[]
  >();

  const [modalSimulation, setModalSimulation] = useState<{
    name: string;
    _id: string;
    isSimulationPremium: boolean;
    videoUrl: string;
  } | null>(null);

  useEffect(() => {
    if (updateData) {
      fetchCurrentChapter({ chapter_id: props.userChapterId })
        .then((x: any) => {
          setCurrentChapter(x);
          const chapterInfoCards = [
            //simulation card
            {
              heading: "Simulations",
              iconPath: require("../../assets/simulationicon.png"),
              displayNumber: x.simulations.length ?? 0,
              dashColor: "#99E6FC",
              OnCardClick: () => {
                setContentPageSection(ChapterContentPageSection.SIMULATIONS);
              },
            },
            //video card
            {
              heading: "Videos",
              iconPath: require("../../assets/videoicon.png"),
              displayNumber: x.videos.length ?? 0,
              dashColor: "#EA6B80",
              OnCardClick: () => {
                setContentPageSection(ChapterContentPageSection.VIDEOS);
              },
            },
          ];
          if (props.userType == UserType.OTHERS) {
            chapterInfoCards.push(
              //question bank card
              {
                heading: "Question Bank",
                iconPath: require("../../assets/questionbankicon.png"),
                displayNumber: x.chapterQuestionsCount ?? 0,
                dashColor: "#EABC6B",
                OnCardClick: () => {
                  setContentPageSection(ChapterContentPageSection.QUESTIONBANK);
                },
              }
            );
          }
          setChapterInfoCards(chapterInfoCards);
          setUpdateData(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [updateData]);

  function updateShareStatus() {
    if (currentChapter?.sharedBatches.indexOf(props.batchId) == -1) {
      currentChapter?.sharedBatches.push(props.batchId);
      UpdateShareStatus({
        chapterId: props.userChapterId,
        subjectId: props.userSubjectId,
        batches: currentChapter?.sharedBatches??[],
      })
        .then((x: any) => {
          setUpdateData(true);
          setShareModalOpen(true);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      UpdateShareStatus({
        chapterId: props.userChapterId,
        subjectId: props.userSubjectId,
        batches: currentChapter?.sharedBatches??[],
      })
        .then((x: any) => {
          setUpdateData(true);
          setShareModalOpen(true);
        })
        .catch((e) => {
          console.log(e);
        });
      showNotification({ message: "Chapter Already Shared" });
    }
  }

  return (
    <>
      <LoadingOverlay visible={loading} />
      {contentPageSection == ChapterContentPageSection.HOME && (
        <Stack w={"100%"}>
          <Flex align={"center"}>
            <Center
              h={8}
              w={8}
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.onBackClick();
              }}
            >
              <IconLeftArrow />
            </Center>
            <Text fz={20} fw={700} m={18}>
              {props.userChapterName}
            </Text>

            {props.userType == UserType.OTHERS && (
              <Center
                h={24}
                w={24}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  updateShareStatus();
                }}
              >
                <IconShare />
              </Center>
            )}
          </Flex>

          <SimpleGrid cols={isMd ? 1 : 3}>
            {chapterInfoCards != null &&
              chapterInfoCards.map((item) => {
                return (
                  <>
                    <SingleCard
                      heading={item.heading}
                      displayNumber={item.displayNumber.toString()}
                      icon={item.iconPath}
                      dashColor={item.dashColor}
                      imageBackgroundColor="#FFFFFF"
                      hasNextButton={true}
                      fontSize={24}
                      headingColor="#000000"
                      OnCardClick={() => {
                        item.OnCardClick();
                      }}
                    />
                  </>
                );
              })}
          </SimpleGrid>

          {currentChapter != null && (
            <UploadResources
              chapter={currentChapter}
              isLoading={false}
              setLoadingData={(updateData: boolean) => {
                if (updateData) {
                  setCurrentChapter(currentChapter);
                  setUpdateData(true);
                }
              }}
              setloading={(updateData: boolean) => {
                if (updateData) setLoading(true);
              }}
              userType={props.userType}
            />
          )}
        </Stack>
      )}

      {contentPageSection == ChapterContentPageSection.QUESTIONBANK && (
        <TestPage2
          chapterId={props.userChapterId}
          setLoadingData={(updateData: boolean) => {
            if (updateData) {
              setCurrentChapter(currentChapter);
              setUpdateData(true);
            }
          }}
          userType={props.userType}
          onBackClick={() => {
            setContentPageSection(ChapterContentPageSection.HOME);
          }}
        />
      )}
      {contentPageSection === ChapterContentPageSection.SIMULATIONS && (
        <ViewSimulations
          chapterId={currentChapter!!._id}
          simulations={currentChapter!!.simulations}
          onBackClick={() => {
            setContentPageSection(ChapterContentPageSection.HOME);
          }}
          setLoadingData={(updateData: boolean) => {
            if (updateData) {
              setCurrentChapter(currentChapter);
              setUpdateData(true);
            }
          }}
          userType={props.userType}
        />
      )}
      {contentPageSection === ChapterContentPageSection.VIDEOS && (
        <ViewVideos
          chapterId={currentChapter!!._id}
          videos={currentChapter!!.videos}
          onBackClick={() => {
            setContentPageSection(ChapterContentPageSection.HOME);
          }}
          setLoadingData={(updateData: boolean) => {
            if (updateData) {
              setCurrentChapter(currentChapter);
              setUpdateData(true);
            }
          }}
          userType={props.userType}
        />
      )}

      <Modal
        opened={openShareModal}
        onClose={() => {
          setShareModalOpen(false);
        }}
        title="Chapter shared with students!"
        centered
      >
        <Stack>
          <Flex>
            <FacebookShareButton url={modifiedURL}>
              <Icon
                name="Facebook"
                icon={
                  <IconBrandFacebook height={24} width={24} color="white" />
                }
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
                marginRight: "5px",
                height: "40px",
                width: "95%",
              }}
              value={modifiedURL}
            ></TextInput>
            <CopyToClipboard text={modifiedURL}>
              <Button
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
                onClick={() => {}}
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
