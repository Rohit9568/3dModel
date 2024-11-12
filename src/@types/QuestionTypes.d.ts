export enum QuestionParentType {
  MCQQ = "MCQQ",
  SUBQ = "SUBQ",
  CASEQ = "CASEQ",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  MOCKTEST = "MOCKTEST",
}

export const DifficultyLevelValues = [
  {
    value: DifficultyLevel.EASY,
    label: "Easy",
  },
  {
    value: DifficultyLevel.MEDIUM,
    label: "Medium",
  },
  {
    value: DifficultyLevel.HARD,
    label: "Hard",
  },
  {
    value: DifficultyLevel.MOCKTEST,
    label: "Mock Test",
  },
];
export const allDifficultyLevels = [
  DifficultyLevel.EASY,
  DifficultyLevel.MEDIUM,
  DifficultyLevel.HARD,
  DifficultyLevel.MOCKTEST,
];
export class QuestionType {
  static readonly McqQues = new QuestionType(
    "MCQ",
    "Single Correct",
    QuestionParentType.MCQQ
  );
  static readonly AssertionReasonQuestions = new QuestionType(
    "ARQ",
    "Assertion Reason Questions",
    QuestionParentType.MCQQ
  );
  static readonly LongQues = new QuestionType(
    "LONG",
    "Long Answer Type",
    QuestionParentType.SUBQ
  );
  static readonly ShortQues = new QuestionType(
    "SHORT",
    "Short Answer Type",
    QuestionParentType.SUBQ
  );
  static readonly IntegerQues = new QuestionType(
    "INT",
    "Integer Type",
    QuestionParentType.SUBQ
  );
  static readonly linkedComprehensionBasedQuestions = new QuestionType(
    "LCBQ",
    "Linked Comprehension Based Questions",
    QuestionParentType.CASEQ
  );
  static readonly matchTheFollowingQuestions = new QuestionType(
    "MTFQ",
    "Match The Following Questions",
    QuestionParentType.MCQQ
  );
  static readonly MultiCorrectQues = new QuestionType(
    "MCQMC",
    "Multiple Correct",
    QuestionParentType.MCQQ
  );

  //to be removed after test
  static readonly FillQues = new QuestionType("FILL", "Fill in the blanks");

  static readonly AllQues = new QuestionType("ALL", "All Questions");
  static readonly TYped = new QuestionType("TYPED", "Short Answer Type ");
  static readonly CaseQues = new QuestionType(
    "CASE",
    "Case based Answer Type "
  );
  static readonly CaseStudyQues = new QuestionType(
    "CASE QUE",
    "Case Study Type Questions"
  );
  static readonly SamplePaper = new QuestionType("SAMPLEPAPER", "SAMPLE PAPER");
  static readonly VeryShortQues = new QuestionType(
    "VERYSHORT",
    "Very Short Type Questions"
  );

  private constructor(
    public readonly type: string,
    public readonly name: string,
    public readonly parentType: QuestionParentType
  ) {}
}

export const allQuestionsTypes = [
  QuestionType.McqQues,
  QuestionType.AssertionReasonQuestions,
  QuestionType.LongQues,
  QuestionType.ShortQues,
  QuestionType.IntegerQues,
  QuestionType.linkedComprehensionBasedQuestions,
  QuestionType.MultiCorrectQues,
];

export const allQuestionTypesValues = [
  {
    value: QuestionType.McqQues.type,
    label: QuestionType.McqQues.name,
  },
  {
    value: QuestionType.AssertionReasonQuestions.type,
    label: QuestionType.AssertionReasonQuestions.name,
  },
  {
    value: QuestionType.LongQues.type,
    label: QuestionType.LongQues.name,
  },
  {
    value: QuestionType.ShortQues.type,
    label: QuestionType.ShortQues.name,
  },
  {
    value: QuestionType.IntegerQues.type,
    label: QuestionType.IntegerQues.name,
  },
  {
    value: QuestionType.linkedComprehensionBasedQuestions.type,
    label: QuestionType.linkedComprehensionBasedQuestions.name,
  },
  {
    value: QuestionType.MultiCorrectQues.type,
    label: QuestionType.MultiCorrectQues.name,
  },
];

export function findQuestionType(type: string): QuestionType {
  return allQuestionsTypes.find((qt) => qt.type === type)??QuestionType.ShortQues;
}

export function getColorForDiffuclityType(difficulty: DifficultyLevel) {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return "linear-gradient(180deg, #37E35D 0%, #1E7B7D 100%)";
    case DifficultyLevel.MEDIUM:
      return "linear-gradient(180deg, #FF2939 0%, #FA7800 79.57%)";
    case DifficultyLevel.MOCKTEST:
      return "linear-gradient(180deg, #FF2939 0%, #FA7800 79.57%)";
    case DifficultyLevel.HARD:
      return "linear-gradient(180deg, #FF2939 0%, #FA7800 79.57%)";
  }
}
