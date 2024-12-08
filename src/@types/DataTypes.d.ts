
interface ClassModelWithSubjects {
  _id: string;
  name: string;
  subjects: { _id: string; name: string }[];
  classType?: string;
  boardId: string;
}

interface SimulationData {
  _id: string;
  name: string;
  topicId: string;
  isthreejs?: boolean;
  description: string | undefined;
  thumbnailImageUrl?: string | undefined;
  tags: string[] | undefined;
  loaderUrl: any;
  dataUrl: string;
  frameworkUrl: string;
  wasmUrl: string;
  simultionfilters: string[];
  simulationfeatures: string[];
  simulationTags: string[];
  simulationDescription: string;
  simulationBackgroundColor: string;
  isSimulationPremium: boolean;
  videoUrl: string;
  downloadPackages: {
    windows: string;
    mac: string;
    linux: string;
    android: string;
  };

}
interface Simulationfilters {
  _id: string;
  subject: string;
  labels: string;
  imgUrl: string;
}

interface UserFeatureAccess {
  attendance: boolean;
  feemanagement: boolean;
  websitebuilder: boolean;
  dailydiary: boolean;
  simulations: boolean;
  contentsharing: boolean;
  testingplatform: boolean;
  liveclasses: boolean;
  onlinecourses: boolean;
  addremovestaff: boolean;
  addremovebatch: boolean;
  addremovestudents: boolean;
}

interface NewSimulationfilters {
  name: string;
  subItems: string[] | Record<string, string[]>;
  open: boolean;
}

