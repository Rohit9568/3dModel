import { TeamMemberstype } from "../../components/WebsiteBuilder/OurTeamEdit";
import { getTeamMemberFeild } from "../../features/websiteBuilder/websiteBuilderSlice";
import ApiHelper from "../../utilities/ApiHelper";

export function GetAllNotices(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllNotices/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllInfoForInstitute(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllInfo/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllInstituteStudents(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/allStudents/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetBatchesInfo(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/institute/getinstitutebatchesAndfeatureaccess/${data.id}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getAllUnregisteredStudents(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getUnregisteredStudents/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllDoubts(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllDoubts/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function AddNewteacher(data: {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  featureAccess: UserFeatureAccess;
  batches: string[];
  role: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/AddteacherToInstitute/${data.id}`, {
      name: data.name,
      email: data.email,
      phoneNo: data.phoneNo,
      featureAccess: data.featureAccess,
      batches: data.batches,
      role: data.role,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddNewbatch(data: {
  id: string;
  name: string;
  subjects: string[];
  courses: string[];
  days: (Date | null)[];
}) {
  console.log(data);
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/addbatchtoInstitute/${data.id}`, {
      name: data.name,
      subjects: data.subjects,
      courses: data.courses,
      days: data.days,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddSchoolPhoto(data: { id: string; imgUrl: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/addAllSchoolPhotos/${data.id}`, {
      imgUrl: data.imgUrl,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteSchoolPhotos(data: { id: string; imgUrls: string[] }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteAllSchoolPhotos/${data.id}`, {
      imgUrls: data.imgUrls,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteBatchFromInstitute(data: {
  id: string;
  batchId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteBatch/${data.id}`, {
      batchId: data.batchId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteUserFromInstitute(data: { id: string; userId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/removeTeacher/${data.id}`, {
      userId: data.userId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllClassesByInstituteId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllClasses/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetInstitiuteAndUsersInfo(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getInstitiuteAndUsersInfo/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function CreateInstitute(data: { name: string; address: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/institute/createNewInstitute`, {
      name: data.name,
      address: data.address,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetDashboardDataForInstitute(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getDashboardData/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllSubjectsForInstitute(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllSubjects/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllCoursesForInstitute(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllCourses/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteTeamMember(data: {
  id: string;
  teamMemberId: string;
  teamMembersType: TeamMemberstype;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteTeamMember/${data.id}`, {
      teamMemberId: data.teamMemberId,
      teamMembersFeildName: getTeamMemberFeild(data.teamMembersType),
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteTestimonial(data: { id: string; testimonialId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteTestimonial/${data.id}`, {
      testimonialId: data.testimonialId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetVideoAccess(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/giveVideoAccess/${data.id}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetCourseAccess(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/giveCourseAccess/${data.id}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetTestAccess(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/giveTestAccess/${data.id}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetSimulationAccess(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/giveSimulationAccess/${data.id}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetDashboardAccess(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/giveDashboardAccess/${data.id}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetInstituteGifts(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/getAllInstituteGifts/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

//gallerySection

export function AddGallerySection(data: {
  id: string;
  name: string;
  description: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/addgallerySection/${data.id}`, {
      name: data.name,
      description: data.description,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateGallerySection(data: { id: string; images: string[] }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateGalleryImages/${data.id}`, {
      images: data.images,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteGallerySectionImages(data: {
  id: string;
  images: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteGalleryImages/${data.id}`, {
      images: data.images,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateGallerySectionData(data: {
  id: string;
  name: string;
  description: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/editGallerySection/${data.id}`, {
      name: data.name,
      description: data.description,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteGallerySection(data: {
  id: string;
  gallerySectionId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deleteGallerySection/${data.id}`, {
      sectionId: data.gallerySectionId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
