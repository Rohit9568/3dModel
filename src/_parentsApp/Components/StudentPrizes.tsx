import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { GetStudentGifts } from "../features/instituteStudentSlice";
import { GiftRedeemCard } from "./GiftRedeemCard";
import { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { UpdateStudentGiftIsRedeemedStatus } from "../../features/studentGift/studentGiftSlice";

export function StudentPrizes(props: {
  studentId: string;
  onFetchGift: () => void;
  allStudentGifts: StudentGift[];
}) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmationWarning, setConfirmationWarning] =
    useState<StudentGift | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  function updateStudentGift(gift: StudentGift) {
    setIsLoading(true);
    UpdateStudentGiftIsRedeemedStatus({
      id: gift._id,
    })
      .then((x) => {
        setIsLoading(false);
        props.onFetchGift();
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }
  return (
    <>
      <Stack
        style={{
          boxShadow: "0px 0px 30px 0px #0000001A",
          height: "100%",
          borderRadius: 10,
        }}
        py={25}
        px={15}
      >
        <Text fz={18} fw={700}>
          Redeemed Prizes
        </Text>
        <Carousel
          getEmblaApi={setEmbla}
          slideGap={20}
          align="start"
          w={"100%"}
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
          slideSize={"100%"}
          px={30}
          p={0}
        >
          {props.allStudentGifts.map((gift, index) => {
            return (
              <Carousel.Slide>
                <GiftRedeemCard
                  gift={gift}
                  onRedeemClick={() => {
                    if (!gift.isConfirmedFromTeacher) {
                      setConfirmationWarning(gift);
                    }
                  }}
                  btnText="Confirm"
                  isDisabled={gift.isConfirmedFromTeacher}
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Stack>
      <LoadingOverlay visible={isLoading} />
      <Modal
        opened={confirmationWarning !== null}
        onClose={() => {
          setConfirmationWarning(null);
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
          Are you sure you want to confirm the redemption of this prize?
        </Text>
        <Flex justify="right" mt={10} gap={10}>
          <Button
            style={{ borderRadius: "24px" }}
            size="md"
            onClick={() => {
              setConfirmationWarning(null);
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
              updateStudentGift(confirmationWarning!!);
              setConfirmationWarning(null);
            }}
          >
            Yes,Confirm
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
