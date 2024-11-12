import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { fetchCurrentSharedSubjectData, fetchCurrentSubjectData, fetchSharedSubjectsData } from "../../features/UserSubject/TeacherSubjectSlice";
import { subjects } from "../../store/subjectsSlice";
import { IconPlayerPlay } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import {
  IconLeftArrow,
} from "../../components/_Icons/CustonIcons";
import { User1 } from "../../@types/User";
import { ChapterContentPage } from "./ChapterContentPage";
import { UserType } from "../../components/AdminPage/DashBoard/InstituteBatchesSection";

const subjectActions = subjects.actions;
function ChapterCard(props: {
  chapter: ChapterData;
  index: number;
  subjectId: string;
  onChapterClicked:((chapterId:string, chapterName:string)=>void)
}) {
  const navigate = useNavigate();
  const [isHovered, setHovered] = useState(false);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  return (
    <>
      <Card
        bg="#F8F9FA"
        p={4}
        h={100}
        withBorder
        shadow="0px 0px 10px 0px rgba(0, 0, 0, 0.25)"
        style={{ borderRadius: 20, cursor: "pointer" }}
        onClick={() => {
          Mixpanel.track(WebAppEvents.TEACHER_APP_CHAPTER_CARD_CLICKED, {
            chapterName: props.chapter.name,
          });
          props.onChapterClicked(props.chapter._id,props.chapter.name)
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Flex align={"center"} h={"100%"} w={"100%"}>
          <Flex bg={"#90939545"} style={{borderRadius:"22px"}} p={12}>
              <Text
                p={24}
                h={60} w = {60}
                bg={"white"}
                c={isHovered ? "#3174F3" : "rgba(144, 147, 149, 0.27)"}
                fz={36}
                fw={600}
                style={{ borderRadius: "50%", aspectRatio: 1 }}
              >
                <Center h={"100%"}>
                  {isHovered ? (
                    <Box mt={4} h={60} w={60}>
                    <IconPlayerPlay fill="#3174F3" />
                    </Box>
                  ) : (
                    props.index
                  )}
                </Center>
              </Text>
              </Flex>
      
              <Text
                ml={isHovered ? 14 : 8}
                m={0}
                p={0}
                fz={isMd ? 14 : 16}
                style={{ transition: "margin-left 0.5s ease" }}
              >
                {props.chapter.name}
              </Text>

              </Flex>
      </Card>
    </>
  );
}

export function ChapterSelect(props:{subject:UserSubject, userType:UserType, classId:string, onBackClick:()=>void}) {

  const params = useParams<any>();

  const [userChapters,setUserChapters] =useState<ChapterData[]>()
  
  function fetchchapters() {
    if (props.subject){
      const apiCallSlice = props.userType == UserType.OTHERS ?
     fetchCurrentSubjectData({ subject_id: props.subject._id }) : 
     fetchCurrentSharedSubjectData({ subject_id: props.subject._id })


     apiCallSlice
        .then((data: any) => {
          console.log(data);
          setUserChapters(data.userChapters)
        })
        .catch((err) => {
          console.log(err);
        });
      }
  }
  useEffect(() => {
    fetchchapters();
  }, [params]);
  useEffect(() => {
    Mixpanel.track(WebAppEvents.TEACHER_APP_SELECTION_PAGE_ACCESSED);
  }, []);
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: 450px)`);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });

  const [chapterPropObj,setChapterPropObj] = useState<{chapterId:string,chapterName:string}|null>();

  return (
    <>
      { chapterPropObj == null && <Stack align="flex-start">

        <Flex columnGap={18} align={"center"}>
         <Center h={8} w={8} style={{"cursor":"pointer"}} onClick={()=>{
          props.onBackClick();
         }}><IconLeftArrow/></Center>
          <Text fw={700} fz={18} color="#FFFFFF" bg={"#3174F3"} py={14} px={34} style={{borderRadius:"16px"}}>
             Chapters {props.subject.chaptersCount} 
             </Text>
        </Flex>

      <SimpleGrid
        cols={isMd ? 1 : isLg ? 2 : 3}
        my={20}
        spacing={isSm ? 10 : isMd ? 20 : 30}
      >
        {userChapters?.map((chapter, index) => {
          return (
            <ChapterCard
              key={chapter._id}
              chapter={chapter}
              index={index + 1}
              subjectId={props.subject.subjectId}
              onChapterClicked={(chapterId:string,chapterName:string)=>{
                setChapterPropObj({chapterId:chapterId, chapterName:chapterName})
              }}
            />
          );
        })}
      </SimpleGrid>
      </Stack>
}

     {
     chapterPropObj!=null && 
     <ChapterContentPage
      userChapterId={chapterPropObj!!.chapterId}
      userChapterName ={chapterPropObj!!.chapterName}
      userSubjectId={props.subject._id}
      onBackClick ={()=>{
        setChapterPropObj(null)
      }}
      userType={props.userType}
      batchId={props.classId}
      />
     }
    </>
  );
}
