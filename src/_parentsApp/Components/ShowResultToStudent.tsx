import { Select, Stack } from "@mantine/core";
import { lazy, useEffect, useState } from "react";
import React from "react";



const ShowStudentResults = lazy(()=> import("./ShowStudentResults"))

const ShowResultToStudent = (props:{userInfo:StudentInfo | null}) => {
    const [batchOptions, setBatchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedBatchName, setSelectedBatchName] = useState<string | null>(
    null
  );
  const handleBatchChange = (value: string) => {
    setSelectedBatchId(value);
    const data = batchOptions.filter(i => i.value === value)
    if(data){
      setSelectedBatchName(data[0]?.label );
    }
  };

  useEffect(() => {
    if(props.userInfo){
      const options = props.userInfo.batches.map((batch: any) => {
        return { value: batch._id, label: batch.name };
      });
      setBatchOptions(options);
    }
  }, [props.userInfo]);
  useEffect(()=>{if(batchOptions.length > 0) handleBatchChange(batchOptions[0]?.value)  },[batchOptions])
  return (
    <>
      <Stack w={"90%"} sx={{ margin: "auto", paddingTop: "2rem" }}>
        <Select
          w={"10rem"}
          label="Select Batch"
          placeholder={"Select Batch"}
          data={batchOptions}
          onChange={handleBatchChange}
          value={selectedBatchId}
        />
        <React.Suspense fallback={<></>} >
        <ShowStudentResults
          studentData={{
            studentId: props.userInfo?._id!!,
            batchId: selectedBatchId || "",
            batchName: selectedBatchName || "",
            studentName: props.userInfo?.name!!,
          }}
          showTestCards={true}
          onResultArrowClicked={() => {
          }}
        />
        </React.Suspense>
      </Stack>
    </>
  );
};

export default ShowResultToStudent;
