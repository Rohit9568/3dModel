import { TeamMemberstype } from "../../components/WebsiteBuilder/OurTeamEdit";
import ApiHelper from "../../utilities/ApiHelper";

export async function fetchAllThemes() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/theme/all`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export async function fetchAllFacilities() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/facility/all`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export async function fetchAllInstitueBenefits() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteBenefits/all`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteTheme(data: { id: string; themeId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateTheme/${data.id}`, {
      themeId: data.themeId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteHeroHeading(data: {
  id: string;
  heading: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateHeroHeading/${data.id}`, {
      heading: data.heading,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteHeroImage(data: {
  id: string;
  imageUrl: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateHeroImage/${data.id}`, {
      imageUrl: data.imageUrl,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateFooterSection(data: {
  id: string;
  footerData: {
    description: string;
    address: string;
    email: string;
    phone: string;
    youtubeLink: string;
    instagramLink: string;
    facebookLink: string;
    secondAddress: string;
    secondInstituteNumber: string;
  };
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateFooterSection/${data.id}`, {
      footerData: data.footerData,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddTestimonialInInstitute(data: {
  id: string;
  personName: string;
  text: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/addTestimonial/${data.id}`, {
      personName: data.personName,
      text: data.text,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteAboutUsHeading(data: {
  id: string;
  heading: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateAboutUsHeading/${data.id}`, {
      heading: data.heading,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdatesubSectionHeading(data: {
  id: string;
  id1: any;
  heading: string;
}) {
  return new Promise((resolve, reject) => {
    console.log(data.id)
    ApiHelper.put(`/api/v1/institute/updatesubSectionHeading/${data.id}/${data.id1}`, {
      heading: data.heading,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function addsubSectionHeading(data: {
  id: string;
  heading: string;
}) {
  return new Promise((resolve, reject) => {
    console.log(data.id)
    ApiHelper.put(`/api/v1/institute/AddsubSectionHeading/${data.id}`, {
      heading: data.heading,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteSubSection(data: {
  id: string;
  id1: any;
}) {
  return new Promise((resolve, reject) => {
    console.log(data.id)
    ApiHelper.put(`/api/v1/institute/deletesubSection/${data.id}/${data.id1}`, {
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteLayout(data: {
  id: string;
  layout: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/changeLayout/${data.id}`, {
      layout: data.layout,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function UpdateInstituteAlignment(data: {
  id: string;
  align: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/changeAlignment/${data.id}`, {
      align: data.align,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteAboutUsDescription(data: {
  id: string;
  text: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateAboutUsDescription/${data.id}`, {
      text: data.text,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstitutesubSectionDescription(data: {
  id: string;
  id1: any;
  text: string;
  // heading: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updatesubSectionDescription/${data.id}/${data.id1}`, {
      text: data.text,
      // heading: data.heading,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getTeamMemberFeild(val: TeamMemberstype) {
  switch (val) {
    case TeamMemberstype.TeamMembers:
      return "teamMembers";
    case TeamMemberstype.CoreTeamMembers:
      return "coreTeamMembers";
    case TeamMemberstype.TopperStudents:
      return "topperStudents";
  }
}
export function AddTeamMemberInInstitute(data: {
  id: string;
  name: string;
  profileImage: string;
  desgination: string;
  description: string;
  teamMembersType: TeamMemberstype;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/addTeamMember/${data.id}`, {
      name: data.name,
      profileImage: data.profileImage,
      desgination: data.desgination,
      description: data.description,
      teamMembersFeildName: getTeamMemberFeild(data.teamMembersType),
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteFacilities(data: {
  id: string;
  facilities: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateFacilities/${data.id}`, {
      facilities: data.facilities,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteBenefits(data: {
  id: string;
  benefits: string[];
  institutionBenefitsTagLine: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateBenefits/${data.id}`, {
      instituteBenefitsTagLine: data.institutionBenefitsTagLine,
      benefits: data.benefits,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteAboutUsPoints(data: {
  id: string;
  points: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateAboutUsPoints/${data.id}`, {
      points: data.points,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstitutesubSectionPoints(data: {
  id: string;
  id1: any;
  points: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updatesubSectionPoints/${data.id}/${data.id1}`, {
      points: data.points,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteAboutUsImages(data: {
  id: string;
  imageUrls: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updateAboutUsImages/${data.id}`, {
      imageUrls: data.imageUrls,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstitutesubSectionImages(data: {
  id: string;
  id1: any;
  imageUrls: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/updatesubSectionImages/${data.id}/${data.id1}`, {
      imageUrls: data.imageUrls,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function deleteInstitutesubSectionImages(data: {
  id: string;
  id1: any;
  imageUrls: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/deletesubSectionImages/${data.id}/${data.id1}`, {
      imageUrls: data.imageUrls,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddInstituteSubSectionImage(data: {
  id: string;
  imageUrls: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/institute/createsubSectionImages/${data.id}`, {
      imageUrls: data.imageUrls,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
