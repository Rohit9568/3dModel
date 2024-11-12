import {
  Box,
  Button,
  Flex,
  Modal,
  SimpleGrid,
  Stack,
  Center,
  Group,
  Text,
  Grid,
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  InstituteUserCard,
  InstituteUserProfileCarousel,
} from "../DashBoardCards";
import { useState } from "react";
import AddStaffModal from "../Models/AddStaffModel";
import {
  getUserById,
  updateUserDetails,
} from "../../../../features/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/ReduxStore";
import {
  AddNewteacher,
  DeleteUserFromInstitute,
} from "../../../../_parentsApp/features/instituteSlice";
import { showNotification } from "@mantine/notifications";
import useFeatureAccess from "../../../../hooks/useFeatureAccess";


interface InstituteProfileProps {
  users: {
    id: string;
    name: string;
    role: string;
  }[];
  onreloadData: () => void;
}

export function InstituteProfile(props: InstituteProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModel, setIsUserModel] = useState(false);
  const [userData, setUserData] = useState<{ [key: string]: string } | null>(
    null
  );
  const [editUserData, setEditUserData] = useState<{
    selectedImage: string;
    name: string;
    phoneNo: string;
    email: string;
    featureAccess: UserFeatureAccess;
    batches: string[];
    _id: string;
  } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMd = useMediaQuery(`(max-width: 768px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const { isFeatureValid, UserFeature } = useFeatureAccess();
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUserModel(false);
    setEditUserData(null);
    setSelectedUserId(null);
    setUserData(null);
  };

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    getUserById(userId)
      .then((x: any) => {
        const lowercaseName = x.name.split(" ")[0].toLowerCase();
        const password = `${lowercaseName}${x.phoneNo.substring(0, 5)}`;
        setUserData({
          name: x.name,
          phoneNumber: x.phoneNo,
          email: x.email,
          password: password,
        });
        console.log("Making API call for user with ID:", userId);
      })
      .catch((e) => {
        console.log(e);
      });
    setIsUserModel(true);
  };

  const handleEditProfile = (userId: string) => {
    setIsModalOpen(true);
    getUserById(userId)
      .then((x: any) => {
        console.log(x);
        setEditUserData({
          selectedImage: x.role,
          name: x.name,
          phoneNo: x.phoneNo,
          email: x.email,
          featureAccess: x.featureAccess,
          batches: x.instituteClasses,
          _id: userId,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  function deleteProfile(deleteProfileId: string) {
    DeleteUserFromInstitute({
      id: instituteDetails?._id || "",
      userId: deleteProfileId,
    })
      .then((x) => {
        props.onreloadData();
        console.log(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function addTeacher(data: {
    name: string;
    email: string;
    phoneNo: string;
    featureAccess: UserFeatureAccess;
    batches: string[];
    role: string;
  }) {
    if (instituteDetails) {
      setIsModalOpen(false);
      AddNewteacher({
        id: instituteDetails?._id,
        name: data.name,
        email: data.email,
        phoneNo: data.phoneNo,
        featureAccess: data.featureAccess,
        batches: data.batches,
        role: data.role,
      })
        .then((x: any) => {
          console.log(x);
          props.onreloadData();
          // onAddStaff(formData.name, "teacher", formData.email);
          // onClose();
        })
        .catch((e) => {
          showNotification({
            message:
              "Email already registrered with another user. Please try with another email.",
          });
          console.log(e);
        });
    }
  }

  function updateTeacher(data: {
    email: string;
    phoneNo: string;
    featureAccess: UserFeatureAccess;
    batches: string[];
    role: string;
    _id: string;
    name: string;
    removedbatches: string[];
  }) {
    setIsModalOpen(false);
    updateUserDetails({
      id: data._id ?? "",
      name: data.name,
      email: data.email,
      phoneNo: data.phoneNo,
      role: data.role,
      featureAccess: data.featureAccess,
      batches: data.batches,
      removedbatches: data.removedbatches,
    })
      .then((x) => {
        props.onreloadData();
        console.log(x);
      })
      .catch((e) => {
        showNotification({
          message:
            "Email already registrered with another user. Please try with another email.",
        });
        console.log(e);
      });
  }




  return (
    <Card
    shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
    radius={10}
    p={20}
    mt={20}
    >
    <Stack
      bg={"#FFFFFF"}
      style={{ borderRadius: "10px", borderColor:"#0000001A" }}
    >
      <Flex ml={5} align="center">
        <Text fz={18} fw={700}>
          Create/View Profile
        </Text>
        { isFeatureValid(UserFeature.ADDREMOVESTAFF) && (
        <Button
          onClick={handleOpenModal}
          size="sm"
          variant="default"
          ml={16}
          fw={700}
          style={{fontSize:"16px", borderRadius: "24px", borderColor:"##808080", borderWidth:"1px"}}
        >
          + Add Staff
        </Button> ) 
        }
      </Flex>
      {isModalOpen && (
        <AddStaffModal
          isOpen={isModalOpen}
          onClose={() => {
            setEditUserData(null);
            setIsModalOpen(false);
          }}
          onAddStaff={(staffName, role, email) => {
            setIsModalOpen(false);
          }}
          initialFormData={editUserData}
          onAddProfile={addTeacher}
          onUpdateprofile={updateTeacher}
        />
      )}
      {isUserModel && userData && (
        <Modal
          opened={isUserModel}
          onClose={handleCloseModal}
          title={
            <Text fz={20} fw={700}>
              View Profile
            </Text>
          }
          centered
        >
          <Stack spacing={4}>
            <Center>
              <Grid>
                <Grid.Col span={4}>
                  <Text fz={14} fw={400}>
                    Name:
                  </Text>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text fz={16} fw={700}>
                    {userData.name}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text fz={14} fw={400}>
                    Phone:
                  </Text>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text fz={16} fw={700}>
                    {userData.phoneNumber}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text fz={14} fw={400}>
                    Login ID:
                  </Text>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text fz={16} fw={700}>
                    {" "}
                    {userData.email}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text fz={14} fw={400}>
                    Password:
                  </Text>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text fz={16} fw={700}>
                    {userData.password}
                  </Text>
                </Grid.Col>
              </Grid>
            </Center>
          </Stack>
        </Modal>
      )}
      <Flex
        direction={isMd ? "column" : "row"}
        justify={"space-between"}
        ml={10}
      >
        {isMd ? (
          <>
            <Box mx={"-5%"}>
              <InstituteUserProfileCarousel
                users={props.users.map((user) => ({
                  id: user.id,
                  name: user.name,
                  role: user.role,
                }))}
                onViewProfile={handleViewProfile}
                onEditProfile={handleEditProfile}
                setDeleteProfileId={setDeleteProfileId}
                setDeleteModal={setDeleteModal}
              />
            </Box>
          </>
        ) : (
          <Flex
            // cols={isLg ? 2 : 4}
            w={"100%"}
            wrap="wrap"
            // verticalSpacing={20}
          >
            <InstituteUserCard
              users={props.users.map((user) => ({
                id: user.id,
                name: user.name,
                role: user.role,
              }))}
              onViewProfile={handleViewProfile}
              onEditProfile={handleEditProfile}
              setDeleteProfileId={setDeleteProfileId}
              setDeleteModal={setDeleteModal}
            />
          </Flex>
        )}
      </Flex>
      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this profile?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setDeleteModal(false);
              setDeleteProfileId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              setDeleteModal(false);
              if (deleteProfileId) deleteProfile(deleteProfileId);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
    </Card>
  );
}
