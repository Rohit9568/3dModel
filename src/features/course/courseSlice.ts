import ApiHelper from "../../utilities/ApiHelper";

export function createCourse(data: {
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  discount: number;
  videos: string[];
  tests: string[];
  files: string[];
  folders: string[];
  date: Date | null;
  createdAt: Date;
  thumbnailname: string;
  validTill?: string;
  isFree: boolean;
  instituteId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/course/`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function updateCourseContent(data: {
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  discount: number;
  videos: string[];
  tests: string[];
  files: string[];
  folders: string[];
  date: Date | null;
  createdAt: Date;
  thumbnailname: string;
  validTill?: string;
  courseId: string;
  isFree: boolean;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/course/${data.courseId}`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function updateCourseFolderContent(data: {
  folderId: string;
  parentFolder: CourseFolder;
}) {
  const name = data.parentFolder.name;
  const folderId = data.parentFolder._id;
  const videos = data.parentFolder.videos.map((courseVideo: CourseVideo) => {
    return courseVideo._id;
  });
  const files = data.parentFolder.files.map((courseFile: CourseFile) => {
    return courseFile._id;
  });
  const tests = data.parentFolder.tests.map((courseTest: TestData) => {
    return courseTest._id;
  });
  const folders = data.parentFolder.folders.map(
    (courseFolder: CourseFolder) => {
      return courseFolder._id;
    }
  );

  const requestBody = {
    name: name,
    folderId: folderId,
    videos: videos,
    files: files,
    tests: tests,
    folders: folders,
  };

  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/course/folder/${data.folderId}`, {
      ...requestBody,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createCoursevideo(data: {
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/courseVideo/`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createCourseFile(data: { name: string; url: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/courseFile/`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateFileName(data: { name: string; id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/courseFile/${data.id}`, {
      name: data.name,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateCourseVideoName(data: { name: string; id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/courseVideo/${data.id}`, {
      name: data.name,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateTestName(data: { name: string; id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/test/${data.id}`, {
      name: data.name,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getAllInstituteCoursesAndTestSeries(institudeId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/institute/getAllCourses/${institudeId}?fetchDetailed=true`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getCourseById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/course/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getCourseFolderById(folderId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/course/folder/${folderId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function deleteStudentFromCourse(id: string, studentId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/course/deleteStudent/${id}`, {
      studentId: studentId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function deleteNewStudentFromInstitute(id: string, studentId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteStudent/${id}/`, {
      studentId: studentId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function deleteCourse(id: string, instituteId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`/api/v1/course/${id}?instituteId=${instituteId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createCourseFolder(data: {
  name: string;
  createdAt: Date;
  parentFolderId?: String;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/course/{id}/folder`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function addVideoToCourse(data: { videoId: string; courseId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/course/addVideo/${data.courseId}`, {
      videoId: data.videoId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
