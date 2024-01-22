import { View, Text, ScrollView } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import {
  ExamContentType,
  ExamType,
  ResultScoreType,
  RootStackParamList,
} from "../../types";
import HeaderCustom from "../components/HeaderCustom";
import { StyledComponent } from "nativewind";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomText from "../components/texts/CustomText";
import Checkbox from "expo-checkbox";

type ResultExamScreenProps = {
  navigation: NavigationProp<RootStackParamList, "ResultExam">;
  route: RouteProp<RootStackParamList, "ResultExam">;
};
const ResultExamScreen: FC<ResultExamScreenProps> = ({ navigation, route }) => {
  const { result_exam_id, class_id, class_name } = route.params;
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [resultExam, setResultExam] = useState<ResultScoreType>();
  console.log("============================================== ,", resultExam);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({
        back,
      }: {
        back?: {
          title: string;
        };
      }) => (
        <HeaderCustom
          back={back}
          title={"Kết quả bài kiểm tra"}
          onPressBack={() =>
            class_id && class_name
              ? navigation.navigate("ClassDetail", { class_id, class_name })
              : navigation.goBack()
          }
        />
      ),
    });
  }, [navigation, resultExam]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<ResultScoreType>(
          `/results/${result_exam_id}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        setResultExam(result.data);
        console.log("result - ", result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const checkScore = (exam_content: ExamContentType[], answer: string[]) => {
    let total_question = 0;
    exam_content.forEach((item, index) => {
      if (answer[index] && item.correct === Number(answer[index])) {
        total_question++;
      }
    });
    return total_question;
  };
  if (resultExam) {
    const {
      totalQuestion,
      numberCorrect,
      exam,
      answer: result_answer,
      student: { name },
    } = resultExam;
    const exam_content: ExamContentType[] = JSON.parse(exam.content);
    return (
      <StyledComponent component={ScrollView} className="p-5 bg-white">
        <CustomText fontFamily="Montserrat-Medium" classes="text-lg">
          Kết quả bài kiểm tra của {name}
        </CustomText>
        <CustomText fontFamily="Montserrat-Medium" classes="text-base">
          {exam.title}
        </CustomText>
        <CustomText>
          Tổng câu đúng: {checkScore(exam_content, result_answer)}/
          {totalQuestion}
        </CustomText>
        <CustomText>
          Tổng điểm:{" "}
          {(checkScore(exam_content, result_answer) / totalQuestion) * 10}
        </CustomText>
        <StyledComponent component={View} className="mt-5 space-y-3 mb-20">
          {exam_content.length > 0 &&
            exam_content.map(({ answer, question, correct }, index) => {
              const questionIndex = index;
              return (
                <StyledComponent
                  component={View}
                  className="space-y-3"
                  key={questionIndex}
                >
                  <CustomText
                    fontFamily="Montserrat-Medium"
                    classes="text-base"
                  >
                    Câu hỏi {questionIndex + 1}: {question}
                  </CustomText>
                  <StyledComponent component={View} className="space-y-1">
                    {answer.map((item, index) => {
                      const answerIndex = index;
                      return (
                        <StyledComponent
                          key={answerIndex}
                          component={View}
                          className="flex-row items-center gap-2"
                        >
                          <Checkbox
                            value={
                              result_answer[questionIndex] ===
                              String(answerIndex)
                            }
                            color={true ? "#000" : undefined}
                            style={{
                              width: 15,
                              height: 15,
                              marginRight: 10,
                              transform: [{ translateY: -3 }],
                            }}
                          />
                          <CustomText
                            classes="text-base"
                            style={{
                              backgroundColor:
                                result_answer[questionIndex] ===
                                String(answerIndex)
                                  ? answerIndex === correct
                                    ? "rgba(0, 184, 148, 0.5)"
                                    : "rgba(225, 112, 85, 0.5)"
                                  : answerIndex === correct
                                  ? "rgba(0, 184, 148, 0.5)"
                                  : "white",
                            }}
                          >
                            {item}
                          </CustomText>
                        </StyledComponent>
                      );
                    })}
                  </StyledComponent>
                </StyledComponent>
              );
            })}
        </StyledComponent>
      </StyledComponent>
    );
  }
  return;
};

export default ResultExamScreen;
