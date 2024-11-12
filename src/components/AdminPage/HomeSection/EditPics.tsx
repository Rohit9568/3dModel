import {
  Box,
  Button,
  Grid,
  Group,
  Overlay,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { showNotification } from "@mantine/notifications";

interface SinglePicProps {
  id: number;
  imgUrl: string;
  allPics: { id: number; imgUrl: string; value: boolean }[];
  onPicClick: (id: number) => void;
}
function SinglePic(props: SinglePicProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isSelected = props.allPics.find(
    (x) => x.id === props.id && x.value === true
  )
    ? true
    : false;
  return (
    <div
      style={{
        width: "100%",
        height: isMd ? "150px" : "200px",
        marginTop: "10px",
        position: "relative",
        alignContent: "center",
      }}
      onClick={() => {
        props.onPicClick(props.id);
      }}
    >
      <img
        src={props.imgUrl}
        style={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <Overlay color="gray" />
      <div
        style={{
          border: `${!isSelected ? "gray solid 5px" : ""}`,
          height: "60px",
          width: "60px",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        {isSelected && (
          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconCheck
              style={{
                height: "90%",
                width: "90%",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
interface EditPicsProps {
  instituteId?: string;
  instituteName?: string;
  pics: string[];
  onDeleteClick: (data: string[]) => void;
  onBackClick: () => void;
}

export function EditPics(props: EditPicsProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [allPics, setAllPics] = useState<
    {
      id: number;
      imgUrl: string;
      value: boolean;
    }[]
  >([]);
  useEffect(() => {
    const pics1 = props.pics.map((x, i) => {
      return {
        id: i,
        imgUrl: x,
        value: false,
      };
    });
    setAllPics(pics1);
  }, [props.pics]);
  return (
    <Stack
      h="100%"
      style={{
        position: "relative",
      }}
    >
      <Grid>
        <Grid.Col span={2}>
          {/* <Box
            onClick={() => {
              props.onBackClick();
              Mixpanel.track(
                AdminPageEvents.ADMIN_APP_HOME_PAGE_BACK_ICON_CLICKED
              );
            }}
            style={{
              backgroundColor: "white",
              cursor: "pointer",
              maxWidth: "32px",
              maxHeight: "32px",
              marginRight: "auto",
            }}
          >
            <IconBackArrow col="black"></IconBackArrow>
          </Box> */}
        </Grid.Col>
        <Grid.Col span={8}>
          <Text
            style={{
              color: "#303030",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Image Library
          </Text>
        </Grid.Col>
      </Grid>
      <ScrollArea h={"100%"} pb={50}>
        <SimpleGrid cols={isMd ? 2 : 3} mx={10} my={10}>
          {props.pics.map((x, i) => {
            return (
              <SinglePic
                id={i}
                imgUrl={x}
                allPics={allPics}
                onPicClick={(id) => {
                  setAllPics((prev) => {
                    const prev1 = prev.map((x) => {
                      if (x.id === i) {
                        return {
                          id: id,
                          imgUrl: x.imgUrl,
                          value: !x.value,
                        };
                      }
                      return x;
                    });
                    return prev1;
                  });
                }}
              />
            );
          })}
        </SimpleGrid>
      </ScrollArea>

      <Group
        style={{
          zIndex: 1000,
          position: "fixed",
          width: "100%",
          bottom: 0,
          left: 0,
          borderTop: "1px solid #B7B7B7",
          borderBottom: "1px solid #B7B7B7",
          background: "#FFF",
          boxShadow: "0px -10px 9px 0px rgba(0, 0, 0, 0.04)",
        }}
        position="center"
        py={10}
      >
        <Button
          style={{
            backgroundColor:
              allPics.filter((x) => x.value === true).length === 0
                ? "white"
                : "#FF0000",
            width: "260px",
            fontSize: 16,
            fontWeight: 500,
            color:
              allPics.filter((x) => x.value === true).length === 0
                ? "#9B9B9B"
                : "white",
            border:
              allPics.filter((x) => x.value === true).length === 0
                ? "1px solid #9B9B9B"
                : "none",
          }}
          size="lg"
          disabled={allPics.filter((x) => x.value === true).length === 0}
          onClick={() => {
            showNotification({
              message: "Deleted Selected Images",
            });
            const selectedPics = allPics.filter((x) => x.value === true);
            const selectedPics1 = selectedPics.map((x) => {
              return x.imgUrl;
            });
            Mixpanel.track(
              AdminPageEvents.ADMIN_APP_HOME_PAGE_DELETE_BUTTON_CLICKED
            );
            props.onDeleteClick(selectedPics1);
          }}
        >
          Delete
        </Button>
      </Group>
    </Stack>
  );
}
