import { updateTestReportMarks } from "../../features/test/testreportSlice";
import ApiHelper from "../../utilities/ApiHelper";

export function GetStudentUserInfo(data: { instituteId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/${data.instituteId}/students`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function StudentAuthorization(data: {
  phoneNo: string;
  instituteId: string | undefined;
  password?: string | null;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteStudent/${data.instituteId}/students/login?phoneNumber=${data.phoneNo}&&password=${data.password}`
    )
      .then((response: any) => {
        ApiHelper.updateInstanceAfterGettingAuthtoken(response.token);
        resolve(response);
      })
      .catch((error) => reject(error));
  });
}

export function SendStudentOtp(data: { phoneNo: string; instituteId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/sendotp/`, {
      phoneNumber: data.phoneNo,
      instituteId: data.instituteId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function CheckIfStudentRegistered(data: {phoneNo: string; instituteId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/isStudentRegistered/`, {
      phoneNumber: data.phoneNo,
      instituteId: data.instituteId
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}




export function AddExistingStudentsInBatch(data: {
  studentIds: string[];
  batchId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteStudent/addInBatch/`, {
      studentIds: data.studentIds,
      instituteBatchId: data.batchId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function MoveUnregisteredStudentIntoBatch(data: {
  studentId: string;
  batchIds: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteStudent/moveToBatch/${data.studentId}`, {
      instituteBatchIds: data.batchIds,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function CreateUnregisteredStudent(data: {
  phoneNo: string;
  instituteId: string;
  name: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/createUnregisteredStudent/`, {
      phoneNumber: data.phoneNo,
      instituteId: data.instituteId,
      name: data.name,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function verifyOtp(data: { studentId: string; otp: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/verifyOtp/`, {
      studentId: data.studentId,
      otp: data.otp,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function generateAccessToken(data: { studentId: string}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/generateAccessToken/`, {
      studentId: data.studentId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetStudentInfoById(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/student/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function CheckStudentExists(data: {
  phoneNo: string;
  instituteId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/institute/checkParentExistence/${data.instituteId}?phoneNumber=${data.phoneNo}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetStudentUserSubjectWiseResults(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/getSubjectWiseResult/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetInstituteInfoByPhone(data: { phoneNumber: {} }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteStudent/${data.phoneNumber}/getInstituteInfo`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetStudentAttendance(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/${data.id}/getAttendanceRecord`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetPaymentRecordsById(data: { id: string; batchId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/instituteStudent/${data.id}/getPaymentRecord?batchId=${data.batchId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

async function AddMarksToStudent(data: {
  testId: string;
  studentId: string;
  marks: number;
  maxMarks: number;
  pdfLink: string;
  fileName: string;
}) {
  return ApiHelper.post(`/api/v1/instituteStudent/addStudentResult`, {
    testId: data.testId,
    marks: data.marks,
    studentId: data.studentId,
    maxMarks: data.maxMarks,
    pdfLink: data.pdfLink,
    fileName: data.fileName,
  });
}
export async function UpdateStudent(data: {
  id: string;
  phoneNumbers: string[];
  parentName: string;
  name: string;
  dateBirth: string;
  address: string;
}) {
  return ApiHelper.put(`/api/v1/instituteStudent/${data.id}`, {
    phoneNumbers: data.phoneNumbers,
    parentName: data.parentName,
    name: data.name,
    dateBirth: data.dateBirth,
    address: data.address,
  });
}
export async function CreateNewCourseStudent(data: {
  name: string;
  phoneNumber: string[];
  instituteId: string;
  parentName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/createCourseStudent`, {
      name: data.name,
      phoneNumber: data.phoneNumber,
      instituteId: data.instituteId,
      parentName: data.parentName,
    })
      .then((response: any) => {
        ApiHelper.updateInstanceAfterGettingAuthtoken(response.token);
        resolve(response);
      })
      .catch((error) => reject(error));
  });
}
export async function CreateNewPaymentRecord(data: {
  id: string;
  pricePaid: number;
  priceToBePaid: number;
  monthDate: Date;
  instituteId: string;
  batchId: string;
}) {
  return ApiHelper.put(`/api/v1/instituteStudent/${data.id}/addPaymentRecord`, {
    monthDate: data.monthDate,
    priceToBePaid: data.priceToBePaid,
    pricePaid: data.pricePaid,
    instituteId: data.instituteId,
    batchId: data.batchId,
  });
}
export async function AddCourseToStudent(data: {
  studentId: string;
  courseId: string;
}) {
  return ApiHelper.post(
    `/api/v1/instituteStudent/addCoursesToStudent/${data.studentId}`,
    {
      courseId: data.courseId,
    }
  );
}

export async function AddCourseToMultipleStudent(data: {
  studentIds: string[];
  courseId: string;
}) {
  return ApiHelper.post(
    `/api/v1/instituteStudent/addCourseToStudents/${data.courseId}`,
    {
      studentIds: data.studentIds,
    }
  );
}

export async function DeleteStudent(data: { id: string; classId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `/api/v1/instituteStudent/${data.id}?classId=${data.classId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export async function RemoveStudentFromBatch(data: { id: string; classId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `/api/v1/instituteStudent/removeFromBatch/${data.id}?classId=${data.classId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export async function AddStudentDiscount(data: {
  id: string;
  discount: number;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteStudent/${data.id}/addDiscount`, {
      feeDiscount: data.discount,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export async function AddStudentProfilePic(data: {
  id: string;
  profilePic: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteStudent/addStudentProfilePic/${data.id}`, {
      profilePic: data.profilePic,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export async function runMultipleApiCallsForStudents(data: {
  testid: string;
  maxMarks: number;
  students: StudentsDataWithBatch[];
}) {
  let totalMarks = 0;
  data.students.map((x) => {
    totalMarks += x.marks ?? 0;
  });
  const promises = data.students.map((x) => {
    return AddMarksToStudent({
      testId: data.testid,
      studentId: x._id!!,
      marks: x.marks ?? 0,
      maxMarks: data.maxMarks,
      pdfLink: x.pdfLink ?? "",
      fileName: x.pdfFileName ?? "",
    });
  });
  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw error;
  }
}
export async function runMultipleApiCallsForUpdatingTestReport(data: {
  students: StudentsDataWithBatch[];
}) {
  const promises = data.students.map((x) => {
    return updateTestReportMarks({
      id: x.testReportId!!,
      totalMarks: x.marks ?? 0,
      fileName: x.pdfFileName ?? "",
      url: x.pdfLink ?? "",
    });
  });
  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw error;
  }
}
export async function UpdateStudentAttendance(data: {
  studentId: string;
  date: Date | null;
  currentAttendanceStatus: string;
}) {
  return ApiHelper.put(`/api/v1/instituteStudent/update/attendance`, {
    studentId: data.studentId,
    date: data.date,
    currentAttendanceStatus: data.currentAttendanceStatus,
  });
}
export async function UpdateStudentActiveStatus(data: { studentId: string }) {
  return ApiHelper.put(
    `/api/v1/instituteStudent/${data.studentId}/updateActiveStatus`,
    {}
  );
}

export function GetAllMeetings(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/getallScheduledMeetings/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetStudentGifts(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/${data.id}/getRedeemedGifts`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function RedeemGift(data: { id: string; giftId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteStudent/${data.id}/redeemGifts`, {
      giftId: data.giftId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
