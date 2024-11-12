import {
  Header,
  createStyles,
  Group,
  Menu,
  Flex,
  Box,
  Center,
  Modal,
  Stack,
  TextInput,
  Text,
  ScrollArea,
  Divider,
  Loader,
} from "@mantine/core";
import { Logo } from "../Logo";
import ProfilePicture from "../ProfilePic/ProfilePic";
import { IsUserLoggedIn } from "../../utilities/AuthUtility";
import {
  GetUser,
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { IconMenu2, IconPlus, IconSearch, IconTrash } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import ToggleTeach from "../../_parentsApp/Components/ToggleTeachAndManage";
import { SideBarItems } from "../../@types/SideBar";
import { convertToHyphenSeparated } from "../../utilities/HelperFunctions";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { useEffect, useState } from "react";
import { GetAllInfoForInstitute } from "../../_parentsApp/features/instituteSlice";
import { getSimulationById } from "../../features/Simulations/getSimulationSlice";
import { fetchSearch } from "../../features/search/seaarchTagSlice";
import { IconCross, IconCross2 } from "../_Icons/CustonIcons";
import { SerachBarWeb } from "./SearchBarWeb";
import ProfilePicture2 from "../ProfilePic/ProfillePic2";

const useStyles = createStyles((theme) => ({
  check: {
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },
  mobile: {
    [theme.fn.smallerThan("md")]: {
      fontSize: "0.8rem",
      padding: "0.5rem",
    },
  },
}));

interface ShowNameProps {
  icon: string;
  logout: () => void;
}
export function ShowName(props: ShowNameProps) {
  const navigate = useNavigate();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div>
          <Box
            h={50}
            w={50}
            style={{
              borderRadius: "50%",
              // border:'red solid 1px',
              cursor: "pointer",
              backgroundColor: "white",
            }}
          >
            <Center w="100%" h="100%">
              <ProfilePicture2
                name={GetUser().name}
                size={40}
                profilePic=""
                isInitialFullName={true}
              ></ProfilePicture2>
            </Center>
          </Box>
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={() => {
            RemoveValueFromLocalStorage(LocalStorageKey.Token);
            RemoveValueFromLocalStorage(LocalStorageKey.User);
            Mixpanel.logout();
            props.logout();
            // navigate("/");
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

interface NavbarTeacherInterface {
  isSetup?: boolean;
  showSideBar?: boolean;
  SetSideBarVisibility?: () => void;
  itemSelected?: SideBarItems;
  disableSearch?: boolean;
  onLogout: () => void;
}

export const TopBarTeacher = (props: NavbarTeacherInterface) => {
  const { theme } = useStyles();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const [instituteInfo, setInstituteInfo] = useState<{
    name: string;
    icon: string;
  } | null>(null);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [isSearchFailed, setIssearchFailed] = useState<boolean>(false);
  const [inputValue, setInputvalue] = useState<string>("");
  const [topics, setTopics] = useState<
    | {
        _id: string;
        name: string;
        chapterId: string;
        subjectId: string;
      }[]
    | null
  >(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    const user = GetUser();
    GetAllInfoForInstitute({ id: user.instituteId })
      .then((x: any) => {
        setInstituteInfo({
          name: x.name,
          icon: x.schoolIcon,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function simulationClickHandler(id: string) {
    setLoading(true);
    navigate(`/allsimulations?id=${id}`);
  }

  return (
    <Flex
      h={70}
      style={{
        backgroundColor: theme.colors.gray[0],
        position: isMd ? "fixed" : "sticky",
        top: 0,
        zIndex: 2,
      }}
      w="100%"
    >
      <Flex
        justify={"space-between"}
        px={isMd ? 15 : 30}
        py={isMd ? 3 : 5}
        w="100%"
      >
        {/* <Group>
          {props.showSideBar !== undefined &&
            props.showSideBar &&
            props.itemSelected !== SideBarItems.WhiteBoard && (
              <IconMenu2 onClick={props.SetSideBarVisibility}></IconMenu2>
            )}
        </Group> */}
        {isMd && instituteInfo && (
          <Flex align="center" gap={10}>
            <img src={instituteInfo.icon} height={30} width={30} />
            <Text fz={12} fw={600}>
              {instituteInfo.name}
            </Text>
          </Flex>
        )}

        {!props.disableSearch && <SerachBarWeb width="50%" page="outer page" />}
        <Flex align={"center"}>
          {isMd && !props.disableSearch && (
            <IconSearch
              onClick={() => {
                navigate("/search");
              }}
              style={{
                marginRight: "10px",
              }}
            />
          )}
          {/* <ToggleTeach
            isTeach={true}
            firstButton={"Manage"}
            secondButton={"Teach"}
            cardColor={"#3174F3"}
            textColor={"#AEC9FF"}
            cardTextColor={"#FFFFFF"}
            onChange={function (val: string): void {}}
            instituteId={GetUser().instituteId}
            instituteName={convertToHyphenSeparated(GetUser().instituteName)}
          ></ToggleTeach> */}
          <Group pl={10}>
            {instituteInfo && IsUserLoggedIn() == true ? (
              <ShowName icon={instituteInfo?.icon} logout={props.onLogout} />
            ) : (
              ""
            )}
          </Group>
        </Flex>
      </Flex>
      <Modal
        opened={isModalOpened}
        onClose={() => {
          setIsModalOpened(false);
        }}
        styles={{
          overlay: {
            // backdropFilter:'blur(10)',
            // color:"whitesmoke",
            // background:"whitesmoke",
            // border:'red solid 1px'
          },
          modal: {
            padding: 0,
            margin: 0,
            minHeight: "500px",
          },
        }}
        // opacity={1}
        withCloseButton={false}
        overlayOpacity={0.4}
        overlayBlur={8}
        overlayColor="black"
        centered
        size="xl"
        m={0}
        p={0}
      >
        <>
          <Stack
            style={
              {
                // width:'100%'
              }
            }
          >
            <TextInput
              value={inputValue}
              onChange={(e) => {
                setInputvalue(e.currentTarget.value);
              }}
            />
          </Stack>
        </>
      </Modal>
    </Flex>
  );
};
