

export interface TestListDetails {
  className: string;
  createdAt: Date;
  isShared: boolean;
  isDeleted: boolean;
  maxMarks: number;
  maxQuestions: number;
  name: string;
  subjectName: string;
  questionType: string;
  _id: string;
  isSamplePaper: boolean;
  pdfLink: string;
  sharedBatches: string[];
  sharedPreviously: boolean;
  duration: string;
  testScheduleTime: string;
  isReportAvailable: boolean;
  isResponseAvailable: boolean;
  isTestwithOnlyMarks:boolean
}
