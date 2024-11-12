import React, { useState } from "react";
import styled from "styled-components";
import { ISimulation } from "../_New/NewPageDesign/ModifiedOptionsSim";
import {
  Center,
  Flex,
  Modal,
  SimpleGrid,
  Stack,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconLeftArrow,
  IconTeachAddContent,
  IconTeachPC,
} from "../_Icons/CustonIcons";
import { NewTeacherAddSimulationPage } from "../../pages/NewTeacherAddSimulationsPage/NewTeacherAddSimulationsPage";
import TeachSimulationCard from "./TeachSimulationCard";
import { ContentSimulation } from "../../pages/SimulationPage/ContentSimulation";
import { UserType } from "../AdminPage/DashBoard/InstituteBatchesSection";
import { EmptyListView } from "../_New/EmptyListView";

interface IProps {
  simulations: ISimulation[];
  chapterId: string;
  userType: UserType;
  onBackClick: () => void;
  setLoadingData: (isUpdated: boolean) => void;
}

const ViewSimulations: React.FC<IProps> = ({
  simulations,
  chapterId,
  userType,
  onBackClick,
}) => {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [showAddSimulationPage, setShowAddSimulationPage] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<{
    name: string;
    id: string;
  } | null>();

  if (showAddSimulationPage) {
    return (
      <NewTeacherAddSimulationPage
        chapterId={chapterId}
        setShowAddSimulationPage={setShowAddSimulationPage}
        subjectId=""
      />
    );
  }

  return (
    <>
      <Container>
        <Flex align={"center"}>
          <Center
            h={8}
            w={8}
            style={{ cursor: "pointer" }}
            onClick={() => {
              onBackClick();
            }}
          >
            <IconLeftArrow />
          </Center>
          <Text fz={20} fw={700} ml={18}>
            {"Simulations"}
          </Text>
        </Flex>

        { userType == UserType.STUDENT && simulations.length == 0 && (
          <Center w="100%" h="100%">
            <EmptyListView
              emptyImage={require("../../assets/EmptySimulaiton.png")}
              emptyMessage={"No Simulations Added Yet"}
              showButton={false}
            />
          </Center>
        )}

        <SimulationsContainer>
          <DynamicSimpleGrid w="100%" px={10} isMd={isMd}>
            {userType == UserType.OTHERS && (
              <AddButtonStyledContainer isFixed={simulations.length === 0}>
                <IconTeachPC />
                <button onClick={() => setShowAddSimulationPage(true)}>
                  <IconTeachAddContent /> Add Content
                </button>
              </AddButtonStyledContainer>
            )}
            { simulations.length ? (
              simulations.map((x) => (
                <Stack
                  align="center"
                  style={{
                    borderRadius: "4px",
                    position: "relative",
                    width: "fit-content",
                    marginTop: "0",
                    paddingTop: "0",
                    aspectRatio: "16/11",
                  }}
                  w="100%"
                  pt={10}
                  key={x?._id}
                >
                  <TeachSimulationCard
                    _id={x?._id}
                    name={x?.name}
                    imageUrl={x?.thumbnailImageUrl}
                    lgNo={4}
                    simulationTags={x?.simulationTags || [""]}
                    setShowAuthModal={() => {}}
                    setSimualtionId={(val) => {}}
                    setPlaySimulation={() => {}}
                    paramValue={null}
                    userSubscriptionType={"PREMIUM"}
                    isSimulationPremium={true}
                    setModalSimulation={(
                      val: {
                        name: string;
                        _id: string;
                        isSimulationPremium: boolean;
                        videoUrl: string;
                      } | null
                    ) => {
                      
                    }}
                    videoUrl={x?.videoUrl}
                    showInfo={true}
                    simulationClickHandler={(name: string, _id: string) => {
                      setSelectedSimulation({ name: name, id: _id });
                    }}
                  />
                </Stack>
              ))
            ) : (
              <></>
            )}
          </DynamicSimpleGrid>
        </SimulationsContainer>
      </Container>

      {selectedSimulation != null && (
        <Modal
          fullScreen
          opened={selectedSimulation != null}
          onClose={() =>  {
            setSelectedSimulation(null)
          }}
          withCloseButton={true}
        >
          <ContentSimulation
            simulationId={selectedSimulation.id}
            paramValue={"teacher"}
          />
        </Modal>
      )}
    </>
  );
};

export default ViewSimulations;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  hight: 100%;
`;

interface IGridProps {
  isMd: boolean;
}
const DynamicSimpleGrid = styled(SimpleGrid)<IGridProps>`
  width: 100%;
  padding: 32px;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  align-items: start;
  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const SimulationsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  align-items: stretch;
`;
interface IButtonProps {
  isFixed: boolean;
}
const AddButtonStyledContainer = styled.div<IButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px black solid;
  aspect-ratio: 16/11;
  border-radius: 12px;
  height: 100%;
  width: 100%;
  ${(props) => (props.isFixed ? "width: 300px;" : "")}
  ${(props) => (props.isFixed ? "min-height: 200px;" : "")}

  button {
    margin-top: 5px;
    background-color: transparent;
    border: 1px solid black;
    border-radius: 24px;
    padding: 9px 14px 9px 14px;
    cursor: pointer;
  }
  @media (max-width: 500px) {
    /* gap: 0;
    justify-content: center;
    height: 177px;
    ${(props) => (props.isFixed ? "width: 200px;" : "")}
    ${(props) => (props.isFixed ? "min-height: 150px;" : "")} */
  }
`;