interface TrendingSimulation {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

interface LoginFormDetails {
  email: string;
  password: string;
}

interface SignupFormDetails {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  subjects: string[];
}

interface TestSectionWithQuestionsIds {
  _id: string;
  name: string;
  questions: string[];
  marksperquestion: number;
  negativeMarks: number;
}

interface FullTest {
  subject_id: string;
  chapter_ids: {
    _id: string;
    chapterId: string;
  }[];
  name: string;
  testDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  maxQuestions: number;
  maxMarks: number;
  difficulity: PaperDifficulity;
  questions: McqQuestion[];
  subjectiveQuestions: SubjectiveQuestion[];
  casebasedquestions: CaseBasedQuestion[];
  questionType: string;
  isSamplePaper: boolean;
  sections: TestSectionWithQuestionsIds[];
  instructions: {
    heading: string;
    points: string[];
  }[];
  pdfLink: string | null;
  isNewSectionType: boolean;
  duration: string;
  superSections: {
    _id: string;
    name: string;
    sections: string[];
    totalTime: string;
  }[];
  isNextSuperSectionClickablebeforeTime: boolean;
  isEnableMultipleTestAttempts: boolean;
}

interface FullTest2 {
  subject_id: string;
  chapter_ids: {
    _id: string;
    chapterId: string;
  }[];
  sections: {
    name: string;
    questions: string[];
    marksperquestion: number;
  }[];
  name: string;
  testDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  maxQuestions: number;
  maxMarks: number;
  difficulity: PaperDifficulity;
  questions: McqQuestion[];
  subjectiveQuestions: any[];
  casebasedquestions: CaseBasedQuestion[];
  questionType: string;
  isSamplePaper: boolean;
  pdfLink: string | null;
  isNewSectionType: boolean;
  superSections: {
    _id: string;
    name: string;
    sections: string[];
    totalTime: string;
  }[];
}

interface MCQTestAnswer {
  question_id: string;
  isCorrect: boolean;
  options: number[];
  answerText: string;
}
interface CasestudyAnswers {
  question_id: string;
  selectedOptions?: number[]
  selectedAnswer?:string
}
interface TestReport {
  _id: string;
  totalMarks: number;
  totalTimeTaken: number;
  accuracy?:number;
  sectionWiseDetails: {
    _id:string;
    name:string;
    questions: {
      options: number[];
      markedCorrect: number;
      unattempted: number;
      timeTaken: number;
      marksObtained: number;
      parentQuestionId?:string;
      type: string;
      chapterId:string;
      chapterName:string;
      question_id: string;
      answerText: string;
      isCorrect: boolean;
    }[];
    timeTaken: number;
    marksObtained: number;
  }[];
  superSectionWiseDetails?: {
    _id:string;
    name:string
    timeTaken: number;
    marksObtained: number;
    sectionIds:string[]
  }[];
  testId: string;
  maxDuration: number;
  maxMarks: number;
  pdfLink: string;
  studentId: string;
  pdfFileName: string;
  questionWisePerformanceDistribution?:QuestionWisePerformanceDistribution;
  questionWiseTimeDistribution?: QuestionWiseTimeDistribution;
  combinedReportStats?:CombinedReportStats
}

interface SubjectiveTestAnswer {
  question_id: string;
  answerText: string;
}

interface TestBasicSettings {
  name: string;
  duration: number | undefined;
  startTime: Date | null;
  isEnableMultipleTestAttempts: boolean;
  selectedTestTemplate: string;
}

interface AnswerSheet {
  studentName: string;
  rollNumber: string;
  test_id: string;
  mcqAnswers: MCQTestAnswer[];
  subjectiveAnswers: SubjectiveTestAnswer[];
  caseStudyAnswers: CaseBasedQuestion[];
  timeTaken: number;
  studentId: string;
  createdAt: Date;
  _id: string;
  subjectiveMarks: number;
  mcqMarks: number;
  student_id: any;
  isChecked: boolean | null;
}
interface AnswerShee3 {
  _id: string;
  mcqMarks: number;
  maxMarks: number;
  testId: string;
  mcqAnswers: MCQTestAnswer[];
  subjectiveAnswers: SubjectiveTestAnswer[];
}

interface AnswerSheet2 {
  studentName: string;
  rollNumber: string;
  test_id: string;
  mcqAnswers: MCQTestAnswer[];
  subjectiveAnswers: SubjectiveTestAnswer[];
  instituteSubjectId: string;
  studentId: string;
}

interface SubjectiveQuestion {
  _id: string;
  answer: string;
  sortOrder: number;
  text: string;
  questionImageUrl: string;
  answerImageUrl: string;
  type: string;
  totalMarks: number;
  difficultyLevel: string;
  totalNegativeMarks: number;
  explaination:string;
  parentQuestionId?:string
  parentQuestionText?:string
}
interface Question {
  _id: string;
  sortOrder: number;
  topic_id: string;
  text: string;
  questionImageUrl: string;
  answers: { text: string; isCorrect: boolean }[];
  answerImageUrl: string[];
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
  difficulty: string;
  totalMarks: number;
  isEmpty: boolean;
  type: string;
  fromQuestionBank: boolean;
  difficultyLevel: string;
  totalNegativeMarks: number;
  questionReferenceId: string;
  childQuestions: Question;
}
interface McqQuestion {
  _id: string;
  text: string;
  questionImageUrl: string;
  answerImageUrl: string[];
  answers: { text: string; isCorrect: boolean }[];
  type: string;
  topic_id: any;
  totalMarks: number;
  totalNegativeMarks: number;
  difficultyLevel: string;
  explaination: string;
  parentQuestionId?:string
  parentQuestionText?:string
}
interface CaseBasedQuestion {
  _id: string;
  sortOrder: number;
  chapterId: string;
  questions:(McqQuestion|SubjectiveQuestion)[];
  text: string;
  explaination: string;
  questionImageUrl: string;
  type: string;
  totalMarks: number;
  totalNegativeMarks: number;
  difficultyLevel: string;
  parentQuestionId?:string
  caseStudyText: string;
}

interface CaseBasedQuestion2 {
  _id: string;
  questions: (McqQuestion | SubjectiveQuestion)[];
  caseStudyText: string;
  explaination: string;
}

interface FeeData {
  _id: string;
  monthDate: string;
  coursefees: number;
}
interface SamplePaper {
  // _id: string;
  caseBasedQuestions: CaseBasedQuestion[];
  mcqQuestions: McqQuestion[];
  longQuestions: SubjectiveQuestion[];
  shortQuestions: SubjectiveQuestion[];
  veryshortQuestions: SubjectiveQuestion[];
}

interface SuperSection {
  name: string;
  sections: string[];
  totalTime: string;
}

interface TestSection {
  type: string;
  sectionName: string;
  questions: (SUBjectivetypedQuestion | CASEtypedQuestion | MCQTypedQuestion)[];
  sectionMarks: number;
  totalNegativeMarks: number;
  _id: string;
  isAddNewQuestion: boolean;
  showOptions: boolean;
}
interface TestPdfSection {
  type: QuestionType;
  sectionName: string;
  questionNo: number;
  totalMarks: number;
  negativeMarks: number;
}

interface MCQCaseTypedQuestion {
  text: string;
  questionImageUrl: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  answerImageUrl: string[];
}

interface MCQTypedQuestion {
  questionImageUrl: string;
  text: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  _id: string;
  answerImageUrl: string[];
  type: string;
  totalMarks: number;
  difficultyLevel: string;
  totalNegativeMarks: number;
  explaination: string;
  fromQuestionBank: boolean;
  fromTeacher?:boolean;
}

interface CASEtypedQuestion {
  questionImageUrl: string;
  questions: (MCQTypedQuestion | SUBjectivetypedQuestion)[];
  caseStudyText: string;
  _id: string;
  type: string;
  totalMarks: number;
  difficultyLevel: string;
  totalNegativeMarks: number;
  explaination: string;
  fromQuestionBank: boolean;
  fromTeacher?:boolean;
}

interface SUBjectivetypedQuestion {
  questionImageUrl: string;
  text: string;
  answer: string;
  questionType: string;
  _id: string;
  answerImageUrl: string;
  type: string;
  totalMarks: number;
  difficultyLevel: string;
  totalNegativeMarks: number;
  explaination: string;
  fromQuestionBank: boolean;
  fromTeacher?:boolean;
}
interface UserSubjectAPI {
  _id: string;
  name: string;
  className: string;
  classId: string;
  classSortOrder: number;
  chaptersCount: number;
  subjectId: string;
  classgrade: number;
  boardId: string;
  boardName: string;
}
interface UserSubject {
  _id: string;
  name: string;
  chaptersCount: number;
  subjectId: any;
}
interface UserClassAndSubjects {
  classId: string;
  className: string;
  classSortOrder: number;
  subjects: UserSubject[];
  grade: number;
  boardId?: string;
  boardName?: string;
}
interface TestData {
  _id: string;
  name: string;
  className: string;
  subjectName: string;
  maxMarks: number;
  maxQuestions: number;
  isShared: boolean;
  isDeleted: boolean;
  questionType: string;
  createdAt: Date;
  isSamplePaper: boolean;
  pdfLink: string;
  sharedPreviously: boolean;
  testScheduleTime: Date | null;
}
interface ChapterPreTestsStatus {
  isFirstTime: boolean;
  testTaken: boolean;
}

interface ChapterData {
  _id: string;
  name: string;
  topicsCount: number;
  chapterPreTestsStatus: ChapterPreTestsStatus;
  shared: boolean;
}

interface UserChapter {
  _id: string;
  name: string;
  chapterId: string;
  simulations: SimulationData[];
  videos: string[];
  shared: boolean;
}

interface SingleSubject {
  _id: string;
  name: string;
  className: string;
  tests: TestData[];
  userChapters: ChapterData[];
  simulationFilter: string;
}
interface ChapterFile {
  fileName: string;
  url: string;
}
interface SingleTopic {
  _id: string;
  topicId: string;
  name: string;
  sortOrder: number;
  theory: string;
  videos: string[];
  animatedVideos: string[];
  simulations: {
    _id: string;
    name: string;
    thumbnailImageUrl: string;
    isActivity: boolean;
    isSimulation: boolean;
  }[];
}
interface SingleTopicQuestions {
  _id: string;
  subjectiveQuestions: SubjectiveQuestion[];
  mcqQuestions: McqQuestion[];
}
interface SingleChapterAllQuestions {
  _id: string;
  subjectiveQuestions: SubjectiveQuestion[];
  mcqQuestions: McqQuestion[];
}
interface IVideos {
  _id: string;
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
}

interface SingleChapter {
  _id: string;
  name: string;
  chapterId: string;
  chapterLessonPlan: ChapterFile[];
  chapterNotes: ChapterFile[];
  chapterWorksheets: ChapterFile[];
  chapterPreTestsStatus: ChapterPreTestsStatus;
  chapterMindmaps: Mindmap[];
  introduction: string;
  preRequisiteTopics: string[];
  objectives: [];
  chapterPreTest: string;
  topics: SingleTopic[];
  shared: boolean;
  simulations: ISimulation[];
  unselectedSimulations: string[];
  videos: IVideos[];
  sharedBatches: string[];
  chapterQuestionsCount: number = 0;
}
interface SingleChapterQuestions {
  _id: string;
  topics: SingleTopicQuestions[];
}
interface Mindmap {
  _id: string;
  name: string;
  data: any;
}

// Data types for Institute Management

interface Notice {
  _id: string;
  heading: string;
  Description: string;
  attachedFiles: AttachFileModelBackend[];
  createdAt: number;
}
interface Doubt {
  _id: string;
  name: string;
  phoneNumber: string;
  description: string;
  reply: string | null;
}
interface InstituteData {
  _id: string;
  Address: string;
  doubts: Doubt[];
  notices: Notice[];
  schoolPhotos: string[];
}

interface AppFeaturesAccess {
  resultsTextService: boolean;
  attendanceTextService: boolean;
  testQuestions: boolean;
  videoCall: boolean;
  course: boolean;
  testFeatureService: boolean;
  dashboardFeature: boolean;
  feeManagementService: boolean;
  teachContentAccess: boolean;
  simualtionAccess: boolean;
  simulationDownloadAccess: boolean;
  feeReceiptAccess: boolean;
  studentCredentialsAccess: boolean;
  secondLogoAccess: boolean;
  pdfWaterMark: boolean;
  hideStudentPhoneNumbers: boolean;
  otpVerification: boolean;
  teacherPhoneNumberAccess: boolean;
}

interface GallerySection {
  _id: string;
  name: string;
  description: string;
  resources: string[];
}

interface InstituteWebsiteDisplay {
  _id: string;
  name: string;
  schoolIcon: string;
  notices: Notice[];
  teachers: any[];
  schoolPhotos: string[];
  theme: InstituteTheme;
  admissionUrl: string;
  heroSection: { heroImage: string[]; heading: string };
  aboutUs: string;
  aboutUsDetails: { heading: string; points: string[] };
  SubSection: any;
  aboutUsImages: string[];
  testimonials: InstituteTestimonial[];
  teamMembers: TeamMember[];
  topperStudents: TeamMember[];
  coreTeamMembers: TeamMember[];
  facilities: InstituteFacilities[];
  instituteBenefits: InstituteBenefits[];
  institutePhoneNumber: string;
  instituteEmail: string;
  youtubeLink: string;
  instagramLink: string;
  facebookLink: string;
  Address: string;
  footerDescription: string;
  mapUrl: string;
  instituteCourses: Course[];
  doubts: Doubt[];
  notifications: InstituteNotifications[];
  featureAccess: AppFeaturesAccess;
  isSchool: boolean;
  gallerySections: GallerySection[];
  secondInstituteNumber: string;
  secondAddress: string;
  nameSubheading: string;
  secondLogo: string;
  websiteLogo: string;
  instituteBenefitsTagLine: string;
  Layout: string;
  Alignment: string;
}
interface InstituteNotifications {
  _id: string;
  type: NotificationType;
  classId: string;
  userId: string;
  createdModalId: string;
  className: string;
  createdAt: string;
}

interface StudentFeeRecord {
  _id: string;
  studentId: string;
  pricePaid: number;
  priceToBePaid: number;
  courseFeeDate: string;
  monthDate: Date;
  createdAt: Date;
  receiptNo: string;
}

interface StudentAttendanceRecord {
  _id: string;
  date: Date;
  status: string;
  studentId?: string;
}

interface InstituteClass {
  _id: string;
  name: string;
  lastHomeworkDate: Date | null;
  lastUpdateDiaryTimeinMillis: number;
  studentsLength: number;
  lastupdatedCourseFee: number;
  averageScore: number;
  totalTeachers: number;
  subjects: InstituteSubject[];
  totalClassFees: number;
  totalFeesPaid: number;
  userSubjects: UserSubject[];
  totalAssignedTestsNumber: number;
  batchScheduleDays: string[] | null;
  students: StudentsDataWithBatch[];
  teachers: TeachersData[];
  checked?: boolean;
  activeVideoCallMeetings: VideoCallMeeting[];
}
interface VideoCallMeetingWithBatchName extends VideoCallMeeting {
  batchName: string;
  batchId: string;
}
interface StudentsDataWithBatch {
  _id?: string;
  name: string;
  phoneNumber: string[];
  parentName: string;
  instituteId: string;
  profilePic?: string;
  batchId?: string;
  attendance?: StudentAttendanceRecord[];
  paymentRecords?: StudentFeeRecord[];
  totalFees?: number;
  dateOfBirth?: string;
  address?: string;
  totalPaidFees?: number;
  uniqueRoll?: number;
  isInActive?: boolean;
  checked?: boolean = false;
  marks?: number;
  isError?: boolean;
  pdfLink?: string;
  pdfFileName?: string;
  testReportId?: string;
  totalRewardpoints: number;
  noofGivenTests: number;
}

interface TeachersData {
  _id: string;
  name: string;
  phoneNo: string;
  email: string;
}

interface VideoCallMeeting {
  _id: string;
  classId: string;
  title: string;
  scheduleTime: string;
  channelName: string;
  isActive: boolean;
}

interface InstituteClassTeacher {
  _id: string;
  name: string;
  lastHomeworkDate: Date | null;
  studentsLength: number;
  averageScore: number;
  totalTeachers: number;
}

interface StudentInfo {
  _id: string;
  phoneNumber: string;
  parentName: string;
  profilePic: string;
  name: string;
  instituteId: string;
  batches: any[];
  homeworks: InstituteHomework[];
  teacherTestAnswers: {
    testId: string;
    answerSheetId: {
      isChecked: boolean | null;
      _id: string;
    };
  }[];
  myCourses: Course[];
  batchCourses: Course[];
  teacherTestPdf: { testId: string; answerPdfId: string }[];
  uniqueRoll: string;
  featureAccess: AppFeaturesAccess;
  isUnregistered: boolean;
}

interface InstituteSubject {
  _id: string;
  name: string;
  tests: {
    _id: string;
    marks: number;
    maxMarks: number;
    name: string;
    count: number;
    date: number;
    type: string;
  }[];
}

interface InstituteClassAndSubjects {
  _id: string;
  name: string;
  subjects: InstituteSubject[];
}

interface SingleStudentResult {
  _id: string;
  subjects: StudentSubjectWiseResult[];
}
interface StudentSubjectWiseResult {
  _id: string;
  subjectName: string;
  tests: {
    _id: string;
    name: string;
    maxMarks: number;
    marks: number;
    date: number;
  }[];
}

interface ClassHomework {
  classId: string;
  date: string;
  className: string;
  homeworks: InstituteHomework[];
}

interface AttachFileModel {
  id: string;
  name: string;
  url: string | null;
  mimetype: string;
}

interface AttachFileModelBackend {
  id: string;
  name: string;
  url: string;
  mimetype: string;
}
interface InstituteHomework {
  _id: string;
  date: string;
  description: string;
  date: number;
  subjectId: string;
  subjectName: string;
  uploadPhoto: string;
}
interface InstituteClasswork {
  _id: string;
  date: string;
  description: string;
  date: number;
  subjectId: string;
  subjectName: string;
  uploadPhoto: string;
}

interface InstituteSubjectDiary {
  id: string;
  name: string;
  classworks: InstituteClasswork | null;
  homeworks: InstituteHomework | null;
  date: number;
}

interface InstituteStudentInfo {
  _id: string;
  name: string;
  uniqueRoll: string;
  phoneNumber: string[];
  profilePic: string;
  instituteId: string;
  instituteBatches: string[];
  parentName: string;
  dateOfBirth: string;
  address: string;
  teacherTestAnswers: { testId: string; answerSheetId: string }[];
  studentResults: string[];
  createdAt: Date;
  isDeleted: boolean;
  myCourses: string[];
  attendance: { date: Date; status: string }[];
  paymentRecords: string[];
  FCMToken: string[];
  password: string;
  lastOtp: string;
  isUnregistered: boolean;
  feeDiscount: number;
  isInActive: boolean;
  testReports: string[];
  totalRewardpoints: number;
  redeemedRewardpoints: number;
}

interface VignamTest {
  _id: string;
  name: string;
  maxMarks: number;
  maxQuestions: number;
  createdAt: string;
  subject: string;
  instituteSubjectId: string;
  answerSheet: {
    _id: string;
    isChecked: boolean | null;
    testReport: TestReport | null;
  } | null;
  questionType: string;
  testScheduleTime: string | null;
  duration: string;
  testResources: {
    fileName: string;
    url: string;
  }[];
  pdfLink: string | null;
  isTestwithOnlyMarks: boolean;
  isEnableMultipleTestAttempts: boolean;
}

interface CourseFile {
  _id: string;
  name: string;
  url: string;
}
interface CourseFolder {
  _id: string;
  name: string;
  videos: CourseVideo[];
  tests: TestData[];
  files: CourseFile[];
  folders: CourseFolder[];
  createdAt: Date;
  hasAllItemsFetched?: boolean;
  isOpen?: boolean;
}

interface CourseVideo {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  url: string;
  createdAt: string;
}

interface Course {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  validTill: Date;
  createdAt: Date;
  price: number;
  discount: number;
  videos: CourseVideo[];
  tests: TestData[];
  files: CourseFile[];
  folders: CourseFolder[];
  students: string[];
  thumbnailname: string;
  isFree: boolean;
}
interface TestWithAnswerSheet extends TestData {
  answerSheet?: AnswerSheet | null;
}
interface CoursewithStudentsData {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  classId: any;
  subjectId: any;
  validTill: Date;
  createdAt: Date;
  price: number;
  discount: number;
  videos: CourseVideo[];
  tests: TestData[];
  files: CourseFile[];
  folders: CourseFolder[];
  students: StudentInfo[];
  thumbnailname: string;
  isFree: boolean;
}

interface CourseContentListModel {
  type: number;
  indexString: string;
  isSelected?: boolean;
  video?: CourseVideo;
  test?: TestWithAnswerSheet;
  file?: CourseFile;
  folder?: CourseFolder;
  parentFolder?: CourseFolder;
  parentFolderIndexString?: string;
  isLastChildOfParent?: boolean;
}

interface Course1 {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  classId: {
    _id: string;
    name: string;
  };
  subjectId: {
    _id: string;
    name: string;
  };
  validTill: Date;
  createdAt: Date;
  price: number;
  discount: number;
  videos: string[];
  tests: string[];
  files: string[];
}

interface FilterParameters {
  labelids: string[];
  type: string | null;
  subjectIds: string[];
  miscellaneous: boolean;
}
interface InstituteFacilities {
  _id: string;
  name: string;
  description: string;
  icon: string;
}
interface InstituteBenefits {
  _id: string;
  title: string;
  icon: string;
}
interface InstituteTestimonial {
  _id: string;
  personName: string;
  text: string;
  createdAt: Date;
}
interface TeamMember {
  _id: string;
  name: string;
  profileImage: string;
  desgination: string;
  description: string;
}

interface InstituteGift {
  _id: string;
  title: string;
  instituteId: string;
  points: number;
  imageLink: string;
}

interface StudentGift extends InstituteGift {
  _id: string;
  instituteGiftId: string;
  isConfirmedFromTeacher: boolean;
  studentId: string;
  createdAt: Date;
}

interface InstituteDetails {
  name: string;
  _id: string;
  iconUrl: string;
  phoneNumber: string;
  secondPhoneNumber: string;
  address: string;
  featureAccess: AppFeaturesAccess;
}


//Related to Video Calling Agora
interface AgoraRtcUserInfo{
  uid:string;
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
  audioTrack:IMicrophoneAudioTrack |null;
  videoTrack:ILocalVideoTrack | null;
  client: IAgoraRTCClient;
  _audio_muted_:boolean
}

//Test Details
interface StudentTestAnswerSheet {
  timeTakenToSubmit:number,
  questions:StudentTestAnsweredQuestions[]
}
interface StudentTestAnsweredQuestions{
questionId:string,
questionType:string,
sectionId:string,
sectionName:string,
questionIndex:number,
timeSpent:number,
studentAnswer:string|number| number[]|null,
correctAnswer:string|number| number []|null,
status:number,
marks:number ,
negativeMarks:number,
parentQuestionId?:string
superSectionId:string,
superSectionName:string,
attemptOrder:number,
chapterId?:string,
chapterName?:string,
}

interface QuestionWisePerformanceDistribution{
  attempted:number
  correct:number,
  inCorrect:number,
  skipped:number
}

interface QuestionWiseTimeDistribution{
  correct:number
  inCorrect:number,
  skipped:number
}

interface CombinedReportStats{
  averageAccuracy:number,
  toppersAccuracy:number
}

interface SectionWiseTestAnalysisData{
    sectionName: string,
    marks: number,
    totalMarks:number,
    tableData: QuestionWiseTableData[]
}

interface QuestionWiseTableData{
    id: number,
    color: string,
    topic: string,
    score: number,
    percentage: number,
    attemptOrder: number,
}

interface TestComparativeAnalysis{
  studentPercentile:number,
  percentileDistribution:number[],
  marksDistribution:number[],
  toppersAccuracy:number,
  studentRank:number,
  questionWiseAnalysisMap:{questionId:string, correctPercentage:number}[]
}

interface MySimulationData{
  data: any,
  simulationId: string,
  name: string,
}

declare module "draft-js-export-markdown";
declare module "draft-js-import-markdown";
declare module "turndown";
declare module "marked";
declare module "@react-pdf-viewer/core";
declare module "react-copy-to-clipboard";
// declare module "file-saver";
