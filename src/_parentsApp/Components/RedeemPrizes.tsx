import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetInstituteGifts } from "../features/instituteSlice";
import { RootState } from "../../store/ReduxStore";
import { GiftRedeemCard } from "./GiftRedeemCard";
import { GetStudentGifts, RedeemGift } from "../features/instituteStudentSlice";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

export function RedeemPrizesSection(props: {
  totalPoints: number;
  redeemedPoints: number;
  studentId: string;
  onRedeemClick: () => void;
}) {
  const [allInstituteGifts, setALlInstituteGifts] = useState<InstituteGift[]>(
    []
  );
  const [allStudentGifts, setAllStudentGifts] = useState<StudentGift[]>([]);
  const [redeemWarning, setRedeemWarning] = useState<InstituteGift | null>(
    null
  );
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  function fetchInstituteGifts() {
    setIsLoading(true);
    GetInstituteGifts({
      id: instituteDetails?._id!!,
    })
      .then((data: any) => {
        setIsLoading(false);
        setALlInstituteGifts(data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }
  function fetchStudentGifts() {
    setIsLoading(true);
    GetStudentGifts({
      id: props.studentId,
    })
      .then((data: any) => {
        setAllStudentGifts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchInstituteGifts();
    fetchStudentGifts();
  }, []);
 

  function redeemGifthandler(gift: InstituteGift) {
    if (gift.points > props.totalPoints - props.redeemedPoints) {
      showNotification({
        message: "You don't have enough points to redeem this gift",
      });
      return;
    } else {
      setIsLoading(true);
      RedeemGift({
        id: props.studentId,
        giftId: gift._id,
      })
        .then((x) => {
          setIsLoading(false);
          fetchStudentGifts();
          props.onRedeemClick();
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
          showNotification({
            message: "Failed to redeem gift",
          });
        });
    }
  }
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack px={isMd ? 20 : 0}>
        {allInstituteGifts.length === 0 && (
          <Center h="80vh">
            <Stack align="center">
              <img src={require("../../assets/emptyInstituteGift.png")} />
              <Text fz={20} fw={600}>
                Prizes not added yet!
              </Text>
            </Stack>
          </Center>
        )}
        {allInstituteGifts.length > 0 && (
          <>
            <Flex justify="space-between" direction={isMd ? "column" : "row"}>
              <Stack
                style={{
                  border: "1px solid #D3D3D3",
                  borderRadius: 10,
                }}
                w={isMd ? "100%" : 400}
                px={30}
                pt={20}
                pb={30}
                spacing={0}
                h="100%"
              >
                <Text fz={48}>{props.totalPoints - props.redeemedPoints}</Text>
                <Flex align="center" gap={10} mt={-10}>
                  <img src={require("../../assets/coinImage.png")} width={20} />
                  <Text fz={15} fw={400}>
                    Available Points
                  </Text>
                </Flex>
                <Progress
                  value={
                    ((props.totalPoints - props.redeemedPoints) /
                      props.totalPoints) *
                    100
                  }
                  color="#FAA300"
                  mt={20}
                />
              </Stack>
              <Carousel
                mt={isMd ? 20 : 0}
                getEmblaApi={setEmbla}
                slideGap={20}
                align="start"
                w={isMd ? "100%" : "60%"}
                nextControlIcon={
                  <IconChevronRight size={70} stroke={1} color="#747474" />
                }
                previousControlIcon={
                  <IconChevronLeft size={70} stroke={1} color="#747474" />
                }
                styles={{
                  root: {
                    maxWidth: "100%",
                    margin: 0,
                  },
                  controls: {
                    top: 0,
                    height: "100%",
                    padding: "0px",
                    margin: "0px",
                  },
                  control: {
                    background: "transparent",
                    boxShadow: "none",
                    height: "100px",
                    padding: 0,
                    "&[data-inactive]": {
                      opacity: 0,
                      cursor: "default",
                    },
                    width: "10px",
                    border: "none",
                  },
                  indicator: {
                    width: 8,
                    height: 8,
                    backgroundColor: "red",
                  },
                  indicators: {
                    top: "110%",
                  },
                }}
                m={0}
                slideSize="auto"
                px={30}
                p={0}
              >
                {allStudentGifts.map((gift, index) => (
                  <Carousel.Slide>
                    <Stack
                      style={{
                        border: "1px solid #D3D3D3",
                        borderRadius: 10,
                      }}
                      align="center"
                      py={isMd ? 10 : 15}
                      px={isMd ? 10 : 20}
                      spacing={6}
                    >
                      <img
                        src={gift.imageLink}
                        style={{
                          width: "50%",
                        }}
                      />
                      <Text fw={700} fz={15}>
                        {gift.title}
                      </Text>
                      {gift.isConfirmedFromTeacher && (
                        <Text color="#888888" fz={14}>
                          Confirmed
                        </Text>
                      )}
                    </Stack>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Flex>
            <Text fz={16} fw={600}>
              Category Name
            </Text>
            <SimpleGrid cols={isMd ? 2 : 4} spacing={isMd ? 25 : 50}>
              {allInstituteGifts.map((gift, index) => {
                return (
                  <GiftRedeemCard
                    gift={gift}
                    onRedeemClick={() => {
                      setRedeemWarning(gift);
                    }}
                    btnText="Redeem"
                    isDisabled={
                      allStudentGifts.findIndex((x) => {
                        return x.instituteGiftId === gift._id;
                      }) !== -1
                    }
                  />
                );
              })}
            </SimpleGrid>
          </>
        )}
      </Stack>
      <Modal
        opened={redeemWarning !== null}
        onClose={() => {
          setRedeemWarning(null);
        }}
        title="Redeem Prize"
        centered
        styles={{
          title: {
            fontWeight: 700,
            fontSize: 20,
          },
        }}
      >
        <Text>
          You are about to redeem a prize. Are you sure you want to continue?
        </Text>
        <Flex justify="right" mt={10} gap={10}>
          <Button
            style={{ borderRadius: "24px" }}
            size="md"
            onClick={() => {
              setRedeemWarning(null);
            }}
            sx={{
              color: "#000000",
              border: "1px solid #808080",
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            bg="#4B65F6"
            style={{ borderRadius: "24px" }}
            size="md"
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              redeemGifthandler(redeemWarning!!);
              setRedeemWarning(null);
            }}
          >
            Yes,Redeem
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
