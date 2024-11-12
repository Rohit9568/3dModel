import { useMediaQuery } from "@mantine/hooks";
import { AddCardWithButton, SingleBatchCard } from "./DashBoardCards";

export enum UserType {
  STUDENT,
  OTHERS,
}

interface InstituteBatchesSectionProps {
  batches: {
    id: string;
    name: string;
    subjects: string[];
    noOfTeachers: number;
    noOfStudents: number;
    firstThreeStudents: { _id: string; name: string }[];
    firstThreeTeachers: { _id: string; name: string }[];
  }[];
  userType: UserType;
  onAddBatchButtonClick: () => void;
  onEditBatchButtonClick: (batchId: string) => void;
  setDeleteBatchId: (batchId: string) => void;
  setDeleteModal: (val: boolean) => void;
  onEditBatchName: (id: string, val: string) => void;
  onbatchCardClick: (val: string) => void;
  onEditCourseFees: (val: any) => void;
}

export function InstituteBatchesSection(props: InstituteBatchesSectionProps) {
  const isMd = useMediaQuery(`(max-width: 968px)`);

  return (
    <>
      {props.userType == UserType.OTHERS && !isMd && (
        <AddCardWithButton
          onAddBatchButtonClick={props.onAddBatchButtonClick}
        />
      )}
      {props.batches.map((batch, index) => {
        return (
          <SingleBatchCard
            key={index}
            id={batch.id}
            name={batch.name}
            subjects={batch.subjects}
            userType={props.userType}
            noOfTeachers={batch.noOfTeachers}
            noOfStudents={batch.noOfStudents}
            firstThreeStudents={batch.firstThreeStudents.map(
              (student) => student.name
            )}
            firstThreeTeachers={batch.firstThreeTeachers.map(
              (teacher) => teacher.name
            )}
            hasNextButton={true}
            onEditBatchButtonClick={() =>
              props.onEditBatchButtonClick(batch.id)
            }
            setDeleteBatchId={props.setDeleteBatchId}
            setDeleteModal={props.setDeleteModal}
            onEditBatchName={(val) => {
              props.onEditBatchName(batch.id, val);
            }}
            onbatchCardClick={() => {
              props.onbatchCardClick(batch.id);
            }}
            onEditCourseFees={() => {
              props.onEditCourseFees({
                _id: batch.id,
                name: batch.name,
              });
            }}
          />
        );
      })}
    </>
  );
}
