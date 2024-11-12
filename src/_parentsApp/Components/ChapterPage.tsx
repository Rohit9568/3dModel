import { LoadingOverlay, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { TopicPage } from "./TopicPage";
import { IntroductionPage } from "./IntroductionPage";
import { WorksheetPage } from "./WorksheetsPage";
import { StudyPageTabs } from "../ParentsAppMain";
import { useMediaQuery } from "@mantine/hooks";
import { SimulationPage } from "./SimulationPage";
import { VideoPage } from "../../pages/DetailsPages/VideoPage";
import Videospage from "./Videospage";

interface ChapterPageProps {
  chapterId: string;
  subjectId: string;
  setisTopicPageAccessed: (val: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (data: boolean) => void;
  onChapterChangeClick: (data: string) => void;
  currentTab: StudyPageTabs;
  selectedTopic: SingleTopic | null;
  currentChapter: SingleChapter | null;
  onTopicChangeClick: (data: string) => void;
  isIntroductionSelected: boolean;
  instituteName: string;
  icon: string;
}

export function ChapterPage(props: ChapterPageProps) {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  useEffect(() => {
    props.setisTopicPageAccessed(true);
    return () => {
      props.setisTopicPageAccessed(false);
    };
  }, []);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <LoadingOverlay visible={loadingData} />

      <Stack
        //ml={isMd ? 0 : 150}
        h="100%"
        w={isMd ? "100%" : "calc(100% - 150px)"}
        style={{
          padding: "10px 10px",
        }}
      >
        {props.currentTab === StudyPageTabs.Topic && props.selectedTopic && (
          <TopicPage
            topic={props?.selectedTopic?.theory}
            topicName={props?.selectedTopic.name}
            videos={props?.selectedTopic?.videos}
          />
        )}
        {props.isIntroductionSelected && props.currentChapter && (
          <IntroductionPage
            introduction={props.currentChapter?.introduction}
            topics={props.currentChapter.topics}
            onTopicClick={props.onTopicChangeClick}
          />
        )}
        {props.currentTab === StudyPageTabs.Worksheets &&
          props.currentChapter && (
            <WorksheetPage files={props.currentChapter.chapterWorksheets} />
          )}
        {props.currentTab === StudyPageTabs.Notes && props.currentChapter && (
          <WorksheetPage files={props.currentChapter.chapterNotes} />
        )}
        {props.currentTab === StudyPageTabs.Simulaitons &&
          props.currentChapter && (
            <SimulationPage
              currentChapter={props.currentChapter}
              icon={props.icon}
              instituteName={props.instituteName}
            />
          )}
        {props.currentTab === StudyPageTabs.Videos && props.currentChapter && (
          <Videospage currentChapter={props?.currentChapter} />
        )}
      </Stack>
    </>
  );
}
