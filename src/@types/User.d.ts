export interface User {
  _id: string;
  email: string;
  name: string;
  role?: number;
  homeworkshareToken: string;
  instituteId: {
    _id: string;
    name: string;
  };
  phoneNo: string;
}

export interface User1 {
  _id: string;
  email: string;
  name: string;
  role?: string;
  homeworkshareToken: string;
  instituteId: string;
  instituteName: string;
  subscriptionModelType: string | null;
  phoneNo: string;
  testRecords: string[];
  schoolIcon: string;
  isOrganic: boolean;
  createdAt: string;
  featureAccess: null | AppFeaturesAccess;
  userSubjects: string[];
  logo: string;
  userFeatureAccess: null | UserFeatureAccess;
}
export interface InstituteTheme {
  _id: string;
  backGroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  topCloud: string;
  bottomCloud: string;
  sectionColor: string;
  textBack: string;
}
