import React, { useState } from "react";
import { TeachViewPageNavbar } from "./TeachViewSimulationsNavbar";
import styled from "styled-components";
import { ISimulation } from "../_New/NewPageDesign/ModifiedOptionsSim";
import { Center, Flex, Modal, SimpleGrid, Text,Stack, useMantineTheme } from "@mantine/core";
import { SimulationCard } from "../Simulations/Simulations";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconDeleteContent,
  IconLeftArrow,
  IconTeachAddContent,
  IconTeachPC,
} from "../_Icons/CustonIcons";
import { NewTeacherAddSimulationPage } from "../../pages/NewTeacherAddSimulationsPage/NewTeacherAddSimulationsPage";
import { useParams } from "react-router-dom";
import { AddVideoModal } from "../MyCourses/Modals/AddVideoModal";
import { useDispatch } from "react-redux";
import {
  AddNewVideoLink,
  removeVideoLink,
} from "../../features/UserSubject/chapterDataSlice";
import { isValidYouTubeLink } from "../WebsiteBuilder/FooterEdit";
import { convertToEmbedLink } from "../../utilities/HelperFunctions";
import { chapter } from "../../store/chapterSlice";
import { title } from "process";
import { video } from "suneditor/src/plugins";
import { UserType } from "../AdminPage/DashBoard/InstituteBatchesSection";
import { EmptyListView } from "../_New/EmptyListView";
const chapterActions = chapter.actions;
interface IProps {
  chapterId: string;
  videos: IVideos[];
  userType:UserType;
  onBackClick :()=>void;
  setLoadingData:(isUpdated:boolean)=>void
}

const ViewVideos: React.FC<IProps> = ({
  chapterId,
  videos,
  userType,
  onBackClick,
  setLoadingData
}) => {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const params = useParams();
  const [chapterVideos,setChapterVideos] =useState<IVideos[]>(videos)

  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const dispath = useDispatch();
  const [videoToBeDeletedChapterId, setVideoToBeDeletedChapterId] =
    useState("");
  const [videoToBeDeletedId, setVideoToBeDeletedId] = useState("");
  const [videoToBeDeletedName, setVideoToBeDeletedName] = useState("");
  const [deleteVideoModalOpen, setDeleteVideoModalOpen] = useState(false);
  const handleAddVideo = async (
    name: string,
    description: string,
    url: string
  ) => {
    setShowAddVideoModal(false);
    const data = {
      chapterId,
      name,
      description,
      url,
    };
    try {
      const response: any = await AddNewVideoLink(data);
      if (response?.video) {
        chapterVideos.push(response?.video)
        setChapterVideos(chapterVideos)
        setLoadingData(true)
      }
    } catch (err) {
      console.log("Could not upload Video: ", err);
    }
  };

  const openDeleteVideoModal = (
    chapterId: string,
    Id: string,
    name: string
  ) => {
    setVideoToBeDeletedChapterId(chapterId);
    setVideoToBeDeletedId(Id);
    setVideoToBeDeletedName(name);
    setDeleteVideoModalOpen(true);
  };

  const handleRemoveVideo = async () => {
    const data = {
      chapterId: videoToBeDeletedChapterId,
      videoId: videoToBeDeletedId,
    };
    try {
      const response: any = await removeVideoLink(data);
      dispath(chapterActions.removeVideos(videoToBeDeletedId));
      setVideoToBeDeletedChapterId("");
      setVideoToBeDeletedId("");
      setVideoToBeDeletedName("");
      setDeleteVideoModalOpen(false);

      var index = chapterVideos.map(x => {
        return x._id;
      }).indexOf(data.videoId);
      chapterVideos.splice(index, 1);
      setChapterVideos(chapterVideos)
      setLoadingData(true)
    } catch (err) {
      console.log("Could not upload Video: ", err);
      setVideoToBeDeletedChapterId("");
      setVideoToBeDeletedId("");
      setVideoToBeDeletedName("");
      setDeleteVideoModalOpen(false);
    }
    setDeleteVideoModalOpen(false);
  };

  return (
    <Container>

            <Flex align={"center"}>
        <Center h={8} w={8} style={{"cursor":"pointer"}}
        onClick={()=>{
          onBackClick();
        }}>
          <IconLeftArrow />
        </Center>
        <Text fz={20} fw={700} ml={18}>
          {"Videos"}
        </Text>
      </Flex>


      { userType == UserType.STUDENT && videos.length == 0 && (
          <Center w="100%" h="100%">
            <EmptyListView
              emptyImage={require("../../assets/EmptyVideo.png")}
              emptyMessage={"No Videos Added Yet"}
              showButton={false}
            />
          </Center>
        )}
      <DynamicSimpleGrid w="100%" cols={isMd ? 2 : 3} isMd={isMd}>
        { userType== UserType.OTHERS && <AddButtonStyledContainer isFixed={videos.length === 0}>
          <IconTeachPC />
          <button onClick={() => setShowAddVideoModal(true)}>
            <IconTeachAddContent /> Add Videos
          </button>
        </AddButtonStyledContainer>
        }
        { chapterVideos !=null && chapterVideos.map((x) => (
          <VideoContainer key={x._id}>
            {isValidYouTubeLink(x.url) && (
              <iframe
                onContextMenu={(e) => e.preventDefault()}
                allow="fullscreen"
                src={convertToEmbedLink(x.url)}
                allowFullScreen
              ></iframe>
            )}
            {!isValidYouTubeLink(x.url) && (
              <video
                src={x?.url}
                controls
                controlsList="nodownload"
              />
            )}
            <div>
              <div
                style={{ backgroundColor: "white" }}
                className="info-conatiner"
              >
                <h2>{x.name}</h2>
                <p>
                  {x.description.length < 40
                    ? x.description
                    : x.description.substring(0, 39) + "..."}
                </p>
              </div>
              <button
                onClick={() => {
                  openDeleteVideoModal(chapterId, x._id, x.name);
                }}
              >
                { userType == UserType.OTHERS && <IconDeleteContent />}
              </button>
            </div>
          </VideoContainer>
        ))}
      </DynamicSimpleGrid>
      <StyledModal
        opened={showAddVideoModal}
        onClose={() => setShowAddVideoModal(false)}
        title="Add Video"
        centered
      >
        <AddVideoModal addVideo={handleAddVideo} />
      </StyledModal>
      <Modal
        opened={deleteVideoModalOpen}
        onClose={() => {
          setDeleteVideoModalOpen(false);
        }}
        title={"Delete Video"}
        centered
        styles={{
          title: {
            fontWeight: 700,
          },
        }}
      >
        <p>Are You sure you want to delete this video?</p>
        <ButtonContainer>
          <CancelButton
            onClick={() => {
              setDeleteVideoModalOpen(false);
            }}
          >
            Cancel
          </CancelButton>
          <SubmitButton onClick={handleRemoveVideo}>Yes</SubmitButton>
        </ButtonContainer>
      </Modal>
    </Container>
  );
};

