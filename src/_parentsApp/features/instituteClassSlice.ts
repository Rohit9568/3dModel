import ApiHelper from "../../utilities/ApiHelper";

export function GetAllHomeworks(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllHomeworks/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllHomeworksByDate(data: { id: string; date: number }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteClass/getHomeworksByDate/${data.id}?date=${data.date}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllClassworksByDate(data: { id: string; date: number }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteClass/getClassworksByDate/${data.id}?date=${data.date}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetBatchById(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function UpdateBatch(data: {
  id: string;
  name: string;
  subjects: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/addbatchtoInstitute/${data.id}`, {
      name: data.name,
      subjects: data.subjects,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddVideoCallMeetingToBatch(data: {
  id: string;
  title: string;
  scheduleTime: Date;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteClass/addVideoCallMeeting/${data.id}`, {
      title: data.title,
      scheduleTime: data.scheduleTime,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddRecordingsToBatch(data: {
  id: string;
  url: string;
  name: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteClass/addRecordingsToBatch/${data.id}`, {
      url: data.url,
      name: data.name,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllSubjectsByClassId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllInstituteSubjects/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllCoursesByBatchId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllInstituteCourses/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllTestsByClassId(data: { id: string }, studentId?: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteClass/getAllInstituteTests/${data.id}?studentId=${
        studentId ?? ""
      }`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllTestByStudentIdAndClassId(data: {
  classId: string;
  studentId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteStudent/getStudentResult/${data.studentId}?classId=${data.classId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllVignamTestsByClassId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllTeacherTests/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllClassMeetings(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllVideoCallMeetings/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllRecordings(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getVideoRecordings/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllMonthsDataByClassId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllMonthCourseFeeDates/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllStudentsByClassIdAndTestId(data: {
  id: string;
  testId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteClass/getAllInstituteStudentsByTestId/${data.id}?&&testId=${data.testId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteInstituteTest(data: {
  testId: string;
  subjectId: string;
  classId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `/api/v1/instituteClass/deleteInstituteTest/${data.classId}`,
      {
        testId: data.testId,
        subjectId: data.subjectId,
      }
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function UpdateInstituteClass(data: {
  id: string;
  name: string;
  subjects: string[];
  courses: string[];
  days: (Date | null)[];
}) {
  console.log(data);
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteClass/updateInstituteClass/${data.id}`, {
      name: data.name,
      subjects: data.subjects,
      courses: data.courses,
      days: data.days,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddCourseFee(data: {
  id: string;
  date: Date;
  courseFees: number;
  selectedFeeOption: string;
  quaterFees: any[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteClass/changeFees/${data.id}`, {
      date: data.date,
      courseFees: data.courseFees,
      selectedFeeOption: data.selectedFeeOption,
      quaterFees: data.quaterFees.slice(0, 4),
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function RenameInstituteClass(data: { id: string; nameValue: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteClass/rename/${data.id}`, {
      value: data.nameValue,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
