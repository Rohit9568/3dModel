import {
  BackgroundImage,
  Center,
  Group,
  Image,
  LoadingOverlay,
  Paper,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Pages } from "./Teach";
import { useEffect, useState } from "react";
import { fetchCurrentSubjectData } from "../../features/UserSubject/TeacherSubjectSlice";
import { subjects } from "../../store/subjectsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/ReduxStore";

const subjectActions = subjects.actions;
interface SelectCardProps {
  text: string;
  image: string;
  subjectId: string | undefined;
  page: Pages;
}

function SelectCard(props: SelectCardProps) {
  const navigate = useNavigate();
  return (
    <Paper
      onClick={() => {
        navigate(`/teach/${props.page}/${props.subjectId}`);
      }}
      shadow="0px 4px 35px rgba(0, 0, 0, 0.25)"
      px={30}
      pt={20}
      pb={10}
      radius={26}
      w={250}
      bg="rgba(233, 233, 233, 0.38)"
    >
      <Image fit="contain" src={props.image} height={150} />
      <Center c="white" fw={500} fz={45}>
        {props.text}
      </Center>
    </Paper>
  );
}
export function SelectScreen() {
  const params = useParams<any>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const { subjectId } = params;
    setLoading(true);
    if (subjectId)
      fetchCurrentSubjectData({ subject_id: subjectId })
        .then((data: any) => {
          setLoading(false);
          dispatch(subjectActions.setCurrentSubject(data));
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
  }, [params]);

  return (
    <BackgroundImage src={require("../../assets/SelectSectionBackground.png")}>
      <LoadingOverlay visible={isLoading} />
      <Center
        style={{ width: "100%", height: "100vh" }}
        bg="rgba(0, 0, 0, 0.39)"
      >
        <Group spacing={30}>
          <SelectCard
            text="Teach"
            image={require("../../assets/SelectLearn.png")}
            subjectId={params.subjectId}
            page={Pages.Teach}
          />
          <SelectCard
            text="Exercise"
            image={require("../../assets/SelectPractice.png")}
            subjectId={params.subjectId}
            page={Pages.Exercise}
          />
          <SelectCard
            text="Test"
            image={require("../../assets/SelectTest.png")}
            subjectId={params.subjectId}
            page={Pages.Test}
          />
        </Group>
      </Center>
    </BackgroundImage>
  );
}
