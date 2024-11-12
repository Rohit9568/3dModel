import { SimpleGrid, Stack,Text } from "@mantine/core";
import {
  InstituteBatchesSection,
  UserType,
} from "../../components/AdminPage/DashBoard/InstituteBatchesSection";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import MergeStudentAndTeachers from "../../components/AdminPage/ClassSection/MergeStudentAndTeachers";

interface StudentsBatchesSectionProps {
  batches: any[];
  instituteId:string;
}

export function StudentBatchesSection(props: StudentsBatchesSectionProps) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [batchId, setBatchId] = useState<string>("");


  return (batchId === "") ? <Stack pt={isMd?8:36} px={isMd?32:60} w={"100%"} h={"100vh"} bg={"#F7F7FF"}>

    <Text fw={700} size={32}>Batches</Text>
      <SimpleGrid
        cols={isMd ? 1 : isLg ? 2 : 4}
        spacing={20}
        verticalSpacing={20}
        mt={8}
      >
        <InstituteBatchesSection
          batches={
            (props.batches || []).map((batch: any) => ({
            id: batch?._id || "",
            name: batch?.name || "",
            subjects: batch?.subjects.map((item:any)=>{return item.name}) || [],
            noOfTeachers: batch?.noOfTeachers || 0,
            noOfStudents: batch?.noOfStudents || 0,
            firstThreeStudents: batch?.firstThreeStudents || [],
            firstThreeTeachers: batch?.firstThreeTeachers || [],
          }))}
          userType={UserType.STUDENT}
          setDeleteBatchId={(batchId: string) => {}}
          setDeleteModal={(val: boolean) => {}}
          onEditBatchName={(id, val) => {}}
          onbatchCardClick={(val) => {
            setBatchId(val);
          }}
          onEditCourseFees={(val) => {}}
          onAddBatchButtonClick={() => {}}
          onEditBatchButtonClick={function (batchId: string): void {}}
        />
      </SimpleGrid>
    </Stack>
:  <MergeStudentAndTeachers
classId={batchId}
instituteId={props.instituteId}
onBackClick={(val) => {
  setBatchId("");
}
}
openedFromAdminPage={false}
isCourseStudentSelected={false}
isFeepayment={false}
resetData={() => {}}
isreceiptFeature={false}
hidePhoneNumbers={
  false
}
userType={UserType.STUDENT}
batchList={[]}
/>
}
