import { TextProps, TextStyle } from "react-native";

export type RootStackParamList = {
  Loading: undefined;
  LogIn: undefined;
  SignIn: undefined;
  Home: undefined;
  Profile: undefined;
  AddClass: undefined;
  ClassDetail: { class_id: string; class_name: string };
  AddStudent: { dclass: ClassType };
  AddExam: {
    class_id: string;
    historyExams: ExamType[];
    initialExam?: ExamType;
  };
  DoExam: { exam_id: string; class_id: string; class_name: string };
  ResultExam: {
    result_exam_id: string;
    class_id?: string;
    class_name?: string;
  };
  Chat: { class_id: string; class_name: string };
  StatisticalScore: { exam_id: string; exam_name: string; class_id: string };
};

export type TextComponentProps = {
  classes?: string | undefined;
  children: React.ReactNode;
  fontFamily?:
    | "Montserrat"
    | "Montserrat-Medium"
    | "Montserrat-SemiBold"
    | "Montserrat-Bold";
  textProps?: TextProps;
  style?: TextStyle;
};

export type ClassType = {
  name: string;
  code: string;
  students: AuthType[];
  teacher: AuthType;
  historyExams: ExamType[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthType = {
  _id: string;
  name: string;
  username: string;
  address: string;
  phone: string;
  role: 1 | 2;
  createdAt: Date;
  updatedAt: Date;
};

export type ExamType = {
  _id: string;
  content: string;
  createdAt: Date;
  description: string;
  duration: string;
  title: string;
  updatedAt: Date;
};

export type ExamContentType = {
  question: string;
  answer: string[];
  correct: 1 | 2 | 3 | 4;
};

export type ResultScoreType = {
  answer: string[];
  numberCorrect: number;
  totalQuestion: number;
  student: AuthType;
  exam: ExamType;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatType = {
  _id: string;
  content: string;
  user: AuthType;
  class: ClassType;
  createdAt: Date;
  updatedAt: Date;
};

export type SatisfyType = {
  candidates: number;
  max: {
    _id: string;
    answer: string[];
    numberCorrect: number;
    totalQuestion: number;
    student: AuthType;
    exam: ExamType;
    createdAt: Date;
    updatedAt: Date;
  };
  min: {
    _id: string;
    answer: string[];
    numberCorrect: number;
    totalQuestion: number;
    student: AuthType;
    exam: ExamType;
    createdAt: Date;
    updatedAt: Date;
  };
  rank: ResultScoreType[];
};
