import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Button,
  Flex,
  Box,
  SimpleGrid,
  Stack,
  Center,
  Checkbox,
  MultiSelect,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/ReduxStore";
import {
  AddNewteacher,
  GetBatchesInfo,
} from "../../../../_parentsApp/features/instituteSlice";
import { updateUserDetails } from "../../../../features/user/userSlice";
import { showNotification } from "@mantine/notifications";
import { CustomCheckBox } from "./TimeInput";
import { isValidEmail } from "../../../../utilities/HelperFunctions";

const featureAccessinitialState: UserFeatureAccess = {
  attendance: false,
  feemanagement: false,
  websitebuilder: false,
  dailydiary: false,
  simulations: false,
  contentsharing: false,
  testingplatform: false,
  liveclasses: false,
  onlinecourses: false,
  addremovestaff: false,
  addremovebatch: false,
  addremovestudents: false,
};

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staffName: string, role: string, email: string) => void;
  initialFormData?: {
    selectedImage: string;
    name: string;
    phoneNo: string;
    email: string;
    featureAccess: UserFeatureAccess;
    batches: string[];
    _id: string;
  } | null;
  onUpdateprofile: (data: {
    name: string;
    email: string;
    phoneNo: string;
    featureAccess: UserFeatureAccess;
    batches: string[];
    role: string;
    _id: string;
    removedbatches: string[];
  }) => void;
  onAddProfile: (data: {
    name: string;
    email: string;
    phoneNo: string;
    featureAccess: UserFeatureAccess;
    batches: string[];
    role: string;
  }) => void;
}
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAddStaff,
  initialFormData,
  onUpdateprofile,
  onAddProfile,
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(2);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  const [formData, setFormData] = useState<{
    selectedImage: string | null;
    name: string;
    phoneNo: string;
    email: string;
  }>({
    selectedImage: initialFormData ? initialFormData.selectedImage : null,
    name: initialFormData ? initialFormData.name : "",
    phoneNo: initialFormData ? initialFormData.phoneNo : "",
    email: initialFormData ? initialFormData.email : "",
  });
  const [featureAccess, setFeatureAccess] = useState<UserFeatureAccess>(
    featureAccessinitialState
  );
  const [allBatches, setAllBatches] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [allFeatureAccess, setAllFeatureAccess] = useState<AppFeaturesAccess>();
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  useEffect(() => {
    if (initialFormData) {
      setFeatureAccess(initialFormData.featureAccess);
      setSelectedImageIndex(
        ["OWNER", "ADMIN", "TEACHER"].indexOf(initialFormData.selectedImage)
      );
      setSelectedBatches(initialFormData.batches);
      setFormData({
        selectedImage: initialFormData.selectedImage,
        name: initialFormData.name,
        phoneNo: initialFormData.phoneNo,
        email: initialFormData.email,
      });
    } else {
      setSelectedImageIndex(2);
      setSelectedBatches([]);
      setFeatureAccess(featureAccessinitialState);
    }
  }, [initialFormData]);

  useEffect(() => {
    if (instituteDetails)
      GetBatchesInfo({ id: instituteDetails._id })
        .then((x: any) => {
          console.log(x);
          setAllBatches(x.allBatches);
          setAllFeatureAccess(x.featureAccess);
        })
        .catch((e) => {
          console.log(e);
        });
  }, [instituteDetails]);

  const handleNext = () => {
    if (currentStep === 1 && selectedImageIndex === -1) {
      return;
    } else if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    } else if (formData.phoneNo.length !== 10) {
      showNotification({
        message: "Enter Valid Phone Number",
      });
    } else if (isValidEmail(formData.email) === false) {
      showNotification({
        message: "Enter Valid Email",
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  function addTeacher() {
    onAddProfile({
      name: formData.name,
      email: formData.email,
      phoneNo: formData.phoneNo,
      featureAccess: featureAccess,
      batches: selectedBatches,
      role:
        selectedImageIndex === 0
          ? "OWNER"
          : selectedImageIndex === 1
          ? "ADMIN"
          : "TEACHER",
    });
  }

  function updateTeacher() {
    if (initialFormData) {
      let removedbatches: string[] = [];
      initialFormData.batches.forEach((batch) => {
        if (!selectedBatches.includes(batch)) {
          removedbatches.push(batch);
        }
      });
      onUpdateprofile({
        _id: initialFormData._id,
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        role:
          selectedImageIndex === 0
            ? "OWNER"
            : selectedImageIndex === 1
            ? "ADMIN"
            : "TEACHER",
        featureAccess: featureAccess,
        batches: selectedBatches,
        removedbatches: removedbatches,
      });
    }
  }

  const handleSubmit = () => {
    console.log(initialFormData);
    if (initialFormData) {
      updateTeacher();
    } else addTeacher();
  };

  const handleImageSelect = (selectedImage: any, index: number) => {
    setFormData({ ...formData, selectedImage });
    setSelectedImageIndex(index);
  };

  function getRequiredImage(index: number) {
    if (index === 0) {
      return require(`../../../../assets/owner.png`);
    }
    if (index === 1) {
      return require(`../../../../assets/admin.png`);
    }
    if (index === 2) {
      return require(`../../../../assets/teacher.png`);
    }
  }

  function isDisabledNextButton() {
    if (currentStep === 1 && selectedImageIndex === -1) {
      return true;
    }
    if (
      currentStep === 2 &&
      (formData.name === "" ||
        formData.phoneNo === "" ||
        formData.email === "") &&
      selectedBatches.length === 0
    ) {
      return true;
    }
    if (currentStep === 3) {
      return true;
    }
    return false;
  }
  function containsOnlyDigits(inputString: string) {
    return /^\d+$/.test(inputString) || inputString === "";
  }

  return (
    <Modal
      radius="sm"
      size="md"
      opened={isOpen}
      onClose={onClose}
      title={
        <>
          <Text size="lg" fz={20} fw={700}>
            {currentStep === 1
              ? "Add Staff"
              : currentStep === 2
              ? "Add Staff"
              : "Profile Preview"}
          </Text>
        </>
      }
      centered
    >
      <Stack spacing={8}>
        {currentStep === 1 && (
          <SimpleGrid
            cols={3}
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            {["OWNER", "ADMIN", "TEACHER"].map((role, index) => (
              <Stack
                key={index}
                style={{
                  border:
                    selectedImageIndex === index
                      ? "1px solid blue"
                      : "1px solid #808080",
                  backgroundColor:
                    selectedImageIndex === -1
                      ? "transparent"
                      : selectedImageIndex === index
                      ? "#EFF1FE"
                      : "transparent",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
                onClick={() => handleImageSelect(role, index)}
                align="center"
                spacing={5}
                justify="center"
                mr={15}
                w="100px"
                h="130px"
              >
                <img
                  src={getRequiredImage(index)}
                  width="35px"
                  alt="No homework found"
                />
                <Text>{capitalizeFirstLetter(role)}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        )}
        {currentStep === 2 && (
          <>
            <TextInput
              placeholder="Name"
              title="Name"
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextInput
              title="Phone Number"
              label="Phone Number"
              placeholder="Enter Phone Number"
              maxLength={10}
              value={formData.phoneNo}
              onChange={(e) => {
                if (containsOnlyDigits(e.currentTarget.value)) {
                  setFormData({ ...formData, phoneNo: e.target.value });
                }
              }}
              required
            />
            <TextInput
              type="email"
              title="Email"
              label="Email"
              placeholder="Enter Email id here"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <MultiSelect
              data={allBatches}
              value={selectedBatches}
              onChange={(value) => setSelectedBatches(value)}
              placeholder="Select Batches"
              label="Select Batches"
            />
          </>
        )}
        {currentStep === 3 && (
          <>
            {allFeatureAccess?.dashboardFeature && (
              <>
                <Checkbox
                  label="Management"
                  checked={
                    featureAccess.attendance &&
                    featureAccess.feemanagement &&
                    featureAccess.websitebuilder &&
                    featureAccess.dailydiary &&
                    featureAccess.addremovebatch &&
                    featureAccess.addremovestaff &&
                    featureAccess.addremovestudents
                  }
                  styles={{
                    label: {
                      fontSize: "18px",
                      fontWeight: 700,
                    },
                  }}
                  mt={10}
                  mb={10}
                  onChange={(event) => {
                    setFeatureAccess({
                      ...featureAccess,
                      attendance: event.currentTarget.checked,
                      feemanagement: event.currentTarget.checked,
                      websitebuilder: event.currentTarget.checked,
                      dailydiary: event.currentTarget.checked,
                      addremovebatch: event.currentTarget.checked,
                      addremovestaff: event.currentTarget.checked,
                      addremovestudents: event.currentTarget.checked,
                    });
                  }}
                />
                <Stack pl={30}>
                  <>
                    <CustomCheckBox
                      label="Add/Remove Staff"
                      checked={featureAccess.addremovestaff}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          addremovestaff: event.currentTarget.checked,
                        });
                      }}
                    />

                    <CustomCheckBox
                      label="Add/Remove Batch"
                      checked={featureAccess.addremovebatch}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          addremovebatch: event.currentTarget.checked,
                        });
                      }}
                    />
                    <CustomCheckBox
                      label="Add/Remove Students"
                      checked={featureAccess.addremovestudents}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          addremovestudents: event.currentTarget.checked,
                        });
                      }}
                    />
                    <CustomCheckBox
                      label="Attendance"
                      // checked={formData.teachingMode}
                      checked={featureAccess.attendance}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          attendance: event.currentTarget.checked,
                        });
                      }}
                    />

                    <CustomCheckBox
                      label="Fee Management"
                      checked={featureAccess.feemanagement}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          feemanagement: event.currentTarget.checked,
                        });
                      }}
                    />
                    <CustomCheckBox
                      label="Website Builder"
                      checked={featureAccess.websitebuilder}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          websitebuilder: event.currentTarget.checked,
                        });
                      }}
                    />
                    <CustomCheckBox
                      label="Daily Diary"
                      checked={featureAccess.dailydiary}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          dailydiary: event.currentTarget.checked,
                        });
                      }}
                    />
                  </>
                </Stack>
              </>
            )}
            {(allFeatureAccess?.simualtionAccess ||
              allFeatureAccess?.teachContentAccess) && (
              <>
                <Checkbox
                  label="Teaching Mode"
                  onChange={(event) => {
                    setFeatureAccess({
                      ...featureAccess,
                      simulations: event.currentTarget.checked,
                      contentsharing: event.currentTarget.checked,
                    });
                  }}
                  checked={
                    featureAccess.simulations && featureAccess.contentsharing
                  }
                  styles={{
                    label: {
                      fontSize: "18px",
                      fontWeight: 700,
                    },
                  }}
                  my={10}
                />
                <Stack pl={30}>
                  {allFeatureAccess?.simualtionAccess && (
                    <CustomCheckBox
                      label="Simulations"
                      checked={featureAccess.simulations}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          simulations: event.currentTarget.checked,
                        });
                      }}
                    />
                  )}
                  {allFeatureAccess?.teachContentAccess && (
                    <CustomCheckBox
                      label="Content Sharing"
                      checked={featureAccess.contentsharing}
                      onChange={(event) => {
                        setFeatureAccess({
                          ...featureAccess,
                          contentsharing: event.currentTarget.checked,
                        });
                      }}
                    />
                  )}
                </Stack>
              </>
            )}
            {allFeatureAccess?.testFeatureService && (
              <Checkbox
                label="Testing Platform"
                checked={featureAccess.testingplatform}
                onChange={(event) => {
                  setFeatureAccess({
                    ...featureAccess,
                    testingplatform: event.currentTarget.checked,
                  });
                }}
                styles={{
                  label: {
                    fontSize: "18px",
                    fontWeight: 700,
                  },
                }}
                mt={10}
              />
            )}
            {allFeatureAccess?.videoCall && (
              <Checkbox
                label="Live Classes"
                styles={{
                  label: {
                    fontSize: "18px",
                    fontWeight: 700,
                  },
                }}
                mt={10}
                checked={featureAccess.liveclasses}
                onChange={(event) => {
                  setFeatureAccess({
                    ...featureAccess,
                    liveclasses: event.currentTarget.checked,
                  });
                }}
              />
            )}
            {allFeatureAccess?.course && (
              <Checkbox
                label="Online Courses"
                styles={{
                  label: {
                    fontSize: "18px",
                    fontWeight: 700,
                  },
                }}
                mt={10}
                checked={featureAccess.onlinecourses}
                onChange={(event) => {
                  setFeatureAccess({
                    ...featureAccess,
                    onlinecourses: event.currentTarget.checked,
                  });
                }}
              />
            )}
          </>
        )}
        <Flex justify="flex-end" mt={10} pr={4}>
          <Button
            id="cancel-btn"
            onClick={() => {
              if (currentStep === 1) {
                onClose();
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
            size="md"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #808080",
              padding: "11px, 13px, 11px, 13px",
              borderRadius: "20px",
            }}
          >
            <Text fz={14} fw={700}>
              {currentStep === 1 ? "Cancel" : "Back"}
            </Text>
          </Button>
          {currentStep === 3 && (
            <Button
              onClick={handleSubmit}
              size="md"
              style={{
                backgroundColor: "#4B65F6",
                border: "1px solid #A7A7A7",
                borderRadius: "20px",
                marginLeft: "8px",
                padding: "11px, 13px, 11px, 13px",
                cursor: "pointer",
              }}
            >
              Save Details
            </Button>
          )}
          {currentStep !== 3 && (
            <Button
              onClick={handleNext}
              py={5}
              style={{
                backgroundColor: "",
                borderRadius: "20px",
                marginLeft: "8px",
                cursor: "pointer",
              }}
              px={40}
              bg="#4B65F6"
              size="md"
              variant={isDisabledNextButton() ? "outline" : "filled"}
              disabled={isDisabledNextButton()}
              sx={{
                "&:hover": {
                  backgroundColor: "#4B65F6",
                },
              }}
            >
              <Text fz={14} fw={700}>
                Next
              </Text>
            </Button>
          )}
        </Flex>
      </Stack>
    </Modal>
  );
};

export default AddStaffModal;