export default ViewVideos;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledModal = styled(Modal)`
  .mantine-Modal-modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 600px;
    .mantine-Modal-header {
      width: 100%;
      font-family: "Nunito";
      font-size: 20px;
      font-weight: 700;
    }
    .mantine-Modal-body {
      width: 100%;
      .mantine-Stack-root {
        width: 100%;
      }
    }
  }
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
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 4px;
  position: relative;
  width: 100%;

  video {
    width: 100%;
    aspect-ratio: 16 / 9;
    /* min-height: 70% ; */
    position: relative;
    border: 1px black solid;
    border-radius: 6px 6px 0 0;
    border-bottom: 0;
  }
  iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
    /* min-height: 70% ; */
    position: relative;
    border: 1px black solid;
    border-radius: 6px 6px 0 0;
    border-bottom: 0;
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px #707070 solid;
    border-top: 0;
    border-radius: 0 0 6px 6px;
    button {
      background-color: transparent;
      border: 0;
      cursor: pointer;
    }
  }
  .info-conatiner {
    background-color: white;
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    border-top: 0;
    padding: 5px 0 0 5px;
    border: 0px;
    h2 {
      margin: 0;
      font-weight: 500;
      font-size: 14px;
      padding-left: 5px;
    }
    p {
      color: #626262;
      font-size: 12px;
      margin: 0;
      margin-left: 10px;
      padding-bottom: 10px;
    }
  }
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
    gap: 0;
    justify-content: center;
    height: 177px;
    ${(props) => (props.isFixed ? "width: 200px;" : "")}
    ${(props) => (props.isFixed ? "min-height: 150px;" : "")}
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: black;
  border: 1px black solid;
  font-weight: 400;
  cursor: pointer;
  background-color: white;
`;
const SubmitButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  background-color: #4b65f6;
  cursor: pointer;
  svg {
    stroke: white;
    path {
      fill: white;
    }
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
