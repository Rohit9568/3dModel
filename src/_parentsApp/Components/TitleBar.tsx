import { Box, Button, Flex, Group, Menu, Text } from "@mantine/core";
import ProfilePicture from "../../components/ProfilePic/ProfilePic";
import {
  GetValueFromLocalStorage,
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { IconMenu2, IconTrash, IconUserCircle } from "@tabler/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import ProfilePicture2 from "../../components/ProfilePic/ProfillePic2";
import { ParentAppPage } from "../ParentsAppMain";
import useParentCommunication from "../../hooks/useParentCommunication";

interface TitleBarProps {
  schoolName: string;
  schoolIcon: string;
  isTeacher: boolean;
  isParent: boolean;
  instituteId: string;
  isTopicpageAccessed?: boolean;
  setisDrawerOpen?: (val: boolean) => void;
  selectedTab?: ParentAppPage;
  name?: string | null;
  profilePic: string;
  onLogout: () => void;
  mainPath: string;
  showDoubts: boolean;
  onShowProfileClick?: () => void;
}
interface ShowNameProps {
  isTeacher: boolean;
  icon: string;
  onLogout: () => void;
}

interface ShowName2Props {
  name: string;
  profilePic: string;
  mainPath: string;
  onShowProfileClick?: () => void;
}
export function ShowName2(props: ShowName2Props) {
  const navigate = useNavigate();
  const params = useParams();
  const instituteId = params.id;
  const instituteName = params.Institutename;
  const { isReactNativeActive } = useParentCommunication();
  return (
    <Menu shadow="md" width={100}>
      <Menu.Target>
        <div
          style={{
            cursor: "pointer",
          }}
        >
          <ProfilePicture2
            name={props.name}
            size={40}
            isInitialFullName={true}
            profilePic={props.profilePic}
          />
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        {props.onShowProfileClick && (
          <Menu.Item
            onClick={() => {
              if (props.onShowProfileClick) props.onShowProfileClick();
            }}
            icon={<IconUserCircle size={16} />}
          >
            Profile
          </Menu.Item>
        )}
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={() => {
            RemoveValueFromLocalStorage(LocalStorageKey.Token);
            RemoveValueFromLocalStorage(LocalStorageKey.User);
            Mixpanel.logout();
            if (isReactNativeActive()) {
              window.location.href = `/${instituteName}/${instituteId}/parent`;
            } else window.location.href = `/${props.mainPath}`;
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
const TitleBar = (props: TitleBarProps) => {
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width: 820px)`);

  const iconStyle = {
    marginRight: "15px",
    marginLeft: "15px",
    width: "30px",
    height: "30px",
  };
  if (!isMd) {
    return (
      <Box
        style={{
          backgroundColor: "#F8F9FA",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
        pr={20}
      >
        {props.isTopicpageAccessed && (
          <Button
            variant="outline"
            style={{
              zIndex: 999,
            }}
            onClick={() => {
              navigate(`/${props.mainPath}/study`);
            }}
          >
            Back To Home
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Flex
      style={{
        border: "1px solid #E9ECEF",
        width: "100%",
        height: "100%",
      }}
      justify="space-between"
      align="center"
    >
      <Flex align="center" style={{ marginBottom: "10px" }}>
        <img src={props.schoolIcon} alt="school Icon" style={iconStyle} />

        <Text
          style={{
            color: "#373737",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          {props.schoolName.length > 25
            ? `${props.schoolName.slice(0, 25)}...`
            : props.schoolName}
        </Text>
      </Flex>
      <Flex mr={20}>
        <ShowName2
          name={props.name ?? "User"}
          mainPath={props.mainPath}
          onShowProfileClick={props.onShowProfileClick}
          profilePic={props.profilePic}
        />
      </Flex>
    </Flex>
  );
};

export default TitleBar;
